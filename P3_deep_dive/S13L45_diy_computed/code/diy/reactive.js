import { handlers } from "./handlers/index.js";
import { isObject } from './utils.js';

const proxyMap = new WeakMap();

export function reactive(target) {
  
  // filter non-object target
  if(!isObject(target)) {
    return target;
  }

  // check proxy cache
  if(proxyMap.has(target)) {
    return proxyMap.get(target);
  }

  const proxy = new Proxy(target, {
    ...handlers
  });

  // cache proxy
  proxyMap.set(target, proxy);

  return proxy;
}