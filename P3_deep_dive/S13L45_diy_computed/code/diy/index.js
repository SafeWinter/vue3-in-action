// 测试文件
import { reactive } from "./reactive.js";
import { computed } from './computed.js';
import effect from './effect/effect.js';

window.reactive = reactive;
window.computed = computed
window.effect = effect

/* 控制台测试内容：
const state = reactive({
  a: 1,
  b: 2,
});
const sum = computed(() => {
  console.log("执行了 sum 计算");
  return state.a + state.b;
});

effect(() => {
  // 假设这个是渲染函数，依赖了 sum 这个计算属性
  console.log("This is render function depended on sum:", sum.value);
});

state.a++

----控制台运行结果----
执行了 sum 计算
This is render function depended on sum: 3
通过 scheduler 触发依赖
执行了 sum 计算
This is render function depended on sum: 4
<- 1
*/