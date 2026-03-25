<template>
  <div id="app">
    <nav>
      <button @click="toggleComp">切换组件</button>
    </nav>
    <component :is="currComp" />
  </div>
</template>

<script setup>
import { shallowRef } from 'vue'
import ComponentA from '@/components/ComponentA.vue'
import ComponentB from '@/components/ComponentB.vue'

// 该状态主要用于记录当前渲染的组件
const currComp = shallowRef(ComponentA)
// 该状态主要用于记录当前渲染的组件的一个标识
const isCompA = shallowRef(true)

const toggleComp = () => {
  isCompA.value = !isCompA.value
  currComp.value = isCompA.value ? ComponentA : ComponentB
}
</script>

<style>
@import '@/assets/main.css';
</style>
