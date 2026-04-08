import { createApp } from 'vue'
import App from './App.vue'
// 引入自定义插件
import ErrLogger from './plugins/ErrLogger/index.js'
import i18nPlugin from './plugins/i18n'


const app = createApp(App)

// 使用插件
app.use(ErrLogger, {
  logToConsole: true,
  remoteLogging: true,
  remoteUrl: 'http://localhost:3000/log'
}).use(i18nPlugin, {
  greetings: {
    hello: 'Bonjour!'
  }
})

app.mount('#app')
