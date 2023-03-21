import request from '@/utils/request'

// 查询实际组托明细列表
export function listGrouppalletrecord(query) {
  return request({
    url: '/system/grouppalletrecord/list',
    method: 'get',
    params: query
  })
}

// 查询实际组托明细详细
export function getGrouppalletrecord(panelLineid) {
  return request({
    url: '/system/grouppalletrecord/' + panelLineid,
    method: 'get'
  })
}

// 新增实际组托明细
export function addGrouppalletrecord(data) {
  return request({
    url: '/system/grouppalletrecord',
    method: 'post',
    data: data
  })
}

// 修改实际组托明细
export function updateGrouppalletrecord(data) {
  return request({
    url: '/system/grouppalletrecord',
    method: 'put',
    data: data
  })
}

// 删除实际组托明细
export function delGrouppalletrecord(panelLineid) {
  return request({
    url: '/system/grouppalletrecord/' + panelLineid,
    method: 'delete'
  })
}
