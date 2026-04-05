<template>
  <div id="app">
    <h1>任务管理应用</h1>
    <TaskManager
      :initialTasks="tasks"
      @task-completed="handleTaskCompleted"
      @task-uncompleted="handleTaskUnCompleted"
    />
  </div>
</template>

<script>
import TaskManager from './components/TaskManager.vue'
export default {
  name: 'App',
  components: {
    TaskManager
  },
  data() {
    return {
      tasks: [
        { id: 1, title: '学习 Vue.js', completed: false },
        { id: 2, title: '学习 React.js', completed: false },
        { id: 3, title: '学习 Angular.js', completed: false }
      ]
    }
  },
  methods: {
    handleTaskCompleted(task) {
      console.log('任务已完成', task)
    },
    handleTaskUnCompleted(task) {
      console.log('任务取消完成', task)
    }
  }
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
