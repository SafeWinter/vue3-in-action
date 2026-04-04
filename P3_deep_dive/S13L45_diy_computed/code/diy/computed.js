import effect from "./effect/effect.js";
import { track } from "./effect/track.js";
import { trigger } from "./effect/trigger.js";
import { TrackOperation, TriggerOperation } from "./utils.js";

function normalizeParam(getterOrOptions) {
  let getter, setter;

  if (typeof getterOrOptions === "function") {
    getter = getterOrOptions;
    setter = () => {
      console.warn("setter is not provided.");
    };
  } else {
    const { get, set } = getterOrOptions;
    getter = get;
    setter = set;
  }

  return {
    getter,
    setter,
  };
}

export function computed(getterOrOptions) {
  const { getter, setter } = normalizeParam(getterOrOptions);
  let cache, dirty = true;
  // 将 getter 传入 effect，getter 里面的响应式属性就会和 getter 建立依赖关系
  const getter1 = effect(getter, {
    lazy: true,
    scheduler(depFn) {
      // depFn(); // 此时无须立即执行依赖函数（即 getter）
      dirty = true;  // 等到下次读取 value 属性再执行
      console.log('depFn === getter1:', depFn === getter1)
      // trigger(getter1, TriggerOperation.SET, 'value'); // 通过 trigger 触发依赖，通知计算属性更新
      trigger(depFn, TriggerOperation.SET, 'value'); // 通过 trigger 触发依赖，通知计算属性更新
    }
  })
  return {
    get value() {
      track(getter1, TrackOperation.GET, 'value'); // 读取 value 属性时建立依赖关系
      if(dirty) {
        cache = getter1();
        dirty = false;
      }
      return cache;
    },
    set value(newValue) {
      return setter(newValue);
    },
  };
}
