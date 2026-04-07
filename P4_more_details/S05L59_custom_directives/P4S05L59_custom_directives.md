# P4S05L59：Vue3 中的自定义指令

---



> [!tip]
>
> `Vue` 自定义指令官方文档：https://cn.vuejs.org/guide/reusability/custom-directives.html



## 0 概述

自定义指令本质上也是一种复用代码的方式。

回顾已经学过的代码复用方式——

- 组件：对 **结构 + 样式 + 逻辑** 的复用；
- 组合式函数：侧重对 **有状态的逻辑** 的复用；
- 自定义指令：侧重涉及普通元素的底层 `DOM` 访问的逻辑复用；



## 1 快速上手

`App.vue`：

```vue
<template>
  <input type="text" v-focus />
</template>

<script setup>
// 这里是局部注册自定义指令，只在 App.vue里面生效
const vFocus = {
  // 键值对
  // 键：生命周期钩子 值：函数
  mounted: (el) => {
    // 这个是 DOM 原生方法，用来让元素获取焦点
    el.focus()
  }
}
</script>

<style scoped></style>
```



## 2 相关细节

### 2.1 不同组件写法下的自定义指令

:one: 使用 `setup` 语法糖：**任何以 v 开头的驼峰式命名的变量** 都可以被用作一个自定义指令。

:two: 非 `setup` 语法：**需要在 directives 中进行注册**，例如：

`App.vue`：

```vue
<script>
export default {
  // 有一个 directives 的配置选项（v-focus）
  directives: {
    focus: {
      mounted: (el) => el.focus()
    }
  }
}
</script>

<template>
  <input v-focus />
</template>
```

实测效果（文本框自动得焦点）：

![](../../assets/59.1.png)



### 2.2 全局注册

在 `app` 应用实例上面通过 `directive` 来进行注册。

`main.js`：

```js
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

// 创建一个全局的自定义指令 v-focus
// 全局注册的自定义指令可以在所有组件里面使用
app.directive('focus', {
  mounted(el) {
    el.focus();
  }
});

app.mount('#app');
```

简写版：

```js
// 注意第二个参数，不再是对象而是函数
app.directive('color', (el, binding) => {
  // 这会在 `mounted` 和 `updated` 时都调用
  el.style.color = binding.value
})
```

第二个参数是一个函数而非对象，之前对象可以指定具体哪个生命周期，而 **函数对应的就固定是 mounted 和 updated 生命周期**。



### 2.3 指令钩子

对象内是和生命周期钩子相关的键值对，可以选择其他生命周期钩子函数：

```js
const myDirective = {
  // 在绑定元素的 attribute 前
  // 或事件监听器应用前调用
  created(el, binding, vnode) {
    // 下面会介绍各个参数的细节
  },
  // 在元素被插入到 DOM 前调用
  beforeMount(el, binding, vnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都挂载完成后调用
  mounted(el, binding, vnode) {},
  // 绑定元素的父组件更新前调用
  beforeUpdate(el, binding, vnode, prevVnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都更新后调用
  updated(el, binding, vnode, prevVnode) {},
  // 绑定元素的父组件卸载前调用
  beforeUnmount(el, binding, vnode) {},
  // 绑定元素的父组件卸载后调用
  unmounted(el, binding, vnode) {}
}
```

指令的钩子函数，会有这么一些参数：

1. `el`：**指令绑定到的元素**。这可以用于直接操作 DOM。

2. `binding`：这是一个 **对象**

   - `value`：传递给指令的值。例如在 `v-my-directive="1 + 1"` 中，值是 `2`。 
   - `oldValue`：之前的值，仅在 `beforeUpdate` 和 `updated` 中可用。无论值是否更改，它都可用。 
   - `arg`：传递给指令的 **参数** (如果有的话)。例如在 `v-my-directive:foo` 中，参数是 `"foo"`。 
   - `modifiers`：一个包含 **修饰符的对象**。例如在 `v-my-directive.foo.bar` 中，修饰符对象是 `{ foo: true, bar: true }`。 
   - `instance`：使用该指令的 **组件实例**。 
   - `dir`：指令的定义对象。

   例如：

   ```vue
   <div v-example:foo.bar="baz">
   ```

   `binding` 参数如下：

   ```js
   {
     arg: 'foo',
     modifiers: { bar: true },
     value: /* baz 的值 */,
     oldValue: /* 上一次更新时 baz 的值 */
   }
   ```

   换句话说，通过 `binding` 对象，可以获取到用户在使用指令时的一些 **详细** 信息，回头需要根据这些详细信息做不同处理。

   再来看一个前面学过的内置指令：

   ```vue
   <div v-bind:id="id">
   ```

   `binding` 参数如下：

   ```js
   {
     arg: 'id',
     value: /* id 的值 */,
     oldValue: /* 上一次更新时 id 的值 */
   }
   ```

3. `vnode`：代表绑定元素的底层 `VNode`。

4. `preVnode`：代表之前的渲染中指令所绑定元素的 `VNode`。仅在 `beforeUpdate` 和 `updated` 钩子中可用。



### 2.4 传递多个值

正常情况下，会给指令传递一个值，例如：

```vue
<div v-bind:id="id">
```

这里给指令传递的值就是 `id`。

但是有些时候的需求是传递多个值，这个时候可以使用 **对象字面量**，例如：

```vue
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
```

这里就通过对象的方式传递了多个值：

```js
app.directive('demo', (el, binding) => {
  // binding.value 
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text) // => "hello!"
})
```



## 3 实战案例

:one: 创建一个自定义指令 `v-permission`，用于控制 `DOM` 元素根据用户权限列表来显示；

（详见 `code/raw/case1`）

:two: 创建一个自定义指令 `v-time`，用于显示相对时间，例如 `XX秒前`、`XX分前`、`XX小时前`、`20XX-XX-XX`。

（详见 `code/diy/case2`）

将自定义指令的核心逻辑迁移至 `./src/directives/time.js` 后，实测效果：

![](../../assets/59.2.png)