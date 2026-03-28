// 先写一个迷你版的 ref 和 reactive 的实现

function isObject(val) {
  return typeof val === "object" && val !== null;
}
class RefImpl {
  constructor(value) {
    // 简单判断是否是对象
    this._value = isObject(value) ? reactive(value) : value;
  }
  get value() {
    console.log("拦截到了 value 属性的 get 操作");
    return this._value;
  }
  set value(newValue) {
    console.log("拦截到了 value 属性的 set 操作");
    this._value = newValue;
  }
}
function ref(val) {
  return new RefImpl(val);
}

/**
 * 做深层代理处理
 * @param {*} obj
 */
function deepProxy(obj) {
  return new Proxy(obj, {
    get(target, key) {
      console.log(`拦截到了${key}属性的get操作`);
      if (isObject(target[key])) {
        // 说明是对象，需要递归代理
        return deepProxy(target[key]);
      }
      return target[key];
    },
    set(target, key, value) {
      console.log(`拦截到了${key}属性的set操作`);
      target[key] = value;
      return true;
    },
    deleteProperty(target, key) {
      console.log(`拦截到了${key}属性的delete操作`);
      delete target[key];
      return true;
    },
  });
}

function reactive(obj) {
  // 进行一个代理
  return deepProxy(obj);
}

// let state = ref(1);
// state; // 不会拦截
// console.log(state); // 不会拦截
// console.log(state.value); // 会拦截，因为访问了 value 属性
// console.log(state.a); // 不会拦截
// state.a = 3; // 不会拦截
// state.value = 3; // 会拦截
// delete state.value; // 不会拦截
// state = 3; // 不会拦截


// let state = ref({ a: 1 });
// state; // 不会拦截
// console.log(state); // 不会拦截
// console.log(state.value); // 会拦截
// console.log(state.a); // 不会拦截
// console.log(state.value.a); // 会拦截，拦截到 value 和 a 属性的 get 操作
// state.a = 3; // 不会拦截
// state.value.a = 3; // 会拦截，value 的 get 操作，a 属性的 set 操作
// delete state.value.a; // 会拦截，value 的 get 操作，a 属性的 delete 操作
// state.value = 3; // 会拦截，value 的 set 操作
// delete state.value; // 不会拦截
// state = 3; // 不会拦截

// let state = reactive({});
// state; // 不会拦截
// console.log(state); // 不会拦截
// console.log(state.a); // 会拦截
// state.a = 3; // 会拦截
// state.a = {
//   b: {
//     c: 3,
//   },
// }; // 会拦截，拦截到 a 属性的 set 操作
// console.log("-------------");
// console.log(state.a.b.c); // 会拦截
// delete state.a.b; // 会拦截 a 是 get 操作，b 是 delete 操作

// const state = ref({ a: 1 });
// const k = state.value; 
// console.log("-------------");
// console.log(k); // 不会拦截，k 相当于是一个 proxy 对象，没有针对成员进行操作
// k.a = 3; // 会拦截，因为 k 是一个 proxy 对象，对 k 的成员进行操作会触发代理的 set 操作
// const n = k.a; // 会拦截，因为访问了 k 的成员 a，会触发代理的 get 操作
// console.log("-------------");
// console.log(n); 

const arr = reactive([1, 2, 3]);
arr; // 不会拦截
arr.length; // 会拦截
arr[0]; // 会拦截，拦截 0 的 get 操作
arr[0] = 3; // 会拦截，拦截 0 的 set 操作
arr.push(4); // 会被拦截