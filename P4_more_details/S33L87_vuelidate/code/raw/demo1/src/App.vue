<template>
  <form @submit.prevent="submitForm" class="form-container">
    <div class="form-group">
      <label for="name">姓名</label>
      <input v-model="state.name" id="name" class="form-control" />
      <span v-if="v$.name.$error" class="error-message">姓名是必填项</span>
    </div>

    <div class="form-group">
      <label for="password">密码</label>
      <input type="password" v-model="state.password" id="password" class="form-control" />
      <span v-if="v$.password.$error" class="error-message">密码不能少于6个字符</span>
    </div>

    <button type="submit" class="submit-button">提交</button>
  </form>
</template>

<script setup>
import { reactive } from 'vue'
import { required, minLength } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

// 创建一个响应式状态对象，用于存储表单数据
const state = reactive({
  name: '',
  password: ''
})

// 定义验证规则
const rules = {
  name: { required },
  password: {
    required,
    minLength: minLength(6) // 规定长度不能小于6个字符
  }
}

// 创建一个验证实例对象
// 1. 验证规则  2. 要对哪一个状态对象进行验证
const v$ = useVuelidate(rules, state)

const submitForm = () => {
  // 1. 触发验证
  // 标记所有规则为“已触摸”
  v$.value.$touch()

  // 2. 检验验证后的状态
  if (v$.value.$invalid) {
    // 说明有验证不通过
    console.log('表单验证不通过')
  } else {
    // 说明验证通过
    console.log('表单验证通过')
  }
}
</script>

<style scoped>
.form-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.error-message {
  color: #ff4d4f;
  font-size: 14px;
  margin-top: 5px;
  display: block;
}

.submit-button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #0056b3;
}
</style>
