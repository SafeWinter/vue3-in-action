<template>
  <div class="app">
    <div>{{ Bill.name }}</div>
    <div>{{ Bill.age }}</div>
    <div>{{ Bill.nested.count }}</div>
  </div>
</template>

<script setup>
import { shallowRef } from 'vue'

let Bill = shallowRef({
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
  console.log('1st update')
}, 2000)

setTimeout(() => {
  Bill.value = {
    name: 'Gates',
    age: 38,
    nested: {
      count: 10
    }
  }
  console.log('2nd update')
}, 4000)
</script>

<style lang="scss" scoped>
.app {
  font-size: 3em;
}
</style>
