<template>
  <div class="app">{{ arr }}</div>
</template>

<script setup>
import { ref } from 'vue'
// 现在的 name 就是一个响应式数据
let arr = ref([1, 2, 3])
setTimeout(() => {
  arr.value.push(4, 5, 6)
}, 2000)
</script>

<style lang="scss" scoped>
.app {
  font-size: 3em;
}
</style>
