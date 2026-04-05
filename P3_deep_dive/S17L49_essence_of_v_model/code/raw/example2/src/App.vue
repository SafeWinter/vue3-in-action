<template>
  <div class="app-container">
    <h1>请给产品打分：</h1>
    <!-- 通过 v-model 将父组件的状态值传递给子组件 -->
    <!-- 这是一个具名的 v-model，名字就是 title -->
    <RatingComponent v-model:title="rating"/>
    <p v-if="rating > 0">您的评分：{{ rating }}/5</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import RatingComponent from '@/components/RatingComponent.vue'
const rating = ref(3) // 评分的状态值
</script>

<style>
.app-container {
  max-width: 600px;
  margin: auto;
  text-align: center;
  font-family: Arial, sans-serif;
}

p {
  font-size: 18px;
  color: #333;
}
</style>
