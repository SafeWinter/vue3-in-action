<template>
  <div :style="styleArr">绑定内连样式</div>
</template>

<script setup>
import { ref, reactive } from 'vue'
const styleObj = reactive({
  color: 'red',
  fontSize: '30px'
})
const styleObj2 = reactive({
  textDecoration: 'underline'
})
const styleArr = ref([styleObj, styleObj2])
setTimeout(() => {
  styleArr.value.pop()
}, 3000)
</script>

<style lang="scss" scoped></style>
