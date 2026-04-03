export let activeEffect = null;

export const targetMap = new WeakMap();

export const effectStack = [];

export default function effect(fn) {
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
  env();
}

function cleanup(env) {
  let deps = env.deps;
  for (const depSet of deps) {
    depSet.delete(env);
  }
  deps.length = 0;
}
