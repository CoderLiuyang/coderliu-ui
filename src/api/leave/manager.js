import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/activiti/bizLeave/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/activiti/bizLeave',
    method: 'post',
    data: obj
  })
}

export function submitProcess(obj) {
  return request({
    url: '/activiti/bizLeave/submitProcess',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/user/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/activiti/bizLeave/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/activiti/bizLeave',
    method: 'put',
    data: obj
  })
}
