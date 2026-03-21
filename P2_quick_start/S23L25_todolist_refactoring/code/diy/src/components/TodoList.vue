<template>
  <!-- 主区域 -->
  <section class="main">
    <!-- 全选按钮 -->
    <input
      type="checkbox"
      id="toggle-all"
      class="toggle-all"
      v-model="allChecked"
      :disabled="filteredTodos.length === 0"
    />
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
          <input type="checkbox" class="toggle" v-model="todo.completed" />
          <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
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
</template>

<script setup>
import { onMounted, computed, watch, ref, nextTick } from 'vue'

const todos = defineModel('todos')
const props = defineProps(['curr'])

// 工具栏的筛选条件
const filters = {
  all: (todos) => todos.value,
  active: (todos) => todos.value.filter((t) => !t.completed),
  completed: (todos) => todos.value.filter((t) => t.completed)
}
// 筛选后的待办事项
const filteredTodos = computed(() => filters[props.curr](todos))

// 全选框及其切换
const allChecked = ref(true)
onMounted(() => (allChecked.value = todos.value.every((t) => t.completed)))
watch(allChecked, (checked) => todos.value.forEach((t) => (t.completed = checked)))

// 缓存修改前的原始值
let titleCached = ''

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
const editedId = ref(null)
const editInput = ref()
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
</script>

<style lang="scss" scoped>
@import '@/assets/todo-list.css';
</style>
