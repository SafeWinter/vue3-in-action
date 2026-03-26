<template>
  <div class="container">
    <h1>任务管理器</h1>
    <div class="task-stats">
      <p>任务总数: {{ taskCount }}</p>
      <p>已完成数: {{ completedTaskCount }}</p>
    </div>
    <input v-model="newTaskTitle" placeholder="添加新任务" @keyup.enter="addTask" />
    <TaskList :tasks="pendingTasks" title="待完成任务" />
    <TaskList :tasks="completedTasks" title="已完成任务" />
    <!-- loading框 -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import TaskList from './components/TaskList.vue'
import { useTaskStore } from './stores/useTaskStore.js'

const newTaskTitle = ref('')
// 得到数据仓库
const taskStore = useTaskStore()

// 得到数据仓库之后，我们就可以从数据仓库中获取各种数据
const completedTasks = computed(() => taskStore.completedTasks)
const pendingTasks = computed(() => taskStore.pendingTasks)
const taskCount = computed(() => taskStore.taskCount)
const completedTaskCount = computed(() => taskStore.completedTaskCount)
const loading = computed(() => taskStore.loading)

onMounted(async () => {
  await taskStore.fetchTasks()
})

async function addTask() {
  const title = newTaskTitle.value.trim()
  if (title) {
    await taskStore.addTask({
      title,
      completed: false
    })
    newTaskTitle.value = ''
  }
}
</script>

<style scoped>
@import '@/assets/app.css';
</style>
