import request from '@/utils/request'

// 获取处置记录数据
export function record(query) {
  return request({
    url: '/statistics/sector/alarmresult/oneday',
    methods: 'get',
    request_base: 'geoStorage',
    params: query,
  })
}
// 获取 统计预警次数
export function content(query) {
  return request({
    url: '/statistics/position/fouralarm/count',
    methods: 'get',
    request_base: 'geoStorage',
    params: query,
  })
}
// 演示
export function demonstration(query) {
  return request({
    url: '/Demo/Get',
    methods: 'get',
    request_base: 'serverUrl',
    params: query,
  })
}
// 演示
export function demoget(query) {
  return request({
    url: '/demo/get',
    methods: 'get',
    request_base: 'serverUrl',
    params: query,
  })
}
// 演示状态监测
export function demoState(query) {
  return request({
    url: '/demo/GetState',
    methods: 'get',
    request_base: 'serverUrl',
    params: query,
  })
}
// 查询预警信息
export function getWarningInfo(query) {
  return request({
    url: '/position/warning',
    method: 'get',
    params: query,
    request_base: 'geoStorage',
  })
}
// 预警统计数据
export function getAlarmStatistics(query) {
  return request({
    url: '/position/warning/statistics',
    method: 'get',
    params: query,
    request_base: 'geoStorage',
  })
}
// 预警报告导出
export function exportAlarm(data) {
  return request({
    url: '/position/warning/word',
    method: 'post',
    data,
    responseType: 'blob',
    request_base: 'geoStorage',
  })
}
