// demo9
import { ref } from "vue";
import { checkEffect } from "../utils/checkEffect.js";

const state = ref({ a: 1 });
checkEffect(() => {
  state.value.a = 2; // 注意这里的依赖仅仅只有 value 属性
});

// state.value.a = 100; // 不会派发更新
state.value = {}; // 会派发更新
