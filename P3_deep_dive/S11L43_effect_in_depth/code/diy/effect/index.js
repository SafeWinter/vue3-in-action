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
  activeEffect.deps.push({key, depSet: deps}); // activeEffect 和 deps 是多对多的关系
  console.log(depsMap);
}

function trigger(target, key) {
  // 这里面就需要运行依赖的函数
  const deps = depsMap.get(key);
  deps && deps.forEach((effect) => effect());
}

function cleanup(environment) {
  let deps = environment.deps; // 拿到当前环境函数的依赖（是个数组）
  if (deps.length) {
    deps.forEach(({key, depSet}) => {
      depSet.delete(environment);
      if (depSet.size === 0) { 
        depsMap.delete(key);
      }
    });
    deps.length = 0;
  }
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
    cleanup(environment); // 在运行副作用函数之前先进行清理，避免重复收集依赖
    activeEffect = environment;
    fn();
    activeEffect = null;
  };
  environment.deps = []; // 用来存储当前环境函数的依赖
  environment();
}

effect(() => {
  if (state.a === 1) {
    state.b;
  } else {
    state.c;
  }
  console.log("执行了函数1");
});
effect(() => {
  console.log(state.c);
  console.log("执行了函数2");
});
state.a = 2;
