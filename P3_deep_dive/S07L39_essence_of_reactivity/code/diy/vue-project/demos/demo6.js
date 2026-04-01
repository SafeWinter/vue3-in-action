// demo6
import { ref } from "vue";
import { checkEffect } from "../utils/checkEffect.js";

let state = ref({ a: 1 });
const k = state.value;
let n = k.a;
checkEffect(() => {
  state;
  state.value;
  state.value.a;
  n;
});

state = 100; // 不要重新运行
