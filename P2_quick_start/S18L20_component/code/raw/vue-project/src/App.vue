<template>
  <button @click="add">Count is: {{ count }}</button>
  <TestCom />
</template>

<script setup>
import { ref } from 'vue'
import TestCom from './components/TestCom.vue'
// 在这里面定数据和方法
const count = ref(0)
function add() {
  count.value++
}
</script>

<style scoped>
button {
  padding: 15px;
}
</style>
