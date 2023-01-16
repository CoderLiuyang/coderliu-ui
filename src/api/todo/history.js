import request from '@/router/axios'

export function fetchList(query) {
  debugger
  return request({
    url: '/workflow/bizTodo/historyPage',
    method: 'get',
    params: query
  })
}

