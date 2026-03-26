<template>
  <div class="container">
    <h1 class="page-header">{{ operation }}用户</h1>
    <form id="my-form" @submit.prevent="addUser">
      <div class="well">
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
          ></textarea>
        </div>
        <button class="btn btn-primary">确认{{ btnLabel }}</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getUserByIdApi, addUserApi, editUserApi } from '@/api/userApi'

const route = useRoute()
const router = useRouter()

const id = ref('')
const operation = computed(() => (id.value ? '编辑' : '新增'))
const btnLabel = computed(() => (id.value ? '修改' : '新增'))

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
  if (route.params && route.params.id) {
    console.log(route.params.id)
    id.value = route.params.id.trim()

    getUserByIdApi(id.value).then(({ data }) => Object.assign(user.value, data))
  }
})

function addUser() {
  // form validation
  for(const key in user.value) {
    if(!user.value[key]) {
      alert('请填写完整的用户信息')
      return
    }
  }

  if(id.value) {
    editUserApi(id.value, user.value)
      .then(({data}) => {
        console.log('修改成功！', data);
        router.push({
          name: 'Home',
          query: {
            alert: '修改用户成功！',
            type: 'success'
          }
        })
      })
  } else {
    addUserApi(user.value)
      .then(({data}) => {
        console.log('新增成功！', data);
        router.push({
          name: 'Home',
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
