<template>
  <A @click="clickHandler" />
</template>

<script setup>
import A from './components/A.vue'
const clickHandler = ({target}) => console.log('(App.vue) clicked target:', target)
</script>
