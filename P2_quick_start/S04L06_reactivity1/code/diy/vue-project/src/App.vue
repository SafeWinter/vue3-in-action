<template>
  <div>{{ Bill.name }}</div>
  <div>{{ Bill.age }}</div>
</template>

<script setup>
import { ref } from 'vue'
// 现在的 name 就是一个响应式数据
let Bill = ref({
  name: 'Biil',
  age: 18
})
setTimeout(() => {
  Bill.value.name = 'Biil2'
  Bill.value.age = 20
}, 2000)
</script>

<style lang="scss" scoped></style>
