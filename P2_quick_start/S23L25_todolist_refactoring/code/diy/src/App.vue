<template>
  <main class="todoapp">
    <!-- 页头 -->
    <todo-header @new-todo="(todo) => todos.push(todo)" />
    <!-- 主区域 -->
    <todo-list v-model:todos="todos" :curr="curr" />
    <!-- 页脚 -->
    <todo-footer v-model:curr="curr" v-model:todos="todos" />
  </main>
</template>

<script setup>
import { ref, watchEffect } from 'vue'

import TodoHeader from '@/components/TodoHeader.vue'
import TodoFooter from '@/components/TodoFooter.vue'
import TodoList from '@/components/TodoList.vue'

// 读取本地缓存逻辑
const CACHE_KEY = 'todo-list'
const todosCached = JSON.parse(localStorage.getItem(CACHE_KEY) || '[]')
const todos = ref(todosCached)

// 当前选中的筛选项（默认为全部）
const curr = ref('all')

// 侦听 todos 并更新到 localStorage
watchEffect(() => {
  localStorage.setItem(CACHE_KEY, JSON.stringify(todos.value))
})
</script>

<style scoped lang="scss">
@import '@/assets/todo.css';
</style>
