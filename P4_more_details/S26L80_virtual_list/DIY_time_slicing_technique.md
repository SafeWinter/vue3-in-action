# DIY 增补：基于时间分片（Time Slicing）的虚拟列表实现方案

---



## 概述

基于时间分片（`Time Slicing`）实现虚拟列表，其核心思想是：**将原本一次性完成的大量 DOM 创建/渲染工作，拆分成多个小任务，分散到多个浏览器空闲时间段中执行**，从而避免阻塞主线程，保证页面滚动流畅和用户交互响应。

下面从问题背景、核心原理、实现步骤、与经典虚拟列表的区别等方面详细说明。



## 一、为什么需要时间分片？

传统虚拟列表（只渲染可视区 + 上下缓冲区的列表项）虽然减少了 `DOM` 数量，但当 **快速滚动** 或 **列表项高度不固定且内容复杂** 时，仍可能出现以下问题：

- 一次滚动可能触发大量新增 `DOM` 节点的创建、插入、样式计算和布局（重排）。
- 如果这一批新增节点数量较多（例如滚动跨度很大），浏览器仍然会长时间占用主线程，导致滚动卡顿或掉帧。

时间分片就是为了 **进一步分解这一批新增节点的渲染压力**。



## 二、时间分片的工作原理

### 1. 总体流程

1. 监听滚动事件，计算当前需要渲染的数据范围（起始索引 `start` 到结束索引 `end`）。
2. 比较新范围与当前已渲染范围，确定需要 **新增** 哪些索引的节点。
3. **不立即一次性创建并插入所有新增节点**，而是将新增索引列表放入一个任务队列。
4. 使用 `requestIdleCallback` 或 `setTimeout`（降级方案）在浏览器空闲时，每次取一部分索引进行 `DOM` 创建、渲染。
5. 重复执行直到所有新增节点渲染完成。
6. 同时，对于移出可视区的节点，可以立即从 `DOM` 树中移除（这部分不耗时，不需要分片）。



### 2. 核心机制：requestIdleCallback

`requestIdleCallback` 允许在浏览器一帧中完成必要任务（脚本、样式、布局、绘制）后，剩余的空闲时间执行低优先级任务。

```js
function renderChunk(idsToRender, callback) {
  const chunkSize = 5; // 每片渲染 5 个节点
  let index = 0;

  function schedule() {
    requestIdleCallback((deadline) => {
      // 当空闲时间大于 0 或者任务必须完成时，执行一小批渲染
      while (index < idsToRender.length && deadline.timeRemaining() > 0) {
        const id = idsToRender[index];
        createAndInsertNode(id);
        index++;
      }
      if (index < idsToRender.length) {
        schedule(); // 继续下一片
      } else if (callback) {
        callback();
      }
    });
  }
  schedule();
}
```



### 3. 任务拆分的粒度

- **按单个节点拆分**：每个空闲片段只创建并插入一个列表项 DOM。
  优点：最平滑；缺点：开销稍大（多次调用空闲回调）。
- **按固定数量拆分**：每次处理 3~10 个节点。
  实践中更常用，平衡了平滑度和调用开销。
- **按预估耗时拆分**：检查 `deadline.timeRemaining()`，动态决定本次处理多少个节点，充分利用空闲时间。



### 4. 与滚动事件的协同

- 滚动事件处理中，**只计算新的渲染范围并更新待渲染队列**。
- 如果用户滚动很快，上一批尚未渲染完的新节点可能已被移出最新可视区，此时应取消未完成的任务或跳过它们的渲染。
- 实现上，可以为每次滚动生成一个递增的 `renderVersion`，在渲染回调中检查版本是否匹配，若不匹配则放弃渲染。



## 三、示例：简化版时间分片虚拟列表结构

```js
class TimeSliceVirtualList {
  constructor(container, items, itemHeight) {
    this.container = container;
    this.items = items;        // 全量数据
    this.itemHeight = itemHeight;
    this.startIndex = 0;
    this.endIndex = 0;
    this.pendingIndices = new Set(); // 待渲染索引集合
    this.renderedIndices = new Set();
    this.currentRenderId = 0;

    this.container.addEventListener('scroll', () => this.onScroll());
    this.onScroll(); // 初始渲染
  }

  onScroll() {
    const scrollTop = this.container.scrollTop;
    const newStart = Math.floor(scrollTop / this.itemHeight);
    const newEnd = newStart + Math.ceil(this.container.clientHeight / this.itemHeight) + 2; // +buffer
    if (newStart === this.startIndex && newEnd === this.endIndex) return;

    this.startIndex = newStart;
    this.endIndex = newEnd;

    // 更新待渲染集合
    const newPending = new Set();
    for (let i = this.startIndex; i <= this.endIndex; i++) {
      if (!this.renderedIndices.has(i)) newPending.add(i);
    }
    this.pendingIndices = newPending;
    this.currentRenderId++; // 使旧分片任务失效
    this.startTimeSlice();
  }

  startTimeSlice() {
    const renderId = this.currentRenderId;
    const pendingArray = Array.from(this.pendingIndices);

    const processChunk = (deadline) => {
      if (renderId !== this.currentRenderId) return; // 被新滚动覆盖

      while (this.pendingIndices.size > 0 && deadline.timeRemaining() > 0) {
        const idx = pendingArray.find(i => this.pendingIndices.has(i));
        if (idx === undefined) break;
        this.renderItem(idx);
        this.pendingIndices.delete(idx);
        this.renderedIndices.add(idx);
      }

      if (this.pendingIndices.size > 0) {
        requestIdleCallback(processChunk);
      } else {
        this.removeOutOfRangeItems();
      }
    };
    requestIdleCallback(processChunk);
  }

  renderItem(index) {
    // 创建 DOM 并插入到正确位置（绝对定位或占位容器）
  }

  removeOutOfRangeItems() {
    // 删除不在 [startIndex, endIndex] 范围内的已渲染节点
  }
}
```



