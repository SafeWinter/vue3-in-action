<template>
  <div class="edit-container">
    <h1 class="page-header">{{ operation }}用户</h1>
    <el-form
      class="form"
      :model="user"
      id="myForm"
      @submit.prevent="submitUser"
      label-width="100px"
    >
      <el-form-item label="姓名">
        <el-input type="text" placeholder="请填写用户姓名" v-model.trim="user.name" />
      </el-form-item>
      <el-form-item label="年龄">
        <el-input type="text" placeholder="请填写用户年龄" v-model.trim="user.age" />
      </el-form-item>
      <el-form-item label="电话">
        <el-input type="text" placeholder="请填写用户电话号码" v-model.trim="user.phone" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input type="text" placeholder="请填写用户邮箱地址" v-model.trim="user.email" />
      </el-form-item>
      <el-form-item label="学历">
        <el-select v-model="user.education" placeholder="请选择学历">
          <el-option label="小学" value="小学" />
          <el-option label="初中或职中" value="初中或职中" />
          <el-option label="高中或职高" value="高中或职高" />
          <el-option label="专科" value="专科" />
          <el-option label="本科" value="本科" />
          <el-option label="硕士" value="硕士" />
          <el-option label="博士" value="博士" />
        </el-select>
      </el-form-item>
      <el-form-item label="毕业学校">
        <el-input type="text" placeholder="请填写用户毕业院校" v-model.trim="user.graduationschool" />
      </el-form-item>
      <el-form-item label="职业">
        <el-input type="text" placeholder="请填写用户从事的相关职业" v-model.trim="user.profession" />
      </el-form-item>
      <el-form-item label="个人简介">
        <el-input type="textarea" :rows="10" placeholder="请简单的介绍一下你自己，包括兴趣、爱好等信息..." v-model.trim="user.profile" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">确认{{ btnLabel }}</el-button>
      </el-form-item>
    </el-form>
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
