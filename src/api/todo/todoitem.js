import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/activiti/bizTodo/page',
    method: 'get',
    params: query
  })
}

export function approve(obj) {
  return request({
    url: '/activiti/bizLeave/complete',
    method: 'post',
    data: obj
  })
}
