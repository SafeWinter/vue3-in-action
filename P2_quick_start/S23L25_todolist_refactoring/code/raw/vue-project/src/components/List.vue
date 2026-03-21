<template>
  <section class="main">
    <!-- 全选按钮 -->
    <input type="checkbox" id="toggle-all" class="toggle-all" />
    <label for="toggle-all">全部完成</label>
    <!-- 待办事项列表 -->
    <ul class="todo-list">
      <li
        class="todo"
        v-for="todo in filteredTodos"
        :key="todo.id"
        :class="{
          completed: todo.completed,
          editing: todo === editedTodo
        }"
      >
        <div class="view">
          <input type="checkbox" class="toggle" v-model="todo.completed" />
          <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
          <button class="destroy" @click="removeTodo(todo)"></button>
        </div>
        <!-- 编辑框 -->
        <input
          type="text"
          class="edit"
          v-if="todo === editedTodo"
          v-model="todo.title"
          @keyup.ctrl.enter="doneEdit(todo)"
          @blur="doneEdit(todo)"
          @keyup.escape="cancelEdit(todo)"
          @vue:mounted="({ el }) => el.focus()"
        />
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// 接收父组件通过 v-model 传递过来的数据
const todos = defineModel('todos')
const filteredTodos = defineModel('filteredTodos')

// editedTodo 是为了和编辑框进行一个双向绑定
const editedTodo = ref() // 存储当前编辑的待办事项，没有传递初始值，默认值为 undefined
let beforeEditCache = '' // 缓存编辑前的标题，用于取消编辑时恢复

function removeTodo(todo) {
  if (window.confirm('确定要删除此待办事项吗？')) {
    todos.value.splice(todos.value.indexOf(todo), 1)
  } else {
    if (beforeEditCache) {
      todo.title = beforeEditCache
      beforeEditCache = ''
    }
  }
}

// 编辑

function editTodo(todo) {
  editedTodo.value = todo
  beforeEditCache = todo.title
}

// 完成编辑方法
function doneEdit(todo) {
  if (editedTodo.value) {
    editedTodo.value = null // 只有置空了才会退出编辑模式
    todo.title = todo.title.trim() // 更新标题
    if (!todo.title) removeTodo(todo) // 如果标题为空，删除此待办事项
  }
}

// 取消编辑
function cancelEdit(todo) {
  editedTodo.value = null // 只有置空了才会退出编辑模式
  // 需要将标题还原
  todo.title = beforeEditCache
}
</script>

<style scoped>
@import '../assets/common.css';
.edit {
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
}
.main {
  position: relative;
  z-index: 2;
  border-top: 1px solid #e6e6e6;
}

.toggle-all {
  width: 1px;
  height: 1px;
  border: none; /* Mobile Safari */
  opacity: 0;
  position: absolute;
  right: 100%;
  bottom: 100%;
}

.toggle-all + label {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 65px;
  font-size: 0;
  position: absolute;
  top: -65px;
  left: -0;
}

.toggle-all + label:before {
  content: '❯';
  display: inline-block;
  font-size: 22px;
  color: #949494;
  padding: 10px 27px 10px 27px;
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}

.toggle-all:checked + label:before {
  color: #484848;
}

.todo-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.todo-list li {
  position: relative;
  font-size: 24px;
  border-bottom: 1px solid #ededed;
}

.todo-list li:last-child {
  border-bottom: none;
}

.todo-list li.editing {
  border-bottom: none;
  padding: 0;
}

.todo-list li.editing .edit {
  display: block;
  width: calc(100% - 43px);
  padding: 12px 16px;
  margin: 0 0 0 43px;
}

.todo-list li.editing .view {
  display: none;
}

.todo-list li .toggle {
  text-align: center;
  width: 40px;
  /* auto, since non-WebKit browsers doesn't support input styling */
  height: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto 0;
  border: none; /* Mobile Safari */
  -webkit-appearance: none;
  appearance: none;
}

.todo-list li .toggle {
  opacity: 0;
}

.todo-list li .toggle + label {
  /*
		Firefox requires `#` to be escaped - https://bugzilla.mozilla.org/show_bug.cgi?id=922433
		IE and Edge requires *everything* to be escaped to render, so we do that instead of just the `#` - https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/7157459/
	*/
  background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23949494%22%20stroke-width%3D%223%22/%3E%3C/svg%3E');
  background-repeat: no-repeat;
  background-position: center left;
}

.todo-list li .toggle:checked + label {
  background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%2359A193%22%20stroke-width%3D%223%22%2F%3E%3Cpath%20fill%3D%22%233EA390%22%20d%3D%22M72%2025L42%2071%2027%2056l-4%204%2020%2020%2034-52z%22%2F%3E%3C%2Fsvg%3E');
}

.todo-list li label {
  word-break: break-all;
  padding: 15px 15px 15px 60px;
  display: block;
  line-height: 1.2;
  transition: color 0.4s;
  font-weight: 400;
  color: #484848;
}

.todo-list li.completed label {
  color: #949494;
  text-decoration: line-through;
}

.todo-list li .destroy {
  display: none;
  position: absolute;
  top: 0;
  right: 10px;
  bottom: 0;
  width: 40px;
  height: 40px;
  margin: auto 0;
  font-size: 30px;
  color: #949494;
  transition: color 0.2s ease-out;
}

.todo-list li .destroy:hover,
.todo-list li .destroy:focus {
  color: #c18585;
}

.todo-list li .destroy:after {
  content: '×';
  display: block;
  height: 100%;
  line-height: 1.1;
}

.todo-list li:hover .destroy {
  display: block;
}

.todo-list li .edit {
  display: none;
}

.todo-list li.editing:last-child {
  margin-bottom: -1px;
}
</style>
