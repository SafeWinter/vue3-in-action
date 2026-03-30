// demo8
import { ref } from "vue";
import { checkEffect } from "../utils/checkEffect.js";

let state = ref({ a: 1 });
const k = state.value;
const n = k.a;
checkEffect(() => {
  state.value.a; // value 和 a 被收集
});

// state.value = {}; // 会派发更新
state.value = {a: 1}; // 会派发更新
