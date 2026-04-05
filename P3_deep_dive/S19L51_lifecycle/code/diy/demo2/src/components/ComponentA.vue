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

onBeforeMount(() => console.log('Component A: onBeforeMount'))

onMounted(() => console.log('Component A: onMounted'))

onBeforeUpdate(() => console.log('Component A: onBeforeUpdate'))

onUpdated(() => console.log('Component A: onUpdated'))

onBeforeUnmount(() => console.log('Component A: onBeforeUnmount'))

onUnmounted(() => console.log('Component A: onUnmounted'))
</script>

<style scoped>
@import '@/assets/component-a.css';
</style>
