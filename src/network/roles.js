import {request} from './request'

export function  getRightsList(){
  return request({
    method: 'get',
    url: '/rights/list'
  }) 
}

export function getRolesList() {
  return request({
    method: 'get',
    url: '/roles'
  })
}

export function getRightsTree() {
  return request({
    method: 'get',
    url: '/rights/tree'
  })
}

export function removeRight(role, id) {
  return request({
    method: 'delete',
    url: `roles/${role.id}/rights/${id}`
  })
}

export function deleteRole(id) {
  return request({
    method: 'delete',
    url: `/roles/+${id}`,
  })
}

export function showEditDialog(id) {
  return request({
    method: 'get',
    url: `/roles/+${id}`,
  })
}

export function editRoles(roleId, data) {
  return request({
    method: 'put',
    url: `/roles/+${roleId}`,
    data
  })
}

export function addRoles(data){
  return request({
    method: 'post',
    url: '/roles',
    data
  })
}

export function showSetRightDialog() {
  return request({
    method: 'get',
    url: 'rights/tree',
  })
}

export function allotRights(roelId, data) {
  return request({
    method: 'post',
    url: `roles/${roelId}/rights`,
    data
  })
}