import { customRef } from 'vue'

const debounce = (fn, duration) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(null, args), duration)
  }
}

export function debouncedRef(value, duration = 1000) {
  let _val = value
  return customRef((track, trigger) => ({
    get() {
      track()
      return _val
    },
    set: debounce((val) => {
      trigger()
      _val = val
    }, duration)
  }))
}
