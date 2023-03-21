import request from '@/utils/request'

// 查询移位记录列表
export function listWmsStockLog(query) {
  return request({
    url: '/system/WmsStockLog/list',
    method: 'get',
    params: query
  })
}

// 查询移位记录详细
export function getWmsStockLog(stocklogId) {
  return request({
    url: '/system/WmsStockLog/' + stocklogId,
    method: 'get'
  })
}

// 新增移位记录
export function addWmsStockLog(data) {
  return request({
    url: '/system/WmsStockLog',
    method: 'post',
    data: data
  })
}

// 修改移位记录
export function updateWmsStockLog(data) {
  return request({
    url: '/system/WmsStockLog',
    method: 'put',
    data: data
  })
}

// 删除移位记录
export function delWmsStockLog(stocklogId) {
  return request({
    url: '/system/WmsStockLog/' + stocklogId,
    method: 'delete'
  })
}
