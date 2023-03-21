import request from '@/utils/request'

// 查询AB品对照列表
export function listAbmouldfile(query) {
  return request({
    url: '/system/abmouldfile/list',
    method: 'get',
    params: query
  })
}

// 查询AB品对照详细
export function getAbmouldfile(id) {
  return request({
    url: '/system/abmouldfile/' + id,
    method: 'get'
  })
}

// 新增AB品对照
export function addAbmouldfile(data) {
  return request({
    url: '/system/abmouldfile',
    method: 'post',
    data: data
  })
}

// 修改AB品对照
export function updateAbmouldfile(data) {
  return request({
    url: '/system/abmouldfile',
    method: 'put',
    data: data
  })
}

// 删除AB品对照
export function delAbmouldfile(id) {
  return request({
    url: '/system/abmouldfile/' + id,
    method: 'delete'
  })
}
