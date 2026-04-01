import { reactive } from "../../reactive.js";
import { isObject, TrackOperation } from '../../utils.js';
import { track } from '../../effect/track.js';

export function getHandler(target, key) {
    
    track(target, TrackOperation.GET, key);

    const res = Reflect.get(target, key);
    
    return isObject(res) 
        ? reactive(res)
        : res;
}