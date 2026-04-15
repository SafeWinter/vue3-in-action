<template>
  <div>
    <button @click="virtualizer.scrollToIndex(0)">scroll to the top</button>
    <span style="padding: 0 4px"></span>
    <button @click="virtualizer.scrollToIndex(sentences.length / 2)">scroll to the middle</button>
    <span style="padding: 0 4px"></span>
    <button @click="virtualizer.scrollToIndex(sentences.length - 1)">scroll to the end</button>
    <hr />
    <div ref="parentRef" class="list">
      <div
        :style="{
          height: `${totalSize}px`,
          width: '100%',
          position: 'relative'
        }"
      >
        <div
          :style="{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            transform: `translateY(${virtualRows[0]?.start ?? 0}px)`
          }"
        >
          <div
            v-for="virtualRow in virtualRows"
            :key="virtualRow.key"
            :data-index="virtualRow.index"
            ref="virtualItemEls"
            :class="virtualRow.index % 2 ? 'list-item-odd' : 'list-item-even'"
          >
            <div style="padding: 10px 0">
              <div>{{ sentences[virtualRow.index].value }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUpdated, ref, shallowRef } from 'vue'
import { useVirtualizer } from '@tanstack/vue-virtual'

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

const sentences = computed(() => props.listData)

const parentRef = ref(null)

const virtualizer = useVirtualizer({
  count: sentences.value.length,
  getScrollElement: () => parentRef.value,
  estimateSize: () => props.estimatedItemSize
})

const virtualRows = computed(() => virtualizer.value.getVirtualItems())

const totalSize = computed(() => virtualizer.value.getTotalSize())

const virtualItemEls = shallowRef([])

function measureAll() {
  virtualizer.value.measureElement(null)
  virtualItemEls.value
    .filter((el) => el)
    .map((el) => virtualizer.value.measureElement(el))
}

onMounted(measureAll)
onUpdated(measureAll)
</script>

<style>
.list {
  border: 1px solid #e6e4dc;
  max-width: 100%;
}

.list-item-even {
  background-color: #e6e4dc;
}

.list {
  height: 400px;
  width: 400px;
  overflow-y: auto;
  contain: strict;
  margin: 0 auto;
}
</style>
