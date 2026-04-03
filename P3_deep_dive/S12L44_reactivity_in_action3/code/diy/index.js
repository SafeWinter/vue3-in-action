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

const arr = [1, obj, 3]

const proxyArr = window.proxyArr = reactive(arr);

// 读取一个数组元素
// proxyArr[0]

// 读取数组长度
// proxyArr.length

// 遍历测试：for...of 循环
// for(let key in proxyArr) proxyArr[key]

// 遍历测试：for 循环
// for(let i = 0; i < proxyArr.length; i++) proxyArr[i]

// 数组方法测试：
// 1. includes
// proxyArr.includes(1)
// proxyArr.includes(3)

// 2. indexOf 与 lastIndexOf
// proxyArr.indexOf(1)
// proxyArr.lastIndexOf(1)

// 3. 查询对象时，检索失败
// proxyArr.includes(obj)
// proxyArr.indexOf(obj)
// proxyArr.lastIndexOf(obj)

// 隐式变更数组长度测试
// proxyArr[5] = 100