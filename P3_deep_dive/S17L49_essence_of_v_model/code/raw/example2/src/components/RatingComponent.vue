<template>
  <div class="rating-container">
    <span v-for="star in 5" :key="star" class="star" @click="setRating(star)">
      {{ model >= star ? '★' : '☆' }}
    </span>
  </div>
</template>

<script setup>
// 接收父组件通过 v-model 传递过来的状态
// 这里在拿状态的时候，就需要指定一下名字
const model = defineModel('title')
// const emit = defineEmits(['update:modelValue'])

function setRating(newRating) {
  // 通过 $emit 方法将新的评分值传递给父组件
  // emit('update:modelValue', newRating);
  model.value = newRating
}
</script>

<style scoped>
.rating-container {
  display: flex;
  font-size: 24px;
  cursor: pointer;
}

.star {
  margin-right: 5px;
  color: gold;
}

.star:hover {
  color: orange;
}
</style>
