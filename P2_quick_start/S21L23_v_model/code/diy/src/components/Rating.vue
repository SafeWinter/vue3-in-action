<template>
  <div class="rating-container">
    <span v-for="star in 5" :key="star" class="star">
      {{ rating >= star ? '★' : '☆' }}
    </span>
    <input type="text" v-model="rating" />
  </div>
</template>

<script setup>
const [rating, { number }] = defineModel({
  required: true,
  // 这个就是一个 setter，回头子组件在修改值的时候，就会走这个 setter
  set(value) {
    console.log(value, typeof value)
    if (number) {
      value = isNaN(value) ? 0 : Number(value)
      value = Math.max(value, 0)
      value = Math.min(5, value)
    }
    console.log(value, typeof value)
    return value
  }
})
</script>

<style scoped>
@import '@/assets/rating.css';
</style>
