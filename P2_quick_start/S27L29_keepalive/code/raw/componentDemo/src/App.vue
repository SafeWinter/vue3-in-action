<template>
  <div id="app">
    <nav>
      <button @click="toggleComponent">切换组件</button>
    </nav>
    <component :is="currentComponent"/>
  </div>
</template>

<script setup>
import { shallowRef } from 'vue'
import ComponentA from '@/components/ComponentA.vue'
import ComponentB from '@/components/ComponentB.vue'

// 该状态主要用于记录当前渲染的组件
const currentComponent = shallowRef(ComponentA)
// 该状态主要用于记录当前渲染的组件的一个标识
const currentLabel = shallowRef('A')

const toggleComponent = () => {
  if (currentLabel.value === 'A') {
    currentComponent.value = ComponentB
    currentLabel.value = 'B'
  } else {
    currentComponent.value = ComponentA
    currentLabel.value = 'A'
  }
}
</script>

<style>
@import '@/assets/main.css';
</style>
