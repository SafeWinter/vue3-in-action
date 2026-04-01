// 这是入口文件，会提供一个 reactive API，该方法接收一个对象，返回一个 Proxy 对象
import handlers from "./handlers/index.js";

/**
 * 将对象转换为 Proxy 对象
 * @param {*} target 原始对象
 * @returns
 */
export function reactive(target) {
  const proxy = new Proxy(target, handlers);
  return proxy;
}
