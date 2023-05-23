/**
 * #region
 * 球上设备模型配置
 */
// 加载设备配置
export function loadDeviceSpecial(deviceOption, show = true) {
  // console.log(deviceOption, show, 'deviceOption')
  let color
  if (
    deviceOption.type === 'aoa' ||
    deviceOption.type === 'tdoa' ||
    deviceOption.type === 'circular'
  ) {
    // aoa
    color = '#99FFFF'
    deviceOption.color = deviceOption.color || color
    addRadar(deviceOption, show)
    // addSector(deviceOption, show)
  } else if (deviceOption.type === 'omni' || deviceOption.type == 'guide') {
    const options = {
      ...deviceOption,
      // startAngle: 0,
      // endAngle: 360,
      color: '#ecc34d',
      // opacity: 0.1,
    }
    options.startAngle = -150
    options.endAngle = -150
    options.opacity = 0.3
    addSector(options, show)

    // CircleExpel(options, false)
  } else if (deviceOption.type == 'direct') {
    color = '#ecc34d'
    // 定向
    const options = {
      ...deviceOption,
      // startAngle: -120,
      // endAngle: -30,
      color,
      opacity: 0.2,
    }
    addSector(options, show)
  } else if (deviceOption.type == 'video') {
    // 视频（光电）
    color = '#4bdd85'
    addCircleEntity(deviceOption, show)
  } else if (deviceOption.type == 'crack') {
    if (deviceOption.deviceType === 'detect') {
      color = '#99FFFF'
      deviceOption.color = deviceOption.color || color
      addRadar(deviceOption, show)
    } else {
      const options = {
        ...deviceOption,
        // startAngle: 0,
        // endAngle: 360,
        color: '#ecc34d',
        opacity: 0.1,
      }
      options.startAngle = -150
      options.endAngle = -150
      options.opacity = 0.3
      addSector(options, show)
    }
  }
}

// AOA TDOA 雷达罩Layer
export function addRadar(options, show = true) {
  console.log(options, show, 'options')
  let layer = window.CesiumSdk._map.getLayerById(`device_layerId${options.id}`) // 雷达罩Layer
  if (!layer) {
    layer = new window.mars3d.layer.GraphicLayer({
      id: `device_layerId${options.id}`,
      pid: 'device_layer',
    })
    window.CesiumSdk._map.addLayer(layer)
  }
  // 显隐
  layer.show = show

  // 是否添加过雷达罩
  let graphic = layer.getGraphicById(`device_Radar_${options.id}`)

  if (graphic) {
    // if (
    //   graphic.options.attr.lng != options.lng ||
    //   graphic.options.attr.lat != options.lat
    // ) {
    // graphic.positions = new window.mars3d.LngLatPoint(
    //   options.lng,
    //   options.lat,
    //   options.alt
    // )
    // }
    // layer.removeGraphic(graphic)
    // graphic = null
  } else {
    // 雷达罩
    graphic = new window.mars3d.graphic.EllipsoidEntity({
      flyTo: true,
      id: `device_Radar_${options.id}`,
      allowDrillPick: true,
      position: [options.lng, options.lat, options.alt],
      style: {
        radii: options.radius,
        maximumConeDegree: 90,
        color: options.color || '#99FFFF',
        opacity: options.opacity || 0.3,
        outline: false,
        outlineColor: window.cesium.Color.WHITE.withAlpha(0.3),
      },
      attr: options,
    })
    layer.addGraphic(graphic)
    // 添加扫描面
    graphic.addScanPlane({
      step: 0.3,
      style: {
        opacity: 0.2,
        color: options.color || '#99FFFF',
      },
    })
  }
  // window.CesiumSdk.Camera().flyToPoint({
  //   lat: options.lat,
  //   lng: options.lng,
  //   alt: 0,
  //   radius: 15000,
  //   heading: 0,
  //   pitch: -60,
  // })

  return graphic
}

