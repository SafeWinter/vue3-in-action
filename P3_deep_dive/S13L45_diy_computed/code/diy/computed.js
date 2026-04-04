function normalizeParam(getterOrOptions) {
  let getter, setter;

  if (typeof getterOrOptions === "function") {
    getter = getterOrOptions;
    setter = () => {
      console.warn("setter is not provided.");
    };
  } else {
    const { get, set } = getterOrOptions;
    getter = get;
    setter = set;
  }

  return {
    getter,
    setter,
  };
}

export function computed(getterOrOptions) {
  const { getter, setter } = normalizeParam(getterOrOptions);
  return {
    get value() {
      return getter();
    },
    set value(newValue) {
      return setter(newValue);
    },
  };
}
