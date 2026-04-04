export let activeEffect = null;

export const targetMap = new WeakMap();

export const effectStack = [];

const defaults = {
  lazy: false,
  scheduler: null
}

export default function effect(fn, options) {
  options = Object.assign({}, defaults, options);
  const env = () => {
    try {
      cleanup(env);
      effectStack.push(env);
      activeEffect = env;
      return fn();
    } finally {
      effectStack.pop();
      activeEffect = effectStack[effectStack.length - 1];
    }
  };
  env.deps = [];
  env.options = options;
  if(!options.lazy) {
    env(); 
  }
  return env;
}

export function cleanup(env) {
  let deps = env.deps;
  for (const depSet of deps) {
    depSet.delete(env);
  }
  deps.length = 0;
}
