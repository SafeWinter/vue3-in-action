<template>
  <div class="component">
    <h4>Component C</h4>
    <p>Count: {{ count }}</p>
    <button @click="incrementCount">Increment Count in C</button>
  </div>
</template>

<script setup>
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted
} from 'vue'

const count = ref(0)

const incrementCount = () => {
  count.value++
}

onBeforeMount(() => {
  console.log('Component C: onBeforeMount')
})

onMounted(() => {
  console.log('Component C: onMounted')
})

onBeforeUpdate(() => {
  console.log('Component C: onBeforeUpdate')
})

onUpdated(() => {
  console.log('Component C: onUpdated')
})

onBeforeUnmount(() => {
  console.log('Component C: onBeforeUnmount')
})

onUnmounted(() => {
  console.log('Component C: onUnmounted')
})
</script>

<style scoped>
.component {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9f9f9;
  border: 2px solid #ff6347;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 10px;
  max-width: 90%;
}

h4 {
  font-size: 24px;
  color: #ff6347;
  margin-bottom: 10px;
}

p {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
}

button {
  font-size: 16px;
  color: #fff;
  background-color: #ff6347;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #cc5135;
}
</style>