// import './assets/main.css'

import { createApp } from 'vue'
// 引入了根组件
import App from './App.vue'

// 挂载根组件
const app = createApp(App)

// 在这里新增全局对象属性
app.config.globalProperties.Test = {
  a: 'Hello, Global Object!'
}

app.mount('#app')
