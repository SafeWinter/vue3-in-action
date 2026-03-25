import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  // 定义数据状态
  state: () => {
    return {
      count: 0
    }
  },
  // 定义了修改数据状态的两个方法
  actions: {
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    }
  }
})
