import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/workflow/bizTodo/page',
    method: 'get',
    params: query
  })
}

export function approve(obj) {
  return request({
    url: '/workflow/bizLeave/complete',
    method: 'post',
    data: obj
  })
}
