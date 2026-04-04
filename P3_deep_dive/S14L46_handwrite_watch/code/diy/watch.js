import effect, { cleanup } from "./effect/effect.js";

function traverse(target, seenSet = new Set()) {
  if (typeof target !== "object" || target === null || seenSet.has(target)) {
    return target;
  }

  seenSet.add(target);

  for (const key in target) {
    traverse(target[key], seenSet);
  }

  return target;
}

export function watch(source, cb, options = {}) {
  let getter = typeof source === "function" ? source : () => traverse(source);

  let oldValue, newValue;

  const job = (depFn) => {
    newValue = depFn();
    cb(newValue, oldValue);
    if (newValue && newValue instanceof Object) {
      oldValue = { ...newValue };
    } else {
      oldValue = newValue;
    }
  };

  const getter1 = effect(getter, {
    lazy: true,
    // scheduler: job,
    scheduler(depFn) {
      if (options.flush === "post") {
        Promise.resolve().then(() => job(depFn));
      } else {
        // flush: 'sync'
        job(depFn);
      }
    },
  });

  if (options.immediate) {
    job(getter1);
  } else {
    oldValue = getter1(); // 建立关联并赋初始值
  }

  return () => cleanup(getter1);
}
