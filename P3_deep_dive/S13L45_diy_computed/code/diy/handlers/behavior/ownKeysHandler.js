import { track } from "../../effect/track.js";
import { TrackOperation } from "../../utils.js";

export function ownKeysHandler(target) {
    track(target, TrackOperation.ITERATE);
    return Reflect.ownKeys(target);
}