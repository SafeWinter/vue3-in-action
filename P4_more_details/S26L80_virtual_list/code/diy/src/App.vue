<template>
  <div id="app">
    <h1>基于 useVirtualList 实现定宽虚拟列表</h1>
    <VirtualList :listData="data" :itemSize="50" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import VirtualList from './components/VirtualList.vue'

// 创建一个长列表的数据
const d = Array.from(Array.from({length: 1e4}).keys())
  .map(i => ({ id: i + 1, value: `第 ${i + 1} 条数据` }))
const data = ref(d)
</script>

<style>
#app {
  text-align: center;
}
</style>
