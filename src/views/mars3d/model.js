// 添加3dTitsets
export function addTitsets() {
  const tilesets = window.mapLayers
  tilesets.forEach((el) => {
    el.show = el.show === undefined || el.show === null ? true : el.show
    if (el.show) {
      let item = {
        id: el.id,
        type: el.type,
        name: el.name || el.id,
        url: el.url,
      }
      if (el.type === '3dtiles') {
        item = {
          ...item,
          maximumScreenSpaceError: 256,
          maximumMemoryUsage: 512,
          preloadWhenHidden: true,
          ...el.symbol,
        }

        const tiles3dLayer = new window.mars3d.layer.TilesetLayer(item)
        window.CesiumSdk._map.addLayer(tiles3dLayer)
      } else if (el.type === 'geojson') {
        item.symbol = el.symbol

        const tiles3dLayer = new window.mars3d.layer.GeoJsonLayer(item)
        window.CesiumSdk._map.addLayer(tiles3dLayer)
      }
    }
  })
}
/**
 * #region
 * 加载layers.json 配置文件
 */
// 加载配置文件的layer
export function loadLayconfig(jsonOption, show = true) {
  jsonOption.show = show
  // 加载geojson
  if (jsonOption.type === 'geojson') {
    if (jsonOption.symbol instanceof Array) {
      // 数组渲染多个 geojson 行政区划
      jsonOption.symbol.forEach((item, index) => {
        const options = {
          ...jsonOption,
          id: `${jsonOption.id}_${item.type}`,
          symbol: {
            ...item,
          },
        }
        loadgeojsonLayer(options, show)
      })
    } else {
      loadgeojsonLayer(jsonOption, show)
    }
  } else if (jsonOption.type === 'ADS-B') {
    // 加载ADS-B
    loadADS(jsonOption, show)
  } else if (jsonOption.type === '3dtiles') {
    // 加载3dtiles
    loadTitsets(jsonOption, show)
  } else if (jsonOption.type === 'polyJson') {
    // 普通聚合数据  设备聚合数据
    loadPoly(jsonOption, show)
  }
}
// 加载3dtileslayers部分
export function loadTitsets(options, show = true) {
  // 查询是否有layer
  let layer = window.CesiumSdk._map.getLayerById(options.id)
  // 若layer没值 切 show为true 创建新的layer赋值
  if (!layer && show) {
    const geoOptions = {
      ...options,
      maximumScreenSpaceError: 256,
      maximumMemoryUsage: 512,
      preloadWhenHidden: true,
      ...options.symbol,
    }
    layer = new window.mars3d.layer.TilesetLayer(geoOptions)
    window.CesiumSdk._map.addLayer(layer)
  }
  // 显隐
  layer.show = show
}

/**
 * ADS-B 方法
 */
// 加载ADS-B layer
export function loadADS(options, show = true) {
  // 查询是否有layer
  let layer = window.CesiumSdk._map.getLayerById(options.id)
  if (!layer) {
    layer = new window.mars3d.layer.GraphicLayer({ id: options.id })
    window.CesiumSdk._map.addLayer(layer)

    window.mars3d.Util.fetchJson({ url: options.url }).then((res) => {
      const billArr = res

      billArr.forEach((el) => {
        addfeiji(layer, { ...el, ...options.symbol })
      })
    })
    // 定时器添加动态点位
    setInterval(() => {
      window.mars3d.Util.fetchJson({ url: options.url }).then((res) => {
        const billArr = res
        // 移除没有的飞机
        layer.eachGraphic((graphic) => {
          if (
            graphic.options &&
            graphic.options.id &&
            !billArr.find((el) => el.hex_id === graphic.options.id)
          ) {
            graphic.remove()
          }
        })

        billArr.forEach((el) => {
          addfeiji(layer, { ...el, ...options.symbol })
        })
      })
    }, options.symbol.temptime)
  }
  // 显隐
  layer.show = show
}
// 添加飞机模型 和 动态点位
function addfeiji(graphicLayer, options) {
  const r = GetThisLngLat(options)
  let graphic = graphicLayer.getGraphicById(options.hex_id)
  if (graphic) {
    graphic.addDynamicPosition(
      window.Cesium.Cartesian3.fromDegrees(
        r[0],
        r[1],
        options.alt * 0.3048 || 30
      ),
      options.temptime / 1000
    )
  } else {
    graphic = new mars3d.graphic.ModelEntity({
      id: options.hex_id,
      style: {
        url: options.glftUrl,
        scale: options.scale || 1,
        minimumPixelSize: options.minimumPixelSize || 50,
        label: {
          text: options.hex_id,
          font: '16px/1.5 system-ui',
          color: '#ffffff',
          pixelOffsetY: -40,
        },
      },
    })

    graphicLayer.addGraphic(graphic)
    graphic.addDynamicPosition(
      window.Cesium.Cartesian3.fromDegrees(
        options.lng,
        options.lat,
        options.alt * 0.3048 || 30
      )
    )

    graphic.addDynamicPosition(
      window.Cesium.Cartesian3.fromDegrees(
        r[0],
        r[1],
        options.alt * 0.3048 || 30
      ),
      options.temptime / 1000
    )
  }
}

