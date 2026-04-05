<template>
  <div id="app">
    <h1>任务管理应用</h1>
    <TaskManager
      ref="taskManagerRef"
      :initialTasks="tasks"
      @task-completed="handleTaskCompleted"
      @task-uncompleted="handleTaskUnCompleted"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TaskManager from './components/TaskManager.vue'

const taskManagerRef = ref(null) // 保存 TaskManager 组件实例

// 声明数据和方法
const tasks = ref([
  { id: 1, title: '学习Vue3', completed: false },
  { id: 2, title: '学习Composition API', completed: false },
  { id: 3, title: '开发一个任务管理应用', completed: false }
])
const handleTaskCompleted = (task) => {
  console.log('任务完成', task)
  console.log('TaskManager 组件实例', taskManagerRef.value)
}
const handleTaskUnCompleted = (task) => {
  console.log('任务取消完成', task)
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1 {
  font-size: 36px;
  margin-bottom: 20px;
}
</style>
