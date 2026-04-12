<template>
  <my-tree
    :data="treeData"
    :show-checkbox="true"
    :transition="true"
    node-key="id"
    @update:child-check="handleChildCheck"
  />
</template>

<script setup>
import { ref } from 'vue'
import MyTree from './components/MyTree.vue'

const treeData = ref([
  {
    id: 1,
    label: '一级 1',
    children: [
      { id: 2, label: '二级 1-1' },
      { id: 3, label: '二级 1-2' },
      {
        id: 7,
        label: '二级 1-3',
        children: [
          { id: 8, label: '三级 1-3-1' },
          { id: 9, label: '三级 1-3-2' },
          {
            id: 10,
            label: '三级 1-3-3',
            children: [
              { id: 11, label: '四级 1-3-3-1' },
              { id: 12, label: '四级 1-3-3-2' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 4,
    label: '一级 2',
    children: [
      { id: 5, label: '二级 2-1' },
      { id: 6, label: '二级 2-2' }
    ]
  }
])

const handleChildCheck = (checkedKeys) => {
  console.log('当前选中的节点key:', checkedKeys)
}
</script>
