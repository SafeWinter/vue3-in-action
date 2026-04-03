import { TrackOperation, ITERATE_KEY } from '../utils.js';
import { activeEffect, targetMap } from "./effect.js";

// 控制是否收集依赖
let shouldTrack = true;

export function pauseTracking() {
  shouldTrack = false;
}

export function resumeTracking() {
  shouldTrack = true;
}

export function track(target, type, key) {
  if (!shouldTrack) {
    return;
  }

  const attr = !!key ? ` ${key} 属性` : "";
  // console.log('收集器：原始对象为', target);
  console.log(`收集器：代理对象${attr}的 ${type} 操作被拦截`);

  if (!targetMap.has(target)) {
    targetMap.set(target, new Map());
  }
  const propMap = targetMap.get(target);

  // 处理 key 可能为 undefined 的情况，例如遍历操作
  if(type === TrackOperation.ITERATE) {
    key = ITERATE_KEY;
  }

  if (!propMap.has(key)) {
    propMap.set(key, new Map());
  }
  const typeMap = propMap.get(key);

  if (!typeMap.has(type)) {
    typeMap.set(type, new Set());
  }
  const depSet = typeMap.get(type);

  if (!depSet.has(activeEffect)) {
    depSet.add(activeEffect);
    activeEffect.deps.push(depSet);
  }
}
