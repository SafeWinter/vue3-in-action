<template>
  <div>
    <h1>文本输入</h1>
    <input type="text" v-model="text" placeholder="请输入内容..." />
    <p>你输入的内容为：{{ text }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const text = ref('')
</script>

<script>
export default {
  name: 'TextInput'
}
</script>

<style>
@import '@/assets/text-input.css';
</style>
