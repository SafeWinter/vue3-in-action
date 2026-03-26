// 该文件主要是对 axios 进行二次封装，主要是对请求和响应进行拦截处理
import axios from 'axios'
// 创建 axios 实例
const request = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use((config) => {
  // config 就是你的请求
  // 做一些其他的事情，比如给请求头添加 token

  // 请求放行
  return config
})

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // response 就是响应
    // 做一些其他的事情，比如对响应结果进行处理

    // 响应放行
    return response
  },
  (error) => {
    // 多了一个错误处理
    return Promise.reject(error)
  }
)

export default request
