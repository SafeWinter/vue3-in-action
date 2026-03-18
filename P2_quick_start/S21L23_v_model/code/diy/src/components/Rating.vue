<template>
  <div class="rating-container">
    <span v-for="star in 5" :key="star" class="star" @click="updateRating(star)">
      {{ rating >= star ? '★' : '☆' }}
    </span>
  </div>
</template>

<script setup>
const rating = defineModel()

function updateRating(newValue) {
  rating.value = newValue
}
</script>

<style scoped>
@import '@/assets/rating.css';
</style>
