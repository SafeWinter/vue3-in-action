<template>
  <li :class="[task.completed ? 'completed' : 'pending']">
    <span @click="toggleStatus">{{ task.title }}</span>
    <button @click="deleteTask">删除</button>
  </li>
</template>

<script setup>
import { useTaskStore } from '../stores/useTaskStore'
const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})
// 拿到状态仓库
const taskStore = useTaskStore()

async function deleteTask() {
  await taskStore.deleteTask(props.task.id)
}

async function toggleStatus() {
  await taskStore.toggleTaskStatus(props.task.id)
}
</script>

<style scoped>
@import '@/assets/task-item.css';
</style>
