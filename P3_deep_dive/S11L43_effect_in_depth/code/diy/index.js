import {reactive, effect} from 'vue'

const state = reactive({
    a: 1,
    b: 2,
    c: 3,
})

effect(() => {
  if (state.a === 1) {
    state.b;
    console.log("执行了b");
  } else {
    state.c;
    console.log("执行了c");
  }
  console.log("执行了函数");
})

console.log('-----------');
state.a = 10