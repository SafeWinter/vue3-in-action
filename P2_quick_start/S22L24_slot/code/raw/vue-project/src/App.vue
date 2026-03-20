<template>
  <div class="app-container">
    <Card>
      <template v-slot="{ item }">
        <!-- 在父组件中来决定子组件的插槽内容 -->
        <h3>{{ item.name }}</h3>
        <p>{{ item.defaultText }}</p>
      </template>
    </Card>
  </div>
</template>

<script setup>
import Card from '@/components/Card.vue'
</script>

<style>
.app-container {
  padding: 20px;
}
</style>
