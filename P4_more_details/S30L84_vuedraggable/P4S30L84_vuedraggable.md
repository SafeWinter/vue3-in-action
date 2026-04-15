# P4S30L84：Vue 第三方库 vuedraggable 的用法简介

---

> [!tip]
>
> `vuedraggable` 官方文档：
>
> - `NPM`：https://www.npmjs.com/package/vuedraggable
> - `GitHub`：https://github.com/SortableJS/Vue.Draggable



## 1 概述

`vuedraggable` 是一个基于 `Sortable.js` 的 `Vue` 组件，用于实现拖拽和排序功能。它可以让你在 `Vue` 应用中轻松地实现拖拽排序，并提供了丰富的配置选项和事件来控制拖拽行为。

>[!tip]
>
>**Sortable.js 简介**
>
>官方 `GitHub` 仓库：https://github.com/SortableJS/Sortable
>
>`Sortable.js` 是一个轻量级的 `JS` 库，用于实现拖拽排序功能。它支持 `HTML5` 的拖拽 `API`，并提供了丰富的选项和事件，可以轻松地在网页中实现拖拽排序、拖拽交换等功能。`Vue.Draggable` 是基于 `Sortable.js` 构建的，用于在 `Vue` 应用中实现这些功能。
>
>`Sortable.js` 的特点：
>
>1. 轻量级：`Sortable.js` 非常轻量，核心库只有几千字节。
>2. 高性能：利用现代浏览器的 `HTML5` 拖拽 `API`，提供高性能的拖拽体验。
>3. 多样的选项：提供丰富的选项和回调函数，可以自定义拖拽行为。
>4. 多种场景：支持多种拖拽场景，包括列表排序、网格布局、分组拖拽等。
>5. 与框架集成：容易与主流前端框架集成，如 `Vue`、`React`、`Angular` 等。
>
>`Sortable.js` 对各前端框架的支持情况：
>
>- `Vue`：[Vue.Draggable](https://github.com/SortableJS/Vue.Draggable)
>- `React`：[react-sortablejs](https://github.com/SortableJS/react-sortablejs)
>- `Angular`：[ngx-sortablejs](https://github.com/SortableJS/ngx-sortablejs)
>- `jQuery`：[jquery-sortablejs](https://github.com/SortableJS/jquery-sortablejs)



## 2 基本用法

首先安装这个库：

```bash
npm install vuedraggable@4.0.0
```

注意：安装时 **一定要指定安装的版本为 4.0.0**。

安装后可以导入一个 **组件**：

```vue
<template>
  <draggable 
     v-model="myArray" 
     group="people" 
     @start="drag=true" 
     @end="drag=false" 
     itemKey="id"
   >
    <template #item="{ element }">
      <div class="task">{{ element.name }}</div>
    </template>
  </draggable>
</template>

<script setup>
import draggable from 'vuedraggable'
</script>
```

这是 `vuedraggable` 的一个标准用法。

1. `v-model="myArray"`：数组包含了需要拖拽排序的元素；
2. `group="people"`：`group` 属性用于配置 **分组**，相同 `group` 名称的 `draggable` 实例之间允许相互拖拽元素；
3. `@start="drag=true"`：当拖拽操作开始时触发，这里将 `drag` 变量设置为 `true`，这可以用于在拖拽开始时触发一些行为，比如改变样式或显示一些提示；
4. `@end="drag=false"`：当拖拽操作结束时触发，这里将 `drag` 变量设置为 `false`。



## 3 实战案例

一个【未完成】列表和一个【已完成】列表，两个列表之间的项目可以自由拖动：

![](../../assets/84.1.png)

核心逻辑：

```vue
<!-- 使用vuedraggable插件实现拖拽 -->
<draggable v-model="list2" group="tasks" @start="drag = true" @end="endHandle" itemKey="id">
  <template #item="{ element }">
    <TransitionGroup name="fade" tag="div">
      <div class="task" :key="element.id">{{ element.text }}</div>
    </TransitionGroup>
  </template>
</draggable>
```



## 4 实测备忘

:one: 课件代码忘了定义响应式数据 `drag`，该数据通常用来 **标识当前是否正在拖拽**，以便在拖拽过程中动态调整 `UI` 或禁用某些操作（例如防止按钮重复点击、改变拖拽项的透明度等）。应该补充完整：

```js
import { ref } from 'vue'
import draggable from 'vuedraggable'

const drag = ref(false)

const endHandle = () => {
  console.log('拖拽结束')
  drag.value = false
}
```

:two: 利用 `drag` 的状态可以给正在拖拽的容器设计半透明效果：

```html
<div :class="{ 'dragging-active': drag }">
  <draggable ...>...</draggable>
</div>
<style scoped>
.dragging-active {
  opacity: 0.6;
  transition: opacity 0.2s;
}
</style>
```

最终效果：

![](../../assets/84.2.png)