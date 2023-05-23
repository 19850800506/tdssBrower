import request from '@/utils/request'

/*   协议破解   */
// 自动打击
export function autoStrikeOperate(query) {
  return request({
    url: '/Crack/device/autoJamminCrack',
    method: 'get',
    request_base: 'operate',
    params: query,
  })
}
// 宽带打击
export function broadbandStrike(query) {
  return request({
    url: '/Crack/device/wideBand',
    method: 'get',
    request_base: 'operate',
    params: query,
  })
}
// 精准打击
export function accurateStrike(query) {
  return request({
    url: '/Crack/device/accurate',
    method: 'get',
    request_base: 'operate',
    params: query,
  })
}
// 获取白名单数据
export function whiteList(query) {
  return request({
    url: '/Crack/device/whiteList',
    method: 'get',
    request_base: 'operate',
    params: query,
  })
}
// 删除白名单数据
export function removeWhiteList(params) {
  return request({
    url: '/Crack/device/whiteList',
    method: 'delete',
    request_base: 'operate',
    params,
  })
}
// 添加白名单数据
export function addWhiteList(data) {
  return request({
    url: '/Crack/device/whiteList',
    method: 'post',
    data,
    request_base: 'operate',
  })
}
// 无人机列表的驱离迫降
export function strikeOperate(query) {
  return request({
    url: '/Attack/position/jamminNearby',
    method: 'get',
    request_base: 'operate',
    params: query,
  })
}
