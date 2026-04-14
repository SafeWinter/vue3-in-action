import { createApp } from 'vue'
import App from './App.vue'
import { ObserveVisibility } from 'vue3-observe-visibility'

const app = createApp(App)

app.directive('observe-visibility', ObserveVisibility)

app.mount('#app')
