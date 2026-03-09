<template>
  <div id="container">{{ count }}</div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
let count = ref(1)
let container = null
setTimeout(() => {
  count.value = 2 // 修改响应式状态
  // 等待下一个 DOM 更新周期
  nextTick(() => {
    // 这个时候再打印就是最新的值了
    console.log('第二次打印：', container.innerText)
  })
}, 2000)
// 这是一个生命周期钩子方法
// 会在组件完成初始渲染并创建 DOM 节点后自动调用
onMounted(() => {
  container = document.getElementById('container')
  console.log('第一次打印：', container.innerText)
})
</script>

<style lang="scss" scoped></style>
