<template>
  <div class="details container">
    <button class="btn btn-default" @click="backToHome">返回</button>
    <h1 class="page-header">
      {{ user.name }}
      <span class="pull-right">
        <button class="btn btn-primary" @click="editUser">修改</button>
        <button class="btn btn-danger" @click="delUser">删除</button>
      </span>
    </h1>
    <!-- Group 1 -->
    <ul class="list-group">
      <li class="list-group-item">
        <span class="glyphicon glyphicon-phone">电话：{{ user.phone }}</span>
      </li>
      <li class="list-group-item">
        <span class="glyphicon glyphicon-envelope">邮箱：{{ user.email }}</span>
      </li>
    </ul>
    <!-- Group 2 -->
    <ul class="list-group">
      <li class="list-group-item">
        <span class="glyphicon glyphicon-book">文化水平：{{ user.education }}</span>
      </li>
      <li class="list-group-item">
        <span class="glyphicon glyphicon-flag">毕业院校：{{ user.graduationschool }}</span>
      </li>
      <li class="list-group-item">
        <span class="glyphicon glyphicon-briefcase">专业：{{ user.profession }}</span>
      </li>
      <li class="list-group-item">
        <span class="glyphicon glyphicon-user">个人简介：{{ user.profile }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
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

onMounted(() => {
  if (id) {
    console.log('id:', id)
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
  if(confirm('确认删除该用户吗？')) {
    deleteUserByIdApi(id).then(res => {
      // console.log('deleted:', res);
      if(res.status === 200) {
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
}
</script>

<style scoped></style>
