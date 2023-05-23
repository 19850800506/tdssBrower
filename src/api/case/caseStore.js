import request from '@/utils/request'
// 分页获取案例库
export function listCase(query) {
  return request({
    url: '/Case/GetCasePage',
    methods: 'get',
    request_base: 'serverUrl',
    params: query,
  })
}
// 分页获取无人机参数
export function listParameter(query) {
  return request({
    url: '/UAV/GetUAVPage',
    methods: 'get',
    request_base: 'serverUrl',
    params: query,
  })
}
// 分页获取预案库
export function GetScenarios(query) {
  return request({
    url: '/Scenario/GetScenarios',
    methods: 'get',
    request_base: 'serverUrl',
    params: query,
  })
}
// 分页获取无人机白名单
export function UAVWhitelist(query) {
  return request({
    url: '/UAVWhitelist/GetByPage',
    methods: 'get',
    request_base: 'serverUrl',
    params: query,
  })
}
