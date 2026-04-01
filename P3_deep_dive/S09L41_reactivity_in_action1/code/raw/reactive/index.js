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

const proxyObj = reactive(obj);

for(let key in proxyObj){}