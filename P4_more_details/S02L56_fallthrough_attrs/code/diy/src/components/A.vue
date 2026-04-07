<template>
  <div class="a-container">
    <p v-bind="$attrs">A组件</p>
  </div>
</template>

<script setup>
defineOptions({
  inheritAttrs: false
})
</script>

<style scoped>
.a-container {
  border: 10px solid black;
}
p {
  border: 10px solid grey;
}
</style>
