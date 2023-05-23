import {
  Convert
} from './Convert'
var convert = new Convert()

export class Draw {
  //#region 属性定义
  constructor(map, layer) {
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

  //#region 天气特效
  /**
   * 开启特效
   * @param { String } type 
   */
  showEffect(options) {
    options = options || {}
    let effect, cover
    switch (options.type) {
      case 'fog':
        effect = window.fogEffect
        break;
      case 'rain':
        effect = window.rainEffect
        break;
      case 'snow':
        effect = window.fogEffect
        cover = window.snowCover
        break;
      default:
        if (window.fogEffect) {
          window.fogEffect.enabled = true
        } else if (window.rainEffect) {
          window.rainEffect.enabled = true
        } else if (window.snowEffect && window.snowCover) {
          window.snowEffect.enabled = true
          window.snowCover.enabled = true
        }
        break;
    }

    if (effect) {
      effect.enabled = true
    }
    if (cover) {
      cover.enabled = true
    }

  }
  /**
   * 关闭特效
   * @param { String } type 
   */
  hideEffect(options) {
    options = options || {}
    let effect, cover
    switch (options.type) {
      case 'fog':
        effect = window.fogEffect
        break;
      case 'rain':
        effect = window.rainEffect
        break;
      case 'snow':
        effect = window.snowEffect
        cover = window.snowCover
        break;
      default:
        if (window.fogEffect) {
          window.fogEffect.enabled = false
        }
        if (window.rainEffect) {
          window.rainEffect.enabled = false
        }

        if (window.snowEffect && window.snowCover) {
          window.snowEffect.enabled = false
          window.snowCover.enabled = false
        }
        break;
    }

    if (effect) {
      effect.enabled = false
    }
    if (cover) {
      cover.enabled = false
    }
  }
  /**
   * 雾特效
   * @param { String } options.Color 
   * @param { Number } options.near 可视近距离
   * @param { Number } options.far 可视远距离
   */
  addFogEffect(options) {

    options = options || {}
    let defaultOptions = {
      maxHeight: 20000, // 大于此高度后不显示
      fogByDistance: new window.cesium.Cartesian4(options.near || 100, 0.0, options.far || 1000, 0.9),
      color: window.cesium.Color.fromCssColorString(options.color || '#FFFFFF')
    }

    window.fogEffect = new window.mars3d.effect.FogEffect(defaultOptions)
    this._map.addEffect(window.fogEffect)
  }
  /**
   * 修改雾特效
   * @param { Object } options 
   * @param { String } options.Color 
   * @param { Number } options.near 可视近距离
   * @param { Number } options.far 可视远距离
   */
  updateFogEffect(options) {
    options = options || {}
    let effect = window.fogEffect
    if (effect) {
      if (options.color) {
        effect.color = Cesium.Color.fromCssColorString(options.color)
      }
      if (options.near) {
        effect.fogByDistance.x = options.near
      }
      if (options.far) {
        effect.fogByDistance.x = options.far
      }
    }
  }

  /**
   * 雨特效
   * @param { Object } options 
   * @param { Number } options.speed 速度
   * @param { Number } options.size 大小
   * @param { Number } options.direction 方向
   */
  addRainEffect(options) {
    options = options || {}

    window.rainEffect = new window.mars3d.effect.RainEffect({
      speed: options.speed || 10,
      size: options.speed || 20,
      direction: options.speed || -30
    })
    this._map.addEffect(window.effect)
  }
  /**
   * 修改雨特效
   * @param { Object } options 
   * @param { Number } options.speed 速度
   * @param { Number } options.size 大小
   * @param { Number } options.direction 方向
   */
  updateRainEffect(options) {
    options = options || {}
    let effect = window.rainEffect
    if (effect) {
      if (options.speed) {
        effect.speed = options.speed
      }
      if (options.size) {
        effect.size = options.size
      }
      if (options.direction) {
        effect.direction = options.direction
      }
    }
  }

  /**
   * 雪特效
   * @param { Object } options 
   * @param { Number } options.speed 速度
   * @param { Number } options.alpha 积雪厚度 0~1
   */
  addSnowEffect(options) {
    options = options || {}
    window.snowEffect = new mars3d.effect.SnowEffect({
      speed: options.speed || 20
    })
    this._map.addEffect(window.snowEffect)

    window.snowCover = new mars3d.effect.SnowCoverEffect({
      maxHeight: 8000, // 大于此高度后不显示
      alpha: options || 0.6
    })
    this._map.addEffect(window.snowCover)
  }

  /**
   * 修改雪特效
   * @param { Object } options 
   * @param { Number } options.speed 速度
   * @param { Number } options.alpha 积雪厚度 0~1
   */
  updateSnowEffect(options) {
    options = options || {}
    let effect = window.snowEffect
    let cover = window.snowCover
    if (effect) {
      if (options.speed) {
        effect.speed = options.speed
      }
      if (options.size) {
        cover.alpha = options.alpha
      }
    }
  }
  //#endregion 天气特效

  //#region 图表绘制
  drawChartByType(options = {}) {
    let {
      baseURL = 'http://192.168.3.11:5799',
        url,
        type,
        method = 'get',
        requestParams = {},
        start_time = '2020-01-01',
        end_time = '2021-07-01',
        device_id = '1090103001000234',
        rule_id = '1040103001000105',
        ...chartParamsOptions
    } = options
    url = '/api/shared/DeviceData/dynamic/count/year'
    if (type === 'DeviceData_year') {
      url = '/api/shared/DeviceData/dynamic/count/year'
    } else if (type === 'DeviceData_month') {
      url = '/api/shared/DeviceData/dynamic/count/month'
    } else if (type === 'DeviceData_day') {
      url = '/api/shared/DeviceData/dynamic/count/day'
    } else if (type === 'DeviceData_azimuth') {
      url = '/api/shared/DeviceData/dynamic/count/azimuth'
    }


    convert.request({
      url,
      baseURL,
      method,
      params: {
        start_time,
        end_time,
        device_id,
        rule_id,
        ...requestParams,
      }
    }).then(res => {
      // 模拟data
      // if (type === 'DeviceData_azimuth'){
      //   res.data = {
      //     "data": [{
      //         "event_name": "入侵",
      //         "event_id": "1",
      //         "data": [{
      //             "order": 1,
      //             "name": "北",
      //             "count": 1
      //           },
      //           {
      //             "order": 2,
      //             "name": "东北",
      //             "count": 1
      //           },
      //           {
      //             "order": 3,
      //             "name": "东",
      //             "count": 1
      //           },
      //           {
      //             "order": 4,
      //             "name": "东南",
      //             "count": 1
      //           },
      //           {
      //             "order": 5,
      //             "name": "南",
      //             "count": 1
      //           },
      //           {
      //             "order": 6,
      //             "name": "西南",
      //             "count": 1
      //           },
      //           {
      //             "order": 7,
      //             "name": "西",
      //             "count": 1
      //           },
      //           {
      //             "order": 8,
      //             "name": "西北",
      //             "count": 1
      //           }
      //         ]
      //       },
      //       {
      //         "event_name": "警告",
      //         "event_id": "2",
      //         "data": [{
      //             "order": 1,
      //             "name": "北",
      //             "count": 3
      //           },
      //           {
      //             "order": 2,
      //             "name": "东北",
      //             "count": 3
      //           },
      //           {
      //             "order": 3,
      //             "name": "东",
      //             "count": 3
      //           },
      //           {
      //             "order": 4,
      //             "name": "东南",
      //             "count": 3
      //           },
      //           {
      //             "order": 5,
      //             "name": "南",
      //             "count": 3
      //           },
      //           {
      //             "order": 6,
      //             "name": "西南",
      //             "count": 3
      //           },
      //           {
      //             "order": 7,
      //             "name": "西",
      //             "count": 3
      //           },
      //           {
      //             "order": 8,
      //             "name": "西北",
      //             "count": 1
      //           }
      //         ]
      //       },
      //       {
      //         "event_name": "正常",
      //         "event_id": "3",
      //         "data": [{
      //             "order": 1,
      //             "name": "北",
      //             "count": 5
      //           },
      //           {
      //             "order": 2,
      //             "name": "东北",
      //             "count": 5
      //           },
      //           {
      //             "order": 3,
      //             "name": "东",
      //             "count": 5
      //           },
      //           {
      //             "order": 4,
      //             "name": "东南",
      //             "count": 5
      //           },
      //           {
      //             "order": 5,
      //             "name": "南",
      //             "count": 5
      //           },
      //           {
      //             "order": 6,
      //             "name": "西南",
      //             "count": 5
      //           },
      //           {
      //             "order": 7,
      //             "name": "西",
      //             "count": 5
      //           },
      //           {
      //             "order": 8,
      //             "name": "西北",
      //             "count": 5
      //           }
      //         ]
      //       }
      //     ],
      //     "code": 0,
      //     "msg": "success"
      //   }
      // } else  {
      //   res.data = {
      //     "data": {
      //       "xAxis": [
      //         "2021",
      //         "2022",
      //         "2023"
      //       ],
      //       "series": [{
      //           "name": "入侵",
      //           "id": "1",
      //           "data": [
      //             1,
      //             1,
      //             0
      //           ]
      //         },
      //         {
      //           "name": "警告",
      //           "id": "2",
      //           "data": [
      //             0,
      //             1,
      //             0
      //           ]
      //         },
      //         {
      //           "name": "正常",
      //           "id": "3",
      //           "data": [
      //             0,
      //             0,
      //             0
      //           ]
      //         }
      //       ]
      //     },
      //     "code": 0,
      //     "msg": "success"
      //   }
      // }



      if (res.data.code == 0) {
        let data = res.data.data

        console.log('data',data,type);
        if (type === 'DeviceData_azimuth') {
          if (res.data.data.length) {
            // 方向
            let direction = ['北','西北','西','西南','南','东南','东','东北']
            //求雷达图最大值 默认10
            let max = 10
            data.forEach(el => {
              let maxCount = Math.max.apply(null, el.data.map(el => el.count))
              max = maxCount > maxCount ? maxCount : max
            })

            let indicator = direction.map(el => {
              return {
                text: el,
                max,
              }
            })

            let series = [{
              type: 'radar',
              tooltip: {
                trigger: 'item'
              },
              areaStyle: {},
              data: data.map(el => {
                return {
                  name: el.event_name,
                  value: direction.map(ele => {
                    return el.data.find(item => item.name = ele).count
                  })
                }
              })
            }]

            let chartOptions = {
              id: options.id,
              animation: false,
              radar: {
                indicator,
                center: ['25%', '40%'],
                radius: 80
              },
              legend: {
                data: data.map(el => el.event_name),
                left: '20%',
                top: '25%',
                textStyle: {
                  color: '#fff',
                },
              },
              series,
              ...chartParamsOptions
            }

            this.drawChart(chartOptions)

          }

        } else {
        
          data.series.forEach((el) => {
            el.type = 'bar'
            el.data = el.data.map((ele, ind) => {
              return {
                name: data.xAxis[ind],
                value: ele
              }
            })
          })

          let chartOptions = {
            id: options.id,
            animation: false,
            tooltip: {
              trigger: "item",
            },
            grid: {
              right: 40,
              top: 100,
              bottom: 40,
              width: "30%",
            },
            xAxis: {
              type: "category",
              nameGap: 16,
              axisLine: {
                show: true,
                lineStyle: {
                  color: "#fff",
                },
              },
              axisTick: {
                lineStyle: {
                  color: "#fff",
                },
              },
              axisLabel: {
                interval: 0,
                color: "#fff",
              },
              data: data.xAxis,
            },
            legend: {
              data: data.series.map(el => el.name),
              right: 150,
              textStyle: {
                color: '#fff',
              },
            },
            yAxis: {
              type: "value",
              scale: true,
              position: "top",
              boundaryGap: false,
              splitLine: {
                show: true,
              },
              axisTick: {
                show: true,
              },
              axisLabel: {
                margin: 2,
                color: "#fff",
              },
            },
            series: data.series,
            ...chartParamsOptions
          }
          // let drawOptions = this.setChartOPtions(chartOptions)

          this.drawChart(chartOptions)
        }

      }

    })
  }

  drawChart(options = {}) {
    // 创建echarts图层
    options.id = options.id || new Date().getTime()
    console.log(JSON.stringify(options));
    // return
    const echartsLayer = new window.mars3d.layer.EchartsLayer(options)
    echartsLayer.pointerEvents = false
    this._map.addLayer(echartsLayer)
    return options.id
  }

  removeChart(options){
    let layer = this._map.getLayerById(options.id)
    if(layer){
      this._map.removeLayer(layer,true)
    }
  }

  //#endregion 图表绘制
}
