import request from '@/utils/request'

// 查询shiftrecord列表
export function listLog(query) {
  return request({
    url: '/system/WmsStockLog/cx/list',
    method: 'get',
    params: query
  })
}

// 查询shiftrecord详细
export function getLog(stocklogId) {
  return request({
    url: '/system/WmsStockLog/cx/' + stocklogId,
    method: 'get'
  })
}

// 新增shiftrecord
export function addLog(data) {
  return request({
    url: '/system/WmsStockLog/cx',
    method: 'post',
    data: data
  })
}

// 修改shiftrecord
export function updateLog(data) {
  return request({
    url: '/system/WmsStockLog/cx',
    method: 'put',
    data: data
  })
}

// 删除shiftrecord
export function delLog(stocklogId) {
  return request({
    url: '/system/WmsStockLog/cx/' + stocklogId,
    method: 'delete'
  })
}
