<template>
  <!-- 页头 -->
  <header class="header">
    <h1>待办事项</h1>
    <input type="text" class="new-todo" placeholder="添加新的待办事项" @keyup.enter="addTodo" />
  </header>
</template>

<script setup>
const emit = defineEmits(['new-todo'])
// 添加 task
function addTodo({ target }) {
  const task = target.value.trim()
  if (task) {
    emit('new-todo', {
      id: Date.now(),
      title: task,
      completed: false
    })
    target.value = ''
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/todo-header.css';
</style>
