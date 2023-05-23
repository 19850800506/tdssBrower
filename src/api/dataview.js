import request from '@/utils/request'
// 获取天气
export function getWeather(query) {
  return request({
    url: '/PositionInfo/weather',
    request_base: 'sharedUrl',
    method: 'get',
    params: query,
  })
}

// 获取gis相关信息（雷达中心点位）
export function getConfigurations() {
  return request({
    url: '/Configuration/GetConfigurations',
    request_base: 'serverUrl',
    method: 'get',
  })
}

// 获取所有设备信息
export function getAllDeviceInfo(query) {
  return request({
    url: '/DeviceInfo',
    request_base: 'sharedUrl',
    method: 'get',
    params: query,
  })
}
// 获取单个设备经纬度
export function getDeviceInfo(query) {
  return request({
    url: '/Device/acess/login',
    request_base: 'sharedUrl',
    method: 'get',
    params: query,
  })
}
// 累计预警数据
export function totalWarning(query) {
  return request({
    url: '/statistics/position/alarm/count',
    request_base: 'geoStorage',
    method: 'get',
    params: query,
  })
}
