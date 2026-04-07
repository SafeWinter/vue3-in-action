// import './assets/main.css'

import { createApp, reactive } from 'vue'
import App from './App.vue'

// 创建全局配置信息对象
const globalConfig = reactive({
  themeColor: 'blue',
  user: {
    name: '张三',
    role: 'admin'
  }
})

// 更新主题颜色的方法
function changeThemeColor(color) {
  globalConfig.themeColor = color
}

const app = createApp(App)

app.provide('globalConfig', globalConfig)
app.provide('changeThemeColor', changeThemeColor)

app.mount('#app')
