import { createApp } from 'vue'
import App from './App.vue'
import {time} from './directives/time'

const app = createApp(App)

app.directive('time', time(6e4))

app.mount('#app')
