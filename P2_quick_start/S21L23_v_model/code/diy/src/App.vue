<template>
  <div class="app-container">
    <h1>请对本次服务评分：</h1>
    <Rating v-model.number="rating" />
    <p v-if="rating > 0">你当前的评价为 {{ rating }} 颗星</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Rating from '@/components/Rating.vue'
// 这是父组件维护的数据
const rating = ref(0)
</script>

<style scoped>
@import '@/assets/app.css';
</style>
