<template>
  <ul>
    <li v-for="project in projects" :key="project.id">
      <h2>{{ project.name }}</h2>
      <ul>
        <li v-for="task in project.tasks" :key="task.id">
          <h3>{{ task.name }}</h3>
          <ul>
            <li v-for="(subtask, index) in task.subtasks" :key="index">
              {{ project.name }}- {{ task.name }} - {{ subtask }}
            </li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script setup>
import { ref } from 'vue'
const projects = ref([
  {
    id: 1,
    name: 'Project A',
    tasks: [
      {
        id: 1,
        name: 'Task A1',
        subtasks: ['Subtask A1.1', 'Subtask A1.2']
      },
      {
        id: 2,
        name: 'Task A2',
        subtasks: ['Subtask A2.1', 'Subtask A2.2']
      }
    ]
  },
  {
    id: 2,
    name: 'Project B',
    tasks: [
      {
        id: 1,
        name: 'Task B1',
        subtasks: ['Subtask B1.1', 'Subtask B1.2']
      },
      {
        id: 2,
        name: 'Task B2',
        subtasks: ['Subtask B2.1', 'Subtask B2.2']
      }
    ]
  }
])
setTimeout(() => {
  projects.value.push({
    id: 3,
    name: '这是一个大项目',
    tasks: [
      {
        id: 1,
        name: '搭建工程',
        subtasks: ['🧵调研框架', '熟悉框架']
      },
      {
        id: 2,
        name: '分解模块',
        subtasks: ['先调研', '分析']
      }
    ]
  })
}, 3000)
</script>

<style scoped></style>
