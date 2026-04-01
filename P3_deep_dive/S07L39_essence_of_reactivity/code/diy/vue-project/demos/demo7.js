// demo7
import { ref } from "vue";
import { checkEffect } from "../utils/checkEffect.js";

const state = ref({ a: 1 });
const k = state.value;
const n = k.a;
checkEffect(() => {
  state;
  state.value; // value 会被收集
  n;
});

state.value.a = 100; // 不会派发更新
