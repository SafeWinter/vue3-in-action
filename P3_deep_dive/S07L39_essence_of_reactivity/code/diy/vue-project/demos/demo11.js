// demo11
import { ref } from "vue";
import { checkEffect } from "../utils/checkEffect.js";

let state = ref({ a: 1 });
const k = state.value;
const n = k.a;
checkEffect(() => {
  state.value.a; // value、a
});

Promise.resolve()
  .then(() => (state.value = { a: 1 })) // 要重新运行
  .then(() => (k.a = 3)); // 这里不会重新运行，因为前面修改了 state.value，不再是同一个代理对象
