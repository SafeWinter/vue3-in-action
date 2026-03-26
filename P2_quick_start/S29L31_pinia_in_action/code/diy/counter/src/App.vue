<template>
  <div class="counter">
    <h1>计数器：{{ count }}</h1>
    <button @click="incCounter">增加</button>
    <button @click="decCounter">减少</button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useCounterStore } from './stores/useCounterStore.js'
// 获取数据仓库
const store = useCounterStore()
const count = computed(() => store.counter)
const incCounter = store.increment
const decCounter = store.decrement
</script>

<style scoped>
@import '@/assets/app.css';
</style>
