<template>
  <a-alert show-icon :message="alert" :type="type" closable @close="onClose"/>
</template>

<script setup>
defineProps(['type', 'alert'])
const emit = defineEmits(['close'])
function onClose() {
  emit('close')
}
</script>

<style lang="scss" scoped></style>
