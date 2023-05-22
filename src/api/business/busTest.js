import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/business/busTest/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/business/busTest',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/business/busTest/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/business/busTest/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/business/busTest',
    method: 'put',
    data: obj
  })
}
