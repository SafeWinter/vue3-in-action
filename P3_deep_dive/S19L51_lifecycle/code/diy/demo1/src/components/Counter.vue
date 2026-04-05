<template>
  <div class="lifecycle-demo">
    <h1>演示Vue3生命周期钩子函数</h1>
    <p>计数：{{ count }}</p>
    <button @click="count++">增加计数</button>
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

onBeforeMount(() => console.log('onBeforeMount:组件即将挂载'))

onMounted(() => console.log('onMounted: 组件已经挂载'))

onBeforeUpdate(() => console.log('onBeforeUpdate: 组件即将更新'))

onUpdated(() => console.log('onUpdated: 组件已经更新'))

onBeforeUnmount(() => console.log('onBeforeUnmount: 组件即将卸载'))

onUnmounted(() => console.log('onUnmounted: 组件已经卸载'))
</script>

<style scoped>
@import '@/assets/counter.css';
</style>