function GetThisLngLat(options) {
  const time = GetDateDiff(options.time, 'second') + 5
  const dis = time * options.spd * 0.514444444856
  // mapNumberUtil.getLonAndLat(options.lng,options.lat,options.track,dis);
  return GetLngLat(options.lng, options.lat, dis, options.track)
}

function TempcreNum(latorlng) {
  return latorlng + Math.floor(Math.random() * 10) * 0.01 // 可均衡获取 0 到 9 的随机整数
}

function GetDateDiff(startTime, diffType) {
  // r=confirm(startTime)
  // 将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
  startTime = startTime.replace(/\-/g, '/')
  // endTime = endTime.replace(/\-/g, "/");
  // 将计算间隔类性字符转换为小写
  diffType = diffType.toLowerCase()
  const sTime = new Date(startTime) // 开始时间
  // var eTime =new Date(endTime); //结束时间
  const eTime = new Date()
  // 作为除数的数字
  let timeType = 1
  switch (diffType) {
    case 'second':
      timeType = 1000
      break
    case 'minute':
      timeType = 1000 * 60
      break
    case 'hour':
      timeType = 1000 * 3600
      break
    case 'day':
      timeType = 1000 * 3600 * 24
      break
    default:
      break
  }
  const result = (eTime.getTime() - sTime.getTime()) / parseInt(timeType)

  return result
}

function GetLngLat(slng, slat, dist1, deg) {
  const arc = 6371393
  const dis = dist1
  const lon2 =
    slng + (dis * Math.sin(deg)) / ((arc * Math.cos(slat) * 2 * Math.PI) / 360)
  const lat2 = slat + (dis * Math.cos(deg)) / ((arc * 2 * Math.PI) / 360)
  //  debugger

  return [Number(lon2.toFixed(4)), Number(lat2.toFixed(4))]
}

const VincentyConstants = {
  a: 6378137,
  b: 6356752.3142,
  f: 1 / 298.257223563,
}
/**
 *Calculate destination point given start point lat/long (numeric degrees),
 * bearing (numeric degrees) & distance (in m).
 */
