// demo14
import { ref } from "vue";
import { checkEffect } from "../utils/checkEffect.js";

let state = ref({ a: 1 });
const k = state.value;
checkEffect(() => {
  state.value.a; // value、a
  k.a; // 返回的 proxy 对象的 a 成员
});

Promise.resolve()
  .then(() => (state.value = { a: 1 }))
  .then(() => (state.value.a = 4))
  .then(() => (k.a = 3));
