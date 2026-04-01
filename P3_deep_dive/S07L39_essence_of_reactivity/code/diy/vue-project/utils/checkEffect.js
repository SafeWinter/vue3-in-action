import { watchEffect } from "vue"

const logBuilder = (initMsg, msg) => {
  let first = true
  return () => {
    if(first) {
      first = false
      initMsg && console.log(initMsg);
    } else {
      console.log(msg);
    }
  }
}

// const skipFirst = logBuilder('(初始加载 effect, 非派发更新)', '执行了派发更新')
const skipFirst = logBuilder(void(0), '执行了派发更新')

export const checkEffect = fn => 
  watchEffect(() => {
    skipFirst()
    fn()
  }, 
  // {flush: 'sync'}
)
