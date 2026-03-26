<template>
  <div class="form-container">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" class="user-form">
      <h2 class="form-title">用户信息表单</h2>
      <!-- 姓名 -->
      <el-form-item label="姓名：" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <!-- 邮箱 -->
      <el-form-item label="邮箱：" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <!-- 出生日期 -->
      <el-form-item label="出生日期：" prop="birthday">
        <ElConfigProvider :locale="locale">
          <el-date-picker
            v-model="form.birthday"
            type="date"
            placeholder="选择日期"
            :picker-options="{ firstDayOfWeek: 1 }"
            style="width: 100%"
          />
        </ElConfigProvider>
      </el-form-item>
      <!-- 性别 -->
      <el-form-item label="性别：" prop="gender">
        <el-radio-group v-model="form.gender">
          <el-radio value="male">男</el-radio>
          <el-radio value="female">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 兴趣爱好 -->
      <el-form-item label="兴趣爱好：" prop="hobbies">
        <el-checkbox-group v-model="form.hobbies">
          <el-checkbox value="reading" name="hobby">阅读</el-checkbox>
          <el-checkbox value="music" name="hobby">音乐</el-checkbox>
          <el-checkbox value="sports" name="hobby">运动</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="接收通知：" prop="notifications">
        <el-switch v-model="form.notifications"></el-switch>
      </el-form-item>
      <el-form-item label="用户评级：" prop="rating">
        <el-rate v-model="form.rating"></el-rate>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElConfigProvider } from 'element-plus'
// 引入的是中文语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn'
const form = ref({
  name: '',
  email: '',
  birthday: '',
  gender: 'male',
  hobbies: [],
  notifications: false,
  rating: 0
})

const formRef = ref(null)

const locale = ref(zhCn)

const rules = {
  // 验证规则是一个数组，因为可以设置多条验证规则
  // 每一条验证规则，是一个对象
  name: [
    {
      required: true,
      message: '请输入姓名',
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入您的邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  birthday: [{ required: true, message: '请选择您的出生日期', trigger: 'change' }],
  gender: [{ required: true, message: '请选择您的性别', trigger: 'change' }],
  hobbies: [{ required: true, message: '至少选择一个兴趣爱好', trigger: 'change' }],
  rating: [{ required: true, message: '请评价用户等级', trigger: 'change' }]
}
// 提交表单
function submitForm() {
  // 提交表单的时候，需要看一下表单是否验证通过
  formRef.value.validate((valid) => {
    // 自动传入一个参数，这个参数是一个布尔值，代表表单是否验证通过
    if (valid) {
      // 验证通过
      console.log('表单验证通过')
    } else {
      // 验证不通过
      console.log('表单验证不通过')
      return false
    }
  })
}
</script>

<style scoped>
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.user-form {
  width: 600px;
  border: 1px solid #eee;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.form-title {
  text-align: center;
  margin-bottom: 20px;
}
</style>
