<template>
  <div class="app">
    <h1>树形组件示例</h1>
    <my-tree
      :data="data"
      @update:child-check="updateNode"
      :show-checkbox="true"
      :transition="true"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MyTree from '@/components/MyTree.vue'
const data = ref([
  {
    id: -1,
    label: '水果',
    checked: false, // 添加初始勾选状态
    children: [
      {
        id: 1,
        label: '苹果',
        checked: false,
        children: [
          {
            id: 2,
            label: '红富士',
            checked: false
          },
          {
            id: 3,
            label: '黄元帅',
            checked: false
          }
        ]
      },
      {
        id: 4,
        label: '香蕉',
        checked: false,
        children: [
          {
            id: 5,
            label: '大香蕉',
            checked: false
          },
          {
            id: 6,
            label: '小香蕉',
            checked: false
          }
        ]
      }
    ]
  },
  {
    id: 7,
    label: '游戏',
    checked: false,
    children: [
      {
        id: 8,
        label: '英雄联盟',
        checked: false,
        children: [
          {
            id: 9,
            label: '剑圣',
            checked: false
          },
          {
            id: 10,
            label: '盖伦',
            checked: false
          },
          {
            id: 11,
            label: '流浪法师',
            checked: false
          },
          {
            id: 12,
            label: '女枪',
            checked: false
          }
        ]
      },
      {
        id: 13,
        label: '王者荣耀',
        checked: false,
        children: [
          {
            id: 14,
            label: '后羿',
            checked: false
          },
          {
            id: 15,
            label: '鲁班七号',
            checked: false
          }
        ]
      }
    ]
  },
  {
    id: 16,
    label: '电影',
    checked: false,
    children: [
      {
        id: 17,
        label: '动作片',
        checked: true,
        children: [
          {
            id: 18,
            label: '速度与激情',
            checked: false
          },
          {
            id: 19,
            label: '碟中谍',
            checked: false
          }
        ]
      },
      {
        id: 20,
        label: '爱情片',
        checked: false,
        children: [
          {
            id: 21,
            label: '泰坦尼克号',
            checked: false
          },
          {
            id: 22,
            label: '罗密欧与朱丽叶',
            checked: false
          }
        ]
      }
    ]
  }
])

function updateNode(checked) {
  console.log('new parent state:', checked)
}
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  place-items: center;
}
</style>
