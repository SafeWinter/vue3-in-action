# P4S10L64：Vue 中的异步组件

---

> [!tip]
>
> `Vue` 异步组件官方文档：https://cn.vuejs.org/guide/components/async.html



异步组件：指的是 **在需要时才加载** 的组件。



## 1 基本用法

在 `Vue` 中，可以通过 `defineAsyncComponent` 来定义一个异步组件

```js
import { defineAsyncComponent } from 'vue'

// 之后就可以像使用普通组件一样，使用 AsyncCom 这个异步组件
const AsyncCom = defineAsyncComponent(() => {
  // 这是一个工厂函数，该工厂函数一般返回一个 Promise
  return new Promise((resolve, reject)=>{
    resolve(/* 获取到的组件 */)
  })
})
```

`ES` 模块的动态导入返回的也是一个 `Promise`，所以多数情况下可以和 `defineAsyncComponent` 配合着一起使用

```js
import { defineAsyncComponent } from 'vue'

// 之后就可以像使用普通组件一样，使用 AsyncCom 这个异步组件
const AsyncCom = defineAsyncComponent(()=>{
 	import('.../MyCom.vue')
})
```



## 2 快速上手

```bash
src/
├── components/
│   ├── Home.vue
│   └── About.vue
├── App.vue
└── main.js
```

`App.vue`

```vue
<template>
  <div id="app">
    <button @click="currentComponent = Home">访问主页</button>
    <button @click="currentComponent = About">访问关于</button>
    <component :is="currentComponent" v-if="currentComponent"></component>
  </div>
</template>

<script setup>
import { shallowRef } from 'vue'
import Home from './components/Home.vue'
import About from './components/About.vue'
const currentComponent = shallowRef(null)
</script>
```

在 `App.vue` 中，通过 `import` 导入了 `Home` 和 `About`，这相当于在应用启动时立即加载所有被导入的组件，这会导致初始加载时间较长，特别是在组件数量较多的时候。

重构 `App.vue`，使用异步组件来进行优化：

```vue
<template>
  <div id="app">
    <button @click="loadComponent('Home')">访问主页</button>
    <button @click="loadComponent('About')">访问关于</button>
    <component :is="currentComponent" v-if="currentComponent"></component>
  </div>
</template>

<script setup>
import { shallowRef, defineAsyncComponent } from 'vue'
// import Home from './components/Home.vue'
// import About from './components/About.vue'

const currentComponent = shallowRef(null)
/**
 *
 * @param name 组件名
 */
const loadComponent = (name) => {
  currentComponent.value = defineAsyncComponent(() => import(`./components/${name}.vue`))
}
</script>
```

相比之前一开始就通过 `import` 导入 `Home` 和 `About` 组件，现在改为了点击按钮后才会 `import`，从而实现了懒加载的特性。



## 3 细节用法

### 3.1 全局注册

与普通组件一样，异步组件可以使用 `app.component()` 全局注册：

```js
app.component('MyComponent', defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
))
```



### 3.2 可以在父组件中定义

```vue
<script setup>
import { defineAsyncComponent } from 'vue'

// 在父组件里面定义了一个异步组件
const AdminPage = defineAsyncComponent(() =>
  import('./components/AdminPageComponent.vue')
)
</script>

<template>
	<!-- 使用异步组件就像使用普通组件一样 -->
  <AdminPage />
</template>
```



### 3.3 支持的配置项

`defineAsyncComponent` 方法支持传入一些配置项，此时不再是传递工厂函数，而是传入一个 **配置对象**：

```js
const AsyncComp = defineAsyncComponent({
  // 加载函数
  loader: () => import('./Foo.vue'),

  // 加载异步组件时使用的组件
  // 如果提供了一个加载组件，它将在内部组件加载时先行显示。
  loadingComponent: LoadingComponent,
  
  // 展示加载组件前的延迟时间，默认为200ms
  // 在网络状况较好时，加载完成得很快，加载组件和最终组件之间的替换太快可能产生闪烁，反而影响用户感受。
  // 通过延迟来解决闪烁问题
  delay: 200,

  // 加载失败后展示的组件
  // 如果提供了一个报错组件，则它会在加载器函数返回的 Promise 抛错时被渲染。
  errorComponent: ErrorComponent,
  
  // 你还可以指定一个超时时间，在请求耗时超过指定时间时也会渲染报错组件。
  // 默认值是：Infinity
  timeout: 3000
})
```

异步组件经常和内置组件 `Suspense` 搭配使用，给用户提供更好的用户体验。



## 4 实测备忘

![](../../assets/64.1.png)

