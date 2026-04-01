import { track } from "../../effect/track.js";
import { TrackOperation } from "../../utils.js";


export function hasHandler(target, key) {
    const existed = Reflect.has(target, key);
    track(target, TrackOperation.HAS, key);
    return existed;
}