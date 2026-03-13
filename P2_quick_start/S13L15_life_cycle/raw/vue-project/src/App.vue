<template>
  <div>Vue2 和 Vue3 钩子函数执行时机对比</div>
</template>

<script>
import { onMounted } from 'vue'
// 这里使用选项时API风格
export default {
  mounted() {
    console.log('执行Vue2的钩子函数')
  },
  setup() {
    // 使用setup函数
    onMounted(() => {
      console.log('执行Vue3的onMounted函数')
    })
  }
}
</script>

<style scoped></style>
