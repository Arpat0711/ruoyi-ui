import request from '@/utils/request'

// 查询taskcenter列表
export function listTaskcenter(query) {
  return request({
    url: '/system/wmsbacklog/cx/list',
    method: 'get',
    params: query
  })
}

// 查询taskcenter详细
export function getTaskcenter(id) {
  return request({
    url: '/system/wmsbacklog/cx/' + id,
    method: 'get'
  })
}

// 新增taskcenter
export function addTaskcenter(data) {
  return request({
    url: '/system/wmsbacklog/cx',
    method: 'post',
    data: data
  })
}

// 修改taskcenter
export function updateTaskcenter(data) {
  return request({
    url: '/system/wmsbacklog/cx',
    method: 'put',
    data: data
  })
}

// 删除taskcenter
export function delTaskcenter(id) {
  return request({
    url: '/system/wmsbacklog/cx/' + id,
    method: 'delete'
  })
}
