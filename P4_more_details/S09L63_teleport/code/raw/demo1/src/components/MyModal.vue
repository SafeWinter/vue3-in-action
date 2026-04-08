<script setup>
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <button @click="open = true">打开模态框</button>

  <Teleport to="body">
    <div v-if="open" class="modal">
      <p>模态框内容</p>
      <button @click="open = false">关闭</button>
    </div>
  </Teleport>
</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
  border: 1px solid #ccc;
  text-align: center;
}
.modal p {
  padding: 10px;
  margin: 0;
  background-color: #f4f4f4;
  text-align: center;
}
</style>
