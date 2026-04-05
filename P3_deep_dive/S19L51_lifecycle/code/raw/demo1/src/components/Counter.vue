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
onBeforeMount(() => {
  console.log('onBeforeMount:组件即将挂载')
})
onMounted(() => {
  console.log('onMounted: 组件已经挂载')
})

onBeforeUpdate(() => {
  console.log('onBeforeUpdate: 组件即将更新')
})

onUpdated(() => {
  console.log('onUpdated: 组件已经更新')
})

onBeforeUnmount(() => {
  console.log('onBeforeUnmount: 组件即将卸载')
})

onUnmounted(() => {
  console.log('onUnmounted: 组件已经卸载')
})
</script>

<style scoped>
.lifecycle-demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9f9f9;
  border: 2px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.lifecycle-demo h1 {
  font-size: 24px;
  color: #42b983;
  margin-bottom: 20px;
}

.lifecycle-demo p {
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
}

.lifecycle-demo button {
  font-size: 16px;
  color: #fff;
  background-color: #42b983;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.lifecycle-demo button:hover {
  background-color: #369f75;
}
</style>
