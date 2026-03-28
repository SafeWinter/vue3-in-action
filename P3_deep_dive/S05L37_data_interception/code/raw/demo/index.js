// function Student() {
//   let stuName = "张三";
//   Object.defineProperty(this, "name", {
//     get() {
//       return stuName;
//     },
//     set(value) {
//       if (!isNaN(value)) {
//         stuName = "张三";
//       } else {
//         stuName = value;
//       }
//     },
//   });
// }
// const stu = new Student();
// console.log(stu.name);
// stu.name = "李四";
// console.log(stu.name);
// stu.name = 100;
// console.log(stu.name);

// function Student() {
//   const obj = {
//     name: "张三",
//   };
//   return new Proxy(obj, {
//     get(obj, prop) {
//       return obj[prop] + "是个好学生";
//     },
//     set(obj, prop, value) {
//       if (!isNaN(value)) {
//         obj[prop] = "张三";
//       } else {
//         obj[prop] = value;
//       }
//     },
//   });
// }
// const stu = new Student(); // stu 拿到的就是代理对象
// console.log(stu.name); // 张三是个好学生
// stu.name = "李四";
// console.log(stu.name); // 李四是个好学生
// stu.name = 100;
// console.log(stu.name); // 张三是个好学生

// const obj = {};
// let _data = "这是一些数据";
// Object.defineProperty(obj, "data", {
//   get() {
//     console.log("读取data的操作被拦截了");
//     return _data;
//   },
// });
// console.log(obj.data);

// const obj = {
//   data: "这是一些数据",
//   name: "张三"
// };
// const p = new Proxy(obj, {
//   get(obj, prop) {
//     console.log(`${prop}的读取操作被拦截了`);
//     return obj[prop];
//   },
// });
// console.log(p.data);
// console.log(p.name);

// const obj = {};
// let _data = "这是一些数据";
// Object.defineProperty(obj, "data", {
//   get() {
//     console.log("读取data的操作被拦截了");
//     return _data;
//   },
//   set(value){
//     console.log("设置data的操作被拦截了");
//     _data = value;
//   }
// });
// obj.data = "这是新的数据";
// console.log(obj.data);

// const obj = {
//   data: "这是一些数据",
//   name: "张三"
// };
// const p = new Proxy(obj, {
//   get(obj, prop) {
//     console.log(`${prop}的读取操作被拦截了`);
//     return obj[prop];
//   },
//   set(obj, prop, value) {
//     // 前面相当于是拦截下这个操作后，我们要做的额外的操作
//     console.log(`${prop}的设置操作被拦截了`);
//     // 后面就是真实的操作
//     obj[prop] = value;
//   }
// });
// p.data = "这是新的数据";
// p.name = "李四";

const data = {
  level1: {
    level2: {
      value: 100,
    },
  },
};

// function deepDefineProperty(obj) {
//   for (let key in obj) {
//     // 首先判断是否是自身属性以及是否为对象
//     if (obj.hasOwnProperty(key) && typeof obj[key] === "object") {
//       // 递归处理
//       deepDefineProperty(obj[key]);
//     }
//     // 缓存一下属性值
//     let _value = obj[key];
//     Object.defineProperty(obj, key, {
//       get() {
//         console.log(`读取${key}属性`);
//         return _value;
//       },
//       set(value) {
//         console.log(`设置${key}属性`);
//         _value = value;
//       },
//       configurable: true,
//       enumerable: true,
//     });
//   }
// }
// deepDefineProperty(data);
// console.log(data.level1.level2.value);
// console.log("----------------");
// data.level1.level2.value = 200;
// data.a = 1;
// delete data.level1;

function deepProxy(obj) {
  return new Proxy(obj, {
    get(obj, prop) {
      console.log(`读取了${prop}属性`);
      if (typeof obj[prop] === "object") {
        // 递归的再次进行代理
        return deepProxy(obj[prop]);
      }
      return obj[prop];
    },
    set(obj, prop, value) {
      console.log(`设置了${prop}属性`);
      if (typeof value === "object") {
        return deepProxy(value);
      }
      obj[prop] = value;
    },
    deleteProperty(obj, prop) {
      console.log(`删除了${prop}属性`);
      delete obj[prop];
    },
    getPrototypeOf(obj) {
      console.log("拦截获取原型");
      return Object.getPrototypeOf(obj);
    },
    setPrototypeOf(obj, proto) {
      console.log("拦截设置原型");
      return Object.setPrototypeOf(obj, proto);
    },
  });
}
const proxyData = deepProxy(data);
// console.log(proxyData.level1.level2.value);
// console.log("----------------");
// proxyData.level1.level2.value = 200;
// proxyData.a = 1;
// delete proxyData.level1;
Object.getPrototypeOf(proxyData);
Object.setPrototypeOf(proxyData, {});
