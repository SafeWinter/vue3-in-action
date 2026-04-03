let activeEnv = null; // 记录当前的函数
const keyEnvsetMap = new Map(); // 保存依赖关系 key -> Set(env1, env2)

function track(target, key, currEnv) {
  // 建立依赖关系
  if (!keyEnvsetMap.has(key)) {
    keyEnvsetMap.set(key, new Set()); // 将集合存入 depsMap
  }
  // 将依赖的函数添加到集合里面
  const envSet = keyEnvsetMap.get(key);
  envSet.add(currEnv)
  currEnv.envSets.push({key, envSet}) // currEnv 和 envSet 是多对多的关系
  console.log(keyEnvsetMap);
}

function trigger(target, key) {
  // 这里面就需要运行依赖的函数
  const envSet = keyEnvsetMap.get(key);
  if (envSet) {
    console.log('running trigger');
    // envSet.forEach(env => env());  // 直接在这里运行会有问题，因为在运行过程中可能会修改 envSet，导致循环出问题
    new Set(envSet).forEach(env => env()); // 创建一个新的 Set 来存储要运行的副作用函数，避免在执行过程中修改原始 Set
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
  get(target, key, receiver) {
    track(target, key, activeEnv); // 进行依赖收集
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    const res = Reflect.set(target, key, value, receiver);
    trigger(target, key); // 派发更新
    return res;
  },
});

function cleanup(env) {
  let envSets = env.envSets; // 拿到当前环境函数的依赖数组
  if (envSets.length > 0) {
    envSets.forEach(({key, envSet}) => {
      envSet.delete(env); // 删除依赖
      if (envSet.size === 0) {
        keyEnvsetMap.delete(key); // 删除key对应的依赖集合
      }
    });
    envSets.length = 0;
  }
}

/**
 * 副作用函数的注册函数，当依赖的响应式数据发生变化时，副作用函数会被重新执行。
 * @param {function} fn 待注册的副作用函数
 */
function effect(fn) {
  const env = () => {
    cleanup(env)
    activeEnv = env;
    fn();
    activeEnv = null;
  }
  env.envSets = [];
  env()
}

const fn1 = () => {
  const a = state.a;
  console.log('state.a =', a);
  if (a === 1) {
    state.b;
  } else {
    state.c;
  }
  console.log("函数1执行完毕");
};

const fn2 = () => {
  console.log(state.a);
  console.log(state.c);
  console.log("函数2执行完毕");
};

effect(fn1);
effect(fn2);

console.log('--------------');
state.a = 10