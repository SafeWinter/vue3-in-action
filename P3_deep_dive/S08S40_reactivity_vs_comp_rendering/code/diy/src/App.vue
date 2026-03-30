<template>
  <div id="app">
    <h1>任务管理器</h1>
    <div class="todo-container">
      <TodoList />
      <AddTodo />
    </div>
  </div>
</template>

<script setup>
import TodoList from '@/components/TodoList.vue'
import AddTodo from '@/components/AddTodo.vue'
</script>

<style scoped>
@import '@/assets/app.css';
</style>
