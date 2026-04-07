<template>
  <h2>组件A</h2>
</template>

<script setup>
import { useAttrs } from 'vue'
const attrs = useAttrs()
console.log(attrs.onClick);
</script>