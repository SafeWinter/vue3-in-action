<template>
  <button v-on:click="a++">A++</button>
  <button v-on:click="b++">B++</button>
  <p>computedA: {{ computedA }}</p>
  <p>computedB: {{ computedB }}</p>
  <p>methodA: {{ methodA() }}</p>
  <p>methodB: {{ methodB() }}</p>
</template>

<script setup>
import { ref, computed } from 'vue'
const a = ref(1)
const b = ref(1)
// 创建两个计算属性，分别依赖 a 和 b
const computedA = computed(() => {
  console.log('计算属性A重新计算了')
  return a.value + 1
})
const computedB = computed(() => {
  console.log('计算属性B重新计算了')
  return b.value + 1
})
function methodA() {
  console.log('methodA执行了')
  return a.value + 1
}
function methodB() {
  console.log('methodB执行了')
  return b.value + 1
}
</script>

<style lang="scss" scoped></style>
