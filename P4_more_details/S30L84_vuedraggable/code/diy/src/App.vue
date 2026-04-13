<template>
  <div id="app">
    <h1>待办事项</h1>
    <div class="newTask-container">
      <input type="text" v-model="newItem" class="newTaskInput" placeholder="添加新任务" @keydown.enter="addNewTask"/>
      <button @click="addNewTask">添加新任务</button>
    </div>
    <div class="list-container">
      <div>
        <h2>未完成</h2>
        <!-- 使用vuedraggable插件实现拖拽 -->
        <div :class="{'dragging-active': drag}">
          <draggable
            v-model="list1"
            group="tasks"
            @start="drag = true"
            @end="endHandle"
            itemKey="id"
          >
            <template #item="{ element }">
              <TransitionGroup name="fade" tag="div">
                <div @dblclick="deleteUndone(element.id)" class="task" :key="element.id">{{ element.text }}</div>
              </TransitionGroup>
            </template>
          </draggable>
        </div>
      </div>
      <div>
        <h2>已完成</h2>
        <!-- 使用vuedraggable插件实现拖拽 -->
        <div :class="{'dragging-active': drag}">
          <draggable
            v-model="list2"
            group="tasks"
            @start="drag = true"
            @end="endHandle"
            itemKey="id"
          >
            <template #item="{ element }">
              <TransitionGroup name="fade" tag="div">
                <div @dblclick="deleteDone(element.id)" class="task" :key="element.id">{{ element.text }}</div>
              </TransitionGroup>
            </template>
          </draggable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import draggable from 'vuedraggable'

const drag = ref(false)

// 未完成列表
const list1 = ref([
  { id: 1, text: '学习Vue' },
  { id: 2, text: '书写Draggable案例' },
  { id: 3, text: '看10页书' }
])

// 已完成列表
const list2 = ref([
  { id: 4, text: '玩游戏' },
  { id: 5, text: '听音乐' },
  { id: 6, text: '看电影' }
])

const newItem = ref('')

const addNewTask = () => {
  if (!newItem.value) return
  list1.value.push({ id: Date.now(), text: newItem.value })
  newItem.value = ''
}

const endHandle = () => {
  console.log('拖拽结束')
  drag.value = false
}

const deleteUndone = id => {
  if(confirm('Are you sure to delete this task to complete?')) {
    list1.value = list1.value.filter(item => item.id !== id)
  }
}

const deleteDone = id => {
  if(confirm('Are you sure to delete this completed task?')) {
    list2.value = list2.value.filter(item => item.id !== id)
  }
}
</script>

<style scoped>
@import '@/assets/app.css';
</style>
