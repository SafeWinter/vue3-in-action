// demo13
import { ref } from "vue";
import { checkEffect } from "../utils/checkEffect.js";

let state = ref({ a: 1 });
const k = state.value;
const n = k.a;
checkEffect(() => {
  state.value.a; // 深度拦截 value 和 a 属性
});

Promise.resolve()
  .then(() => (state.value = { a: 1 })) // 派发更新
  .then(() => (state.value.a = 1)); // 不派发更新，因为值没有变化