import { getHandler } from "./behavior/getHandler.js";
import { setHandler } from "./behavior/setHandler.js";
import { deleteHandler } from "./behavior/deleteHandler.js";
import { hasHandler } from "./behavior/hasHandler.js";
import { ownKeysHandler } from "./behavior/ownKeysHandler.js";

export const handlers = {
  get: getHandler,
  set: setHandler,
  deleteProperty: deleteHandler,
  has: hasHandler,
  ownKeys: ownKeysHandler,
};
