<template>
  <div class="app-container">
    <h1>这是App组件</h1>
    <Child name="李四" email="123@qq.com" />
    <component :is="vnode" />
  </div>
</template>

<script setup>
import { h } from 'vue'
import Child from '@/components/Child.vue'
const vnode = h(Child, {
  name: '李四',
  email: '123@qq.com'
})
console.log('vnode:', vnode)
</script>

<style scoped>
.app-container {
  width: 400px;
  border: 1px solid;
}
</style>
