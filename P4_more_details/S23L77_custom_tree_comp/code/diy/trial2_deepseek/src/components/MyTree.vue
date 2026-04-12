<template>
  <div class="my-tree">
    <template v-for="node in data" :key="getNodeKey(node)">
      <tree-node
        :node="node"
        :show-checkbox="showCheckbox"
        :transition="transition"
        :node-key="nodeKey"
        :state-map="stateMap"
        :parent-key="null"
        @update:checked="handleNodeCheckChange"
        @toggle-expand="toggleExpand"
      />
    </template>
  </div>
</template>

<script setup>
import { reactive, watch, nextTick, provide } from 'vue'
import TreeNode from './TreeNode.vue'

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  showCheckbox: {
    type: Boolean,
    default: false
  },
  transition: {
    type: Boolean,
    default: false
  },
  nodeKey: {
    type: String,
    default: 'id'
  }
})

const emit = defineEmits(['update:child-check'])

// 响应式状态映射：key -> { checked, indeterminate, expanded }
const stateMap = reactive({})

// 父子关系映射：childKey -> parentKey
const parentMap = new Map()
// 节点映射：key -> node 对象 (便于快速查找)
const nodeMap = new Map()

// 生成节点唯一标识
const getNodeKey = (node) => {
  if (props.nodeKey in node) {
    return node[props.nodeKey]
  }
  // 降级处理：若没有指定字段，使用引用作为临时 key (仅限初始化)
  console.warn(`[MyTree] 节点缺少字段 "${props.nodeKey}"，将使用对象引用作为key，可能导致状态异常`)
  return Symbol.for(JSON.stringify(node))
}

// 初始化/重建内部状态
const buildState = (nodes, parentKey = null) => {
  for (const node of nodes) {
    const key = getNodeKey(node)
    nodeMap.set(key, node)

    // 记录父子关系
    parentMap.set(key, parentKey)

    // 初始化状态 (若已存在则保留expanded？重建时默认全部展开)
    if (!stateMap[key]) {
      stateMap[key] = {
        checked: node.checked ?? false,
        indeterminate: false,
        expanded: true // 默认展开
      }
    }

    if (node.children && node.children.length) {
      buildState(node.children, key)
    }
  }
}

// 监听 data 变化，重新构建状态
watch(
  () => props.data,
  (newData) => {
    // 清空旧映射
    parentMap.clear()
    nodeMap.clear()
    // 重建前清空状态
    for (const key of Object.keys(stateMap)) {
      delete stateMap[key]
    }
    buildState(newData)
    // 初始化后同步一次父节点状态
    nextTick(() => {
      syncAllParentStates()
      emitCheckedKeys()
    })
  },
  { immediate: true, deep: true }
)

// ========== 核心联动逻辑 ==========

// 设置节点选中状态 (会递归影响后代，并更新父链)
const setNodeChecked = (key, checked) => {
  const state = stateMap[key]
  if (!state) return

  state.checked = checked
  state.indeterminate = false // 明确选中或取消时，半选状态清除

  const node = nodeMap.get(key)
  if (node && node.children) {
    // 递归设置所有后代
    const setDescendants = (children) => {
      for (const child of children) {
        const childKey = getNodeKey(child)
        const childState = stateMap[childKey]
        if (childState) {
          childState.checked = checked
          childState.indeterminate = false
        }
        if (child.children) {
          setDescendants(child.children)
        }
      }
    }
    setDescendants(node.children)
  }

  // 向上更新父节点状态
  updateParentStates(key)
}

// 根据子节点状态更新当前节点父链
const updateParentStates = (childKey) => {
  let parentKey = parentMap.get(childKey)
  while (parentKey) {
    const parentState = stateMap[parentKey]
    const parentNode = nodeMap.get(parentKey)
    if (!parentState || !parentNode || !parentNode.children) break

    const childrenKeys = parentNode.children.map((child) => getNodeKey(child))

    let checkedCount = 0
    let hasIndeterminate = false
    const total = childrenKeys.length

    for (const cKey of childrenKeys) {
      const cState = stateMap[cKey]
      if (cState) {
        if (cState.checked) checkedCount++
        if (cState.indeterminate) hasIndeterminate = true
      }
    }

    if (checkedCount === total && total > 0) {
      parentState.checked = true
      parentState.indeterminate = false
    } else if (checkedCount === 0 && !hasIndeterminate) {
      parentState.checked = false
      parentState.indeterminate = false
    } else {
      parentState.checked = false
      parentState.indeterminate = true
    }

    parentKey = parentMap.get(parentKey)
  }
}

// 同步所有父节点状态 (用于初始化或数据变化后)
const syncAllParentStates = () => {
  for (const key of Object.keys(stateMap)) {
    const node = nodeMap.get(key)
    if (node && node.children && node.children.length > 0) {
      updateParentStates(key)
    }
  }
}

// 处理复选框点击
const handleNodeCheckChange = (key, checked) => {
  const node = nodeMap.get(key)
  if (node?.disabled) return

  setNodeChecked(key, checked)
  emitCheckedKeys()
}

// 切换展开/折叠
const toggleExpand = (key) => {
  const state = stateMap[key]
  if (state) {
    state.expanded = !state.expanded
  }
}

// 收集所有选中的 key 并触发事件
const emitCheckedKeys = () => {
  const checkedKeys = []
  for (const key in stateMap) {
    if (stateMap[key]?.checked) {
      checkedKeys.push(key)
    }
  }
  emit('update:child-check', checkedKeys)
}

// 提供方法给子组件使用
provide('treeContext', {
  getNodeKey,
  stateMap,
  parentMap,
  nodeMap,
  showCheckbox: props.showCheckbox,
  transition: props.transition,
  handleNodeCheckChange,
  toggleExpand
})
</script>

<style scoped>
.my-tree {
  font-family: system-ui, sans-serif;
  user-select: none;
}
</style>
