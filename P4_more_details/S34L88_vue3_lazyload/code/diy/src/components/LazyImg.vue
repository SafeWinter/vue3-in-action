<template>
  <img ref="lazyRef" class="image" width="100" />
</template>

<script setup>
import { computed } from 'vue'
import { useLazyload } from 'vue3-lazyload'
import error from '@/assets/error.png'
import loading from '@/assets/loading.png'

const props = defineProps({
  src: {
    type: String,
    required: true
  }
})

const src = computed(() => props.src)

// 在该组件中，通过 useLazyload 来创建懒加载链接
// 注意：参数第一项是图片真实的 src
const lazyRef = useLazyload(src, {
  lifecycle: {
    loading: () => {
      console.log('loading')
    },
    error: () => {
      console.log('error')
    },
    loaded: () => {
      console.log('loaded')
    }
  },
  loading, // 图片加载时显示的占位图片
  error // 图片加载失败时显示的图片
})
</script>

<style scoped>
.image {
  display: block;
  margin: 10px;
  width: 200px;
  height: 150px;
  object-fit: cover;
}
</style>
