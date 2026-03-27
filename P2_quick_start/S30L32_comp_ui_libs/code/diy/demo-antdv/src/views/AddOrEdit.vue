<template>
  <div class="edit-container">
    <h1 class="page-header">{{ operation }}用户</h1>
    <a-form
      class="form"
      :model="user"
      id="myForm"
      @submit.prevent="submitUser"
    >
      <a-form-item label="姓名">
        <a-input
          placeholder="请填写用户姓名"
          v-model:value.trim="user.name"
        />
      </a-form-item>
      <a-form-item label="年龄">
        <a-input
          placeholder="请填写用户年龄"
          v-model:value.trim="user.age"
        />
      </a-form-item>
      <a-form-item label="电话">
        <a-input
          placeholder="请填写用户电话号码"
          v-model:value.trim="user.phone"
        />
      </a-form-item>
      <a-form-item label="邮箱">
        <a-input
          placeholder="请填写用户邮箱地址"
          v-model:value.trim="user.email"
        />
      </a-form-item>
      <a-form-item label="学历">
        <a-select v-model:value="user.education" placeholder="请选择学历">
          <a-select-option value="小学">小学</a-select-option>
          <a-select-option value="初中或职中">初中或职中</a-select-option>
          <a-select-option value="高中或职高">高中或职高</a-select-option>
          <a-select-option value="专科">专科</a-select-option>
          <a-select-option value="本科">本科</a-select-option>
          <a-select-option value="硕士">硕士</a-select-option>
          <a-select-option value="博士">博士</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="毕业学校">
        <a-input
          placeholder="请填写用户毕业院校"
          v-model:value.trim="user.graduationschool"
        />
      </a-form-item>
      <a-form-item label="职业">
        <a-input
          placeholder="请填写用户从事的相关职业"
          v-model:value.trim="user.profession"
        />
      </a-form-item>
      <a-form-item label="个人简介">
        <a-textarea
          :rows="10"
          placeholder="请简单的介绍一下你自己，包括兴趣、爱好等信息..."
          v-model:value.trim="user.profile"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">确认{{ btnLabel }}</a-button>
      </a-form-item>
    </a-form>
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

function submitUser() {
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

<style scoped>
.edit-container {
  margin-inline: 5em;
}
</style>