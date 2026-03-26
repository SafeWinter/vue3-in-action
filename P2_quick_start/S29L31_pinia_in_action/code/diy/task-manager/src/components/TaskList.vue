<template>
  <div class="task-list">
    <h2>{{ title }}</h2>
    <ul>
      <TaskItem v-for="task in tasks" :key="task.id" :task="task" />
    </ul>
  </div>
</template>

<script setup>
import TaskItem from './TaskItem.vue'

defineProps({
  tasks: Array,
  title: String
})
</script>

<style scoped>
@import '@/assets/task-list.css';
</style>
