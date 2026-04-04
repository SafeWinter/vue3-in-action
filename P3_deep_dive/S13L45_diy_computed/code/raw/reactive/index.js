// 测试文件
import { computed } from "./computed.js";
import { reactive } from "./reactvie.js";
import { effect } from "./effect/effect.js";

const state = reactive({
  a: 1,
  b: 2,
});
const sum = computed(() => {
  console.log("计算属性进行计算了");
  return state.a + state.b;
});

effect(() => {
  // 假设这个是渲染函数，依赖了 sum 这个计算属性
  console.log("render", sum.value);
});

state.a = 100;