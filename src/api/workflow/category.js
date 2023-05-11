import request from '@/router/axios'

// 查询流程分类列表
export function fetchList(query) {
  return request({
    url: '/workflow/category/list',
    method: 'get',
    params: query
  })
}

// 查询流程分类列表
export function listAllCategory(query) {
  return request({
    url: '/workflow/category/listAll',
    method: 'get',
    params: query
  })
}

// 查询流程分类详细
export function getObj(categoryId) {
  return request({
    url: '/workflow/category/' + categoryId,
    method: 'get'
  })
}

// 新增流程分类
export function addObj(data) {
  return request({
    url: '/workflow/category',
    method: 'post',
    data: data
  })
}

// 修改流程分类
export function putObj(data) {
  return request({
    url: '/workflow/category',
    method: 'put',
    data: data
  })
}

// 删除流程分类
export function delObj(categoryId) {
  return request({
    url: '/workflow/category/' + categoryId,
    method: 'delete'
  })
}
