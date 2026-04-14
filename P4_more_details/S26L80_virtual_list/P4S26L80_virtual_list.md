# P4S26L80：Vue3 应用场景之：虚拟列表

---

> [!tip]
>
> **面试题**
>
> 一次性给你 `10000` 条数据，前端怎么渲染到页面上？

长列表常见的三种处理方式：

1. 懒加载；
2. 时间分片；
3. 虚拟列表；



## 1 懒加载

工作原理：只有视口内的内容会被加载，其他内容在用户滚动到视口时才会被加载。这可以显著减少初次加载的时间，提高页面响应速度。

懒加载的优势：

1. 节省带宽
2. 提升用户体验

懒加载的劣势：懒加载只能应对 **数据不太多** 的情况。如果列表项有几万甚至几十万项，最终页面上将有对应数量的 `DOM` 元素，因而严重降低页面性能。



## 2 时间分片

时间分片（`Time Slicing`）的本质在于 `requestAnimationFrame`：**由浏览器来决定回调函数的触发时机**。大量的数据会被分多次渲染，每次渲染对应一个片段。在每个片段中处理定量的数据后，会将主线程还给浏览器，从而实现快速呈现页面内容给用户。

`DeepSeek` 补充：基于时间分片的实现方案的核心思想是：**将原本一次性完成的大量 DOM 创建/渲染工作，拆分成多个小任务，分散到多个浏览器空闲时间段中执行**，从而避免阻塞主线程，保证页面滚动流畅和用户交互响应。

时间分片的缺点：

1. 效率低
2. 不直观
3. 性能差

> [!tip]
>
> **小结**
>
> 无论是懒加载还是时间分片，最终都是将 **完整数量的列表项** 渲染出来，这在面对列表项非常多的时候，页面性能是比较低的。



## 3 虚拟列表

原理：设置一个可视区域，然后用户在滚动列表的时候，本质上是 **动态修改可视区域里面的内容**。

例如，一开始渲染前面 `5` 个项目：

<img src="../../assets/80.1.png" alt="image-20240701162418114" style="zoom:40%;" />

之后用户进行滚动，就会动态的修改可视区域里面的内容，如下图所示：

<img src="../../assets/80.2.png" alt="image-20240701162813149" style="zoom:50%;" />

也就是说，始终渲染的只有可视区的那 5 个项目，这样能够极大的保障页面性能。

实现：实现定高的虚拟列表，这里所指的定高是说列表项的每一项高度相同

涉及到的信息：

1. 可视区域起始数据索引(`startIndex`)
2. 可视区域结束数据索引(`endIndex`)
3. 可视区域的数据
4. 整个列表中的偏移位置 `startOffset`

如下图所示：

<img src="../../assets/80.3.png" alt="image-20240701164454859" style="zoom:50%;" />

接下来整个虚拟列表的设计如下：

```html
<div class="infinite-list-container">
  <!-- 该元素高度为总列表的高度，目的是为了形成滚动 -->
  <div class="infinite-list-phantom"></div>
  <!-- 该元素为可视区域，里面就是一个一个列表项 -->
  <div class="infinite-list">
    <!-- item-1 -->
    <!-- item-2 -->
    <!-- ...... -->
    <!-- item-n -->
  </div>
</div>
```

- `infinite-list-container`：可视区域的容器 
- `infinite-list-phantom`：容器内的占位，高度为总列表高度，用于形成滚动条 
- `infinite-list`：列表项的渲染区域

如下图所示：

<img src="../../assets/80.4.png" alt="image-20240701165847905" style="zoom:50%;" />

接下来监听 `infinite-list-container` 的 `scroll` 事件，获取滚动位置的 `scrollTop`，因为回头需要设置 `list` 向下位移的距离

- 假定可视区域高度固定，称之为 `screenHeight`
- 假定列表每项高度固定，称之为 `itemSize`
- 假定列表数据称之为 `listData`（就是很多的列表数据，几万项、几十万项列表数据）
- 假定当前滚动位置称之为 `scrollTop`

那么我们能够计算出这么一些信息：

