// #region 无人机方法
/**
 * 更新无人机
 * @param { Object } options
 * @param { String } options.id
 * @param { Number } options.lng
 * @param { Number } options.lat
 * @param { Number } options.alt
 *
 */
// 无人机弹窗
export function updateUavPop(options) {
  let layer = window.CesiumSdk._map.getLayerById('uavPopLayer')
  if (!layer) {
    layer = new window.mars3d.layer.GraphicLayer({
      id: 'uavPopLayer',
    })
    window.CesiumSdk._map.addLayer(layer)
  }

  let popGraphic = layer.getGraphicById(options.id)
  if (popGraphic) {
    if (options.lng && options.lat && options.alt) {
      popGraphic.position = [options.lng, options.lat, options.alt]
    }

    popGraphic.on('postRender', (event) => {
      // 修改设备状态
      const container = event.container.querySelector('.uav_pop')
      if (container) {
        let html = ''
        for (const key in options.params) {
          html = `<div class="pop_title"><span class="title_txt">${options.model}</span></div><div class="pop-expand" id="pop-list">`

          for (const key in options.params) {
            html += `<div><span>${key}</span><span>${options.params[key]}</span></div>`
          }
          html += `</div></div><div class="guide_line">`
        }
        container.innerHTML = html
      }
    })
  } else {
    let html
    html = `<div class="uav_pop" ><div class="pop_title"><span class="title_txt">${options.model}</span></div><div class="pop-expand" id="pop-list">`

    for (const key in options.params) {
      html += `<div><span>${key}</span><span>${options.params[key]}</span></div>`
    }
    html += `</div></div><div class="guide_line"></div>`

    popGraphic = new window.mars3d.graphic.DivGraphic({
      id: options.id,
      position: [options.lng, options.lat, options.alt],
      style: {
        html,
        horizontalOrigin: 'LEFT',
        verticalOrigin: 'LEFT',
        offsetX: 40,
        offsetY: -40,
        zIndex: 100,
      },
    })

    console.log(popGraphic, 'popGraphicpopGraphic')
    layer.addGraphic(popGraphic)
  }
}

export function updateUAV(options) {
  // 创建无人机图层
  let layer = window.CesiumSdk._map.getLayerById('uavLayer')
  if (!layer) {
    layer = new window.mars3d.layer.GraphicLayer({
      id: 'uavLayer',
    })
    window.CesiumSdk._map.addLayer(layer)
  }

  options.id = options.id || new Date().getTime()

  const url =
    window.config.uavModel ||
    `${window.location.origin}${window.location.pathname}data/uav.gltf`

  let graphic = layer.getGraphicById(options.id)
  // if (graphic) {
  //   return false
  // }
  if (graphic) {
    if (options.lng && options.lat && options.alt) {
      graphic.position = [options.lng, options.lat, options.alt]
    }

    if (options.scale) {
      graphic.scale = options.scale
    }

    graphic.on('postRender', (event) => {
      // 修改无人机弹窗的值
      const container = event.container.querySelector('#pop-list')
      if (container) {
        let html = ''
        for (const key in options.params) {
          html += `<div><span>${key}</span><span>${options.params[key]}</span></div>`
        }
        container.innerHTML = html
      }
    })
  } else {
    graphic = new window.mars3d.graphic.ModelEntity({
      id: options.id,
      position: [options.lng, options.lat, options.alt],
      type: 'UAV',
      model: options.model || '',
      style: {
        url,
        scale: options.scale || 0.5,
        maximumScale: 10000,
        minimumPixelSize: 80,
        silhouette: false,
      },
      pointerEvents: false,
      allowDrillPick: false,
    })

    layer.addGraphic(graphic)
    // graphic.flyTo()
  }

  updateUavPop(options)
  if (options.flyto) {
    setTimeout(() => {
      graphic.flyTo({
        radius: options.radius || 500,
        heading: options.heading || 40,
        pitch: options.pitch || -50,
        duration: options.duration || 2,
      })
    }, 1000)
  }

  return options.id
}
// #endregion 无人机方法

// #region 无人机轨迹
// 更新无人机轨迹
export function updateLocusLayer(options, show = true) {
  let layer = window.CesiumSdk._map.getLayerById('locus_Layer')
  if (!layer) {
    layer = new window.mars3d.layer.GraphicLayer({
      id: 'locus_Layer',
    })
    window.CesiumSdk._map.addLayer(layer)
  }
  // if (!show) {
  //   layer.show = show
  //   return
  // }
  let locusGraphic = layer.getGraphicById(options.id)

  if (locusGraphic) {
    // console.log(locusGraphic,'locusGraphic');
    const positions = options.locus.features.geometry.coordinates

    // console.log(options.locus.features.geometry.coordinates, 'coordinates')
    // const car3pos = positions.join(',')
    const car3pos = window.cesium.Cartesian3.fromDegreesArrayHeights(
      positions.join(',').split(',')
    )
    locusGraphic.positions = car3pos

    // locusGraphic.setCallbackPositions(positions)

    // locusGraphic.removeNearPoint()

    // if (options.lng && options.lat && options.alt) {
    // locusGraphic.position = options.locus.features.geometry.coordinates
    // }

    // locusGraphic = new mars3d.graphic.PolylineEntity({
    //   id: options.id,
    //   positions: options.locus.features.geometry.coordinates,
    //   style: {
    //     width: 2,
    //     clampToGround: true,
    //     materialType: 'PolylineDash',
    //     materialOptions: {
    //       color: options.color,
    //       dashLength: 5,
    //     },
    //   },
    // })
    // layer.addGraphic(locusGraphic)
  } else {
    locusGraphic = new mars3d.graphic.CurveEntity({
      id: options.id,
      positions: options.locus.features.geometry.coordinates,
      style: {
        width: 2,
        materialType: 'PolylineOutline',
        materialOptions: {
          color: options.color,
          dashLength: 5,
        },
        closure: false,
      },
    })
    layer.addGraphic(locusGraphic)
  }
}
// #endregion 无人机轨迹

// #region 加载车模型
export function updateCar(options) {
  console.log(options, 'caroptions')
  // 创建无人机图层
  let layer = window.CesiumSdk._map.getLayerById('carLayer')
  if (!layer) {
    layer = new window.mars3d.layer.GraphicLayer({
      id: 'carLayer',
    })
    window.CesiumSdk._map.addLayer(layer)
  }

  options.id = options.id || new Date().getTime()

  const url =
    window.config.carModel ||
    `${window.location.origin}${window.location.pathname}data/car.glb`

  let graphic = layer.getGraphicById(options.id)

  if (graphic) {
    if (options.lng && options.lat) {
      graphic.position = [options.lng, options.lat, 0]
    }
    if (options.scale) {
      graphic.scale = options.scale
    }
  } else {
    graphic = new window.mars3d.graphic.ModelEntity({
      id: options.id,
      position: [options.lng, options.lat, 0],
      type: 'CAR',
      style: {
        url,
        scale: options.scale || 0.1,
        maximumScale: 10000,
        minimumPixelSize: 80,
        silhouette: false,
      },
      pointerEvents: false,
      allowDrillPick: false,
    })

    layer.addGraphic(graphic)

    graphic.flyTo()
  }

  return options.id
}
// #endregion 加载车模型
