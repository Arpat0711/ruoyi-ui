import request from '@/utils/request'

// 查询待办信息配置列表
export function listBacklogauthor(query) {
  return request({
    url: '/system/backlogauthor/list',
    method: 'get',
    params: query
  })
}

// 查询待办信息配置详细
export function getBacklogauthor(id) {
  return request({
    url: '/system/backlogauthor/' + id,
    method: 'get'
  })
}

// 新增待办信息配置
export function addBacklogauthor(data) {
  return request({
    url: '/system/backlogauthor',
    method: 'post',
    data: data
  })
}

// 修改待办信息配置
export function updateBacklogauthor(data) {
  return request({
    url: '/system/backlogauthor',
    method: 'put',
    data: data
  })
}

// 删除待办信息配置
export function delBacklogauthor(id) {
  return request({
    url: '/system/backlogauthor/' + id,
    method: 'delete'
  })
}
