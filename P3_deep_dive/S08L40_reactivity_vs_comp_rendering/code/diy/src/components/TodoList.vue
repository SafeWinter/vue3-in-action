<template>
  <div class="todo-list">
    <h2>任务列表</h2>
    <ul>
      <li v-for="todo in todos" :key="todo.id" :class="{ completed: todo.completed }">
        <span>{{ todo.text }}</span>
        <button @click="toggleTodo(todo.id)" class="complete-btn">
          {{ todo.completed ? '取消完成' : '完成' }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { store } from '@/store'
const todos = store.todos // 拿到待办事项
const toggleTodo = store.toggleTodo // 切换待办事项状态
</script>

<style scoped>
@import '@/assets/todo-list.css';
</style>