function destinationVincenty(lon, lat, brng, dist) {
  const { a } = VincentyConstants
  const { b } = VincentyConstants
  const { f } = VincentyConstants

  const lon1 = lon * 1 // 乘一（*1）是为了确保经纬度的数据类型为number
  const lat1 = lat * 1

  const s = dist
  const alpha1 = rad(brng)
  const sinAlpha1 = Math.sin(alpha1)
  const cosAlpha1 = Math.cos(alpha1)

  const tanU1 = (1 - f) * Math.tan(rad(lat1))
  const cosU1 = 1 / Math.sqrt(1 + tanU1 * tanU1)
  const sinU1 = tanU1 * cosU1
  const sigma1 = Math.atan2(tanU1, cosAlpha1)
  const sinAlpha = cosU1 * sinAlpha1
  const cosSqAlpha = 1 - sinAlpha * sinAlpha
  const uSq = (cosSqAlpha * (a * a - b * b)) / (b * b)
  const A = 1 + (uSq / 16384) * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)))
  const B = (uSq / 1024) * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)))

  let sigma = s / (b * A)
  let sigmaP = 2 * Math.PI
  while (Math.abs(sigma - sigmaP) > 1e-12) {
    var cos2SigmaM = Math.cos(2 * sigma1 + sigma)
    var sinSigma = Math.sin(sigma)
    var cosSigma = Math.cos(sigma)
    const deltaSigma =
      B *
      sinSigma *
      (cos2SigmaM +
        (B / 4) *
          (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
            (B / 6) *
              cos2SigmaM *
              (-3 + 4 * sinSigma * sinSigma) *
              (-3 + 4 * cos2SigmaM * cos2SigmaM)))
    sigmaP = sigma
    sigma = s / (b * A) + deltaSigma
  }

  const tmp = sinU1 * sinSigma - cosU1 * cosSigma * cosAlpha1
  const lat2 = Math.atan2(
    sinU1 * cosSigma + cosU1 * sinSigma * cosAlpha1,
    (1 - f) * Math.sqrt(sinAlpha * sinAlpha + tmp * tmp)
  )
  const lambda = Math.atan2(
    sinSigma * sinAlpha1,
    cosU1 * cosSigma - sinU1 * sinSigma * cosAlpha1
  )
  const C = (f / 16) * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha))
  const L =
    lambda -
    (1 - C) *
      f *
      sinAlpha *
      (sigma +
        C *
          sinSigma *
          (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)))

  const revAz = Math.atan2(sinAlpha, -tmp) // final bearing

  const lon_destina = lon1 * 1 + deg(L)

  // var num_lon_dest = lon_destina*1;

  // var lon_destina = new Number;

  const lonlat_destination = { lon: lon_destina, lat: deg(lat2) }

  return lonlat_destination
}

/**
 * 度换成弧度
 * @param  {Float} d  度
 * @return {Float}   弧度
 */
function rad(d) {
  return (d * Math.PI) / 180.0
}

/**
 * 弧度换成度
 * @param  {Float} x 弧度
 * @return {Float}   度
 */
function deg(x) {
  return (x * 180) / Math.PI
}

/**
 *  行政区划方法
 */
// 加载行政区划layer
function loadgeojsonLayer(geojson, show = true) {
  let geoJsonLayer = window.CesiumSdk._map.getLayerById(geojson.id)
  // 若layer没值 切 show为true 创建新的layer赋值
  if (!geoJsonLayer && show) {
    const geoOptions = {
      ...geojson,
    }
    // console.log(geoOptions, 'geoOptions')
    // 区域高亮
    if (geojson.symbol.hightArea) {
      geoOptions.symbol.callback = (attr, styleOpt) => {
        if (attr.code === geojson.symbol.hightArea) {
          return {
            materialOptions: {
              color: geojson.symbol.hightColor || '#ecc34d', // 高亮颜色
              opacity: geojson.symbol.hightOpacity || 0.5, // 高亮区域透明度
            },
          }
        }
      }
    }
    // let buffere
    // const geojsonData = geoOptions.data
    // geojsonData.properties = {}
    // console.log(window.mars3d.PolyUtil, geojsonData, 'window.mars3d.PolyUtil')
    // buffere = window.mars3d.PolyUtil.buffer(geojsonData, 400)
    // const graphicsOptions = window.mars3d.Util.geoJsonToGraphics(buffere, {
    //   type: 'polygon',
    //   style: {
    //     color: 'rgba(255,0,0,0.4)',
    //     clampToGround: true,
    //   },
    // })
    geoJsonLayer = new mars3d.layer.GeoJsonLayer(geoOptions)
    // geoJsonLayer.addGraphic(graphicsOptions)
    window.CesiumSdk._map.addLayer(geoJsonLayer)

    // 特殊处理
    // 北京点击事件
    if (geojson.id === 'geojson_beijingArea_polygonP') {
      // beijingLayerEvent(geoJsonLayer);
    } else if (geojson.name === '全国') {
      // 全国地图 下钻
      chinaLayerEvent(geoJsonLayer)
    }
  }
  // 显隐
  geoJsonLayer.show = show
  // 跳转到北京视角
  if (geojson.flyTo === true && geojson.name === '北京' && !show) {
    const { point } = window.config.loginView.find((el) => el.name === '北京')
    window.CesiumSdk.Camera().flyToPoint(point)
  }
}

