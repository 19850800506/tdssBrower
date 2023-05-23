import request from '@/utils/request'
// 简要数据
export function getwirelesschart(params) {
  return request({
    url: '/briefly/data',
    method: 'get',
    params,
    request_base: 'scaleplateUrl',
  })
}
// 全部数据
export function getcompletechart(params) {
  return request({
    url: '/detail/data',
    method: 'get',
    params,
    request_base: 'scaleplateUrl',
  })
}
// 完整标尺
export function getscaleplate(params) {
  return request({
    url: '/detail/ruler',
    method: 'get',
    params,
    request_base: 'scaleplateUrl',
  })
}
