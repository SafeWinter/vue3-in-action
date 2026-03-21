// 前端路由配置文件
import { createRouter, createWebHistory } from 'vue-router'
// 页面组件
import Home from '../views/Home.vue'
import About from '../views/About.vue'

// 该方法会创建一个路由的实例
// 在创建路由实例的时候，可以传入一个配置对象
const router = createRouter({
  history: createWebHistory(), // 指定前端路由的模式，常见的有 hash 和 history 两种模式
  // 路由和组件的映射
  routes: [
    {
      path: '/', // 路由的路径
      name: 'Home',
      component: Home // 路由对应的组件
    },
    {
      path: '/about',
      name: 'About',
      component: About
    }
  ]
})
export default router
