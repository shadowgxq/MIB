import {request} from './request'

export function getUserList(queryInfo) {
  return request({
    method: 'get',
    url: '/users',
    params: queryInfo
  })
}

export function userStateChanged(userInfo) {
  return request({
    method: 'put',
    url: `users/${userInfo.id}/state/${userInfo.mg_state}`
  })
}