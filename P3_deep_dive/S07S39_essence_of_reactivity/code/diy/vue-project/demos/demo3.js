// demo3
import { ref } from "vue";
import { checkEffect } from "../utils/checkEffect.js";

const state = ref({ a: 1 });
const k = state.value;
const n = k.a;
checkEffect(() => {
  state;
  state.value; // value
  state.value.a; // value、a
  n;
});

k.a = 2; /* 这里相当于是操作了 proxy 对象的成员 a
            因此派发了更新 */
// 若注释掉 L12 的 state.value.a 则不会派发更新
