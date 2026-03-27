<template>
  <a-layout class="container">
    <a-layout-header>
      <a-row>
        <a-col :span="4">
          <a-image class="logo" :src="logo" :preview="false"/>
        </a-col>
        <a-col :span="17">
          <a-menu
            v-model:selectedKeys="selectedKeys"
            mode="horizontal"
            :style="{ lineHeight: '64px' }"
            theme="light"
          >
            <a-menu-item key="home">
              <router-link to="/home" class="navigation">主页</router-link>
            </a-menu-item>
            <a-menu-item key="about">
              <router-link to="/about" class="navigation">关于我们</router-link>          
            </a-menu-item>
          </a-menu>
        </a-col>
        <a-col :span="3">
          <a-menu
            v-model:selectedKeys="selectedKeys"
            mode="horizontal"
            :style="{ lineHeight: '64px' }"
            theme="light"
          >
            <a-menu-item key="add">
              <router-link to="/add" class="navigation">添加用户</router-link>
            </a-menu-item>
          </a-menu>
        </a-col>
      </a-row>
    </a-layout-header>
    <a-layout-content style="padding: 0 5em" class="content">
      <router-view />
    </a-layout-content>
  </a-layout>
</template>

<script setup>
import { ref } from 'vue'
// logo image
import img from '@/assets/logo.jpg'

const selectedKeys = ref(['home'])
const logo = ref(img)
</script>

<style scoped></style>
