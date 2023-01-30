

import request from '@/router/axios'

/**
 * 获取表数据分页
 */
export function fetchList(query) {
  return request({
    url: '/generate/gen/page',
    method: 'get',
    params: query
  })
}

export function preview(table) {
  return request({
    url: '/generate/generator/preview',
    method: 'get',
    params: table
  })
}

/**
 * 获取数据源配置
 */
export function fetchDsList(query) {
  return request({
    url: '/generate/dsconf/page',
    method: 'get',
    params: query
  })
}

export function fetchSelectDsList() {
  return request({
    url: '/generate/dsconf/list',
    method: 'get'
  })
}

export function addObj(obj) {
  return request({
    url: '/generate/dsconf/',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/generate/dsconf/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/generate/dsconf/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/generate/dsconf/',
    method: 'put',
    data: obj
  })
}

export function handleDown(table) {
  return request({
    url: '/gen/generator/code',
    method: 'post',
    data: table,
    responseType: 'arraybuffer'
  }).then((response) => { // 处理返回的文件流
    const blob = new Blob([response.data], { type: 'application/zip' })
    const filename = table.tableName + '.zip'
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    document.body.appendChild(link)
    link.click()
    window.setTimeout(function() {
      URL.revokeObjectURL(blob)
      document.body.removeChild(link)
    }, 0)
  })
}


export function getForm(tableName, dsName) {
  return request({
    url: '/gen/form/info',
    params: { tableName: tableName, dsName: dsName },
    method: 'get'
  })
}

export function postForm(formInfo, tableName, dsId) {
  return request({
    url: '/gen/form/',
    method: 'post',
    data: Object.assign({ formInfo, tableName, dsId })
  })
}

