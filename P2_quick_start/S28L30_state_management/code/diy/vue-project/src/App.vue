<template>
  <div class="counter">
    <h1>计数器：{{ count }}</h1>
    <button @click="incCounter">增加</button>
    <button @click="decCounter">减少</button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useCounterStore } from '@/stores/useCounterStore.js'
// 获取数据仓库
const counterStore = useCounterStore()

const count = computed(() => counterStore.count)
const incCounter = computed(counterStore.increment)
const decCounter = computed(counterStore.decrement)
</script>

<style scoped>
.counter {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
