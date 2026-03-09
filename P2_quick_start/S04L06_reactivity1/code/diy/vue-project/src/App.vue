<template>
  <div>{{ name }}</div>
</template>

<script setup>
import { ref } from 'vue'
// 现在的 name 就是一个响应式数据
let name = ref('Bill')
console.log(name)
console.log(name.value)
setTimeout(() => {
  name.value = 'Tom'
}, 2000)
</script>

<style lang="scss" scoped></style>
