// demo2
import { ref } from "vue";
import { checkEffect } from "../utils/checkEffect.js";

const state = ref({ a: 1 });
const k = state.value;
const n = k.a;
checkEffect(() => {
  state;
  state.value; // value
  state.value.a; // value a
  n;
});

state.value; // 不会重新运行
state.value.a = 1; // 不会重新运行
