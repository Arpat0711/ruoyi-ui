import request from '@/utils/request'


export const getList = (data, params) => {
  return request({
    url: '/system/WmMiscShip/listDataInfo',
    method: 'post',
    data: data,
    params: params
  })
}

export function getDetail(params) {
  return request({
    url: '/system/Wm/MiscShip/id',
    method: 'post',
    data: params
  })
}

export function miscRcvTrans(data) {
  return request({
    url: '/system/WmMiscShip/put',
    method: 'put',
    data: data
  })
}

export function addtInsert(data) {
  return request({
    url: '/system/WmMiscShip/add',
    method: 'post',
    data: data
  })
}

export function MiscRcvTransDelete(data) {
  return request({
    url: '/system/WmMiscShip/removedele',
    method: 'post',
    data: data
  })
}

export function getItemListTable(data) {
  return request({
    url: '/system/barcode/find-by-orgid-and-location-and-condition',
    method: 'post',
    data: data
  })
}