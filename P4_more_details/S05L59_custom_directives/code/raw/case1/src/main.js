// import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

// 模拟用户权限
const userPermissions = ['admin', 'read']

const app = createApp(App)

app.directive('permission', {
  mounted(el, binding) {
    const { value } = binding
    if (value && value instanceof Array) {
      // 检查用户权限是否包含指令传入的权限
      const hasPermission = value.some((item) => userPermissions.includes(item))
      if (!hasPermission) {
        el.style.display = 'none'
      }
    } else {
      throw new Error('请传入一个权限数组')
    }
  }
})

app.mount('#app')
