export default {
  install(app, options) {
    app.config.globalProperties.$translate = (key) =>
      key.split('.').reduce((o, e) => (o ? o[e] : void 0), options)
  }
}
