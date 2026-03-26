<template>
  <div class="container">
    <Alert v-if="alert" v-bind="alert" @close="closeAlert" />
    <el-input
      class="searchBox"
      v-model="searchItem"
      placeholder="搜索"
      @input="changeHandle"
      clearable
    />
    <!-- 表格 -->
    <el-table :data="list" stripe style="width: 100%">
      <el-table-column prop="name" label="姓名" align="center" />
      <el-table-column prop="age" label="年龄" width="180" align="center" />
      <el-table-column prop="phone" label="联系方式" align="center" />
      <el-table-column prop="" label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="goToDetail(scope.row)"
            >详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getUserListApi } from '../api/userApi.js'
import Alert from '../components/Alert.vue'

const userList = ref([]) // 存储所有的数据
const searchItem = ref('') // 存储用户输入的搜索信息
const alert = ref(null)
const searchList = ref([]) // 存储搜索后的数据

const route = useRoute()
const router = useRouter()

// 获取学生列表数据
onMounted(() => {
  getUserListApi().then(({ data }) => {
    userList.value = data
  })
})

// 获取跳转到 Home 组件时传递的 state 数据
onMounted(() => {
  if (route.query.alert) {
    alert.value = route.query
  }
})

function changeHandle() {
  const name = searchItem.value
  const arr = userList.value.filter((item) => item.name.match(name))
  searchList.value = arr
}

function closeAlert() {
  alert.value = null
}

function goToDetail(item) {
  router.push(`/detail/${item.id}`)
}

// list 就是最终要显示的列表
const list = computed(() => (searchItem.value ? searchList.value : userList.value))
</script>

<style scoped>
.title {
  margin-bottom: 20px;
  font-weight: 200;
}
.searchBox {
  margin: 20px 0;
}

/* 添加必要的样式调整 */
.el-header {
  background-color: #333;
  color: white;
  line-height: 60px;
}
.el-menu-demo {
  background-color: transparent;
}
</style>
