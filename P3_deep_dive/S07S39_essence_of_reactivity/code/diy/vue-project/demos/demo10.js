// demo10
import { ref } from "vue";
import { checkEffect } from "../utils/checkEffect.js";

let state = ref({ a: 1 });
const k = state.value;
const n = k.a;
checkEffect(() => {
  state;
  state.value.a; // value、a
  n;
  // console.log(state.value.a);  // 用于验证同步逻辑中的 k.a = 2 不派发更新
});

Promise.resolve()
  .then(() => (state.value.a = 2))
  .then(() => (k.a = 3))
  .then(() => (k.a = 2));

// 同步逻辑对比：
// state.value.a = 2
// // k.a = 3
// k.a = 2
