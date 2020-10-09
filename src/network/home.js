import {request} from './request'

export function getMenuList() {
  return request({
    methods: 'get',
    url: '/menus'
  })
}