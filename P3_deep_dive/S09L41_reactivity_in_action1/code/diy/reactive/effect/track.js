export function track(target, type, key) {
    const attr = !!key ? ` ${key} 属性` : '';
    console.log('收集器：原始对象为', target);
    console.log(`收集器：代理对象${attr}的 ${type} 操作被拦截`);
}