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
}
