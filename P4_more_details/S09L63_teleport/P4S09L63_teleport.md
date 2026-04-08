# P4S09L63：Vue 内置组件之：Teleport

---



> [!tip]
>
> `Vue` 官方文档：https://cn.vuejs.org/guide/built-ins/teleport.html



`Teleport` 是 `Vue` 中的一个内置组件。作用：将一个组件内部的一部分模板“传送”到该组件的 `DOM` 结构外层的位置。



## 1 快速上手

模态框：理想情况下，模态框的按钮和模态框本身是在同一个组件中，因为它们都与组件的开关状态有关。但这意味着该模态框将与按钮一起渲染在应用 `DOM` 结构里很深的地方。

例如：

```vue
<script setup>
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <button @click="open = true">打开模态框</button>

  <div v-if="open" class="modal">
    <p>模态框内容</p>
    <button @click="open = false">关闭</button>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
  border: 1px solid #ccc;
  text-align: center;
}
.modal p {
  padding: 10px;
  margin: 0;
  background-color: #f4f4f4;
  text-align: center;
}
</style>
```

打开该模态框，观察渲染结构：

```html
<div id="app" data-v-app="">
  <div class="outer">
    <h1>Teleport示例</h1>
    <div>
      <button data-v-381af681="">打开模态框</button>
      <div data-v-381af681="" class="modal">
        <p data-v-381af681="">模态框内容</p>
        <button data-v-381af681="">关闭</button>
      </div>
    </div>
  </div>
</div>
```

实测效果（详见 `code/raw/demo1`）：

![](../../assets/63.1.png)

这里的渲染结构其实是不太合适的。

1. `position: fixed` 能够相对于浏览器窗口放置有一个条件，那就是不能有任何祖先元素设置了 `transform`、`perspective` 或者 `filter` 样式属性。也就是说如果我们想要用 `CSS transform` 为祖先节点 `<div class="outer">` 设置动画，就会不小心破坏模态框的布局！
2. 这个模态框的 `z-index` 受限于它的容器元素。如果有其他元素与 `<div class="outer">` 重叠并有更高的 `z-index`，则它会覆盖住我们的模态框。

总结起来，就是 **模态框的样式会受到所在位置的祖级元素的影响**。



以前书写原生 `HTML` 的时候，模特框一般都是在最外层：

```html
<body>
  <div class="container">
  	<!-- 其他代码 -->
  </div>
  <div class="modal"></div>
</body>
```

这种场景就可以使用 `Teleport`：

```vue
<Teleport to="body">
  <div v-if="open" class="modal">
    <p>模态框内容</p>
    <button @click="open = false">关闭</button>
  </div>
</Teleport>
```

使用 `to` 属性来指定要渲染的位置。



## 2 实战案例

用户管理模块中，有一个全局的“用户详情”对话框，该对话框可以在页面的任何地方被触发显示。为了使该对话框在 `DOM` 结构上位于应用的根元素下，并且避免它受到父组件的 `CSS` 样式影响，可以使用 `Teleport` 组件将该对话框传送到指定的 `DOM` 节点：

核心代码（`UserDetailDialog.vue`，详见 `code/raw/demo2`）：

```vue
<template>
  <Teleport to="body">
    <div v-if="visible" class="dialog-overlay" @click.self="close">
      <div class="dialog-content">
        <h2>用户详情</h2>
        <p><strong>姓名:</strong> {{ user.name }}</p>
        <p><strong>邮箱:</strong> {{ user.email }}</p>
        <button @click="close">关闭</button>
      </div>
    </div>
  </Teleport>
</template>
```

实测效果：

![](../../assets/63.2.png)

---

-EOF-