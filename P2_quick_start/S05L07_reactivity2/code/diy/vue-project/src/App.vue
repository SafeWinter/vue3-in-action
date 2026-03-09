<template>
  <div id="container">
    <div>object.count: {{ obj.count }}</div>
    <div>object.nested.count: {{ obj.nested.count }}</div>
  </div>
</template>

<script setup>
import { shallowReactive } from 'vue'

let obj = shallowReactive({
  count: 0,
  nested: {
    count: 0
  }
})

setTimeout(() => {
  obj.count++
  obj.nested.count++
  console.log('1st update')
}, 2000)

setTimeout(() => {
  obj.nested.count = 3
  console.log('2nd update')
}, 4000)
</script>

<style lang="scss" scoped>
#container {
  font-size: 3em;
}
</style>
