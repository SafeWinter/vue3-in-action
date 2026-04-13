<template>
  <div class="demo">
    <h2>自定义调度器示例：useNow + useRafFn</h2>
    <p>当前时间（基于 requestAnimationFrame 更新）：</p>
    <p class="time">{{ now.toLocaleTimeString() }}</p>
    <div class="controls">
      <button @click="pause">暂停</button>
      <button @click="resume">恢复</button>
    </div>
    <p class="note">
      说明：默认 useNow 使用 <code>setInterval</code> 或 <code>requestAnimationFrame</code><br>
      这里通过自定义 scheduler，显式将更新调度委托给 <code>useRafFn</code>，使时间更新与浏览器刷新帧率同步。
    </p>
  </div>
</template>

<script setup>
import { useNow, useRafFn } from '@vueuse/core'

// 使用自定义调度器，让 useNow 的更新由 requestAnimationFrame 驱动
const { now, pause, resume } = useNow({
  controls: true,                     // 返回 pause / resume 方法
  scheduler: (cb) => useRafFn(cb),   // 调度器：接收回调 cb，返回一个可控制启动/停止的对象
})
</script>

<style scoped>
@import '@/assets/app.css';
</style>