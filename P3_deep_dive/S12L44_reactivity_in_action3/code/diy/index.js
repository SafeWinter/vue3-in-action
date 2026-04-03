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

window.effect = effect;

/* 控制台测试内容1：
const eff = effect(() => {
  if (state.a === 1) {
    state.b;
  } else {
    state.c;
  }
  console.log("执行了函数");
}, {lazy: true});
eff();
state.a = 10
----控制台运行结果----
收集器：代理对象 a 属性的 get 操作被拦截
收集器：代理对象 b 属性的 get 操作被拦截
执行了函数
触发器：代理对象 a 属性的 set 操作被拦截
收集器：代理对象 a 属性的 get 操作被拦截
收集器：代理对象 c 属性的 get 操作被拦截
执行了函数
<- 10
*/

/* 控制台测试内容2：
const eff = effect(() => {
  if (state.a === 1) {
    state.b;
  } else {
    state.c;
  }
  console.log("执行了函数");
}, {lazy: true});
state.a = 10
eff()
----控制台运行结果----
触发器：代理对象 a 属性的 set 操作被拦截
收集器：代理对象 a 属性的 get 操作被拦截
收集器：代理对象 c 属性的 get 操作被拦截
执行了函数
<- undefined
*/