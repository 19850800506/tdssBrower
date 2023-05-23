import request from '@/utils/request'
// 获取阵地上所有设备在线状态
export function getAllHeartbeat(params) {
  return request({
    url: '/position',
    method: 'get',
    params,
    request_base: 'heartbeatUrl',
  })
}

// 获取阵地自动打击、间隔打击
export function getJamminWorkMode(params) {
  return request({
    url: '/workmode',
    method: 'get',
    params,
    request_base: 'jammin',
  })
}

// 获取阵地报警
export function getDynamicAlarm(params) {
  return request({
    url: '/alarm',
    method: 'get',
    params,
    request_base: 'dynamic',
  })
}

// 获取阵地无人机路径
export function getDynamicLocus(params) {
  return request({
    url: '/locus',
    method: 'get',
    params,
    request_base: 'dynamic',
  })
}

// 获取阵地转台角度
export function getDynamicTurnTableAngle(params) {
  return request({
    url: '/turnTableAngle',
    method: 'get',
    params,
    request_base: 'dynamic',
  })
}

// 获取阵地打击结果
export function getDynamicJamminResult(params) {
  return request({
    url: '/jamminResult',
    method: 'get',
    params,
    request_base: 'dynamic',
  })
}

// 获取阵地打击结果
export function getDynamicScannerImg(params) {
  return request({
    url: '/scannerImg',
    method: 'get',
    params,
    request_base: 'dynamic',
  })
}

// 获取车位置
export function getCarLocation(params) {
  return request({
    url: '/carLocation',
    method: 'get',
    params,
    request_base: 'dynamic',
  })
}
// 获取车打击状态
export function getCarState(params) {
  return request({
    url: '/carJammin',
    method: 'get',
    params,
    request_base: 'dynamic',
  })
}
