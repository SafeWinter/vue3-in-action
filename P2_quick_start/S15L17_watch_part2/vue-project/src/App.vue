<template>
  <div>
    <button @click="a++">+1</button>
    <p>当前 a 的值为：{{ a }}</p>
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const a = ref(1) // 计数器
const message = ref('') // 消息
// 假设我们期望 a 的值到达一定的值之后，停止侦听
const unwatch = watch(
  a,
  (newVal) => {
    // 当值大于 5 的时候，停止侦听
    if (newVal > 5) {
      unwatch()
    }
    message.value = `当前 a 的值为：${a.value}`
  },
  { immediate: true }
)
</script>

<style scoped></style>
