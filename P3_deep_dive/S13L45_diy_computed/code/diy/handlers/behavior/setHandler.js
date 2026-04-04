import { TriggerOperation, isDifferent } from "../../utils.js";
import { trigger } from "../../effect/trigger.js";

export function setHandler(target, key, value) {
  // 变更前
  const original = Reflect.get(target, key);

  const type = Reflect.has(target, key)
    ? TriggerOperation.SET
    : TriggerOperation.ADD;

  const oldLength = Array.isArray(target)
    ? Reflect.get(target, "length")
    : undefined;

  const res = Reflect.set(target, key, value);

  // 变更后
  if (isDifferent(original, value)) {
    trigger(target, type, key);

    // 数组隐式变更长度的特殊处理
    if (Array.isArray(target)) {
      const newLength = Reflect.get(target, "length");
      if (isDifferent(oldLength, newLength)) {
        if (key !== "length") { // 只在隐式变更长度时手动触发 length 的 SET 操作
          trigger(target, TriggerOperation.SET, "length");
        } else {
          for (let i = newLength; i < oldLength; i++) {
            trigger(target, TriggerOperation.DELETE, `${i}`);
          }
        }
      }
    }
  }
  return res;
}
