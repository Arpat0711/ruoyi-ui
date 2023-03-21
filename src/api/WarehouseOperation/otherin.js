import request from '@/utils/request'


export const getList = (data) => {
  return request({
    url: '/system/MiscRcvTrans/list',
    method: 'get',
    params: data
  })
}

export function getDetail(id) {
  return request({
    url: '/system/MiscRcvTrans/' + id,
    method: 'get'
  })
}

export function miscRcvTrans(data) {
  return request({
    url: '/system/MiscRcvTrans',
    method: 'put',
    data: data
  })
}

export function addtInsert(data) {
  return request({
    url: '/system/MiscRcvTrans/addtInsert',
    method: 'post',
    data: data
  })
}

export function MiscRcvTransDelete(data) {
  return request({
    url: '/system/MiscRcvTrans/removedele',
    method: 'post',
    data: data
  })
}

export function getItem(data) {
  return request({
    url: '/system/item/list',
    method: 'post',
    data: data
  })
}

export function getBatch(data) {
  return request({
    url: '/system/MiscRcvTrans/listone',
    method: 'post',
    data: data
  })
}

export const getWmMiscRcvTransBoxList = (data) => {
  return request({
    url: '/system/MiscRcvTrans/getWmMiscRcvTransBoxList',
    method: 'get',
    params: data
  })
}