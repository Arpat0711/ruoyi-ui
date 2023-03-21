import request from '@/utils/request'

// 查询拆托明细列表
export function listLine(query) {
  return request({
    url: '/system/unpackpalletrecord/list',
    method: 'get',
    params: query
  })
}

// 查询拆托明细详细
export function getLine(unpanelLineid) {
  return request({
    url: '/system/unpackpalletrecord/' + unpanelLineid,
    method: 'get'
  })
}

// 新增拆托明细
export function addLine(data) {
  return request({
    url: '/system/unpackpalletrecord',
    method: 'post',
    data: data
  })
}

// 修改拆托明细
export function updateLine(data) {
  return request({
    url: '/system/unpackpalletrecord',
    method: 'put',
    data: data
  })
}

// 删除拆托明细
export function delLine(unpanelLineid) {
  return request({
    url: '/system/unpackpalletrecord/' + unpanelLineid,
    method: 'delete'
  })
}