1. 列表总高度：`listHeight = listData.length * itemSize`
2. 可显示的列表项数：`visibleCount = Math.ceil(screenHeight / itemSize)`
3. 数据的起始索引：`startIndex = Math.floor(scrollTop / itemSize)`
4. 数据的结束索引：`endIndex = startIndex + visibleCount`
5. 列表显示数据为：`visibleData = listData.slice(startIndex, endIndex)`

当发生滚动后，由于渲染区域相对于可视区域发生了偏移，因此我们需要计算出这个偏移量，然后使用 transform 重新偏移回可视区域。

偏移量的计算：`startOffset = scrollTop - (scrollTop % itemSize)`

> [!tip]
>
> 思考🤔：为什么要减去 `scrollTop % itemSize` ？
>
> 答案：之所以要减去 `scrollTop % itemSize`，是为了将 `scrollTop` 调整到一个与 `itemSize` 对齐的位置，避免显示不完整的列表项。

<img src="../../assets/80.5.png" alt="image-20240701170126764" style="zoom:50%;" />

## 4 实战演练：实现定高的虚拟列表

定高的虚拟列表存在一些问题，或者说可以优化的地方：

1. 动态高度
2. 白屏现象
3. 滚动事件触发频率过高

![](../../assets/80.6.png)



## 5 实测备忘

由于 `VueUse` 刚好提供了最新的虚拟列表的组合式函数 `useVirtualList`（`2025-9-1` 发布了 `v14.0.0-alpha.0`），加之视频中的纯手动方案过于繁琐，实测时换用 `VueUse` 实现了同等效果，用起来也更顺手。

实测截图：

![](../../assets/80.7.png)

具体用法详见 `useVirtualList` [官方文档](https://vueuse.org/core/useVirtualList/) 及 [官方示例源码](https://github.com/vueuse/vueuse/blob/main/packages/core/useVirtualList/demo.vue)。

核心逻辑：

```vue
<div class="vlist-container" v-bind="containerProps">
  <div v-bind="wrapperProps">
    <div
      class="list-item"
      v-for="{ index: idx, data: { id, value } } in list"
      :key="idx"
      :style="{ height: `${props.itemSize}px` }"
    >
      <span class="row">第 {{ id }} 行</span><span>{{ value }}</span>
    </div>
  </div>
</div>
<script setup>
import { computed, shallowRef } from 'vue'
import { useVirtualList } from '@vueuse/core'

const props = defineProps({
  listData: {
    type: Array,
    default: () => []
  },
  itemSize: {
    type: Number,
    default: 150
  }
})

const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(props.listData, {
  itemHeight: props.itemSize,
  overscan: 3
})

// const rowNum = shallowRef()
// const handleScrollTo = () => (rowNum.value ? scrollTo(rowNum.value - 1) : void 0)
</script>
```

参数解释：

- `listData`：全量数据源，包含所有列表数据；
- `itemHeight`：用于指定每行数据的行高，其值：
  - 既可以为固定值，例如上述代码中的 `props.itemSize`；
  - 也可以是关于数组索引值 `i` 的高度函数，例如：`itemHeight: i => (filteredItems.value[i].height + 8)`；
- `overscan`：两边缓冲区的缓冲数据的个数，设为 `3` 表示可视区域上下各附加 `3` 条记录，以防快速滚动产生的白边；
- 返回的解构变量中——
  - `list`：表示用于可视区域的精简数据源，包含 `index` 和 `data` 两个属性，`data` 即用户自定义的 `JSON` 数据项；
  - `containerProps`：最外层虚拟列表容器元素绑定的必要 `prop` 属性；
  - `wrapperProps`：包裹实际虚拟列表的包裹层元素绑定的必要 `prop` 属性；
  - `scrollTo`：快速定位行的工具函数。例如快速跳转到下标为 `300` 的数据行：`scrollTo(300)`。可根据该函数设计一个用于快速跳转工具栏。



:star: 从 `VueUse` 源码示例看到一个生成序列的新写法：

```js
const allItems = Array.from(Array.from({ length: 99999 }).keys())
```

从性能和可读性看，不如常规写法：

```js
const allItems = Array.from({length: 1e4}, (_, i) => i)
```

