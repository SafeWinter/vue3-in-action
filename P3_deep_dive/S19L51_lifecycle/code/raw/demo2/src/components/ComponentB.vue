<template>
  <div class="component">
    <h3>Component B</h3>
    <p>Count: {{ count }}</p>
    <button @click="incrementCount">Increment Count in B</button>
    <ComponentC />
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
import ComponentC from './ComponentC.vue'

const count = ref(0)

const incrementCount = () => {
  count.value++
}

onBeforeMount(() => {
  console.log('Component B: onBeforeMount')
})

onMounted(() => {
  console.log('Component B: onMounted')
})

onBeforeUpdate(() => {
  console.log('Component B: onBeforeUpdate')
})

onUpdated(() => {
  console.log('Component B: onUpdated')
})

onBeforeUnmount(() => {
  console.log('Component B: onBeforeUnmount')
})

onUnmounted(() => {
  console.log('Component B: onUnmounted')
})
</script>

<style scoped>
.component {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9f9f9;
  border: 2px solid #ffa500;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 10px;
  max-width: 90%;
}

h3 {
  font-size: 24px;
  color: #ffa500;
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
  background-color: #ffa500;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #cc8400;
}
</style>