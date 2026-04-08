<template>
  <div v-if="errs.length">
    <h3>错误日志</h3>
    <ul>
      <li v-for="err in errs" :key="err.time">[{{ err.time }}] - {{ err.message }}</li>
    </ul>
  </div>
</template>

<script setup>
import {reactive, onMounted} from 'vue'
const errs = reactive([])
onMounted(() => {
  const err = console.error;
  console.error = (...args) => {
    const r = `${Math.random() * 1000}`.substring(3)
    const time = [new Date().toLocaleString(), r].join('-')
    errs.push({
      message: args[0],
      time
    })
    err.apply(console, args)
  }
})
</script>

<style lang="scss" scoped>

</style>