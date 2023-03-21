import request from '@/utils/request'


export const getList = (data, params) => {
  return request({
    url: '/system/TransferOut/listData',
    method: 'post',
    data: data,
    params: params
  })
}

export function getDetail(params) {
  return request({
    url: '/system/TransferOut/id',
    method: 'post',
    data: params
  })
}

export function miscRcvTrans(data) {
  return request({
    url: '/system/TransferOut/editData',
    method: 'post',
    data: data
  })
}

export function addtInsert(data) {
  return request({
    url: '/system/TransferOut/innerData',
    method: 'post',
    data: data
  })
}

export function MiscRcvTransDelete(data) {
  return request({
    url: '/system/TransferOut/removeData',
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

export function listThread() {
  return request({
    url: '/system/warehouse/listThread',
    method: 'get',
  })
}
