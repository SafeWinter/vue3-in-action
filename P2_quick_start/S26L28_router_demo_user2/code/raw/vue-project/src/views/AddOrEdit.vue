<template>
  <div class="container">
    <h1 class="page-header">{{ id ? '修改用户' : '添加用户' }}</h1>
    <form id="my-form" @submit.prevent="submitUserInfo">
      <div class="well">
        <!-- 里面就是每一项表单控件 -->
        <div class="form-group">
          <label>姓名</label>
          <input
            type="text"
            class="form-control"
            placeholder="请输入用户姓名"
            v-model="user.name"
          />
        </div>
        <div class="form-group">
          <label>年龄</label>
          <input
            type="text"
            class="form-control"
            placeholder="请填写用户年龄"
            v-model.trim="user.age"
          />
        </div>
        <div class="form-group">
          <label>电话</label>
          <input
            type="text"
            class="form-control"
            placeholder="请填写用户电话号码"
            v-model.trim="user.phone"
          />
        </div>
        <div class="form-group">
          <label>邮箱</label>
          <input
            type="text"
            class="form-control"
            placeholder="请填写用户邮箱地址"
            v-model.trim="user.email"
          />
        </div>
        <div class="form-group">
          <label>学历</label>
          <select class="form-control" v-model="user.education">
            <option>小学</option>
            <option>初中或职中</option>
            <option>高中或职高</option>
            <option>专科</option>
            <option>本科</option>
            <option>硕士</option>
            <option>博士</option>
          </select>
        </div>
        <div class="form-group">
          <label>毕业学校</label>
          <input
            type="text"
            class="form-control"
            placeholder="请填写用户毕业院校"
            v-model.trim="user.graduationschool"
          />
        </div>
        <div class="form-group">
          <label>职业</label>
          <input
            type="text"
            class="form-control"
            placeholder="请填写用户从事的相关职业"
            v-model.trim="user.profession"
          />
        </div>
        <div class="form-group">
          <label>个人介绍</label>
          <textarea
            class="form-control"
            rows="10"
            placeholder="请简单的介绍一下你自己，包括兴趣、爱好等信息..."
            v-model.trim="user.profile"
          />
        </div>
        <button class="btn btn-primary">{{ id ? '确认修改' : '确认新增' }}</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { addUserApi, getUserByIdApi, editUserByIdApi } from '../api/userApi.js'
import { useRouter, useRoute } from 'vue-router'

const user = reactive({
  name: '',
  age: '',
  phone: '',
  email: '',
  education: '本科',
  graduationschool: '',
  profession: '',
  profile: ''
})

// 得到 router 的实例对象
const router = useRouter()
const route = useRoute()
const id = route.params.id

onMounted(() => {
  // 跳转过来有两种情况：1. 新增用户 2. 修改用户
  // 新增用户 id 是没有值的
  // 修改用户 id 是有值的
  if (id) {
    getUserByIdApi(id).then(({ data }) => {
      Object.assign(user, data)
    })
  }
})

function submitUserInfo() {
  // 这只是一个简单的验证，验证不能有空项
  for (const key in user) {
    if (!user[key]) {
      alert('请填写完整的用户信息')
      return
    }
  }

  if (id) {
    // 修改用户
    editUserByIdApi(id, user).then(() => {
      router.push({
        path: '/home',
        query: {
          alert: '修改用户成功！',
          type: 'success'
        }
      })
    })
  } else {
    // 新增用户
    addUserApi(user).then(() => {
      router.push({
        path: '/home',
        query: {
          alert: '新增用户成功！',
          type: 'success'
        }
      })
    })
  }
}
</script>

<style scoped></style>
