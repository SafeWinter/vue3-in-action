<template>
  <div class="app">
    <div>{{ Bill.name }}</div>
    <div>{{ Bill.age }}</div>
    <div>{{ Bill.nested.count }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// 现在的 name 就是一个响应式数据
let Bill = ref({
  name: 'Biil',
  age: 18,
  nested: {
    count: 1
  }
})
setTimeout(() => {
  Bill.value.name = 'Gates'
  Bill.value.age = 28
  Bill.value.nested.count += 3
}, 2000)
</script>

<style lang="scss" scoped>
.app {
  font-size: 3em;
}
</style>
