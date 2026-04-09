# P4S15L69：路由组件传参

---

路由组件传参是指 **将参数直接以 props 的形式传递给组件**。



## 1 快速上手

回顾如何获取路由参数。假设有如下的动态路由：

```js
const routes = [
  { 
    path: '/users/:userId(\\d+)',
    component: User
  },
]
```

之后诸如 `/users/1` 就会匹配上该路由，其中 `1` 就是对应的参数。那么在组件中如何获取这个参数呢？

1. 要么用 `$route.params`

2. 要么就是 `useRoute()` 方法获取到当前的路由

这些方式 **和路由是紧密耦合的**，这限制了组件的灵活性，因为它 **只能用于特定的 URL**。

一种更好的方式，是将参数设置为组件的一个 `props`，这样能删除组件对 `$route` 的直接依赖。

1. 首先在路由配置中开启 `props`

   ```js
   const routes = [
     { path: '/user/:userId(\\d+)', name: 'User', component: User, props: true }
   ]
   ```

2. 在组件内部设置 `userId` 这个 `props`，之后路由参数就会以 `props` 的形式传递进来：

   ```js
   const props = defineProps({
     userId: {
       type: String,
       required: true
     }
   })
   ```



## 2 用法细节

路由参数设置成组件 `props`，支持不同的模式：

1. 布尔模式
2. 对象模式
3. 函数模式



### 2.1 布尔模式

当 `props` 设置为 `true` 时，`route.params` 将被设置为组件的 `props`。

如果是命名视图，那么需要为每个命名视图定义 `props` 配置：

```js
const routes = [
  {
    path: '/user/:id',
    components: { default: User, sidebar: Sidebar },
    props: { default: true, sidebar: false }
  }
]
```



### 2.2 对象模式

当 `props` 设置为一个对象时候，回头传递到组件内部 `props` 的信息就是这个对象。



### 2.3 函数模式

可以创建一个返回 `props` 的函数。这允许你将参数转换为其他类型，将静态值与基于路由的值相结合。



### 2.4 在 RouterView 插槽中设置 props

还可以在 `RouterView` 里面设置 `props`，例如：

```vue
<RouterView v-slot="{ Component }">
  <component
    :is="Component"
    view-prop="value"
   />
</RouterView>
```

这种设置方式会让所有视图组件都接收 `view-prop`，相当于每个组件都设置了 `view-prop` 这个 `props` 属性，使用时需考虑实际情况来用。

---

-EOF-


