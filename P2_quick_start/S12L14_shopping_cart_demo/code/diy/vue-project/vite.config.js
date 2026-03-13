import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // +++ 新增以下 css 配置块 +++
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler' // 关键配置：告诉 Vite 使用新版 Sass API
      }
    }
  }
})
