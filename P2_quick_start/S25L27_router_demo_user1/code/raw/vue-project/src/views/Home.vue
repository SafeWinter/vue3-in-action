<template>
  <div>
    <h1>用户列表</h1>
    <!-- 搜索框 -->
    <input
      type="text"
      class="form-control"
      placeholder="搜索内容"
      v-model="searchItem"
      @input="changeHandle"
    />
    <!-- 表格：显示用户信息 -->
    <table class="table table-striped table-bordered">
      <thead>
        <tr>
          <th>姓名</th>
          <th>年龄</th>
          <th>联系方式</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in list" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.age }}</td>
          <td>{{ item.phone }}</td>
          <td>
            <router-link :to="`/detail/${item.id}`">详情</router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { getUserListApi } from '../api/userApi.js'

const userList = ref([])
const searchItem = ref('')
const searchList = ref([]) // 存储搜索后的数据

onMounted(() => {
  // 获取用户的数据
  getUserListApi().then(({ data }) => {
    userList.value = data
  })
})

function changeHandle() {
  // 根据用户输入的内容进行信息的过滤
  searchList.value = userList.value.filter((item) => {
    return item.name.includes(searchItem.value)
  })
}

const list = computed(() => (searchItem.value ? searchList.value : userList.value))
</script>

<style scoped></style>
