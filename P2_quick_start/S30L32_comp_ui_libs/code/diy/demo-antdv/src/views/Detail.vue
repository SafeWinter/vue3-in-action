<template>
  <div class="detail-container">
    <h1>
      {{ user.name }}
      <a-button type="link" @click="backToHome">返回</a-button>
      <span class="pull-right">
        <a-button type="primary" @click="editUser">修改</a-button>
        <a-button type="primary" danger @click="deleteUser">删除</a-button>
      </span>
    </h1>
    <!-- Group 1 -->
    <a-card title="用户信息" class="box-card">
      <ul class="list-group">
        <li class="list-group-item"><PhoneOutlined /> 电话：{{ user.phone }}</li>
        <li class="list-group-item"><MailOutlined /> 邮箱：{{ user.email }}</li>
      </ul>
    </a-card>

    <!-- Group 2 -->
    <a-card title="教育与职业" class="box-card">
      <ul class="list-group">
        <li class="list-group-item"><ReadOutlined /> 文化水平：{{ user.education }}</li>
        <li class="list-group-item"><BankOutlined /> 毕业院校：{{ user.graduationschool }}</li>
        <li class="list-group-item"><CrownOutlined /> 专业：{{ user.profession }}</li>
        <li class="list-group-item"><UserOutlined /> 个人简介：{{ user.profile }}</li>
      </ul>
    </a-card>
  </div>
</template>

<script setup>
import { ref, onMounted, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getUserByIdApi, deleteUserByIdApi } from '@/api/userApi'
import { Modal } from 'ant-design-vue'
import {
  ExclamationCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  ReadOutlined,
  BankOutlined,
  CrownOutlined,
  UserOutlined
} from '@ant-design/icons-vue'

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

function deleteUser() {
  Modal.confirm({
    title: '提示',
    icon: h(ExclamationCircleOutlined),
    content: '确定要删除该用户吗？',
    okText: '确定',
    okType: 'primary',
    cancelText: '取消',
    onOk() {
      console.log('OK')
      delUser()
    },
    onCancel() {
      console.log('Cancel')
    }
  })
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
