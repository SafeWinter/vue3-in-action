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

onBeforeMount(() => console.log('Component B: onBeforeMount'))

onMounted(() => console.log('Component B: onMounted'))

onBeforeUpdate(() => console.log('Component B: onBeforeUpdate'))

onUpdated(() => console.log('Component B: onUpdated'))

onBeforeUnmount(() => console.log('Component B: onBeforeUnmount'))

onUnmounted(() => console.log('Component B: onUnmounted'))
</script>

<style scoped>
@import '@/assets/component-b.css';
</style>
