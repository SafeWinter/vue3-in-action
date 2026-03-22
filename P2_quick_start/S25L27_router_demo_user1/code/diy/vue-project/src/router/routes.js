export const routes = [
  {
    path: '/', // 路由的路径
    name: 'Portal',
    redirect: '/home'
  },
  {
    path: '/home', // 路由的路径
    name: 'Home',
    component: () => import('@/views/Home.vue') // 路由对应的组件
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
    redirect: '/about/email',
    // 创建嵌套的路由
    children: [
      {
        path: 'email',
        component: () => import('@/views/Email.vue')
      },
      {
        path: 'tel',
        component: () => import('@/views/Tel.vue')
      }
    ]
  },
  {
    path: '/add',
    name: 'AddOrEdit',
    component: () => import('@/views/AddOrEdit.vue')
  },
  {
    // 这里的详情就应该是一个动态路由
    path: '/detail/:id',
    component: () => import('@/views/Detail.vue')
  }
]
