<template>
  <div class="component">
    <h2>ComponentA</h2>
    <p>Count:{{ count }}</p>
    <button @click="count++">A++</button>
    <ComponentB v-if="showB" />
  </div>
</template>

<script setup>
import ComponentB from './ComponentB.vue'
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
defineProps(['showB'])
onBeforeMount(() => {
  console.log('Component A: onBeforeMount')
})

onMounted(() => {
  console.log('Component A: onMounted')
})

onBeforeUpdate(() => {
  console.log('Component A: onBeforeUpdate')
})

onUpdated(() => {
  console.log('Component A: onUpdated')
})

onBeforeUnmount(() => {
  console.log('Component A: onBeforeUnmount')
})

onUnmounted(() => {
  console.log('Component A: onUnmounted')
})
</script>

<style scoped>
.component {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9f9f9;
  border: 2px solid #42b983;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 10px auto;
  max-width: 90%;
}

h2 {
  font-size: 24px;
  color: #42b983;
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
  background-color: #42b983;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #369f75;
}
</style>
