<template>
  <el-alert :title="alert" :type="type" />
</template>

<script setup>
defineProps(['type', 'alert'])
</script>

<style lang="scss" scoped></style>
