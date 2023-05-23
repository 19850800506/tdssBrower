import request from '@/utils/request'

// 图表绘制年
export function getrecentmonthdata(query) {
  return request({
    url: '/statistics/position/alarm/months',
    methods: 'get',
    request_base: 'geoStorage',
    params: query,
  })
}
// 图表绘制月
export function getrecentdaydata(query) {
  return request({
    url: '/statistics/position/alarm/days',
    methods: 'get',
    request_base: 'geoStorage',
    params: query,
  })
}
// 图表绘制日
export function getconcretedaydata(query) {
  return request({
    url: '/statistics/position/alarm/oneday',
    methods: 'get',
    request_base: 'geoStorage',
    params: query,
  })
}

// 获取入侵方位信息 type  获取类型：1：日，2：月，3：年
export function getinvasionlocationinfo(query) {
  return request({
    url: '/statistics/sector/direction',
    methods: 'get',
    request_base: 'geoStorage',
    params: query,
  })
}
