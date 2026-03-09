<template>
  <div id="container">{{ count }}</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
let count = ref(1),
  container = null

onMounted(() => {
  container = document.getElementById('container')
  console.log('第一次打印：', container.innerText)
})

setTimeout(() => {
  count.value = 2 // 修改响应式状态
  console.log('第二次打印：', container.innerText)
}, 2000)
</script>

<style lang="scss" scoped>
#container {
  font-size: 3em;
}
</style>
