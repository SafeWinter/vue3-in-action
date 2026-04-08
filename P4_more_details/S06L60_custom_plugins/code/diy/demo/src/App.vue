<template>
  <div>
    <h1>i18n 插件示例</h1>
    <h3>{{ $translate('greetings.hello') }}</h3>
    <hr>
    <h1>错误插件使用示例</h1>
    <button @click="triggerError">触发错误</button>
    <!-- 使用由ErrLogger插件所提供的组件 -->
    <err-logger />
  </div>
</template>

<script setup>
function triggerError() {
  // 触发一个错误
  if(Math.random() > 0.5) {
    console.log('触发普通错误');
    throw new Error('这是一个错误呀！！！' + Math.random())
  } else {
    console.log('触发Promise错误');
    Promise.reject('Promise 错误').catch(err => {
      throw new Error(err)
    })
  }
}
</script>
