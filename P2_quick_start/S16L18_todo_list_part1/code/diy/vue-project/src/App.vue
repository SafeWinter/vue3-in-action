<template>
  <main class="todoapp">
    <!-- header -->
    <header class="header">
      <h1>待办事项</h1>
      <input type="text" class="new-todo" placeholder="添加新的待办事项" @keyup.enter="addTodo" />
    </header>
    <!-- 代办列表 -->
    <section class="main">
      <!-- 全选按钮 -->
      <input type="checkbox" id="toggle-all" class="toggle-all" v-model="allChecked" />
      <label for="toggle-all">全部完成</label>
      <ul class="todo-list">
        <li
          class="todo"
          v-for="todo in todos"
          :key="todo.id"
          :class="{ completed: todo.completed }"
        >
          <div class="view">
            <input :id="todo.id" type="checkbox" class="toggle" v-model="todo.completed" />
            <label :for="todo.id">{{ todo.title }}</label>
            <button class="destroy" @click="removeTodo(todo)"></button>
          </div>
        </li>
      </ul>
    </section>
  </main>
</template>

<script setup>
import { ref, watchEffect, watch, onMounted } from 'vue'

// 读取本地缓存逻辑
const CACHE_KEY = 'todo-list'
const todosCached = JSON.parse(localStorage.getItem(CACHE_KEY) || '[]')
const todos = ref(todosCached)
// 侦听 todos 并更新到 localStorage
watchEffect(() => {
  localStorage.setItem(CACHE_KEY, JSON.stringify(todos.value))
})

// 全选框及其切换
const allChecked = ref(false)
onMounted(() => (allChecked.value = todos.value.every((t) => t.completed)))
watch(allChecked, (checked) => todos.value.forEach((t) => (t.completed = checked)))

// 添加 task
function addTodo({ target }) {
  const task = target.value.trim()
  if (task) {
    todos.value.push({
      id: Date.now(),
      title: task,
      completed: false
    })
    target.value = ''
  }
}

// 删除 todo
function removeTodo({ id }) {
  if (window.confirm('确认删除该待办事项吗？')) {
    todos.value = todos.value.filter((t) => t.id !== id)
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/todo.css';
</style>
