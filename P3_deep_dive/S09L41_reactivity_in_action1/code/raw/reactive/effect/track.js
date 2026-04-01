import { TrackOpTypes } from "../utils.js";

/**
 * 收集器：用于收集依赖
 * @param {*} target 原始对象
 * @param {*} type 进行的操作类型
 * @param {*} key 针对哪一个属性
 */
export default function (target, type, key) {
  if (type === TrackOpTypes.ITERATE) {
    // 说明是遍历操作
    // 此时没有第三个参数 key
    console.log("收集器：原始对象为", target);
    console.log(`收集器：代理对象${type}操作被拦截`);
    return;
  }

  console.log("收集器：原始对象为", target);
  console.log(`收集器：代理对象${key}属性的${type}操作被拦截`);
}
