// 测试文件
import { reactive } from "./reactive.js";
import { computed } from './computed.js';

const obj = window.obj = {
  a: 1,
  b: 2,
  c: {
    name: "张三",
    age: 18,
  },
};

const state = window.state = reactive(obj);

window.computed = computed

/* 控制台测试内容：
const sum = computed(() => {
  console.log('执行了 sum 计算');
  return state.a + state.b
})
console.log(sum.value)
console.log(sum.value)
console.log(sum.value)
console.log('-------------')
state.a = 2
console.log(sum.value)
console.log(sum.value)
console.log(sum.value)
----控制台运行结果----
执行了 sum 计算
3
3
3
-------------
通过 scheduler 触发依赖
执行了 sum 计算
4
4
4
*/