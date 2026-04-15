<template>
  <div id="app">
    <VirtualList :listData="data" :estimatedItemSize="50" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import VirtualList from './components/VirtualList.vue'
import { faker } from '@faker-js/faker'

// 创建一个长列表的数据
const d = Array.from({length: 10_000}, (_, i) => i + 1)
  .map(id => ({id, value: [id, faker.lorem.sentences(5, 20)].join(': ')}))
const data = ref(d)
</script>

<style>
html {
  height: 100%;
}
body {
  height: 100%;
  margin: 0;
}
#app {
  height: 100%;
}
</style>
