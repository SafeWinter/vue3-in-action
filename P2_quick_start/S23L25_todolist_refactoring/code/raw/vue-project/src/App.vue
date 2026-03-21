<template>
  <!-- 最外层的容器 -->
  <section class="todoapp">
    <!-- 头部 -->
    <Header v-model:todos="todos" />
    <!-- 待办列表 -->
    <List v-model:todos="todos" v-model:filteredTodos="filteredTodos" />
    <!-- 底部 -->
    <Footer
      v-model:todos="todos"
      v-model:remaining="remaining"
      v-model:visibility="visibility"
      @removeAll="removeAllCompleted"
    />
  </section>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import Header from './components/Header.vue'
import List from './components/List.vue'
import Footer from './components/Footer.vue'

// 每一项待办事项的结构如下
// [{id: 1, title: 'xxx', completed: false}]

const STORAGE_KEY = 'todo-list'
// 尝试从本地存储中获取数据，如果没有数据则使用空数组（第一次）
const todos = ref(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))
const visibility = ref('all') // 默认是显示所有待办事项

// 接下来我们需要一个过滤器，用于过滤不同状态的待办事项
const filters = {
  all: (todos) => todos, // 全部
  active: (todos) => todos.filter((todo) => !todo.completed), // 未完成
  completed: (todos) => todos.filter((todo) => todo.completed) // 已完成
}

// 接下来，根据当前的状态（all、active、completed）去调用对应的过滤器函数
const filteredTodos = computed(() => filters[visibility.value](todos.value))
const remaining = computed(() => filters.active(todos.value).length)

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
.todoapp {
  background: #fff;
  margin: 130px auto;
  position: relative;
  box-shadow:
    0 2px 4px 0 rgba(0, 0, 0, 0.2),
    0 25px 50px 0 rgba(0, 0, 0, 0.1);
  width: 800px;
}
</style>
