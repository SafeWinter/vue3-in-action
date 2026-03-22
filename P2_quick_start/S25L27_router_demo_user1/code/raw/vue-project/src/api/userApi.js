// 封装具体的请求函数
import request from './request.js'

/**
 * 获取用户列表
 */
export function getUserListApi() {
  return request({
    url: '/users',
    method: 'GET'
  })
}
