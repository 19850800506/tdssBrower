import axios from 'axios'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // 超时
  timeout: 10000,
})
// request拦截器
service.interceptors.request.use(
  (config) => {
    // get请求映射params参数
    if (config.method === 'get' && config.params) {
      let url = config.url + '?' + tansParams(config.params)
      url = url.slice(0, -1)
      config.params = {}
      config.url = url
    }
    if (config.method === 'post' || config.method === 'put') {
      const requestObj = {
        url: config.url,
        data:
          typeof config.data === 'object'
            ? JSON.stringify(config.data)
            : config.data,
        time: new Date().getTime(),
      }
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)
//参数处理
function tansParams(params) {
  let result = ''
  for (const propName of Object.keys(params)) {
    const value = params[propName]
    var part = encodeURIComponent(propName) + '='
    if (value !== null && typeof value !== 'undefined') {
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (value[key] !== null && typeof value[key] !== 'undefined') {
            let params = propName + '[' + key + ']'
            var subPart = encodeURIComponent(params) + '='
            result += subPart + encodeURIComponent(value[key]) + '&'
          }
        }
      } else {
        result += part + encodeURIComponent(value) + '&'
      }
    }
  }
  return result
}

export class Convert{
  //#region 属性定义
  constructor(map,layer) {
    /**
     * Cesium Viewer
     * */
    this._map = map
    /**
     * 图层
     * */
    this._layer = layer
  }
  //#endregion 属性定义

  
  //获取视角中心点位
  getCenter(){
    return this._map.getCenter()
  }
  /**
   * 经纬度转换为mars3d LngLatPoint 对象
   * @param { Number } lng 经度
   * @param { Number } lat 纬度
   * @param { Number } alt 高度
   */
  lngLatPoint(lng,lat,alt){
    return  new window.mars3d.LngLatPoint(lng, lat, alt)
  }
  /**
   * 经纬度转换为cesium Cartesian3 笛卡尔点 对象
   * @param { Number } lng 经度
   * @param { Number } lat 纬度
   * @param { Number } alt 高度
   */
  pointToCartesian3(lng,lat,alt){
    return new window.cesium.Cartesian3(lng, lat, alt)
  }
  /**
   * cesium Cartesian3 笛卡尔点 对象 转换为 经纬度
   * @param { cesium.Cartesian3 } cartesian3 
   */
  cartesian3ToPoint(cartesian3){
    return window.mars3d.LngLatPoint.fromCartesian(cartesian3)
  }
  
  request(params) {
    return new Promise((resolve) => {
      service(params).then((res)=>{
        resolve(res)
      })
    })
  }
}