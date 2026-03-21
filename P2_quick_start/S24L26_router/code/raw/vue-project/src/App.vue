<template>
  <div id="app">
    <h1>欢迎来到Vue-router快速入门示例</h1>
    <nav>
      <!-- 该组件由 vue-router 这个库提供的 -->
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
    </nav>
    <!-- 由 vue-router 这个库提供的 -->
    <!-- 路由所匹配上的组件，会渲染到这个位置 -->
    <router-view />
  </div>
</template>

<script setup></script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}

nav a {
  padding: 15px;
}
</style>
