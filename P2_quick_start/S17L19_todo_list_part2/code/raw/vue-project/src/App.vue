<template>
  <!-- 最外层的容器 -->
  <section class="todoapp">
    <!-- 头部 -->
    <header class="header">
      <h1>待办事项</h1>
      <input
        type="text"
        class="new-todo"
        placeholder="添加新的待办事项"
        @keyup.ctrl.enter="addTodo"
      />
    </header>
    <!-- 待办列表 -->
    <section class="main">
      <!-- 全选按钮 -->
      <input type="checkbox" id="toggle-all" class="toggle-all" />
      <label for="toggle-all">全部完成</label>
      <!-- 待办事项列表 -->
      <ul class="todo-list">
        <li
          class="todo"
          v-for="todo in filteredTodos"
          :key="todo.id"
          :class="{
            completed: todo.completed,
            editing: todo === editedTodo
          }"
        >
          <div class="view">
            <input type="checkbox" class="toggle" v-model="todo.completed" />
            <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
            <button class="destroy" @click="removeTodo(todo)"></button>
          </div>
          <!-- 编辑框 -->
          <input
            type="text"
            class="edit"
            v-if="todo === editedTodo"
            v-model="todo.title"
            @keyup.ctrl.enter="doneEdit(todo)"
            @blur="doneEdit(todo)"
            @keyup.escape="cancelEdit(todo)"
            @vue:mounted="({ el }) => el.focus()"
          />
        </li>
      </ul>
    </section>
    <!-- 底部 -->
    <footer class="footer">
      <span class="todo-count">
        <span>剩余 {{ remaining }} 项</span>
      </span>
      <ul class="filters">
        <li>
          <a
            href="#/all"
            :class="{
              selected: visibility === 'all'
            }"
            >全部</a
          >
        </li>
        <li>
          <a
            href="#/active"
            :class="{
              selected: visibility === 'active'
            }"
            >未完成</a
          >
        </li>
        <li>
          <a
            href="#/completed"
            :class="{
              selected: visibility === 'completed'
            }"
            >已完成</a
          >
        </li>
      </ul>
      <button class="clear-completed" @click="removeAllCompleted" v-show="todos.length > remaining">
        清除已完成
      </button>
    </footer>
  </section>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
// 每一项待办事项的结构如下
// [{id: 1, title: 'xxx', completed: false}]

const STORAGE_KEY = 'todo-list'
// 尝试从本地存储中获取数据，如果没有数据则使用空数组（第一次）
const todos = ref(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))
const visibility = ref('all') // 默认是显示所有待办事项
// editedTodo 是为了和编辑框进行一个双向绑定
const editedTodo = ref() // 存储当前编辑的待办事项，没有传递初始值，默认值为 undefined
let beforeEditCache = '' // 缓存编辑前的标题，用于取消编辑时恢复

// 接下来我们需要一个过滤器，用于过滤不同状态的待办事项
const filters = {
  all: (todos) => todos, // 全部
  active: (todos) => todos.filter((todo) => !todo.completed), // 未完成
  completed: (todos) => todos.filter((todo) => todo.completed) // 已完成
}

// 接下来，根据当前的状态（all、active、completed）去调用对应的过滤器函数
const filteredTodos = computed(() => filters[visibility.value](todos.value))
const remaining = computed(() => filters.active(todos.value).length)

// 方法
function addTodo(event) {
  // 拿到用户输入的值
  const value = event.target.value.trim()
  if (value) {
    todos.value.push({
      id: Date.now(),
      title: value,
      completed: false
    })
    event.target.value = '' // 清空输入框
  }
}

function removeTodo(todo) {
  if (window.confirm('确定要删除此待办事项吗？')) {
    todos.value.splice(todos.value.indexOf(todo), 1)
  } else {
    if (beforeEditCache) {
      todo.title = beforeEditCache
      beforeEditCache = ''
    }
  }
}

// 编辑

function editTodo(todo) {
  editedTodo.value = todo
  beforeEditCache = todo.title
}

// 完成编辑方法
function doneEdit(todo) {
  if (editedTodo.value) {
    editedTodo.value = null // 只有置空了才会退出编辑模式
    todo.title = todo.title.trim() // 更新标题
    if (!todo.title) removeTodo(todo) // 如果标题为空，删除此待办事项
  }
}

// 取消编辑
function cancelEdit(todo) {
  editedTodo.value = null // 只有置空了才会退出编辑模式
  // 需要将标题还原
  todo.title = beforeEditCache
}

// 删除所有已完成
function removeAllCompleted() {
  if (window.confirm('确定要删除所有已完成的待办事项吗？')) {
    todos.value = filters.active(todos.value)
  }
}

// 设置侦听器
watchEffect(() => {
  // 每次 todos 变化时，都需要存储
  // 因为使用到了 todos，因此这个 todos 会变成一个依赖，只要 todos 变化，就会触发这个侦听器
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.value))
})

// 监听 hash 变化
window.addEventListener('hashchange', onHashChange)
function onHashChange() {
  const route = window.location.hash.replace(/#\/?/, '')
  if (filters[route]) {
    visibility.value = route
  } else {
    window.location.hash = ''
    visibility.value = 'all'
  }
}
</script>

<style scoped>
@import './assets/todo.css';
</style>
