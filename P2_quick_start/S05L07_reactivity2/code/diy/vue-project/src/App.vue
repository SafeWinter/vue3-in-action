<template>
  <div>state.count1: {{ state.count1 }}</div>
  <div>state.nested.count2: {{ state.nested.count2 }}</div>
</template>

<script setup>
import { shallowReactive } from 'vue'
const state = shallowReactive({
  count1: 0,
  nested: {
    count2: 0
  }
})
setTimeout(() => {
  state.count1++
  console.log('1. 只更新 count1')
}, 2000)
setTimeout(() => {
  state.nested.count2++
  console.log('2. 只更新 nested.count2')
}, 4000)
</script>

<style lang="scss" scoped>
div {
  font-size: 2em;
}
</style>
