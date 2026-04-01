// demo12
import { ref } from "vue";
import { checkEffect } from "../utils/checkEffect.js";

let state = ref({ a: 1 });
const k = state.value;
const n = k.a;
checkEffect(() => {
  state.value.a; // 收集依赖 value 及 a 
});

Promise.resolve()
  .then(() => (state.value = { a: 1 }))  // 派发更新
  .then(() => (state.value.a = 2));  // 派发更新
