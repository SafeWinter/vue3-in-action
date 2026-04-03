// 测试文件
import { reactive } from "./reactive.js";
import effect from "./effect/effect.js";

const obj = window.obj = {
  a: 1,
  b: 2,
  c: {
    name: "张三",
    age: 18,
  },
};

const state = window.state = reactive(obj);

const fn = () => {
  console.log('running fn');
  state.a = state.a + 1;
}

effect(fn);