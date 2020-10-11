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

export function addUseFrom(data) {
  return request({
    method: 'post',
    url: '/users',
    data
  })
}
export function showEditDialog(id) {
  return request({
    method:'get',
    url: `/users/+${id}`,
  })
}
export function editUserInfo(id,data) {
  return request({
    method: 'put',
    url: `/users/+${id}`,
    data
  })
}

export function removeUserById(id){
  return request({
    method: 'delete',
    url: `/users/+${id}`
  })
}