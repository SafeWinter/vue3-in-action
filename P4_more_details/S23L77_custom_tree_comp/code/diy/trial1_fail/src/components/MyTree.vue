<template>
  <ul class="my-tree-container" v-if="Array.isArray(data) && data.length">
    <li v-for="item in data" :key="item.id">
      <div :class="{ leaf: isLeaf(item) }">
        <span
          v-if="!isLeaf(item)"
          :class="['triangle', { collapsed: isClosed[item.id] }]"
          @click="toggleTriangle(item)"
          >▲</span
        >
        <input
          :id="item.id"
          v-if="showCheckbox"
          type="checkbox"
          v-model="item.checked"
          @change="(ev) => handleClick(item, data)"
        />
        <label for="item.id">{{ item.label }}</label>
      </div>
      <transition
        v-if="transition"
        name="expand"
        @before-enter="beforeEnter"
        @enter="enter"
        @after-enter="afterEnter"
        @before-leave="beforeLeave"
        @leave="leave"
        @after-leave="afterLeave"
      >
        <my-tree
          v-if="!isLeaf(item) && isClosed[item.id]"
          :data="item.children"
          :show-checkbox="showCheckbox"
          :transition="transition"
          @update:child-check="refreshParent"
        />
      </transition>
      <div v-else>
        <my-tree
          v-if="!isLeaf(item) && isClosed[item.id]"
          :data="item.children"
          :show-checkbox="showCheckbox"
          :transition="transition"
          @update:child-check="refreshParent"
        />
      </div>
    </li>
  </ul>
</template>

<script setup>
import { ref, onMounted } from 'vue'
defineOptions({
  name: 'MyTree'
})

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  showCheckbox: {
    type: Boolean,
    default: true
  },
  transition: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['update:child-check'])
onMounted(
  () =>
    (isClosed.value = props.data.reduce((acc, e) => {
      if (!acc[e.id]) {
        acc[e.id] = false
      }
      return acc
    }, {}))
)

const isClosed = ref({})

function refreshParent(checked) {
  console.log('children state:', checked)
  // 获取父节点 item
  // item.checked = checked
  parent.checked = checked
}

function recursiveMark(children, checked) {
  children.forEach((node) => {
    node.checked = checked
    if (!isLeaf(node)) {
      recursiveMark(node.children, checked)
    }
  })
}

function handleClick(item, siblings) {
  const checked = item.checked
  if (!isLeaf(item)) {
    recursiveMark(item.children, checked)
  }
  const allChecked = siblings.every((e) => e.checked)
  emit('update:child-check', allChecked)
}

function isLeaf(item) {
  return !(Array.isArray(item.children) && item.children.length > 0)
}

function toggleTriangle(item) {
  if (typeof isClosed.value[item.id] === 'boolean') {
    isClosed.value[item.id] = !isClosed.value[item.id]
  } else {
    isClosed.value[item.id] = true // 默认收起
  }
}

// -------------------------------
// 过渡动画相关的方法
function beforeEnter(el) {
  el.style.maxHeight = '0'
  el.style.opacity = '0'
  el.style.overflow = 'hidden'
}

function enter(el) {
  el.style.transition = 'max-height 0.3s ease, opacity 0.3s ease'
  el.style.maxHeight = el.scrollHeight + 'px'
  el.style.opacity = '1'
}

function afterEnter(el) {
  el.style.maxHeight = 'none'
}

function beforeLeave(el) {
  el.style.maxHeight = el.scrollHeight + 'px'
  el.style.opacity = '1'
  el.style.overflow = 'hidden'
}

function leave(el) {
  el.style.transition = 'max-height 0.3s ease, opacity 0.3s ease'
  el.style.maxHeight = '0'
  el.style.opacity = '0'
}

function afterLeave(el) {
  el.style.maxHeight = 'none'
}
</script>

<style scoped>
.my-tree-container {
  padding-left: 2ch;
}
li {
  list-style-type: none;
}
label[for],
.triangle {
  user-select: none;
}
.triangle {
  font-style: normal;
  display: inline-block;
  transform: rotate(90deg);
}
.collapsed {
  transform: rotate(180deg);
}
.leaf {
  margin-inline-start: 2ch;
}
</style>
