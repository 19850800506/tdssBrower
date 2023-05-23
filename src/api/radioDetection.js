import request from '@/utils/request'

// 获取白名单数据
export function getWihteList(query) {
  return request({
    url: '/whitelist/list',
    method: 'get',
    params: query,
    request_base: 'radioUrl',
  })
}
// 新增白名单数据
export function addWhiteList(query) {
  return request({
    url: '/whitelist/add',
    method: 'get',
    params: query,
    request_base: 'radioUrl',
  })
}
// 修改白名单数据
export function updateWhiteList(query) {
  return request({
    url: '/whitelist/update',
    method: 'get',
    params: query,
    request_base: 'radioUrl',
  })
}
// 删除白名单数据
export function removeWhiteList(query) {
  return request({
    url: '/whitelist/delete',
    method: 'get',
    params: query,
    request_base: 'radioUrl',
  })
}
