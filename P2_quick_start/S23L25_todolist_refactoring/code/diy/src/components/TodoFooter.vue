<template>
  <!-- 页脚 -->
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
</template>

<script setup>
import { computed, onMounted } from 'vue'

const todos = defineModel('todos')
const curr = defineModel('curr')

const active = computed(() => todos.value.filter((t) => !t.completed))
const remaining = computed(() => active.value.length)
const hasCompleted = computed(() => todos.value.length > remaining.value)

function removeCompleted() {
  if (window.confirm('确定要删除已完成事项吗？')) {
    todos.value = active.value
  }
}

function onHashchange() {
  const route = window.location.hash.replace(/#\/?/, '')
  if (['all', 'active', 'completed'].includes(route)) {
    curr.value = route
  } else {
    // console.log('not included', Date.now())
    window.location.hash = ''
    curr.value = 'all'
  }
}
onMounted(() => onHashchange())
window.addEventListener('hashchange', onHashchange)
</script>

<style lang="scss" scoped>
@import '@/assets/todo-footer.css';
</style>
