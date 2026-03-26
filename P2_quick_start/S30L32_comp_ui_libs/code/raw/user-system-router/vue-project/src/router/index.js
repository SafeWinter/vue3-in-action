// router.js
import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import About from '../views/About.vue'
import AddOrEdit from '../views/AddOrEdit.vue'
import Detail from '../views/Detail.vue'
import Email from '../views/Email.vue'
import Tel from '../views/Tel.vue'

const routes = [
  {
    path: '/home',
    component: Home
  },
  {
    path: '/about',
    component: About,
    children: [
      {
        path: 'email',
        component: Email
      },
      {
        path: 'tel',
        component: Tel
      },
      {
        path: '',
        redirect: '/about/email'
      }
    ]
  },
  {
    path: '/add',
    component: AddOrEdit
  },
  {
    path: '/detail/:id',
    component: Detail
  },
  {
    path: '/edit/:id',
    component: AddOrEdit
  },
  {
    path: '/',
    redirect: '/home'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