// 定向  全向 添加扇形区域
export function addSector(options, show = true) {
  console.log(options, 'options4')
  const layerId = `device_layerId${options.id}`
  let layer = window.CesiumSdk._map.getLayerById(layerId) // 定向Layer
  if (!layer) {
    layer = new window.mars3d.layer.GraphicLayer({
      id: layerId,
      pid: 'device_layer',
    })
    window.CesiumSdk._map.addLayer(layer)
  }

  // 显隐
  layer.show = show

  // 是否添加过扇形区域
  let graphic = layer.getGraphicById(`device_Sector_${options.id}`)

  if (graphic) {
    layer.removeGraphic(graphic)
    graphic = null
    graphic = new window.mars3d.graphic.Sector({
      id: `device_Sector_${options.id}`,
      positions: [[options.lng, options.lat, options.alt]],
      style: {
        radius: options.radius || 3000,
        startAngle: options.startAngle || -150, // 开始角度(正东方向为0,顺时针到360度)
        endAngle: options.endAngle || -30,
        diffHeight: options.diffHeight || 0,
        color: options.color || '#99FFFF',
        opacity: options.opacity || 0.5,
        outline: false,
      },
    })
    layer.addGraphic(graphic)
  } else {
    // 扇形区域
    graphic = new window.mars3d.graphic.Sector({
      id: `device_Sector_${options.id}`,
      positions: [[options.lng, options.lat, options.alt]],
      style: {
        radius: options.radius || 5000,
        startAngle: options.startAngle || -150, // 开始角度(正东方向为0,顺时针到360度)
        endAngle: options.endAngle || -30,
        diffHeight: options.diffHeight || 0,
        color: options.color || '#99FFFF',
        opacity: options.opacity || 0.5,
        outline: false,
      },
    })

    layer.addGraphic(graphic)
  }

  return graphic
}
// 光电 添加扫描面
const scanImg = require('../../assets/images/circle-scan.png')

export function addCircleEntity(options, show = true) {
  const layerId = `device_layerId${options.id}`
  let layer = window.CesiumSdk._map.getLayerById(layerId) // 光电Layer
  if (!layer) {
    layer = new window.mars3d.layer.GraphicLayer({
      id: layerId,
      pid: 'device_layer',
    })
    window.CesiumSdk._map.addLayer(layer)
  }

  // 显隐
  layer.show = show

  // 是否添加扫描面
  let graphic = layer.getGraphicById(`device_${options.id}`)

  if (graphic) {
    // layer.removeGraphic(graphic)
    // graphic = null
  } else {
    let _rotation = 1

    // 扫描面
    graphic = new window.mars3d.graphic.CircleEntity({
      id: `device_${options.id}`,
      position: [options.lng, options.lat, options.alt],
      style: {
        radius: options.radius || 1000,
        clampToGround: false,
        // 扫描材质
        materialType: 'CircleScan',
        materialOptions: {
          image: scanImg,
          color: '#ff0000',
          opacity: 0.2,
        },
        stRotation: new window.Cesium.CallbackProperty(function (e) {
          _rotation += 0.01
          return _rotation
        }, false),
        classificationType: window.Cesium.ClassificationType.BOTH,
      },
    })

    layer.addGraphic(graphic)
  }
}

// 设备点位
export function addDivLightPoint(options, show = true) {
  let layer = window.CesiumSdk._map.getLayerById(options.layerId) // 设备点位Layer
  if (!layer) {
    layer = new window.mars3d.layer.GraphicLayer({
      id: options.layerId,
    })
    window.CesiumSdk._map.addLayer(layer)
  }
  if (layer) {
    // 显隐
    layer.show = show
  }

  // 是否添加设备点位
  let graphic = layer.getGraphicById(`point_${options.id}`)

  if (graphic) {
    return
    // layer.removeGraphic(graphic);
    // graphic = null;
  }
  // 设备点位
  graphic = new window.mars3d.graphic.DivLightPoint({
    id: `point_${options.id}`,
    position: new window.mars3d.LngLatPoint(
      options.lng,
      options.lat,
      options.alt || 0
    ),
    style: {
      size: options.size || 10,
      color: options.color || '#5158fa',
      // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 200000), // 按视距距离显示
    },
    attr: options,
  })

  layer.addGraphic(graphic)
  addPopup(graphic)
  return graphic
}
// 添加设备
export function addDevicePoi(options, show = true) {
  let layer = window.CesiumSdk._map.getLayerById(
    `deviceDivLayer_Popup${options.id}`
  ) // 设备点位Layer
  if (!layer) {
    layer = new window.mars3d.layer.GraphicLayer({
      id: `deviceDivLayer_Popup${options.id}`,
    })
    window.CesiumSdk._map.addLayer(layer)
  }
  if (layer) {
    // 显隐
    layer.show = show
  }

  // 是否添加设备点位
  let graphic = layer.getGraphicById(`deviceDivPoint_${options.id}`)
  if (graphic) {
    return graphic
    // layer.removeGraphic(graphic);
    // graphic = null;
  }
  // 设备点位
  try {
    graphic = new window.mars3d.graphic.BillboardEntity({
      id: `deviceDivPoint_${options.id}`,
      position: new window.mars3d.LngLatPoint(options.lng, options.lat, 0),
      style: {
        image: require(`../../assets/images/popup/${options.type}.png`),
        scaleByDistance: true,
        scaleByDistance_near: 10000,
        scaleByDistance_nearValue: 0.7,
        visibleDepth: false,
        clampToGround: true,
      },
      attr: options,
    })
    layer.addGraphic(graphic)

    addPopup(graphic)
  } catch (error) {
    // console.error(error)

    graphic = null
  }
  return graphic
}
// 设备点位添加弹窗
export function addPopup(graphic) {
  graphic.bindPopup((event) => {
    const item = event.graphic.attr

    if (!item) {
      return false
    }
    const html = `<div class="petrol_station shebei">
      <div class="vague"></div>
      <div><span>名称：</span><span>${item.name}</span></div>
      <div><span>类型：</span><span>${item.typeName}</span></div>
      <div id="device_popup_status"><span>状态：</span><span ${
        item.state == '离线' ? 'class="offlineColor"' : ''
      }>${item.state || '在线'}</span></div>
    </div>`

    return html
  })

  graphic.on('postRender', (event) => {
    const { container, attr } = event

    const statusDiv = container.querySelector('#device_popup_status')

    // 监听状态更新
    if (statusDiv) {
      statusDiv.innerHTML = `<span>状态：</span><span ${
        attr.state == '离线' ? 'class="offlineColor"' : ''
      }>${attr.state || '在线'}</span>`
    }
  })
}

