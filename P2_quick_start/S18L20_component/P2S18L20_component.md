# P2S18L20：Vue3 组件概述



> [!tip]
>
> 本节概要
>
> - 组件结构
> - 组件注册
> - 组件名



## 1 组件结构

`Vue` 支持 **单文件组件（SFC）**，即一个文件对应一个组件，该文件以 `.vue` 作为扩展名。

一个组件会包含一套完整的结构、样式以及逻辑：

```vue
<template>
  <button @click="count++">Count is: {{ count }}</button>
</template>

<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<style scoped>
button{
  padding: 15px;
}
</style>
```



### 1.1 关于 setup 语法糖

早期的 `Vue3` 需要返回一个对象，该对象包含模板要用到的数据状态及方法：

```js
// <button @click="add">Count is: {{ count }}</button>
import { ref } from 'vue'
export default {
  setup() {
    // 在这里面定数据和方法
    const count = ref(0)
    function add() {
      count.value++
    }
    return {
      count,
      add
    }
  }
}
```

从 `Vue 3.2` 版本开始，推出了 `setup` 标签，定义的所有数据状态及方法都会自动暴露给模板使用，从而减少了样板代码：

```vue
<template>
  <button @click="add">Count is: {{ count }}</button>
</template>

<script setup>
import { ref } from 'vue'
// 在这里面定数据和方法
const count = ref(0)
function add() {
  count.value++
}
</script>
```

`setup` 标签语法的其他好处：

- 有更好的类型推断
- 支持顶级 `await`

更多用法，详见官方文档：[&lt;script setup&gt;](https://cn.vuejs.org/api/sfc-script-setup.html)



### 1.2 关于 scoped 标记

用于定义组件私有的 `CSS` 样式，即该样式只对当前组件生效。如果不写 `scoped`，则样式就对全局生效。



### 1.3 以纯对象方式定义组件

除了以 **单文件组件** 的形式来定义组件外，还可以使用 **对象** 的形式来定义组件：

```js
export default {
  setup(){
    // 定义数据
    const count = ref(0)
    return { count }
  },
  template: `<div>{{count}}</div>`
}
```

当 `template` 模板结构较复杂时，也可以引用 `template` 标签 `ID` 来简化书写：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="app"></div>
    <template id="my-template-element">
      <div>
        <h1>{{ count }}</h1>
        <button @click="count++">Increment</button>
      </div>
    </template>
    <script src="https://unpkg.com/vue@3.2.31"></script>
    <script>
      const { createApp, ref } = Vue;
      const App = {
        setup() {
          const count = ref(0);
          return { count };
        },
        template: "#my-template-element",
      };
      createApp(App).mount("#app");
    </script>
  </body>
</html>
```



## 2 组件的注册

组件注册分为两种形式：

- 全局注册
- 局部注册



### 2.1 全局注册

即使用 `Vue` 实例的 `.component()` 方法来实现，所注册的组件 **全局可用**：

```js
import { createApp } from 'vue'

const app = createApp({})

app.component(
  // 注册的名字
  'MyComponent',
  // 组件的实现
  {
    /* ... */
  }
)
```

其中的组件实现部分也可以用 `import` 语句导入：

```js
import MyComponent from './App.vue'
app.component('MyComponent', MyComponent)
```

此外，`component()` 方法也支持链式调用：

```js
app
  .component('ComponentA', ComponentA)
  .component('ComponentB', ComponentB)
  .component('ComponentC', ComponentC)
```



### 2.2 局部注册

局部注册就是在具体某个父组件内按需导入目标组件，然后通过 `components` 配置项进行注册。

未使用编译时 `setup` 语法糖的旧版写法：

```vue
<template>
  <button @click="add">Count is: {{ count }}</button>
  <TestCom />
</template>

<script>
import { ref } from 'vue'
import TestCom from './components/TestCom.vue'
export default {
  // 局部注册
  components: {
    TestCom
  },
  setup() {
    // 在这里面定数据和方法
    const count = ref(0)
    function add() {
      count.value++
    }
    return {
      count,
      add
    }
  }
}
</script>

<style scoped>
button {
  padding: 15px;
}
</style>
```

改用 `setup` 语法糖后，只需导入目标组件即可，`Vue` 会自动注册，无需手动配置 `components` 选项：

```vue
<template>
  <button @click="add">Count is: {{ count }}</button>
  <TestCom />
</template>

<script setup>
import { ref } from 'vue'
import TestCom from './components/TestCom.vue'
// 在这里面定数据和方法
const count = ref(0)
function add() {
  count.value++
}
</script>

<style scoped>
button {
  padding: 15px;
}
</style>
```



> [!tip]
>
> **最佳实践**
>
> 实际开发时 **推荐使用局部注册**。
>
> 1. 全局注册无法充分利用 `tree-shaking` 机制；
> 2. 全局注册的组件在大型项目中无法很好地体现组件间的依赖关系。
>



## 3 组件名

组件名称推荐使用 **大驼峰命名法**。

> **注意**
>
> 大驼峰命名在 `DOM` 内模板中无法使用。
