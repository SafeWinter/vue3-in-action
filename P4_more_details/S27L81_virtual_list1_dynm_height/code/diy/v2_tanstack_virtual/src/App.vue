<template>
  <div id="app">
    <h1>基于 Tanstack Virtual 的动态高度虚拟列表</h1>
    <VirtualList :listData="data" :estimatedItemSize="100" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import VirtualList from './components/VirtualList.vue'
import { faker } from '@faker-js/faker'

// 创建一个长列表的数据
const d = Array.from({ length: 10_000 }, (_, i) => i + 1)
  .map((id) => ({ id, value: faker.lorem.sentences()}))
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
  text-align: center;
}
</style>