## 四、与经典虚拟列表的区别

|    维度    | 经典虚拟列表（无分片）                         | 基于时间分片的虚拟列表                         |
| :--------: | :--------------------------------------------- | :--------------------------------------------- |
|  渲染时机  | 滚动结束后或滚动过程中一次性渲染所有新增节点   | 将新增节点分批，分散到多帧空闲时间             |
| 主线程阻塞 | 如果一次新增节点较多（例如跨页滚动），可能掉帧 | 每帧只做少量 DOM 工作，几乎不阻塞用户交互      |
| 滚动流畅度 | 依赖总渲染量，量大时卡顿                       | 始终保持高帧率，渲染滞后但视觉平滑             |
| 实现复杂度 | 低                                             | 较高（需处理任务取消、版本控制、空闲时间调度） |
|  适用场景  | 高度固定、滚动平缓、单次增量小                 | 数据量大、滚动剧烈、项高度复杂或动态           |



## 五、注意事项与优化

1. **兼容性**：`requestIdleCallback` 在 `Safari` 中不支持，需回退到 `setTimeout(..., 20)` 版本。
2. **渲染顺序**：优先渲染可视区中心附近的节点，再渲染边缘节点，可进一步提升感知流畅度。
3. **与绝对定位布局配合**：时间分片渲染不会影响滚动条高度和占位逻辑，容器高度仍由 `总数据量 * 平均高度` 撑开，每个分片渲染的节点使用 `transform: translateY` 或 `top` 绝对定位。
4. **内存与节点数量**：虽然分片渲染，最终 `DOM` 节点数仍等于可视区+缓冲区节点数，不会无限增加。
5. **测量动态高度**：如果使用动态高度，时间分片更显优势——因为高度测量本身可能触发同步布局，分片可避免一次性大量测量导致的卡顿。



## 六、小结

基于时间分片的虚拟列表工作原理可以概括为：

> **将滚动导致的“一批新增渲染任务”拆解为多个微批次，利用 `requestIdleCallback` 在每一帧的空闲时间执行一个批次，从而避免长时间阻塞主线程，保持滚动流畅与交互响应。**

这种方案并非替代经典虚拟列表，而是对后者在“极端滚动场景”或“复杂列表项渲染成本高”情况下的增强。实际项目中，可根据数据量、列表项复杂度、目标设备性能来决定是否需要引入时间分片。



> [!tip]
>
> **DIY 拓展**
>
> **时间分片和 requestAnimationFrame 的关系**
>
> **时间分片和 `requestAnimationFrame` 有密切关系，但它们的定位完全不同**——实际上它们是互补的技术，常用于解决渲染性能问题的不同层面。
>
> 让我详细解释它们的关系和区别：
>
> ## 一、核心区别
>
> | 维度             | requestIdleCallback（时间分片）            | requestAnimationFrame                    |
> | :--------------- | :----------------------------------------- | :--------------------------------------- |
> | **执行时机**     | 浏览器空闲时段（帧末空闲时间）             | 每次重绘前（约 60fps，即每 16.6ms 一次） |
> | **优先级**       | **低优先级**，不阻塞关键任务               | **高优先级**，用于视觉更新               |
> | **适用场景**     | 非紧急的后台任务（渲染大量 DOM、数据处理） | 动画、滚动同步、视觉更新                 |
> | **是否保证执行** | 不保证（空闲时间不足可能不执行）           | 保证在下一帧执行                         |
> | **与帧的关系**   | 利用帧的**剩余时间**                       | 驱动帧的**开始**                         |
>
> 
>
> ## 二、两者在一帧中的时序关系
>
> ```bash
> 浏览器一帧的生命周期（约 16.6ms）：
> │
> ├─ 1. 处理输入事件（滚动、触摸等）
> ├─ 2. 执行 requestAnimationFrame 回调  ← 高优先级，保证每帧执行
> ├─ 3. 样式计算、布局（重排）
> ├─ 4. 绘制（Paint）
> ├─ 5. 合成（Composite）
> └─ 6. 空闲时间（若有剩余） ← 执行 requestIdleCallback
>       └─ 时间分片任务在此执行
> ```
>
> **关键点**：
>
> - `requestAnimationFrame` 在 **每一帧开始时** 执行，用于准备下一帧要显示的内容
> - `requestIdleCallback` 在 **每一帧结束后** 的空闲时间执行，用于处理不紧急的任务