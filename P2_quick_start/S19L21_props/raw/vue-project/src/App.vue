<template>
  <div class="app-container">
    <!-- 父组件在使用 UserCard 这个组件的时候，向内部传递数据 -->
    <UserCard :user="user" :age="18" />
    <div class="input-group">
      <input type="text" placeholder="请输入新的名字" v-model="newName" />
      <button @click="changeName">确定修改</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import UserCard from './components/UserCard.vue'
// 父组件所维护的一份数据
const user = ref({
  name: '张三',
  // email: '123@gamil.com',
  avatarUrl: 'src/assets/yinshi.jpg'
})
const newName = ref('')

// 根据用户输入的新名字
// 更新 user 这个数据
function changeName() {
  if (newName.value.trim()) {
    user.value.name = newName.value
  }
}
</script>

<style scoped>
.app-container {
  max-width: 500px;
  margin: auto;
  padding: 20px;
}
.input-group {
  display: flex;
  margin-top: 20px;
}

input {
  flex: 1;
  padding: 10px;
  margin-right: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #0056b3;
}
</style>
