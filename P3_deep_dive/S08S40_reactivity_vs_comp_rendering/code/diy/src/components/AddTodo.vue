<template>
  <div class="add-todo">
    <input type="text" v-model="newTodo" placeholder="请输入新的待办事项" />
    <button @click="addTodo">添加任务</button>
  </div>
</template>

<script setup>
import { store } from '@/store'
import { ref } from 'vue'
const newTodo = ref('') // 记录新增待办事项的名词
const addTodo = () => {
  const text = newTodo.value.trim()
  if (text === '') {
    return
  }
  store.addTodo({
    id: Date.now(),
    text,
    completed: false
  })
  newTodo.value = ''
}
</script>

<style scoped>
@import '@/assets/add-todo.css';
</style>
