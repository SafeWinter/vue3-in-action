<template>
  <div>
    <h1>用户列表</h1>
    <ul v-if="!loading">
      <li v-for="(user, index) in users" :key="index">{{ user.name }} - {{ user.email }}</li>
    </ul>
    <div v-if="loading">加载中...</div>
    <div v-if="error">出错啦！</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const users = ref([])
const loading = ref(false)
const error = ref(null)

onMounted(async () => {
  // 一般来讲，我们会在此生命周期钩子方法中请求数据
  loading.value = true
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/users')
    if (res.ok) {
      users.value = await res.json()
    } else {
      throw new Error('请求失败')
    }
  } catch (err) {
    error.value = err.message
  } finally {
    // 无论是出错也好，还是正常请求到了数据，都需要将 loading 状态改为 false
    loading.value = false
  }
})
</script>

<style scoped></style>
