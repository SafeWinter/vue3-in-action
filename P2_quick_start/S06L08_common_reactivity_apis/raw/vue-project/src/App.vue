<template>
  <div></div>
</template>

<script setup>
import { ref, toValue } from 'vue'
const countRef = ref(10)
const normalValue = 20
const getter = ()=>30;

console.log(toValue(countRef)) // 10
console.log(toValue(normalValue)) // 20
console.log(toValue(getter)) // 30
</script>

<style lang="scss" scoped></style>
