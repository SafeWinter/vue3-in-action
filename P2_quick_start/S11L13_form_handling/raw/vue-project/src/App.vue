<template>
  <!-- lazy修饰符演示 -->
  <input type="text" v-model.lazy="mess1" />
  <p>你输入的是：{{ mess1 }}</p>
  <p>类型为{{ typeof mess1 }}</p>
  <p>长度为{{ mess1.length }}</p>

  <!-- number修饰符演示 -->
  <input type="text" v-model.number="mess2" />
  <p>你输入的是：{{ mess2 }}</p>
  <p>类型为{{ typeof mess2 }}</p>
  <p>长度为{{ mess2.length }}</p>

  <!-- trim修饰符演示 -->
  <input type="text" v-model.trim="mess3" />
  <p>你输入的是：{{ mess3 }}</p>
  <p>类型为{{ typeof mess3 }}</p>
  <p>长度为{{ mess3.length }}</p>
</template>

<script setup>
import { ref } from 'vue'
const mess1 = ref('')
const mess2 = ref('')
const mess3 = ref('')
</script>

<style scoped></style>
