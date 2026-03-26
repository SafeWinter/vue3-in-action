<template>
  <div class="home-container">
    <Alert v-if="showAlert" v-bind="alert" @close="closeAlert" />
    <h1>用户列表</h1>
    <!-- 搜索框 -->
    <el-input
      type="text"
      class="searchBox"
      placeholder="搜索姓名"
      v-model="search"
      @input="updateSearch"
    />
    <!-- 表格：显示用户信息 -->
    <el-table :data="list" stripe style="width: 100%">
      <el-table-column prop="name" label="姓名" align="center" />
      <el-table-column prop="age" label="年龄" align="center" />
      <el-table-column prop="phone" label="联系方式" align="center" />
      <el-table-column prop="" label="操作" align="center">
        <template #default="{ row }">
          <el-button type="primary" size="small" link @click="gotoDetail(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
// import { onMounted, ref, computed } from 'vue'
import { getUserListApi } from '@/api/userApi'
// import { useRoute, useRouter } from 'vue-router'
import Alert from '@/components/Alert.vue'

const route = useRoute()
const router = useRouter()

const userList = ref([])
const filteredList = ref([])
const search = ref('')

const alert = ref(null)
const showAlert = computed(() => alert.value !== null)

onMounted(async () => {
  const { data } = await getUserListApi()
  userList.value = [...data]

  if (route.query && route.query.alert && route.query.type) {
    alert.value = route.query
  }
})

function closeAlert() {
  alert.value = null
}

function updateSearch() {
  const keyword = search.value.trim()
  filteredList.value = userList.value.filter((item) => item.name.includes(keyword))
}

const list = computed(() => (search.value.trim() ? filteredList.value : userList.value))

function gotoDetail({ id }) {
  router.push(`/detail/${id}`)
}
</script>

<style scoped>
.home-container {
  margin-inline: 5em;
}
.searchBox {
  margin: 20px 0;
}
</style>
