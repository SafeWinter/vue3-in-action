// demo4
import { ref } from "vue";
import { checkEffect } from "../utils/checkEffect.js";

const state = ref({ a: 1 });
const k = state.value;
let n = k.a;
checkEffect(() => {
  state;
  state.value;
  state.value.a;
  n;
});

// n++; // 不会派发更新
k.a++; // 会派发更新
