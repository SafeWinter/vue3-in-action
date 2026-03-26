<template>
  <div class="detail-container">
    <h1>
      {{ user.name }}
      <el-button link type="primary" @click="backToHome">返回</el-button>
      <span class="pull-right">
        <el-button type="primary" @click="editUser">修改</el-button>
        <el-button type="danger" @click="dialogVisible = true">删除</el-button>
      </span>
    </h1>
    <!-- Group 1 -->
    <el-card class="box-card">
      <template #header>
        <span>用户信息</span>
      </template>
      <ul class="list-group">
        <li class="list-group-item">
          <el-icon class="icon"><Cellphone /></el-icon> 电话：{{ user.phone }}
        </li>
        <li class="list-group-item">
          <el-icon class="icon"><Message /></el-icon> 邮箱：{{ user.email }}
        </li>
      </ul>
    </el-card>

    <!-- Group 2 -->
    <el-card class="box-card">
      <template #header><span>教育与职业</span></template>
      <ul class="list-group">
        <li class="list-group-item">
          <el-icon class="icon"><Reading /></el-icon>文化水平：{{ user.education }}
        </li>
        <li class="list-group-item">
          <el-icon class="icon"><Collection /></el-icon>毕业院校：{{ user.graduationschool }}
        </li>
        <li class="list-group-item">
          <el-icon class="icon"><Postcard /></el-icon>专业：{{ user.profession }}
        </li>
        <li class="list-group-item">
          <el-icon class="icon"><User /></el-icon>个人简介：{{ user.profile }}
        </li>
      </ul>
    </el-card>

    <el-dialog v-model="dialogVisible" title="提示" width="500">
      <span>确定要删除该用户吗？</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="delUser"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getUserByIdApi, deleteUserByIdApi } from '@/api/userApi'

const router = useRouter()
const route = useRoute()
const id = route.params.id
const user = ref({
  name: '',
  age: '',
  phone: '',
  email: '',
  education: '本科',
  graduationschool: '',
  profession: '',
  profile: ''
})

const dialogVisible = ref(false)

onMounted(() => {
  if (id) {
    getUserByIdApi(id).then(({ data }) => Object.assign(user.value, data))
  }
})

function backToHome() {
  router.push('/')
}

function editUser() {
  router.push(`/edit/${id}`)
}

function delUser() {
  deleteUserByIdApi(id).then((res) => {
    // console.log('deleted:', res);
    if (res.status === 200) {
      router.push({
        name: 'Home',
        query: {
          alert: '删除用户成功！',
          type: 'warning'
        }
      })
    }
  })
}
</script>

<style scoped>
.detail-container {
  margin-inline: 5em;
}
.pull-right {
  float: right;
}
.box-card {
  margin-bottom: 20px;
}
</style>
