<template>
  <div class="go-to">
    跳转行数：
    <input v-model.number="rowNum" @keyup.enter="handleScrollTo" :placeholder="hint" type="number" />
    <button type="button" @click="handleScrollTo">跳转</button>
  </div>
  <div class="vlist-container" v-bind="containerProps">
    <div v-bind="wrapperProps">
      <div
        class="list-item"
        v-for="{ index: idx, data: { id, value } } in list"
        :key="idx"
        :style="{ height: `${props.itemSize}px` }"
      >
        <span class="row">第 {{ id }} 行</span><span>{{ value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, shallowRef } from 'vue'
import { useVirtualList } from '@vueuse/core'

const props = defineProps({
  listData: {
    type: Array,
    default: () => []
  },
  itemSize: {
    type: Number,
    default: 150
  }
})

const hint = computed(() => `有效范围：1 ~ ${props.listData.length}`)

const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(props.listData, {
  itemHeight: props.itemSize,
  overscan: 3
})

const rowNum = shallowRef()
const handleScrollTo = () => (rowNum.value ? scrollTo(rowNum.value - 1) : void 0)
</script>

<style scoped>
.vlist-container {
  height: 500px;
  width: 100%;
  border: 2px solid #b1b1b1;
}

.go-to {
  margin-block: 1em;
}

.list-item {
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #ccc;
}

.row::after {
  content: '|';
  display: inline-block;
  margin-inline: 1em;
}
</style>
