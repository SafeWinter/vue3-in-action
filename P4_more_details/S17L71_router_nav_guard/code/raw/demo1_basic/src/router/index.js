import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  }
]

// 这一步创建了一个路由的实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局导航守卫
router.beforeEach((to, from, next) => {
  // 回调函数里面决定了拦截下来后做什么
  console.log('from:', from)
  console.log('to:', to)
  console.log('导航到：', to.name)
  next() // 调用该方法代表放行
})

export default router
