import ErrLogger from './index.vue'

const defaults = {
  logToConsole: true,
  remoteLogging: false,
  remoteUrl: ''
}

export default {
  install(app, options = {}) {
    options = Object.assign({}, defaults, options)

    function diyLogger(err, info) {
      if (options.logToConsole) {
        console.error(`[错误：${info}]`, err)
      }
      if (options.remoteLogging && options.remoteUrl) {
        const r = `${Math.random() * 1000}`.substring(3)
        const time = [new Date().toLocaleString(), r].join('-')
        fetch(options.remoteUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            error: err.message, // 错误消息
            stack: err.stack, // 错误堆栈
            info, // 具体错误说明信息
            time // 记录时间
          })
        }).catch(console.error)
      }
    }

    app.config.errorHandler = (err, vm, info) => diyLogger(err, info)

    window.addEventListener('unhandledrejection', (ev) => {
      console.log(ev)
      diyLogger(ev.reason, 'DIY Promise Rejection Err')
    })

    app.component('ErrLogger', ErrLogger)
  }
}
