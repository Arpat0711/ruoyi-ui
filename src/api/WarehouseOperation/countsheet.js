import request from '@/utils/request'


export const getList = (data) => {
  return request({
    url: '/system/WmsCheckPlan/list',
    method: 'get',
    params: data
  })
}

export function listThread() {
  return request({
    url: '/system/warehouse/listThread',
    method: 'get'
  })
}

export const getUser = (data) => {
  return request({
    url: '/system/role/authUser/allocatedList',
    method: 'get',
    params: data
  })
}

export function addPlan(data) {
  return request({
    url: '/system/WmsCheckPlan/add',
    method: 'post',
    data: data
  })
}

export const getDetail = (id) => {
  return request({
    url: '/system/WmsCheckPlan/' + id,
    method: 'get'
  })
}

export function updatePlan(id,data) {
  return request({
    url: '/system/WmsCheckPlan/' + id,
    method: 'put',
    data: data
  })
}

export function delPlan(id) {
  return request({
    url: '/system/WmsCheckPlan/' + id,
    method: 'delete'
  })
}
