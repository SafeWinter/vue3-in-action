import { createRouter, createWebHistory } from 'vue-router'
import page1 from '../views/page1.vue'
import page2 from '../views/page2.vue'
import page3 from '../views/page3.vue'

const routes = [
  {
    path: '/',
    redirect: '/page1'
  },
  {
    path: '/page1',
    name: page1.name,
    component: page1,
  },
  {
    path: '/page2',
    name: page2.name,
    component: page2
  },
  {
    path: '/page3',
    name: page3.name,
    component: page3
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
