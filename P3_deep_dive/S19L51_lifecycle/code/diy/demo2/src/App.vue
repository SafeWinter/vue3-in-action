<template>
  <div id="app">
    <button @click="isShowB = !isShowB">
      {{ isShowB ? '隐藏ComponentB' : '显示Component B'}}
    </button>
    <ComponentA :showB="isShowB" />
  </div>
</template>

<script setup>
import ComponentA from './components/ComponentA.vue'
import {ref} from 'vue'
const isShowB = ref(true)
</script>

<style>
@import '@/assets/app.css';
</style>
