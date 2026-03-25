# P2S27L29：内置组件 KeepAlive 在 Vue3 中的应用

---



> [!tip]
>
> 官方中文文档：
>
> - [KeepAlive 指南](https://cn.vuejs.org/guide/built-ins/keep-alive.html)
> - [KeepAlive API](https://cn.vuejs.org/api/built-in-components.html#keepalive)



## 1 概述

`Vue` 提供了一些内置组件，例如：

- `Transition`：为 **单个** 元素或组件提供动画过渡效果。
- `TransitionGroup`：为列表中的 **多个** 元素或组件提供过渡效果。
- `KeepAlive`（:star:）：缓存包裹在其中的动态切换组件。
- `Teleport`：将其插槽内容渲染到 `DOM` 中的另一个位置。
- `Suspense`：用于协调对组件树中嵌套的异步依赖的处理。

内置组件无需注册便可以直接在模板中使用。它们也支持 `tree-shake`：仅在使用时才会包含在构建中。

在 [渲染函数](https://cn.vuejs.org/guide/extras/render-function.html) 中使用时，则需要显式导入：

```js
import { h, Transition } from 'vue'

h(Transition, {
  /* props */
})
```



## 2 关于 component 元素

这是一个用于渲染动态组件或元素的【元组件】。

这里的 `component` **并非组件**，而是和 `slot`、`template` 等元素类似的一种特殊元素。这些元素均是模板语法的一部分，但并非真正的组件，都会在模板编译期间被编译掉。因此，在模板中通常 **用小写字母书写**。

`component` 用于渲染动态组件，具体渲染的组件取决于 `is` 属性

文档地址：https://cn.vuejs.org/api/built-in-special-elements.html#component



## 3 KeepAlive 基础用法

`KeepAlive` 是一个 **内置组件**，该组件的主要作用是 **缓存组件的状态**。

例如 `App.vue`：

```vue
<router-view v-slot="{ Component }">
  <keep-alive>
    <component :is="Component" />
  </keep-alive>
</router-view>
```

`router-view` 组件通过作用域插槽获取到一个和当前路由所匹配的组件，然后将该组件用于 `component` 元素的 `is` 属性。

最关键的改动：必须在 `component` 元素外包裹内置组件 `keep-alive`，让其中的组件状态得以保留。

> [!tip]
>
> **关于 `router-view` 组件中的作用域插槽内的 `Component` 属性**
>
> `v-slot="{ Component }"` 是解构赋值的语法：
>
> ```vue
> <!-- 等价于 -->
> <router-view v-slot="slotProps">
>   <keep-alive>
>     <component :is="slotProps.Component" />
>   </keep-alive>
> </router-view>
> ```
>
> `slotProps` 是一个对象，包含了 `Component` 和 `route` 等属性：
>
> ```js
> {
>   Component: 当前路由对应的组件对象,
>   route: 当前路由对象
> }
> ```
>
> `<component :is="Component" />` 是 `Vue` 的 **动态组件**，`:is` 属性接收一个组件对象或组件名，`Vue` 会根据它的值动态渲染对应的组件。



## 4 KeepAlive 的注意事项

该组件支持 **include / exclude** 关键字，用于指定或排除要缓存的组件。该 `prop` 支持的值的类型：

- 以英文逗号分隔的字符串（严禁包含空格）；
- 正则表达式；
- 包含这两种类型的一个数组。

例如：

```vue
<!-- 以英文逗号分隔的字符串 -->
<KeepAlive include="a,b">
  <component :is="view" />
</KeepAlive>

<!-- 正则表达式 (需使用 v-bind) -->
<KeepAlive :include="/a|b/">
  <component :is="view" />
</KeepAlive>

<!-- 数组 (需使用 v-bind) -->
<KeepAlive :include="['a', 'b']">
  <component :is="view" />
</KeepAlive>
```

例如：

```vue
<router-view v-slot="{ Component }">
  <keep-alive include="Counter,Timer">
    <component :is="Component" />
  </keep-alive>
</router-view>
```

> [!note]
>
> **注意**
>
> 以英文逗号分隔时，**逗号两边不要添加空格**，否则出现不可控行为。
>
> 另外，组件的名称如果和文件名不同（例如一个组件文件夹下的 `index.vue`），可在普通 `script` 标签内显式声明：
>
> ```html
> <script>
> export default {
>   name: 'Timer'
> }
> </script>
> <script setup>
> // -- snip --
> </script>
> ```



`KeepAlive` 组件还可以接收一个 `max` 属性，用于 **指定缓存组件状态个数的最大值**。如果缓存的实例数量即将超过设定的最大值，则未被访问的最早缓存过的实例将被销毁，以便为新的缓存实例腾出空间：

```vue
<router-view v-slot="{ Component }">
  <keep-alive :max="3">
    <component :is="Component" />
  </keep-alive>
</router-view>
```



## 2 实测备忘

`Timer` 组件中的计时算法值得积累：

```js
const startTimer = () => {
  if (!timerRunning.value) {
    timerRunning.value = true
    timer = setInterval(() => {
      milliseconds.value++
      if (milliseconds.value >= 100) {
        milliseconds.value = 0
        seconds.value++
      }
    }, 10)
  }
}
```

时间格式化的实现可优化为：

```js
const fmtDigit = refVal => `${refVal.value}`.padStart(2, '0')
const formattedTime = computed(() => {
  return [seconds, milliseconds].map(fmtDigit).join(':')
})
```

