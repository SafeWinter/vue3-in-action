# P4S13L67：Vue3 路由杂项知识点

---



## 1 别名

用 `alias` 设置别名。

给定路由 `/user/:id/profile`，用于显示用户的个人资料，若希望通过 `/profile/:id` 也能访问到同样的组件，此时就可以使用别名：

```js
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/user/:id/profile',
      name: 'user-profile',
      component: UserProfile,
      alias: '/profile/:id' // 配置路由别名
    }
  ]
});
```

别名的好处：

- **提供不同的访问路径**：为同一个路由提供了多种访问方式，更加灵活；
- **兼容旧路径**：有些时候需要更新路径，使用别名可以保证旧的路由依然有效；
- **简化路径**：特别是嵌套路由的情况下，路径可能会很长，别名可以简化路径。



## 2 命名视图

`router-view` 被称为 **视图** 或者 **路由出口**。

适用场景：要求 **一个路由对应多个组件** 而非一个组件时。**不同的组件渲染到不同的视图里面**，此时需要给视图设置不同的 `name` 来加以区分。

例如：

```js
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      // 注意这里是 components，多了一个 's'
      components: {
        default: Home,
        // LeftSidebar: LeftSidebar 的缩写
        LeftSidebar,
        // 它们与 <router-view> 上的 name 属性匹配
        RightSidebar,
      },
    },
  ],
})
```

在上面的 `components` 配置中，对应了多个组件，所以视图也就提供多个：

```vue
<router-view class="view left-sidebar" name="LeftSidebar" />
<router-view class="view main-content" />
<router-view class="view right-sidebar" name="RightSidebar" />
```

如果 **视图没有设置名字，那么默认为 default**。那些只配置了一个组件的路由，默认就渲染在 `default` 视图所在位置。



## 3 重定向

通过 `redirect` 可以配置路由重定向，它允许你将一个路径重定向到另一个路径，当用户访问被重定向的路径时，浏览器的 `URL` 会自动更新到目标路径，并渲染目标路径对应的组件。

`redirect` 对应的值可以有多种形式：



### 3.1 字符串

```js
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/home',
      redirect: '/'
    },
    {
      path: '/',
      component: HomeView
    }
  ]
});
```

在这个示例中，当用户访问 `/home` 时，会被重定向到 `/`，并渲染 `HomeView` 组件。

### 3.2 对象

可以使用对象来更详细地定义重定向，包括传递 **路径参数（params）** 和 **查询参数（query）**。

```js
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/user/:id',
      redirect: { name: 'profile', params: { userId: ':id' } }
    },
    {
      path: '/profile/:userId',
      name: 'profile',
      component: UserProfile
    }
  ]
});
```

在这个示例中，当用户访问 `/user/123` 时，会被重定向到 `/profile/123`，并渲染 `UserProfile` 组件。

### 3.3 函数

重定向函数可以根据路由信息动态生成重定向目标路径。

```js
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/old-path/:id',
      redirect: to => {
        const { params } = to;
        return `/new-path/${params.id}`;
      }
    },
    {
      path: '/new-path/:id',
      component: NewPathComponent
    }
  ]
});
```

在这个示例中，当用户访问 `/old-path/123` 时，会被重定向到 `/new-path/123`，并渲染 `NewPathComponent` 组件。



## 4 路由元数据

元数据（`meta fields`）是一种附加到路由配置中的属性，用来存储与路由相关的 **附加信息**。

元数据经常用于权限控制、标题设置、面包屑导航、路由过渡之类的效果。

:one: 定义元数据：添加一个 `meta` 配置项，该配置项对应的是一个对象，对象里面就是你自定义要添加的信息：

```js
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: HomeView,
      meta: { requiresAuth: true, title: 'Home' }
    },
    {
      path: '/about',
      component: AboutView,
      meta: { requiresAuth: false, title: 'About Us' }
    }
  ]
});
```

:two: 访问元数据：在导航守卫的回调函数中，会自动传入 `to` 这个参数（你要起哪里），通过 `to.meta` 就可以拿到元数据信息：

```js
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    next('/login');
  } else {
    next();
  }
});
```



## 5 路由懒加载

在新项目的模板代码中，官方路由示例的写法如下：

```js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
```

可以看到，`HomeView` 是正常导入，而 `AboutView` 却有所不同。`component` 的配置对应的是一个返回 `Promise` 组件的函数，这种情况下，`VueRouter` 只会在第一次进入页面时才会获取这个函数，然后使用缓存数据。

这意味着你也可以使用更复杂的函数，只要它们返回一个 `Promise`：

```js
const UserDetails = () =>
  Promise.resolve({
    /* 组件定义 */
  })
```

这样的组件导入方式称为 **动态导入**，其好处在于：

1. 当路由被访问的时候才加载对应组件，这样就会更加高效；
2. 进行打包的时候方便做 **代码分割**。



另外注意，**路由中不要再使用异步组件**，也就是说下面的代码虽然可以使用，但是 **没有必要**：

```js
import { defineAsyncComponent } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

const asyncAboutView = defineAsyncComponent(() =>
	import('../views/AboutView.vue')
)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ...
    {
      path: '/about',
      name: 'about',
      component: asyncAboutView
    }
  ]
})

export default router
```

究其原因，是因为 **Vue-router 内部会自动对动态导入做处理，转换为异步组件**，**开发者只需要书写动态导入组件的代码即可**，无需再显式使用 `defineAsyncComponent`，这样更加简洁方便一些。

