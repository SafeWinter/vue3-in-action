// 前端路由配置文件
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router/routes'
// 该方法会创建一个路由的实例
// 在创建路由实例的时候，可以传入一个配置对象
const router = createRouter({
  history: createWebHistory(), // 指定前端路由的模式，常见的有 hash 和 history 两种模式
  // 路由和组件的映射
  routes
})
export default router
