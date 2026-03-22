<template>
  <div id="app" class="container">
    <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <button
            type="button"
            class="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#navbar"
            aria-expanded="false"
            aria-controls="navbar"
          >
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <div class="navbar-brand">用户管理系统</div>
        </div>
        <div id="navbar" class="collapse navbar-collapse">
          <ul class="nav navbar-nav">
            <router-link to="/home" class="navigation">主页</router-link>
            <router-link to="/about" class="navigation">关于我们</router-link>
          </ul>
          <ul class="nav navbar-nav navbar-right">
            <router-link to="/add" class="navigation">添加用户</router-link>
          </ul>
        </div>
      </div>
    </nav>
    <!-- 由 vue-router 这个库提供的 -->
    <!-- 路由所匹配上的组件，会渲染到这个位置 -->
    <router-view class="content" />
  </div>
</template>

<script setup></script>

<style scoped></style>
