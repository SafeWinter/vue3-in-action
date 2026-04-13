<template>
  <div class="demo">
    <h2>VueUse 事件过滤器示例</h2>
    
    <!-- 节流示例：localStorage 写入节流 -->
    <div class="section">
      <h3>🚀 节流过滤器 (Throttle)</h3>
      <p>每秒最多写入 localStorage 一次</p>
      <div class="form-group">
        <label>输入内容：</label>
        <input 
          v-model="storage.foo" 
          type="text" 
          placeholder="输入内容，会自动保存到 localStorage"
        />
      </div>
      <div class="info">
        <div>当前值: {{ storage.foo }}</div>
        <div>localStorage 中的值: {{ localStorageValue }}</div>
        <button @click="checkLocalStorage">读取 localStorage</button>
      </div>
      <p class="note">⏱️ 快速输入时，每秒最多写入一次 localStorage（节流）</p>
    </div>

    <!-- 防抖示例：鼠标位置防抖 -->
    <div class="section">
      <h3>🐌 防抖过滤器 (Debounce)</h3>
      <p>鼠标停止移动 100ms 后才更新坐标</p>
      <div class="mouse-area">
        <div class="mouse-coords">
          <div>📏 容器尺寸: 宽={{ containerWidth }}, 高={{ containerHeight }}</div>
          <div>🎯 相对坐标: X={{ relativeX.toFixed(0) }}, Y={{ relativeY.toFixed(0) }}</div>
        </div>
        <div class="mouse-tracker" ref="box">
          在此区域移动鼠标测试防抖效果
        </div>
      </div>
      <p class="note">⏸️ 持续移动鼠标时坐标不会更新，停止 100ms 后才会更新（防抖）</p>
    </div>

    <!-- 对比说明 -->
    <div class="section comparison">
      <h3>📖 说明</h3>
      <ul>
        <li><strong>节流 (Throttle)</strong>：固定时间间隔执行一次，适用于限制写入频率（如保存到 localStorage）</li>
        <li><strong>防抖 (Debounce)</strong>：延迟执行，直到动作停止后才触发，适用于搜索输入、鼠标位置更新等</li>
        <li>两者都通过 <code>eventFilter</code> 选项传入组合式函数</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { debounceFilter, throttleFilter, useLocalStorage, useMouse } from '@vueuse/core'

// 1. 节流过滤器示例：localStorage 写入节流（1秒内最多写入一次）
const storage = useLocalStorage('my-key', { foo: 'bar' }, { 
  eventFilter: throttleFilter(1000) 
})

// 用于显示 localStorage 中的原始值
const localStorageValue = ref('')

// 读取 localStorage 的实际值（用于演示）
const checkLocalStorage = () => {
  const raw = localStorage.getItem('my-key')
  localStorageValue.value = raw || '未找到'
}

// 初始读取一次
checkLocalStorage()

// 监听 storage 的变化（用于演示实时显示）
watch(() => storage.value.foo, (newVal) => {
  console.log('storage.foo 已更新:', newVal)
  // 延迟一下再读取 localStorage，确保写入完成
  setTimeout(checkLocalStorage, 50)
})

// 2. 防抖过滤器示例：鼠标位置在停止移动 100ms 后才更新
const box = ref(null)

// 获取全局鼠标坐标（带防抖）
const { x, y } = useMouse({ 
  target: box,
  eventFilter: debounceFilter(100) 
})

// 计算相对于指定容器的坐标
const relativeX = ref(0)
const relativeY = ref(0)
const containerWidth = ref(0)
const containerHeight = ref(0)

// 监听全局坐标变化，计算相对坐标
watch([x, y, box], () => {
  if (box.value) {
    const rect = box.value.getBoundingClientRect()
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft
    const scrollY = window.pageYOffset || document.documentElement.scrollTop
    
    // 计算相对于容器的坐标
    // 鼠标全局坐标 - 容器左上角的全局坐标
    let relX = x.value - (rect.left + scrollX)
    let relY = y.value - (rect.top + scrollY)
    
    // 限制坐标范围在容器内
    relX = Math.max(0, Math.min(rect.width, relX))
    relY = Math.max(0, Math.min(rect.height, relY))
    
    relativeX.value = relX
    relativeY.value = relY
    containerWidth.value = Math.round(rect.width)
    containerHeight.value = Math.round(rect.height)
  }
}, { immediate: true })
</script>

<style scoped>
@import '@/assets/app.css';
</style>