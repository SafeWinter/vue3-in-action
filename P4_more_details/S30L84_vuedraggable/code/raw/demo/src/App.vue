<template>
  <div id="app">
    <h1>待办事项</h1>
    <div class="newTask-container">
      <input type="text" v-model="newItem" class="newTaskInput" placeholder="添加新任务" />
      <button @click="addNewTask">添加新任务</button>
    </div>
    <div class="list-container">
      <div>
        <h2>未完成</h2>
        <!-- 任务：显示未完成的任务，并且可以自由拖拽 -->

        <!-- 这是普通的显示列表内容 -->
        <!-- <div v-for="item in list1" :key="item.id" class="task">
          {{ item.text }}
        </div> -->

        <!-- 使用vuedraggable插件实现拖拽 -->
        <draggable v-model="list1" group="tasks" @start="drag = true" @end="endHandle" itemKey="id">
          <template #item="{ element }">
            <TransitionGroup name="fade" tag="div">
              <div class="task" :key="element.id">{{ element.text }}</div>
            </TransitionGroup>
          </template>
        </draggable>
      </div>
      <div>
        <h2>已完成</h2>
        <!-- 任务：显示已完成的任务，并且可以自由拖拽 -->
        <!-- <div v-for="item in list2" :key="item.id" class="task">
          {{ item.text }}
        </div> -->

        <!-- 使用vuedraggable插件实现拖拽 -->
        <draggable v-model="list2" group="tasks" @start="drag = true" @end="endHandle" itemKey="id">
          <template #item="{ element }">
            <TransitionGroup name="fade" tag="div">
              <div class="task" :key="element.id">{{ element.text }}</div>
            </TransitionGroup>
          </template>
        </draggable>
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
</script>

<style scoped>
@import '@/assets/app.css';
</style>
