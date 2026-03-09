// import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

app.config.globalProperties.Test = {
  a: 1
}

app.mount('#app')
