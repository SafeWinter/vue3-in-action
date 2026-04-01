/**
 * 触发器
 * @param {object} target 原始对象
 * @param {string} type 操作类型
 * @param {string} key 操作的属性
 */
export function trigger(target, type, key) {
    console.log('触发器：原始对象为', target);
    console.log(`触发器：代理对象 ${key} 属性的 ${type} 操作被拦截`);
}