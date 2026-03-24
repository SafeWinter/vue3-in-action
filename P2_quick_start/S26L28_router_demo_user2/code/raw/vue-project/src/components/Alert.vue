<template>
  <div :class="['alert', 'alert-dismissible', `alert-${type}`]" role="alert">
    <button type="button" class="close" @click="closeAlert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
    <strong>提示!</strong> {{ alert }}
  </div>
</template>

<script setup>
defineProps({
  type: String, // 提示的类型
  alert: String // 提示的内容
})

const emit = defineEmits(['close'])
function closeAlert() {
  // 触发父组件的 close 事件
  emit('close')
}
</script>
