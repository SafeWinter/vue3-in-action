<template>
  <div>
    <div v-for="task in tasks" :key="task.id" @click="selectTask(task)">
      {{ task.title }} ({{ task.completed ? 'Completed' : 'Pending' }})
    </div>
    <hr />
    <div v-if="selectedTask">
      <h3>Edit Task</h3>
      <input v-model="selectedTask.title" placeholder="Edit title" />
      <label>
        <input type="checkbox" v-model="selectedTask.completed" />
        Completed
      </label>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'

const tasks = reactive([
  { id: 1, title: 'Learn Vue', completed: false },
  { id: 2, title: 'Read Documentation', completed: false },
  { id: 3, title: 'Build Something Awesome', completed: false }
])

const selectedId = reactive({ id: null })

// 这是一个计算属性
const selectedTask = computed(() => {
  return tasks.find((task) => task.id === selectedId.id)
})

// 侦听的是一个 Getter 函数
// 该 Getter 函数返回计算属性的值
watch(
  () => selectedTask.value,
  () => {
    console.log('Task details changed')
  },
  { deep: true }
)

function selectTask(task) {
  selectedId.id = task.id
}
</script>
