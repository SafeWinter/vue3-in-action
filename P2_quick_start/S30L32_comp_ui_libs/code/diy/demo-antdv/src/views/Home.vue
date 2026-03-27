<template>
  <div class="home-container">
    <Alert v-if="showAlert" v-bind="alert" @close="closeAlert" />
    <h1>用户列表</h1>
    <!-- 搜索框 -->
    <a-input
      class="searchBox"
      placeholder="搜索姓名"
      v-model:value="search"
      @input="updateSearch"
    />
    <!-- 表格：显示用户信息 -->
    <a-table 
      :data-source="list"
      :columns="columns"
      :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
      style="width: 100%"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-button type="link" size="small" @click="gotoDetail(record)">详情</a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { getUserListApi } from '@/api/userApi'
import { useRoute, useRouter } from 'vue-router'
import Alert from '@/components/Alert.vue'

const route = useRoute()
const router = useRouter()

const columns = ref([
  {
    title: '姓名',
    dataIndex: 'name',
    align: 'center'
  },
  {
    title: '年龄',
    dataIndex: 'age',
    align: 'center'
  },
  {
    title: '联系方式',
    dataIndex: 'phone',
    align: 'center'
  },
  {
    title: '操作',
    key: 'action',
    align: 'center'
  },
]);

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

const list = computed(() => (search.value.trim().length > 0 ? filteredList.value : userList.value))

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
:deep(.table-striped) td {
  background-color: #fafafa;
}
</style>
