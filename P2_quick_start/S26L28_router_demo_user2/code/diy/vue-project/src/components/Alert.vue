<template>
  <div class="alert alert-dismissible" :class="`alert-${type}`" role="alert">
    <button class="close" aria-label="Close" @click="closeAlert">
      <span aria-hidden="true">&times;</span>
    </button>
    <strong>提示!</strong> {{ alert }}
  </div>
</template>

<script setup>
defineProps(['type', 'alert'])
const emit = defineEmits(['close'])

function closeAlert() {
  emit('close')
}
</script>

<style lang="scss" scoped></style>
