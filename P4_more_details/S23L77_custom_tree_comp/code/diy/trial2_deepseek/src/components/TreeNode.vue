<template>
  <div class="tree-node">
    <div class="node-content" :style="{ paddingLeft }" @click.stop="handleExpandToggle">
      <span class="expand-icon" v-if="hasChildren">
        <Transition :name="transition ? 'expand' : void 0" mode="out-in">
          <span :key="state.expanded">
            {{ state.expanded ? '▼' : '▶' }}
          </span>
        </Transition>
      </span>
      <span v-else class="expand-placeholder"></span>

      <!-- 修正：使用 .prop 修饰符绑定 indeterminate -->
      <input
        v-if="showCheckbox"
        type="checkbox"
        :checked="state.checked"
        :indeterminate.prop="state.indeterminate"
        :disabled="node.disabled"
        @click.stop
        @change="onCheckChange"
      />

      <span class="node-label">{{ node.label }}</span>
    </div>

    <Transition :name="transition ? 'slide-fade' : undefined">
      <div v-if="hasChildren && state.expanded" class="children-list">
        <TreeNode
          v-for="child in node.children"
          :key="getNodeKey(child)"
          :node="child"
          :level="level + 1"
          :show-checkbox="showCheckbox"
          :transition="transition"
          :node-key="nodeKey"
          :state-map="stateMap"
          :parent-key="currentKey"
          @update:checked="handleChildCheck"
          @toggle-expand="handleChildToggle"
        />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'

const props = defineProps({
  node: { type: Object, required: true },
  level: { type: Number, default: 0 },
  showCheckbox: Boolean,
  transition: Boolean,
  nodeKey: String,
  stateMap: Object,
  parentKey: { default: null }
})

const emit = defineEmits(['update:checked', 'toggle-expand'])

const context = inject('treeContext')
const getNodeKey = context.getNodeKey
const currentKey = computed(() => getNodeKey(props.node))
const paddingLeft = computed(() => `${props.level * 20}px`)

const state = computed(() => {
  return (
    props.stateMap?.[currentKey.value] || { checked: false, indeterminate: false, expanded: true }
  )
})

const hasChildren = computed(() => {
  return props.node.children && props.node.children.length > 0
})

const onCheckChange = (event) => {
  emit('update:checked', currentKey.value, event.target.checked)
}

const handleExpandToggle = () => {
  if (hasChildren.value) {
    emit('toggle-expand', currentKey.value)
  }
}

const handleChildCheck = (key, checked) => {
  emit('update:checked', key, checked)
}

const handleChildToggle = (key) => {
  emit('toggle-expand', key)
}
</script>

<style scoped>
/* 样式保持不变 */
.tree-node {
  line-height: 1.8;
}
.node-content {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 0;
}
.node-content:hover {
  background-color: #f5f7fa;
}
.expand-icon {
  display: inline-block;
  width: 20px;
  text-align: center;
  font-size: 12px;
  color: #606266;
}
.expand-placeholder {
  width: 20px;
}
.node-label {
  margin-left: 6px;
  font-size: 14px;
}
.children-list {
  overflow: hidden;
}

.slide-fade-enter-active {
  transition: all 0.2s ease;
}
.slide-fade-leave-active {
  transition: all 0.15s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
