import request from '@/utils/request'


export const getList = (data) => {
  return request({
    url: '/system/WmsCheckDiff/list',
    method: 'get',
    params: data
  })
}

export const getDetail = (id) => {
  return request({
    url: '/system/WmsCheckDiff/' + id,
    method: 'get'
  })
}

export const disuse = (id,data) => {
  return request({
    url: '/system/WmsCheckDiff/' + id + '/disuse',
    method: 'post',
    data: data
  })
}
