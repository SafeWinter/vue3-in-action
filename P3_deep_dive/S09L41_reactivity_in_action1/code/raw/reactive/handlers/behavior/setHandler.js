import trigger from "../../effect/trigger.js";
import { TriggerOpTypes, hasChanged } from "../../utils.js";

export default function (target, key, value) {
  // 关于具体的操作类型需要进一步判断
  // 有可能是设置，有可能是新增
  const type = target.hasOwnProperty(key)
    ? TriggerOpTypes.SET
    : TriggerOpTypes.ADD;

  // 在设置之前需要缓存一下旧值
  const oldValue = target[key];

  // 先进行设置操作
  const result = Reflect.set(target, key, value);

  // 要不要派发更新需要一些判断
  if (hasChanged(oldValue, value)) {
    // 派发更新
    trigger(target, type, key);
  }

  return result;
}
