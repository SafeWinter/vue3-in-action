<template>
  <!-- 外层容器 -->
  <div ref="list" class="infinite-list-container" @scroll="scrollHandler">
    <!-- 该元素高度为总列表的高度，目的是为了形成滚动 -->
    <div ref="listHeight" class="infinite-list-phantom"></div>
    <!-- 该元素为可视区域，里面就是一个一个列表项 -->
    <div ref="content" class="infinite-list">
      <div class="infinite-list-item" ref="items" v-for="item in visibleData" :key="item.id">
        {{ item.value }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUpdated, nextTick } from 'vue'
const props = defineProps({
  listData: {
    type: Array,
    default: () => []
  },
  // 预估高度
  estimatedItemSize: {
    type: Number,
    required: true
  }
})

const estimated = computed(() => props.estimatedItemSize)

// 引用 container 元素
const list = ref(null)
// 可视区域高度
const screenHeight = ref(0)
// 开始索引
const startIndex = ref(0)
// 结束索引
const endIndex = ref(0)

// 用于创建列表项元素的引用
const items = ref([])
// 用于引用 phantom 元素
const listHeight = ref(null)
// 用于引用list元素
const content = ref(null)

// 缓存列表，用于存储列表项的位置信息
let positions = []
// 用于初始化每个列表项的位置信息
const initPostions = () => {
  positions = props.listData.map((_, index) => ({
    index, // 列表项的下标
    height: estimated.value, // 列表项的高度，这里采用预估的高度
    top: index * estimated.value, // 列表项的顶部位置，根据下标和预估高度计算
    bottom: (index + 1) * estimated.value // 列表项的底部位置，也是根据下标和预估高度计算
  }))
}

// 列表总高度
// 可显示的列表项数（只能预估）
const visibleCount = computed(() => Math.ceil(screenHeight.value / estimated.value))
// 列表显示数据
const visibleData = computed(() =>
  props.listData.slice(startIndex.value, Math.min(endIndex.value, props.listData.length))
)

// 关于查找 startIndex 的方法，可以使用二分查找法来进行优化
const binarySearch = (list, value) => {
  let start = 0
  let end = list.length - 1
  let targetIndex = null
  while (start <= end) {
    let midIndex = parseInt((start + end) / 2)
    let midValue = list[midIndex].bottom
    if (midValue === value) {
      return midIndex + 1
    } else if (midValue < value) {
      start = midIndex + 1
    } else if (midValue > value) {
      if (targetIndex === null || targetIndex > midIndex) {
        targetIndex = midIndex
      }
      end = end - 1
    }
  }
  return targetIndex
}
const getStartIndex = (scrollTop) => {
  // // 找到第一个底部位置大于滚动高度的列表项
  // // 高度固定版本
  // let item = positions.find((i) => i && i.bottom > scrollTop)
  // return item.index

  // 高度不固定版本
  return binarySearch(positions, scrollTop)
}

// 滚动对应的处理函数
const scrollHandler = () => {
  // 这里要做的事情主要就是更新各项数据
  const scrollTop = list.value.scrollTop
  startIndex.value = getStartIndex(scrollTop)
  endIndex.value = startIndex.value + visibleCount.value
  setStartOffset()
}

onMounted(() => {
  // 获取可视区域高度
  screenHeight.value = list.value.clientHeight
  startIndex.value = 0
  endIndex.value = startIndex.value + visibleCount.value
  // 在组件挂载的时候，初始化列表项的位置信息
  initPostions()
})

const updateItemsSize = () => {
  items.value.forEach((node, index) => {
    // 获取列表项实际的高度
    const { height: newHeight } = node.getBoundingClientRect()
    // 计算预估高度和真实高度的差值
    const oldHeight = positions[index].height // 拿到该项的预估高度
    const dH = newHeight - oldHeight
    if (dH) {
      // 如果存在差值，那么就需要更新位置信息
      positions[index].bottom += dH
      positions[index].height = newHeight
      // 接下来需要更新后续所有列表项的位置
      for (let i = index + 1; i < positions.length; i++) {
        positions[i].top = positions[i - 1].bottom
        positions[i].bottom += dH
      }
    }
  })
}

// 更新偏移量
const setStartOffset = () => {
  const startOffset = startIndex.value >= 1 ? positions[startIndex.value - 1].bottom : 0
  content.value.style.transform = `translateY(${startOffset}px)`
}

onUpdated(() => {
  // 这里之所以使用 nextTick，是为了确保 DOM 更新完毕后再去获取列表项的位置信息
  nextTick(() => {
    if (!items.value || !items.value.length) return
    // 1. 更新列表项的高度
    updateItemsSize()
    // 2. 更新虚拟列表的高度
    listHeight.value.style.height = positions[positions.length - 1].bottom + 'px'
    // 3. 更新列表的偏移量
    setStartOffset()
  })
})

watch(() => props.listData, initPostions)
</script>

<style scoped>
.infinite-list-container {
  height: 100%;
  overflow: auto;
  position: relative;
  -webkit-overflow-scrolling: touch;
}

.infinite-list-phantom {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  z-index: -1;
}

.infinite-list {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  text-align: center;
}

.infinite-list-item {
  padding: 10px;
  color: #555;
  box-sizing: border-box;
  border-bottom: 1px solid #999;
}
</style>
