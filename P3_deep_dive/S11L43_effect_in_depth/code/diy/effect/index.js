let activeEffect = null; // 记录当前的函数
const depsMap = new Map(); // 保存依赖关系

function track(target, key) {
  // 建立依赖关系
  if(!depsMap.has(key)) {
    depsMap.set(key, new Set()); // 创建一个新的集合
  }
  let deps = depsMap.get(key); // 根据属性值去拿依赖的函数集合

  // 将依赖的函数添加到集合里面
  deps.add(activeEffect);
  console.log(depsMap);
}

function trigger(target, key) {
  // 这里面就需要运行依赖的函数
  const deps = depsMap.get(key);
  deps && deps.forEach((effect) => effect());
}

// 原始对象
const data = {
  a: 1,
  b: 2,
  c: 3,
};
// 代理对象
const state = new Proxy(data, {
  get(target, key) {
    track(target, key); // 进行依赖收集
    return Reflect.get(target, key);
  },
  set(target, key, value) {
    const res = Reflect.set(target, key, value);
    trigger(target, key); // 派发更新
    return res;
  },
});

/**
 *
 * @param {*} fn 回调函数
 */
function effect(fn) {
  const environment = () => {
    activeEffect = environment;
    fn();
    activeEffect = null;
  };
  environment();
}

effect(() => {
  if (state.a === 1) {
    state.b;
  } else {
    state.c;
  }
  console.log("执行了函数");
});
state.a = 10;
