<template>
  <div>{{ Math.random() }}</div>
  <div>{{ Test.a }}</div>
</template>

<script setup>
window.Test = {
  a: 1
}
</script>

<style lang="scss" scoped>
div {
  font-size: 3em;
}
</style>
