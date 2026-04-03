import { trigger } from "../../effect/trigger.js";
import { TriggerOperation } from "../../utils.js";

export function deleteHandler(target, key) {
    const existed = Reflect.has(target, key)
    const res = Reflect.deleteProperty(target, key);
    if(existed && res) {
        trigger(target, TriggerOperation.DELETE, key);
    }
    return res;
}