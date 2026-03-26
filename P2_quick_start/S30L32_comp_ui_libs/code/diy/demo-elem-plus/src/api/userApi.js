// 封装具体的请求函数
import request from './request.js'

/**
 * 获取用户列表
 */
export function getUserListApi() {
  return request.get('/users')
}

/**
 * 根据 id 来获取用户的信息
 * @param {string} id
 * @returns
 */
export function getUserByIdApi(id) {
  return request.get(`/users/${id}`)
}

/**
 * 添加用户
 */
export function addUserApi(data) {
  return request.post('/users', data)
}

/**
 * 修改用户信息
 * @param {string} id 待修改的用户ID
 * @param {object} data 待修改的用户信息
 */
export function editUserApi(id, data) {
  return request.patch(`/users/${id}`, data)
}

/**
 * 删除用户
 * @param {string} id 要删除的用户的 ID
 * @returns 操作结果 Promise 实例
 */
export function deleteUserByIdApi(id) {
  return request({
    url: `/users/${id}`,
    method: 'DELETE'
  })
}