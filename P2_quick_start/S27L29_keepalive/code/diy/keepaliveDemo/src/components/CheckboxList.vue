<template>
  <div class="component">
    <h1>复选框列表</h1>
    <div v-for="(item, index) in items" :key="index" class="checkbox-item">
      <label>
        <div>{{ item.name }}</div>
        <input type="checkbox" v-model="item.checked" />
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([
  { name: '选项 1', checked: false },
  { name: '选项 2', checked: false },
  { name: '选项 3', checked: false }
])
</script>

<script>
export default {
  name: 'CheckboxList'
}
</script>

<style>
@import '@/assets/checkbox-list.css';
</style>