// 全国点击加载下一层级行政区划
let currentClickId = null // 记录点击的layerid
function chinaLayerEvent(geoJsonLayer) {
  geoJsonLayer.on('click', (e) => {
    if (e.graphic.attr.level === 'province') {
      e.layer.options.symbol.styleOptions.label.distanceDisplayCondition_far = 1500000
    } else if (e.graphic.attr.level === 'city') {
      e.layer.options.symbol.styleOptions.label.distanceDisplayCondition_far = 500000
    }
    let geojson = e.layer ? JSON.parse(JSON.stringify(e.layer.options)) : null
    const attr = e.graphic ? JSON.parse(JSON.stringify(e.graphic.attr)) : null
    // 县级
    if (attr.level === 'district' || !attr.level) {
      return
    }
    if (!geojson || !attr) {
      return
    }

    // 记录当前点击的layer Id
    if (
      geojson.id === 'geojson_chinaArea_full' ||
      geojson.id === 'geojson_chinaArea_full_copy'
    ) {
      // 第一次点击新增无边框地图layer 隐藏带边框layer
      const chinaJson = JSON.parse(JSON.stringify(e.layer.options))
      if (chinaJson.symbol.styleOptions.outline) {
        const copylayer = window.CesiumSdk._map.getLayerById(
          'geojson_chinaArea_full_copy'
        )
        if (copylayer) {
          copylayer.show = true
        } else {
          // 移除 label popup
          // delete chinaJson.symbol.styleOptions.label;
          // delete chinaJson.popup;
          chinaJson.symbol.styleOptions.outline = false
          chinaJson.id = 'geojson_chinaArea_full_copy'
          loadgeojsonLayer(chinaJson)
        }

        window.CesiumSdk._map.getLayerById(
          'geojson_chinaArea_full'
        ).show = false
      }

      // 更换url 加载下级geojson
      geojson.url = geojson.url.replace('100000_full', `${attr.adcode}_full`)
    } else {
      geojson.url = geojson.url.replace(geojson.id, `${attr.adcode}_full`)
    }

    geojson.id = `${attr.adcode}_full`

    geojson.symbol.styleOptions.outline = true

    // 北京地区 单独处理
    if (attr.adcode == 110000) {
      // 跳转北京视角
      const { point } = window.config.loginView.find((el) => el.name === '北京')

      window.CesiumSdk.Camera().flyToPoint(point)
      // 查找北京地区layer
      geojson = JSON.parse(
        JSON.stringify(
          window.mapLayers.find((el) => el.id === 'geojson_beijingArea')
        )
      )
      geojson.name = '全国'
      loadLayconfig(geojson)
    } else {
      e.graphic.flyTo()
      loadgeojsonLayer(geojson)
    }

    // 隐藏上次点击的layer
    if (currentClickId && currentClickId != geojson.id) {
      if (window.CesiumSdk._map.getLayerById(currentClickId)) {
        window.CesiumSdk._map.getLayerById(currentClickId).show = false
      } else if (currentClickId === 'geojson_beijingArea') {
        // 北京地区单独处理
        window.CesiumSdk._map.eachLayer((layer) => {
          if (String(layer.options.id).indexOf('geojson_beijingArea') !== -1) {
            layer.show = false
          }
        })
      }
    } else {
      window.CesiumSdk._map.getLayerById('geojson_chinaArea_full').show = false
    }
    window.CesiumSdk._map.getLayerById(
      'geojson_chinaArea_full_copy'
    ).show = true
    // 记录当前点击的layer Id
    currentClickId = geojson.id
  })
}

// 北京点击大兴，跳转大兴关闭高亮
function beijingLayerEvent(geoJsonLayer) {
  geoJsonLayer.on('click', (e) => {
    // 跳转大兴区视角
    if (e.graphic._primitive_label._text == '大兴区') {
      // 跳转大兴区视角
      const daxingpoint = {
        lat: 39.660788,
        lng: 116.450789,
        alt: 80412,
        heading: 0,
        pitch: -90,
        radius: 1,
      }
      window.CesiumSdk.Camera().flyToPoint(daxingpoint)
      window.CesiumSdk._map.getLayerById(
        'geojson_beijingArea_polygonP'
      ).show = false
    }
  })
}
