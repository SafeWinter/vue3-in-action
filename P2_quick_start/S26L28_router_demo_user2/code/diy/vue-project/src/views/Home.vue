<template>
  <div>
    <Alert v-if="showAlert" v-bind="alert" @close="closeAlert" />
    <h1>用户列表</h1>
    <!-- 搜索框 -->
    <input
      type="text"
      class="form-control"
      placeholder="搜索姓名"
      v-model="search"
      @input="updateSearch"
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
import { getUserListApi } from '@/api/userApi'
import { useRoute } from 'vue-router'
import Alert from '@/components/Alert.vue';

const route = useRoute()

const userList = ref([])
const filteredList = ref([])
const search = ref('')

const alert = ref(null)
const showAlert = computed(() => alert.value !== null)

onMounted(async () => {
  const { data } = await getUserListApi()
  userList.value = [...data]
  
  if(route.query && route.query.alert && route.query.type) {
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
</script>

<style scoped></style>
