// demo1
import { ref } from 'vue'
import { checkEffect } from '../utils/checkEffect.js'

const state = ref({ a: 1 })
const k = state.value
const n = k.a
// 监控函数
checkEffect(() => {
  // 首先判断依赖关系
  state; // 没有依赖关系产生
  state.value; // 会产生依赖关系，依赖 value 属性
  state.value.a; // 会产生依赖关系，依赖 value 和 a 属性
  n; // 没有依赖关系
})

// 测试更新
state.value = { a: 3 } // 要派发更新
