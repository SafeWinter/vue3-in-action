<template>
  <div>{{ count }}</div>
  <button v-on:click="count++">+1</button>
</template>

<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<style lang="scss" scoped></style>