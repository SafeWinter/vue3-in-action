import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// 模拟用户权限
const userPermissions = ['admin', 'read']
app.directive('permission', {
  mounted(el, binding) {
    const { value } = binding
    if (value && Array.isArray(value)) {
      // 检查用户权限是否包含指令传入的权限
      const hasPermission = value.some(p => userPermissions.includes(p))
      if (!hasPermission) {
        el.style.display = 'none'
      }
    } else {
      throw new Error('请传入一个权限数组')
    }
  }
})

app.mount('#app')
