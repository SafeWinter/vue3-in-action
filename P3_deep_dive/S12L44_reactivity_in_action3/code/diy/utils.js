export const TrackOperation = {
  GET: "get",
  HAS: "has",
  ITERATE: "iterate",
};

export const TriggerOperation = {
  SET: "set",
  ADD: "add",
  DELETE: "delete",
};

export const isObject = (target) =>
  typeof target === "object" && target !== null;

export const isDifferent = (original, value) => !Object.is(original, value);

export const RAW = Symbol("raw");

export const ITERATE_KEY = Symbol("iterate");
