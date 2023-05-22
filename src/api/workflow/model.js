import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/activiti/model/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/activiti/model',
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
    url: '/activiti/model/' + id,
    method: 'delete'
  })
}

export function putObj(obj, id) {
  return request({
    url: '/activiti/model/' + id,
    method: 'put',
    data: obj
  })
}

//获取流程图的json
export function getJson(id) {
  return request({
    url: '/activiti/model/' + id + '/json',
    method: 'get'
  })
}
//获取流程图的json
export function deploy(data) {
  return request({
    url: '/activiti/model/deploy',
    method: 'post',
    data: data
  })
}
