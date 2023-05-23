import request from '@/utils/request'

// 异常月报获取
export function getMothlyreport(query) {
  return request({
    url: '/mothlyreport',
    methods: 'get',
    request_base: 'radioUrl',
    params: query,
  })
}
// 异常数据下载
export function downloadExceptiond(query) {
  return request({
    url: '/exceptiondownload',
    methods: 'get',
    request_base: 'radioUrl',
    params: query,
  })
}
// 数据回放
export function getReload(query) {
  return request({
    url: '/reload',
    methods: 'get',
    request_base: 'radioUrl',
    params: query,
  })
}
