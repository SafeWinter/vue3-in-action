import { reactive } from "../../reactive.js";
import { isObject, TrackOperation, RAW } from "../../utils.js";
import { pauseTracking, resumeTracking, track } from "../../effect/track.js";

const arrayInstrumentations = {};
["includes", "indexOf", "lastIndexOf"].forEach((methodName) => {
  Reflect.set(arrayInstrumentations, methodName, function (...args) {
    const method = Reflect.get(Array.prototype, methodName);
    // match with proxy target first
    const res = Reflect.apply(method, this, args);
    if (res === false || res === -1) {
      // match with original target
      const original = this[RAW];
      return Reflect.apply(method, original, args);
    } else {
      return res;
    }
  });
});

// 以下方法由开发者自主控制是否启用对 length 的依赖收集
["push", "pop", "shift", "unshift", "splice"].forEach((methodName) => {
  Reflect.set(arrayInstrumentations, methodName, function (...args) {
    const method = Reflect.get(Array.prototype, methodName);
    pauseTracking();
    const res = Reflect.apply(method, this, args);
    resumeTracking();
    return res;
  });
});

export function getHandler(target, key) {
  if (key === RAW) {
    return target;
  }

  track(target, TrackOperation.GET, key);

  // 发现如下方法就返回自定义版本
  if (Array.isArray(target) && arrayInstrumentations.hasOwnProperty(key)) {
    return Reflect.get(arrayInstrumentations, key);
  }

  const res = Reflect.get(target, key);

  return isObject(res) ? reactive(res) : res;
}
