import track from "../../effect/track.js";
import { TrackOpTypes, isObject } from "../../utils.js";
import { reactive } from "../../reactvie.js";

export default function (target, key) {
  // 拦截到 get 操作后，要做一些额外的事情
  // 要做的事情，就是收集依赖
  track(target, TrackOpTypes.GET, key);

  const result = Reflect.get(target, key);

  // 获取到的成员可能是对象，需要递归处理，将其转换为响应式
  if (isObject(result)) {
    return reactive(result);
  }

  return result;
}