// 电子围栏
export function addBoundaryWall(options, show = true) {
  const layerId = `place_BoundaryWall_${options.id}`
  const image = require('../../assets/images/fence.png')
  let layer = window.CesiumSdk._map.getLayerById(layerId)
  if (!layer) {
    layer = new window.mars3d.layer.GraphicLayer({
      id: layerId,
      pid: 'geojson_place',
    })
    window.CesiumSdk._map.addLayer(layer)
  }
  // 显隐
  layer.show = show
  let graphic = layer.getGraphicById(`device_${options.id}`)

  if (graphic) {
    layer.removeGraphic(graphic)
    graphic = null
    graphic = new window.mars3d.graphic.WallEntity({
      id: `device_${options.id}`,
      positions: options.data.geometry.coordinates[0][0],
      style: {
        diffHeight: 500,
        materialType: 'LineFlow',
        materialOptions: {
          image,
          color: options.color || '#00ffff',
          axisY: true,
          speed: 10,
        },
      },
    })
    layer.addGraphic(graphic)
  } else {
    graphic = new window.mars3d.graphic.WallEntity({
      positions: options.data.geometry.coordinates[0][0],
      style: {
        diffHeight: 100,
        materialType: 'LineFlow',
        clampToGround: true,
        materialOptions: {
          image,
          color: options.color || '#00ffff',
          axisY: true,
          speed: 10,
        },
      },
    })
    layer.addGraphic(graphic)
  }
}
// 圆形扩散效果（驱离状态动画）
export function CircleExpel(options, show) {
  const layerId = `device_layerId${options.id}`
  let layer = window.CesiumSdk._map.getLayerById(layerId) // 定向Layer
  if (!layer) {
    layer = new window.mars3d.layer.GraphicLayer({
      id: layerId,
      pid: 'device_layer',
    })
    window.CesiumSdk._map.addLayer(layer)
  }

  // 是否添加过扇形区域
  let graphic = layer.getGraphicById(`device_circleExpel_${options.id}`)

  if (!graphic) {
    graphic = new window.mars3d.graphic.CirclePrimitive({
      position: [options.lng, options.lat, options.alt],
      style: {
        radius: options.radius || 3000,
        materialType: 'ScanLine',
        materialOptions: {
          color: new window.cesium.Color(1.0, 1.0, 0.0, 1.0),
          speed: 10,
        },
        clampToGround: true, // 是否贴地
      },
    })
    layer.addGraphic(graphic)
  }

  graphic.show = show

  return graphic
}

// 无人机缩放效果（迫降状态动画）
export function scaleUav(options) {
  let layer = window.CesiumSdk._map.getLayerById('uavPopLayer')
  if (!layer) {
    layer = new window.mars3d.layer.GraphicLayer({
      id: 'uavPopLayer',
    })
    window.CesiumSdk._map.addLayer(layer)
  }
}
