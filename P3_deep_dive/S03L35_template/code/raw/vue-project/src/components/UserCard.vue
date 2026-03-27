<template>
  <div class="user-card">
    <img :src="user.avatarUrl" alt="User avatar" class="avatar" />
    <div class="user-info">
      <h2>{{ user.name }}</h2>
      <p>{{ user.email }}</p>
    </div>
  </div>
</template>

<script setup>
const user = defineProps({
  name: String,
  email: String,
  avatarUrl: String
})
</script>

<style scoped>
.user-card {
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 10px;
  margin: 10px 0;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 15px;
}

.user-info h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.user-info p {
  margin: 5px 0 0;
  font-size: 16px;
  color: #666;
}
</style>
