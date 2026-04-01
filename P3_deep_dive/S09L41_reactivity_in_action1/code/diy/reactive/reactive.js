import { handlers } from "./handlers/index.js";
export function reactive(target) {
  return new Proxy(target, {
    ...handlers
  });
}