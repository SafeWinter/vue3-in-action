<template>
  <div>当前鼠标位置: {{ x }}, {{ y }}</div>
  <div class="result">
    <p v-if="error">{{ error.message }}</p>
    <template v-else>
      <p>answer: {{ data.answer }}</p>
      <img class="img" :src="data.image" alt="image received" />
    </template>
    <div><button @click="refresh">Refresh</button></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMouse } from './hooks/useMouse'
import { useFetch } from './hooks/useFetch'
const { x, y } = useMouse()
const refresh = () => (url.value = url.value === '' ? 'https://yesno.wtf/api' : '')
const url = ref('https://yesno.wtf/api')
const { data, error } = useFetch(url)
</script>

<style scoped>
.img {
  width: 150px;
}
</style>
