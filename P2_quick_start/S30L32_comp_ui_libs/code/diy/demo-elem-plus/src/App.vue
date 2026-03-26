<template>
  <el-container class="container">
    <el-header>
      <el-row justify="end">
        <el-col :span="4">
          <el-image class="logo" :src="logo" fit="cover"/>
        </el-col>
        <el-col :span="20">
          <el-menu mode="horizontal" @select="changeMenuItem" :default-active="activeMenu">
            <el-menu-item index="home">
              <router-link to="/home" class="navigation">主页</router-link>
            </el-menu-item>
            <el-menu-item index="about">
              <router-link to="/about" class="navigation">关于我们</router-link>
            </el-menu-item>
            <el-menu-item index="add">
              <router-link to="/add" class="navigation">添加用户</router-link>
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </el-header>
    <el-main class="content">
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup>
// logo image
import img from '@/assets/logo.jpg'
const logo = ref(img)

// toggle menu item
const activeMenu = ref('home')
function changeMenuItem(key) {
  activeMenu.value = key
}
</script>

<style scoped></style>
