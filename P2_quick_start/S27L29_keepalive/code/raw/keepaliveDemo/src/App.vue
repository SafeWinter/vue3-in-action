<template>
  <div id="app">
    <nav>
      <router-link to="/">计数器</router-link>
      <router-link to="/input">文本输入</router-link>
      <router-link to="/checkboxlist">复选框</router-link>
      <router-link to="/timer">计时器</router-link>
    </nav>
    <router-view v-slot="{ Component }">
      <keep-alive :max="3">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<style>
@import '@/assets/app.css';
</style>
