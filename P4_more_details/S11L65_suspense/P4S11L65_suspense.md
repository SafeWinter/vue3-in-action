# P4S11L65：Vue 内置组件之：Suspense

---

> [!tip]
>
> `Suspense` 组件官方文档：https://cn.vuejs.org/guide/built-ins/suspense.html
>
> `Suspense` 官方 `API` 参考：https://cn.vuejs.org/api/built-in-components.html#suspense
>
> 主要用法：统一异步组件的步调，让放入其中的各异步组件同时渲染（相当于组件级别的 `Promise.all()`）。



## 1 概述

`Suspense`，本意是“悬而未决”的意思，这是 `Vue3` 新增的一个内置组件，主要用来在组件树中协调对异步依赖的处理。

假设有如下目录结构：

```bash
<Suspense>
└─ <Dashboard>
   ├─ <Profile>（内容一）
   │  └─ <FriendStatus>（好友状态组件：有异步的setup方法）
   └─ <Content>（内容二）
      ├─ <ActivityFeed> （活动提要：异步组件）
      └─ <Stats>（统计组件：异步组件）
```

在这个组件树中有多个嵌套组件，要渲染出它们，首先得解析一些异步资源。

每个异步组件需要处理自己的加载、报错和完成状态。在最坏的情况下，可能会在页面上看到三个旋转的加载状态，然后在不同的时间显示出内容。

有了 `<Suspense>` 组件后，我们就可以在等待整个多层级组件树中的各个异步依赖获取结果时，**在顶层统一处理加载状态**。

`<Suspense>` 可以等待的异步依赖有两种：

:one: 带有 **异步 setup( ) 钩子的组件**。这也包含了使用 `<script setup>` 时有 **顶层 await 表达式的组件**：

`Options API`：

```js
export default {
  async setup() {
    const res = await fetch(...)
    const posts = await res.json()
    return {
      posts
    }
  }
}
```

`Composition API`：

```vue
<script setup>
const res = await fetch(...)
const posts = await res.json()
</script>

<template>
  {{ posts }}
</template>
```

:two: 异步组件



在 `<Suspense>` 组件中有两个插槽，两个插槽都 **只允许一个直接子节点**。

1. `#default`：当所有的异步依赖都完成后，会进入 **完成** 状态，展示默认插槽内容。
2. `#fallback`：如果有任何异步依赖未完成，则进入 **挂起** 状态，在挂起状态期间，**展示的是后备内容**。



## 2 快速上手

```bash
App.vue
└─ Dashboard.vue
   ├─ Profile.vue
   │  └─ FriendStatus.vue（组件有异步的 setup）
   └─ Content.vue
      ├─ AsyncActivityFeed（异步组件）
      │  └─ ActivityFeed.vue
      └─ AsyncStats（异步组件）
         └─ Stats.vue
```

实现效果：使用 `Suspense` 统一显示状态

> [!tip]
>
> 🤔 思考
>
> 假设想要让 `Profile` 组件内容先显示出来，不等待 `Content` 组件的异步完成状态，该怎么做？
>
> 答：在 `Content` 内部再次使用 `Suspense` 组件包裹需要统一步调的模板内容。



## 3 用法细节



### 3.1 内置组件嵌套顺序

`<Suspense>` 经常会和 `<Transition>`、`<KeepAlive>` 搭配着一起使用，此时就涉及到一个 **嵌套的顺序** 问题，谁在外层，谁在内层。

推荐顺序如下：

```vue
<RouterView v-slot="{ Component }">
  <template v-if="Component">
    <Transition mode="out-in">
      <KeepAlive>
        <Suspense>
          <!-- 主要内容 -->
          <component :is="Component"></component>

          <!-- 加载中状态 -->
          <template #fallback>
            正在加载...
          </template>
        </Suspense>
      </KeepAlive>
    </Transition>
  </template>
</RouterView>
```

你可以根据实际开发需求，删减你不需要的组件。



### 3.2 支持事件

`<Suspense>` 组件会触发三个事件：

- `pending`：在进入挂起状态时触发
- `resolve`：在 `default` 插槽完成获取新内容时触发
- `fallback`：显示后备内容的时候触发

