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
