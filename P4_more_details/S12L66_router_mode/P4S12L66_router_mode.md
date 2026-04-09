# P4S12L66：Vue3 中的路由模式

---



> [!tip]
>
> **官方文档**
>
> `VueRouter` 不同的历史模式（`history` 属性）：https://router.vuejs.org/zh/guide/essentials/history-mode.html



`VueRouter` 支持三种模式：

1. `Hash` 模式
2. `HTML5` 模式
3. `Memory` 模式



## 1 Hash 模式

`Hash` 是 `URL` 的组成部分，例如：

```url
https://www.example.com:80/path/to/myfile.html?key1=value1&key2=value2#anchor
```

其中 `#anchor` 就是 `location.hash` 的内容。**早期 Hash 更多是被用作【锚点】**：

```html
<a href="target">go target</a>
......
<div id="target">i am target place</div>
```

在上面代码中，点击 `<a>` 链接，文档会滚动到 `id="target"` 的 `div` 的位置。

`Hash` 另一个重要特性：**Hash 的变化不会请求服务器**

利用该特性可以实现不同 `URL` 映射不同的模块。

`#a` :arrow_right: `A`

`#b` :arrow_right: `B`



### 【实战1】使用 Hash 实现单页应用

`VueRouter` 启用 `Hash` 模式的写法：

```js
// router/index.js
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    // ...
  ]
})
```

`import.meta.env.BASE_URL` 是 `Vite` 提供的一个 **环境变量**，默认是 **应用的根路径**。

- 开发环境，默认值是 `'/'`；
- 生产环境，可在 `vite.config.js` 的 `base` 属性中设置；



## 2 HTML5 模式

`HTML5` 模式也被称之为 `History` 模式。该模式利用 `HTML5` 的 **【History API】来管理浏览器的历史记录** 从而实现单页应用。

`History API`：

1. `history.pushState(state, title, url)`：将一个 `state` 状态（`JS` 对象）推入到历史堆栈里；
2. `history.replaceState(state, title, url)`：替换当前历史堆栈最上面的状态；
3. `window.onpopstate`：这是一个事件，当用户点击浏览器的前进或者后退按钮时，会触发该事件；



### 2.1 History 实现原理

工作原理：

1. 拦截链接点击事件
   - 客户端路由器会 **拦截** 页面上的 **所有链接点击事件**（通常是通过阻止链接的默认行为 `event.preventDefault()`）；
   - 取而代之的是，**路由器使用 history.pushState() 或 history.replaceState() 更新 URL**。
2. `URL` 变化处理：
   - 当 `URL` 变化时，路由器会捕捉到这个变化。
   - 路由器不会发出新的 `HTTP` 请求，而是根据新的 `URL` 查找预先定义好的路由规则，并加载相应的视图组件。

例如：一个单页应用，使用 `history` 模式，并且定义以下路由规则：

- `/home`：显示【主页】内容；
- `/about`：显示【关于】页内容；

当用户点击导航链接从 `/home` 切换到 `/about` 时，流程如下：

1. 用户点击链接 `<a href="/about">About\</a>`；
2. 路由器拦截点击事件，调用 `event.preventDefault()` 阻止浏览器的默认行为（即不发出 `HTTP` 请求）；
3. 路由器调用 `history.pushState(null, '', '/about')` 更新浏览器的地址栏 `URL` 为 `/about`；
4. 路由器检测到 `URL` 变化，查找路由规则，发现 `/about` 对应的视图组件；
5. 路由器加载并渲染 `/about` 视图组件，将其插入到页面的特定位置。

整个过程中，浏览器地址栏的 `URL` 更新了，但没有发出新的 `HTTP` 请求，所有的视图更新都是在客户端完成的。



### 【实战2】用 History 实现单页应用

`VueRouter` 启用 `History` 模式的写法：

```js
// router/index.js
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ...
  ]
})
```



### 2.2 History 存在的问题

一旦刷新，就会报 `404` 错误。

> [!tip]
>
> **思考：为什么会这样？**
>
> 答：刷新时浏览器会请求服务器，但服务器并没有该后端路由，当前路由仅仅是一个前端路由。

要解决这个问题，需要在服务器上面做一些配置。添加一个回退路由，如果 `URL` 不匹配任何的静态资源，回退到首页。不同服务器环境的具体配置方法，详见 `VueRouter` 官方文档：[服务器配置示例](https://router.vuejs.org/zh/guide/essentials/history-mode.html#%E6%9C%8D%E5%8A%A1%E5%99%A8%E9%85%8D%E7%BD%AE%E7%A4%BA%E4%BE%8B)。



## 3 Memory 模式

无论是 `Hash` 也好、`History API` 也好，本质上都是 **基于浏览器的特性** 来实现的。

而 `Memory` 模式一般用于 **非浏览器环境**，例如 `NodeJS` 或者 `SSR`。因为是非浏览器环境，所以不会有 `URL` 交互也 **不会自动触发初始导航**。

该模式用 `createMemoryHistory()` 创建，并且需要 **在调用 app.use(router) 之后手动 push 到初始导航**。

```js
import { createRouter, createMemoryHistory } from 'vue-router'
const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    //...
  ],
})
```

---

-EOF-