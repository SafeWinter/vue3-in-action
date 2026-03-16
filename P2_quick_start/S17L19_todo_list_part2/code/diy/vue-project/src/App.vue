<template>
  <main class="todoapp">
    <!-- header -->
    <header class="header">
      <h1>待办事项</h1>
      <input type="text" class="new-todo" placeholder="添加新的待办事项" @keyup.enter="addTodo" />
    </header>
    <!-- 主区域 -->
    <section class="main">
      <!-- 全选按钮 -->
      <input type="checkbox" id="toggle-all" class="toggle-all" v-model="allChecked" />
      <label for="toggle-all">全部完成</label>
      <!-- 代办列表 -->
      <ul class="todo-list">
        <li
          class="todo"
          v-for="todo in filteredTodos"
          :key="todo.id"
          :class="{
            completed: todo.completed,
            editing: todo.id === editedId
          }"
        >
          <div class="view">
            <input :id="todo.id" type="checkbox" class="toggle" v-model="todo.completed" />
            <label :for="todo.id" @dblclick="editTodo(todo)">{{ todo.title }}</label>
            <button class="destroy" @click="removeTodo(todo)"></button>
          </div>
          <!-- 须禁用 Vimium C 插件，否则 @keyup.escape 不触发执行 -->
          <input
            ref="editInput"
            type="text"
            class="edit"
            v-if="todo.id === editedId"
            v-model="todo.title"
            @keyup.enter="updateTodo(todo)"
            @keyup.escape="cancelTodo(todo)"
            @blur="updateTodo(todo)"
          />
        </li>
      </ul>
    </section>
    <footer class="footer">
      <span class="todo-count">
        <span>剩余 {{ remaining }} 项目</span>
      </span>
      <ul class="filters">
        <li><a :class="{ selected: curr === 'all' }" href="#/all">全部</a></li>
        <li><a :class="{ selected: curr === 'active' }" href="#/active">未完成</a></li>
        <li><a :class="{ selected: curr === 'completed' }" href="#/completed">已完成</a></li>
      </ul>
      <button class="clear-completed" v-show="hasCompleted" @click="removeCompleted">
        清除已完成项
      </button>
    </footer>
  </main>
</template>

<script setup>
import { ref, watchEffect, watch, onMounted, nextTick, computed } from 'vue'

// 读取本地缓存逻辑
const CACHE_KEY = 'todo-list'
const todosCached = JSON.parse(localStorage.getItem(CACHE_KEY) || '[]')
const todos = ref(todosCached)
// 工具栏的筛选条件
const filters = {
  all: (todos) => todos.value,
  active: (todos) => todos.value.filter((t) => !t.completed),
  completed: (todos) => todos.value.filter((t) => t.completed)
}
// 当前选中的筛选项（默认为全部）
const curr = ref('all')
// 筛选后的待办事项
const filteredTodos = computed(() => filters[curr.value](todos))
// 删除已完成项的显隐标记
const hasCompleted = computed(() => filters.completed(todos).length > 0)
// 缓存修改前的原始值
let titleCached = ''
// 侦听 todos 并更新到 localStorage
watchEffect(() => {
  localStorage.setItem(CACHE_KEY, JSON.stringify(todos.value))
})

// 全选框及其切换
const allChecked = ref(false)
onMounted(() => {
  allChecked.value = filteredTodos.value.every((t) => t.completed)
  onHashchange()
})
watch(allChecked, (checked) => filteredTodos.value.forEach((t) => (t.completed = checked)))

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
  } else {
    // console.log('title cached:', titleCached)
    if (titleCached) {
      todos.value.find((t) => t.id === id).title = titleCached
      titleCached = ''
    }
  }
}

// 修改 todo
const editInput = ref(null)
const editedId = ref(null)
function editTodo(todo) {
  editedId.value = todo.id // 激活编辑文本框
  titleCached = todo.title // 缓存当前的待办内容（以便在临时取消修改时还原文本）
  nextTick(() => editInput.value[0].focus())
}

function updateTodo(todo) {
  // console.log('正在更新 todo：', todo)
  editedId.value = null
  if (!todo.title.trim()) {
    removeTodo(todo) // 先处理为空的情况，这样缓存的内容
  } else {
    titleCached = todo.title
  }
}

function cancelTodo(todo) {
  // console.log('正在取消 todo：', todo)
  editedId.value = null
  todo.title = titleCached
}

const remaining = computed(() => todos.value.filter((t) => !t.completed).length)
window.addEventListener('hashchange', onHashchange)
function onHashchange() {
  const route = window.location.hash.replace(/#\/?/, '')
  if (route in filters) {
    curr.value = route
  } else {
    // console.log('not included', Date.now())
    window.location.hash = ''
    curr.value = 'all'
  }
}

function removeCompleted() {
  if (window.confirm('确定要删除已完成事项吗？')) {
    todos.value = filters.active(todos)
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/todo.css';
</style>
