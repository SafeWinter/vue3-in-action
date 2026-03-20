<template>
  <div class="rating-container">
    <span v-for="star in 5" :key="star" class="star" @click="setStar(star)">
      <!-- <span v-for="star in 5" :key="star" class="star" @click="$emit('update-rating', star)"> -->
      {{ model >= star ? '★' : '☆' }}
    </span>
    <input type="text" v-model="model" />
  </div>
</template>

<script setup>
// import { ref } from 'vue'
// const rating = ref(0) // 表示几颗星

// defineProps(['rating'])
// const emits = defineEmits({
//   'update-rating': (value) => {
//     if (value < 1 || value > 5) {
//       console.warn('传递的值有问题！！！')
//       return false
//     }
//     return true
//   }
// })
const [model, modifiers] = defineModel({
  required: true,
  // 这个就是一个 setter，回头子组件在修改值的时候，就会走这个 setter
  set(value) {
    console.log(value)
    if (modifiers.number) {
      if (isNaN(value)) {
        value = 0
      } else {
        value = Number(value)
      }
      if (value < 0) {
        value = 0
      } else if (value > 5) {
        value = 5
      }
      return value
    }
  }
})

function setStar(newStar) {
  // 我们需要将最新的星星状态的值传递给父组件
  // 触发父组件的 update-rating 事件
  // emits('update-rating', 100)
  model.value = newStar
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
