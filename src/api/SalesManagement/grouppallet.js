import request from '@/utils/request'


/**审核状态接口 */
export const checkDocument = (params) => {
  return request({
    url: '/system/pkgplan/status',
    method: 'post',
    data: params
  })
}

/**删除组托计划接口 */
export const handleDelete = (packageIds, orgId) => {
  return request({
    url: '/system/pkgplan' + "/" + packageIds + "/" + orgId,
    method: 'delete',
  })
}

/**修改船期 */
