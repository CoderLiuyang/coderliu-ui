import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/workflow/model/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/workflow/model',
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
    url: '/workflow/model/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/user',
    method: 'put',
    data: obj
  })
}

//获取流程图的json
export function getJson(id) {
  return request({
    url: '/workflow/model/' + id + '/json',
    method: 'get'
  })
}
