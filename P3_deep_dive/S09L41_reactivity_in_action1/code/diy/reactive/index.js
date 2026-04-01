// 测试文件
import { reactive } from "./reactive.js";

const obj = window.obj = {
  a: 1,
  b: 2,
  c: {
    name: "张三",
    age: 18,
  },
};

const proxyObj = window.proxyObj = reactive(obj);

// get
// proxyObj.a;
// proxyObj.c.name;

// set
// proxyObj.b = 2;
// proxyObj.b = 3;
// proxyObj.c.age = 19;

// delete
// delete proxyObj.a;

// has
// 'a' in proxyObj;

// ownKeys
// const keys = Object.keys(proxyObj);
// for (const key in keys) {
//   console.log(key, keys[key]);
// }

// add
// proxyObj.d = 4;