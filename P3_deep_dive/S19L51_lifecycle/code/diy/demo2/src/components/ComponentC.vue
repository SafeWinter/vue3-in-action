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

onBeforeMount(() => console.log('Component C: onBeforeMount'))

onMounted(() => console.log('Component C: onMounted'))

onBeforeUpdate(() => console.log('Component C: onBeforeUpdate'))

onUpdated(() => console.log('Component C: onUpdated'))

onBeforeUnmount(() => console.log('Component C: onBeforeUnmount'))

onUnmounted(() => console.log('Component C: onUnmounted'))
</script>

<style scoped>
@import '@/assets/component-c.css';
</style>
