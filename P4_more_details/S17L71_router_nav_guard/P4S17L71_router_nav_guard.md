# P4S17L71：Vue3 中的导航守卫

---

> [!tip]
>
> `Vue` 导航守卫官方文档：https://router.vuejs.org/guide/advanced/navigation-guards.html



所谓导航守卫（`Navigation Guards`），就是在当你进行导航的时候将其拦截下来，从而方便做一些其他的事情。



## 1 快速上手

```js
// 全局导航守卫
router.beforeEach((to, from, next) => {
  // 回调函数里面决定了拦截下来后做什么
  console.log('from:', from)
  console.log('to:', to)
  console.log('导航到：', to.name)
  next() // 调用该方法代表放行
})
```

这是一个全局导航守卫，回调会自动传入三个参数：

- `to`：即将要 **进入的目标路由**，是一个 **对象**，对象里面有 `path`、`fullPath`、`hash`、`params` 等参数；
- `from`：当前导航 **正要离开的路由**，同样是一个对象，对象内部有上述参数；
- `next`：是一个函数，表示导航放行。



## 2 各种拦截守卫

整体分为三大类：

1. 全局守卫；
2. 路由守卫；
3. 组件守卫；



### 2.1 全局守卫

主要有三个——

- `beforeEach`：全局前置守卫，会 **在解析组件守卫和异步路由组件之前被调用**
- `beforeResolve`：全局解析守卫，在 **导航被确认之前，但在所有组件内守卫和异步路由组件被解析之后调用**
  - 上面两个其实就是执行的时机一前一后
- `afterEach`：全局后置守卫，**在导航确认后触发** 的钩子函数。该钩子函数执行后会触发 `DOM` 更新，用户看到新的页面。
  - 思考🤔：既然导航都已经确认了，这里安插一个守卫干嘛呢？
  - 全局后置守卫经常用于如下的场景：
    1. 记录页面访问历史：可以使用 `afterEach` 来记录用户访问的页面，以便进行统计或分析。
    2. 关闭加载指示器：在 `beforeEach` 中开启加载指示器，在 `afterEach` 中关闭它，以提供更好的用户体验。
    3. 页面切换动画：在 `afterEach` 中触发页面切换动画或其他视觉效果，以提升用户体验。
    4. 更新文档标题：在导航完成后更新页面标题，以反映当前页面内容。



### 2.2 路由守卫

即写到具体路由对象中的 `beforeEnter` 钩子：**针对特定路由设置的守卫**，因此设置的方式也不再是在 `router` 路由实例上面设置，而是在某个路由配置中设置。

```js
const routes = [
  {
    path: '/users/:id',
    component: UserDetails,
    // 在路由的配置中进行设置，只针对特定的路由进行拦截
    beforeEnter: (to, from) => {
      // reject the navigation
      return false
    },
  },
]
```

相关细节：

1. `beforeEnter` 守卫 **只在进入路由时触发**，**不会在 params、query 或 hash 改变时触发**。

   - 例1：从 `/users/2` 进入到 `/users/3` 这种不会触发（除非是组件守卫里的 `beforeRouteUpdate` 钩子）；
   - 例2：从 `/users/2#info` 进入到 `/users/2#projects` 这种也不会触发；

2. 如果放在父级路由上，路由在具有相同父级的子路由之间移动时，它不会被触发。

   ```js
   const routes = [
     {
       path: '/user',
       beforeEnter() {
         // ...
       },
       children: [
         { path: 'list', component: UserList },
         { path: 'details', component: UserDetails },
       ],
     },
   ]
   ```


此时从 `/user/list` 跳转到 `/user/details` 不会触发路由级别守卫。



### 2.3 组件守卫

这种守卫是组件级别，取决于是否进入或者离开某个组件：

- `beforeRouteEnter`：进入了该导航，组件开始渲染之前；
- `beforeRouteUpdate`：当前路由改变，但是该组件被复用时调用，例如对于一个带有动态参数的路径 `/users/:id`，在 `/users/1` 和 `/users/2` 之间跳转的时候 **会触发**；
- `beforeRouteLeave`：离开了该导航，组件失活的时候；

整体的执行顺序：

1. 组件离开守卫
2. 全局前置守卫
3. 路由级别守卫
4. 全局解析守卫
5. 全局后置守卫
6. 组件进入守卫

如果是组件复用，参数变化的情况，执行顺序如下：

1. 全局前置守卫
2. 组件更新守卫
3. 全局解析守卫
4. 全局后置守卫



## 3 其他细节

### 3.1 为路由级别守卫 beforeEnter 设置多个值

路由级别守卫，也就是 `beforeEnter` 可以 **设置成一个数组，数组里面包含多个方法**，每个方法进行一项处理：

```js
const routes = [
  // ...
  {
    path: '/about',
    name: 'About',
    component: About,
    beforeEnter: [
      (to, from, next) => {
        console.log('Route beforeEnter step 1')
        next()
      },
      (to, from, next) => {
        console.log('Route beforeEnter step 2')
        next()
      }
    ]
  },
  // ...
]
```



### 3.2 在守卫内的全局注入

从 **Vue 3.3** 开始，你可以在导航守卫内使用 `inject()` 方法。这在注入像 `pinia stores` 这样的全局属性时很有用。

在 `app.provide()` 中提供的所有内容都可以在全局守卫里面获取到。

```js
// main.js
const app = createApp();
app.provide('global', 'some data');
```

```js
// router.js
router.beforeEach(()=>{
  const data = inject('global');
  
  const userStore = useUserStore();
})
```



## 4 实战案例

本例可视为简化版的 `Vue2` 实战项目。

需求描述：使用导航守卫拦截未登录的用户，将未登录用户导航到登录页面。

关键信息：

- 角色划分：普通用户、管理员
- 涉及页面：主页、用户页、管理员页、登录
- 未登录渲染页面：主页、登录
- 【用户】身份登录时渲染：主页、用户页、登录
- 【管理员】身份登录时渲染：主页、用户页、管理员页、登录



