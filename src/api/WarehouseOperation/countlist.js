import request from '@/utils/request'


export const getList = (data) => {
  return request({
    url: '/system/WmsCheckOrder/list',
    method: 'get',
    params: data
  })
}

export const getDetail = (id) => {
  return request({
    url: '/system/WmsCheckOrder/' + id,
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

export function updateOrder(id, operatorId) {
  return request({
    url: `/system/WmsCheckOrder/${id}/${operatorId}`,
    method: 'put'
  })
}

export const getLineDetail = (checkLineId) => {
  return request({
    url: '/system/WmsCheckOrder/line/detail/' + checkLineId,
    method: 'get'
  })
}

export function redo(id) {
  return request({
    url: '/system/WmsCheckOrder/redo/' + id,
    method: 'put'
  })
}

export function close(id, forced) {
  return request({
    url: '/system/WmsCheckOrder/close/' + id,
    method: 'put',
    params: forced
  })
}
