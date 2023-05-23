/**
 * 防区阵地设备信息查询 接口
 */
import request from '@/utils/request'
// 获取当前用户的阵地Id集合
export function getPositionByUser(params) {
  return request({
    url: '/User/Position/positions',
    method: 'get',
    params,
    request_base: 'authority',
  })
}
// 根据阵地Id集合查询防区-阵地-设备
export function getAllInfoByPosition(data) {
  return request({
    url: '/SectorInfo/position/source/ids',
    method: 'post',
    data,
    request_base: 'sharedUrl',
  })
}

// 根据设备Id获取设备详情
export function getDeviceInfoById(params) {
  return request({
    url: '/DeviceInfo/detail',
    method: 'get',
    params,
    request_base: 'sharedUrl',
  })
}

// 查询阵地所有设备
export function getDevicesByPosition(params) {
  return request({
    url: '/PositionInfo/device',
    method: 'get',
    params,
    request_base: 'sharedUrl',
  })
}

// 查询阵地所属防区
export function getSectorByPosition(params) {
  return request({
    url: '/SectorInfo/position/owner',
    method: 'get',
    params,
    request_base: 'sharedUrl',
  })
}

// 查询所有防区-阵地-设备
export function getAllInfo() {
  return request({
    url: '/SectorInfo/position/source',
    method: 'get',
    request_base: 'sharedUrl',
  })
}
// 查询阵地天气
export function getWeather(params) {
  return request({
    url: '/PositionInfo/weather',
    method: 'get',
    params,
    request_base: 'sharedUrl',
  })
}

// 阵地详情查看
export function getPositionDetail(params) {
  return request({
    url: '/PositionInfo/detail',
    method: 'get',
    params,
    request_base: 'sharedUrl',
  })
}
// 阵地所有设备
export function getPositionDevice(params) {
  return request({
    url: '/PositionInfo/device',
    method: 'get',
    params,
    request_base: 'sharedUrl',
  })
}
// 获取阵地上所有设备在线状态
export function getAllHeartbeat(params) {
  return request({
    url: '/position',
    method: 'get',
    params,
    request_base: 'heartbeatUrl',
  })
}
