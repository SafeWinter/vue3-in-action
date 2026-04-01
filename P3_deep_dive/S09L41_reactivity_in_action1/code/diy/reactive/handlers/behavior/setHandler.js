import { TriggerOperation, isDifferent } from "../../utils.js";
import { trigger } from '../../effect/trigger.js';

export function setHandler(target, key, value) {
    const original = Reflect.get(target, key);
    if(isDifferent(original, value)) {
        const type = Reflect.has(target, key)
            ? TriggerOperation.SET
            : TriggerOperation.ADD;
        trigger(target, type, key);
    }

    return Reflect.set(target, key, value);
}