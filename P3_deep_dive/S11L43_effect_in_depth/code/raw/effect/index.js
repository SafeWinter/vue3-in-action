let activeEffect = null; // 记录当前的函数
const depsMap = new Map(); // 保存依赖关系
const effectStack = []; // 保存函数栈

function track(target, key) {
  // 建立依赖关系
  if (activeEffect) {
    let deps = depsMap.get(key); // 根据属性值去拿依赖的函数集合
    if (!deps) {
      deps = new Set(); // 创建一个新的集合
      depsMap.set(key, deps); // 将集合存入 depsMap
    }
    // 将依赖的函数添加到集合里面
    deps.add(activeEffect);
    activeEffect.deps.push(deps); // 将当前的依赖的集合添加到函数里面
  }
  console.log(depsMap);
}

function trigger(target, key) {
  // 这里面就需要运行依赖的函数
  const deps = depsMap.get(key);
  if (deps) {
    const effectsToRun = new Set(deps);
    effectsToRun.forEach((effect) => effect());
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
    return target[key];
  },
  set(target, key, value) {
    target[key] = value;
    trigger(target, key); // 派发更新
    return true;
  },
});

/**
 *
 * @param {*} fn 回调函数
 */
function effect(fn) {
  const environment = () => {
    activeEffect = environment;
    // 将环境函数推入栈（其实就是在模拟真实的函数栈）
    effectStack.push(environment);
    // 清理依赖
    cleanup(environment);
    fn();
    // activeEffect = null;
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
  };
  environment.deps = []; // 用来记录该环境函数在哪些集合里面
  environment();
}

function cleanup(environment) {
  let deps = environment.deps; // 拿到当前环境函数的依赖数组
  if (deps.length) {
    deps.forEach((dep) => {
      dep.delete(environment); // 删除依赖
      if (dep.size === 0) {
        for (let [key, value] of depsMap) {
          if (value === dep) {
            depsMap.delete(key);
          }
        }
      }
    });
    deps.length = 0;
  }
}

effect(() => {
  effect(() => {
    // 一旦嵌套的函数执行完毕，之后的依赖都收集不到
    effect(() => {
      state.c;
      console.log("执行了函数3");
    });
    state.a;
    console.log("执行了函数2");
  });
  state.b;
  console.log("执行了函数1");
});
