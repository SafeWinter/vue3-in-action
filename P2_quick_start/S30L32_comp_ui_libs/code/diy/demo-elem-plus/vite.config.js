import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'

// auto-import configs for element-plus components
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  // 插件
  plugins: [
    vue(),
    VueDevTools(),
    AutoImport({
      imports: [
        'vue',
        'vue-router'
      ],
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  // 用于配置模块解析
  resolve: {
    // 别名
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
