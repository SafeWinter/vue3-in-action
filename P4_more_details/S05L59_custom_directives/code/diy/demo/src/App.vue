<template>
  <input type="text" v-focus />
</template>

<script setup>
const vFocus = {
  mounted(el) {
    el.focus()
  }
}
</script>

<style scoped></style>
