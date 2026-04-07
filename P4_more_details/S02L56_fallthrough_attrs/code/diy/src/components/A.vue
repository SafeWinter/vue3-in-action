<template>
  <!-- 组件 A 直接渲染子组件 B -->
  <B />
</template>

<script setup>
import B from './B.vue'
const emits = defineEmits(['click'])
// console.log(emits);
</script>
