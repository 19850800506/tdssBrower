import request from '@/utils/request'

// 获取ruleid
export function GetConfigurations(query) {
  return request({
    url: '/Configuration/GetConfigurations',
    methods: 'get',
    request_base: 'serverUrl',
    params: query,
  })
}
// 获取图片信息
export function GetStream(query) {
  return request({
    url: '/Object/GetStream',
    methods: 'get',
    params: query,
    request_base: 'sharedUrl',
    responseType: 'blob',
  })
}
// 自动切打击和间隔打击
export function Jammin(data) {
  return request({
    url: '/Operate/jammin',
    methods: 'post',
    data,
    request_base: 'sharedUrl',
    responseType: 'blob',
  })
}
