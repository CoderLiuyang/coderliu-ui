import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/activiti/bizTodo/historyPage',
    method: 'get',
    params: query
  })
}

