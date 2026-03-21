<template>
  <header class="header">
    <h1>待办事项</h1>
    <input
      type="text"
      class="new-todo"
      placeholder="添加新的待办事项"
      @keyup.ctrl.enter="addTodo"
    />
  </header>
</template>

<script setup>
// 接收父组件通过 v-model 传递过来的数据
const todos = defineModel('todos')
// 方法
function addTodo(event) {
  // 拿到用户输入的值
  const value = event.target.value.trim()
  console.log(value)
  if (value) {
    todos.value.push({
      id: Date.now(),
      title: value,
      completed: false
    })
    event.target.value = '' // 清空输入框
  }
}
</script>

<style scoped>
input::-webkit-input-placeholder {
  font-style: italic;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.4);
}
input::-moz-placeholder {
  font-style: italic;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.4);
}
input::input-placeholder {
  font-style: italic;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.4);
}
h1 {
  position: absolute;
  top: -150px;
  width: 100%;
  font-size: 60px;
  font-weight: 200;
  text-align: center;
  color: #b83f45;
  -webkit-text-rendering: optimizeLegibility;
  -moz-text-rendering: optimizeLegibility;
  text-rendering: optimizeLegibility;
}
.new-todo {
  position: relative;
  margin: 0;
  width: 100%;
  font-size: 24px;
  font-family: inherit;
  font-weight: inherit;
  line-height: 1.4em;
  color: inherit;
  padding: 6px;
  border: 1px solid #999;
  box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 16px 16px 16px 60px;
  height: 65px;
  border: none;
  background: rgba(0, 0, 0, 0.003);
  box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
}
</style>
