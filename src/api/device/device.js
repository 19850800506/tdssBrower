import request from '@/utils/request'

// 获取所有设备基础信息
export function DeviceInfo(query) {
  return request({
    url: '/DeviceInfo',
    methods: 'get',
    request_base: 'sharedUrl',
    params: query,
  })
}
// 获取设备的静态数据
export function Device(query) {
  return request({
    url: '/Device/acess/login',
    methods: 'get',
    request_base: 'sharedUrl',
    params: query,
  })
}
// 获取阵地数据
export function Deposition(query) {
  return request({
    url: '/Statistics/all/position',
    methods: 'get',
    request_base: 'serverUrl',
    params: query,
  })
}

// 获取阵地数据
export function getTdoa(query) {
  return request({
    url: '/tdoas',
    methods: 'get',
    request_base: 'dynamic',
    params: query,
  })
}
// 获取无线电状态
export function getRadioStatus(query) {
  return request({
    url: '/status',
    methods: 'get',
    request_base: 'radioUrl',
    params: query,
  })
}
