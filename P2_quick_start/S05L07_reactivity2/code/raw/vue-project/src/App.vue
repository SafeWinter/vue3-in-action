<template>
  <div>
    <div>{{ count + 1 }}</div>
    <div>{{ object.id.value + 1 }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const count = ref(0) // 顶级的 Ref 自动解包
const object = {
  id: ref(1) // 这就是一个非顶级 Ref 不会自动解包
}
</script>

<style lang="scss" scoped></style>
