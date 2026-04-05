import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import './assets/main.css'; // 引入 Tailwind CSS 样式

// 创建 pinia 实例
const pinia = createPinia()
createApp(App).use(router).use(pinia).mount('#app')
