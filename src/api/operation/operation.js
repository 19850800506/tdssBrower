import request from '@/utils/request'

// 驱离单个设备
export function expelDevice(query) {
  return request({
    url: '/Attack/device/Expel',
    methods: 'get',
    request_base: 'operate',
    params: query,
  })
}
// 驱离阵地下所有设备
export function expelAllDevice(query) {
  return request({
    url: '/Attack/position/expel',
    methods: 'get',
    request_base: 'operate',
    params: query,
  })
}
// 迫降单个设备
export function forcedDevice(query) {
  return request({
    url: '/Attack/device/forced',
    methods: 'get',
    request_base: 'operate',
    params: query,
  })
}
// 迫降阵地下所有设备
export function forcedAllDevice(query) {
  return request({
    url: '/Attack/position/forced',
    methods: 'get',
    request_base: 'operate',
    params: query,
  })
}
// 自动打击
export function autoStrike(query) {
  return request({
    url: '/auto',
    methods: 'get',
    request_base: 'jammin',
    params: query,
  })
}
// 间隔打击
export function intervalStrike(query) {
  return request({
    url: '/interval',
    methods: 'get',
    request_base: 'jammin',
    params: query,
  })
}
// 电子围栏内打击压制
export function fenceStrike(query) {
  return request({
    url: '/gps',
    methods: 'get',
    request_base: 'jammin',
    params: query,
  })
}
// GPS诱导防御/驱离
export function guideOperation(query) {
  return request({
    url: '/GPSGuide/device/Guide',
    methods: 'get',
    request_base: 'operate',
    params: query,
  })
}
// GPS诱导驱离
export function guideExpel(query) {
  return request({
    url: '/GPSGuide/device/expel',
    methods: 'get',
    request_base: 'operate',
    params: query,
  })
}
// GPS诱导防御
export function guideDefense(query) {
  return request({
    url: '/GPSGuide/device/defense',
    methods: 'get',
    request_base: 'operate',
    params: query,
  })
}
// GPS诱导停止
export function guideStop(query) {
  return request({
    url: '/GPSGuide/device/stop',
    methods: 'get',
    request_base: 'operate',
    params: query,
  })
}
// 转台停止转动
export function turnStop(query) {
  return request({
    url: '/TurnTable/device/turnStop',
    methods: 'get',
    request_base: 'operate',
    params: query,
  })
}
// 设置转台转向
export function turnDirection(query) {
  return request({
    url: '/TurnTable/device/turn',
    methods: 'get',
    request_base: 'operate',
    params: query,
  })
}
// 设置转台到指定角度
export function turnAngle(query) {
  return request({
    url: '/TurnTable/device/orient',
    methods: 'get',
    request_base: 'operate',
    params: query,
  })
}
// 停止打击
export function JamminStop(query) {
  return request({
    url: '/Attack/device/JamminStop',
    methods: 'get',
    request_base: 'operate',
    params: query,
  })
}
// 光电驱离单个设备
export function expelElectronic(query) {
  return request({
    url: '/Photoelectricity/device/expel',
    methods: 'get',
    request_base: 'operate',
    params: query,
  })
}
// 光电迫降单个设备
export function forcedElectronic(query) {
  return request({
    url: '/Photoelectricity/device/forced',
    methods: 'get',
    request_base: 'operate',
    params: query,
  })
}
// 光电干扰停止单个设备
export function stopElectronic(query) {
  return request({
    url: '/Photoelectricity/device/jamminStop',
    methods: 'get',
    request_base: 'operate',
    params: query,
  })
}
// 光电摄像头转向
export function cameraTrun(query) {
  return request({
    url: '/Photoelectricity/device/video/mouseturn',
    methods: 'get',
    request_base: 'operate',
    params: query,
  })
}
// 视频流ID获取
export function getStreamID(query) {
  return request({
    url: '/streamId',
    methods: 'get',
    request_base: 'dynamic',
    params: query,
  })
}
// 查打一体 驱离单个设备
export function expelfindStrike(query) {
  return request({
    url: '/DectetJammin/device/expel',
    methods: 'get',
    request_base: 'operate',
    params: query,
  })
}
// 迫降单个设备
export function forcedfindStrike(query) {
  return request({
    url: '/DectetJammin/device/forced',
    methods: 'get',
    request_base: 'operate',
    params: query,
  })
}
// 停止单个设备
export function stopfindStrike(query) {
  return request({
    url: '/DectetJammin/device/jamminStop',
    methods: 'get',
    request_base: 'operate',
    params: query,
  })
}
