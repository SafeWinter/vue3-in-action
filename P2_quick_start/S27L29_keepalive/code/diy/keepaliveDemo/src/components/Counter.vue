<template>
  <div>
    <h1>计数器</h1>
    <p>计数：{{ count }}</p>
    <button @click="count++">增加</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<script>
export default {
  name: 'Counter'
}
</script>

<style>
@import '@/assets/counter.css';
</style>
