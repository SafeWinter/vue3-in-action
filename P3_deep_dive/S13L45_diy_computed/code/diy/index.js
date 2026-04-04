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

/* 控制台测试内容：
function fn() {
  state.a = state.a + 1;
  console.log("执行了 fn");
}
const effectFn = effect(fn, {
  lazy: true,
  scheduler: (eff) => {
    // 由我用户来决定如何处理依赖的函数
    setTimeout(() => {
      console.log('1 秒后通过 scheduler 自主控制依赖函数的执行：');
      eff();
    }, 1000);
  },
});
effectFn(); // 只有在执行了这个函数之后，才会建立依赖关系
state.a++;

----控制台运行结果----

收集器：代理对象 a 属性的 get 操作被拦截
触发器：代理对象 a 属性的 set 操作被拦截
执行了 fn
收集器：代理对象 a 属性的 get 操作被拦截
track.js:25 未通过 trigger 触发读取拦截，不收集依赖
触发器：代理对象 a 属性的 set 操作被拦截
通过 scheduler 触发依赖
<- 2
(1 秒后)
1 秒后通过 scheduler 自主控制依赖函数的执行：
收集器：代理对象 a 属性的 get 操作被拦截
触发器：代理对象 a 属性的 set 操作被拦截
执行了 fn
*/