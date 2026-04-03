import { TriggerOperation, TrackOperation, ITERATE_KEY } from "../utils.js";
import { activeEffect, targetMap } from "./effect.js";

const TRIGGER_TYPE_MAP = {
  [TriggerOperation.SET]: [TrackOperation.GET],
  [TriggerOperation.ADD]: [
    TrackOperation.GET,
    TrackOperation.ITERATE,
    TrackOperation.HAS,
  ],
  [TriggerOperation.DELETE]: [
    TrackOperation.GET,
    TrackOperation.ITERATE,
    TrackOperation.HAS,
  ],
};

function collectEffects(target, type, key) {
  if (!targetMap.has(target)) {
    return;
  }
  const propMap = targetMap.get(target);

  const keys = [key];
  if ([TriggerOperation.ADD, TriggerOperation.DELETE].includes(type)) {
    keys.push(ITERATE_KEY);
  }

  const possibleTrackTypes = TRIGGER_TYPE_MAP[type]; // trigger -> track

  const collectDepSet = (set1, set2) => new Set([...set1, ...set2]);

  return keys
    .filter((k) => propMap.has(k))
    .map((k) => propMap.get(k)) // key -> typeMap
    .map((typeMap) =>
      possibleTrackTypes
        .filter((possible) => typeMap.has(possible)) 
        .map((trackType) => typeMap.get(trackType)) // trackType -> depSet
        .reduce(collectDepSet),
    )
    .reduce(collectDepSet);
}


/**
 * 触发器
 * @param {object} target 原始对象
 * @param {string} type 操作类型
 * @param {string} key 操作的属性
 */
export function trigger(target, type, key) {
  // console.log('触发器：原始对象为', target);
  console.log(`触发器：代理对象 ${key} 属性的 ${type} 操作被拦截`);

  const effects = collectEffects(target, type, key); // Set<effect>
  if(!effects) {
    return;
  }

  Array.from(effects)
    .filter(e => e !== activeEffect)
    .forEach(effect => effect());
}