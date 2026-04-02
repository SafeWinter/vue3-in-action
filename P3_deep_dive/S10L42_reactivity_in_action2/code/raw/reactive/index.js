// 测试文件
import { reactive } from "./reactvie.js";

const obj = {
  a: 1,
  b: 2,
  c: {
    name: "张三",
    age: 18,
  },
};

const arr = [1, obj, 3];

const proxyArr = reactive(arr);

// 测试读取行为
// proxyArr[0]
// proxyArr.length;
// for(let key in proxyArr){
//   proxyArr[key];
// }

// for (let i = 0; i < proxyArr.length; i++) {
//   proxyArr[i];
// }

// console.log(proxyArr.includes(1));
// console.log(proxyArr.indexOf(1));
// console.log(proxyArr.lastIndexOf(1));

// console.log(proxyArr.includes(obj));
// console.log(proxyArr.indexOf(obj));
// console.log(proxyArr.lastIndexOf(obj));

// 测试写入行为
// proxyArr[0] = 100;
// proxyArr[5] = 100; // 这里会涉及到隐式的改变 length，但是 length 的改变不会触发 get 操作

// proxyArr.length = 1;

proxyArr.push(4);