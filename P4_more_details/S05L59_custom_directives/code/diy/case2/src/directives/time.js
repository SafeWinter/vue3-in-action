// 获取当前时间戳
export function getUnix() {
  return new Date().getTime()
}

// 获取今天0时0分0秒的时间戳
export function getTodayUnix() {
  const date = new Date()
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)
  return date.getTime()
}

// 获取今年 1 月 1 日 0 点 0 分 0 秒的时间戳
export function getYearUnix() {
  var date = new Date()
  date.setMonth(0)
  date.setDate(1)
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)
  return date.getTime()
}

// 获取标准年月日
export function getLastDate(time) {
  var date = new Date(time)
  var month = `${date.getMonth() + 1}`.padStart(2, '0')
  var day = `${date.getDate()}`.padStart(2, '0')
  return [date.getFullYear(), month, day].join('-')
}

// 转换时间
export function formatTime(timestamp) {
  // 根据时间戳来决定返回的提示信息
  var now = getUnix()
  var today = getTodayUnix()
  var timer = (now - timestamp) / 1000
  var tip = ''

  if (timer <= 0) {
    tip = '刚刚'
  } else if (Math.floor(timer / 60) <= 0) {
    tip = '刚刚'
  } else if (timer < 3600) {
    tip = Math.floor(timer / 60) + '分钟前'
  } else if (timer >= 3600 && timestamp - today >= 0) {
    tip = Math.floor(timer / 3600) + '小时前'
  } else if (timer / 86400 <= 31) {
    tip = Math.ceil(timer / 86400) + '天前'
  } else {
    tip = getLastDate(timestamp)
  }
  return tip
}

export const time = (freq = 6e4) => ({
  mounted(el, { value }) {
    el.innerHTML = formatTime(value)
    el.timeout = setInterval(() => {
      el.innerHTML = formatTime(value)
    }, freq)
  },
  unmounted(el) {
    clearInterval(el.timeout)
    delete el.timeout
  }
})
