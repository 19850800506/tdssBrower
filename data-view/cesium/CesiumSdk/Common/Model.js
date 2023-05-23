import {
  Convert
} from './Convert'
var convert = new Convert()
export class Model {
  //#region 属性定义
  constructor(map, layer) {
    console.log('map,layer', map, layer);
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

  // 移除模型
  removeModel(options) {
    let graphic = this._layer.getGraphicById(options.id);
    console.log(graphic);
    this._layer.removeGraphic(graphic)
  }

  /**
   * 设置模型动态位置
   * @param { Object } options 
   * @param { Object } options.id 
   * @param { Number | string } options.time
   * @param { Number } options.lng 
   * @param { Number } options.lat
   * @param { Number } options.alt
   */
  setDynamicPosition(options) {
    let graphic = this._layer.getGraphicById(options.id);
    graphic.addDynamicPosition(graphic.point)
    graphic.addDynamicPosition(convert.lngLatPoint(options.lng, options.lat, options.alt), options.time)
  }
  //#region 无人机方法
  /**
   * 添加无人机
   * @param { Object } options 
   * @param { String } options.id
   * @param { Number } options.lng 
   * @param { Number } options.lat
   * @param { Number } options.alt
   * 
   */
  addUAV(options) {
    let text = `经度：${options.lng.toFixed(6)}°\n纬度：${options.lat.toFixed(6)}°\n高度：${options.alt.toFixed(0)}米`;
    let id = new Date().getTime()

    options.id = options.id || id
    let graphic = new window.mars3d.graphic.ModelEntity({
      id: options.id,
      position: [options.lng, options.lat, options.alt],
      type: 'UAV',
      style: {
        url: location.origin + '/data/uav.gltf',
        scale: options.scale || 0.5,
        // maximumScale: 300000,
        minimumPixelSize: 160,
        silhouette: false,
        label: {
          text: text,
          font: '12px/1.5 system-ui',
          pixelOffset: new window.cesium.Cartesian2(30, 0),
          pixelOffsetScaleByDistance: new window.cesium.NearFarScalar(1e2, 2, 5e7, 0.1),
          style: window.cesium.LabelStyle.FILL_AND_OUTLINE,
          fillColor: window.cesium.Color.WHITE,
          outlineColor: window.cesium.Color.BLACK,
          outlineWidth: 1,
          showBackground: true,
          backgroundColor: new window.cesium.Color(0, 0, 0, 0.3),
          backgroundPadding: new window.cesium.Cartesian2(5, 5),
          verticalOrigin: window.cesium.VerticalOrigin.CENTER,
          horizontalOrigin: window.cesium.HorizontalOrigin.LEFT,
          scaleByDistance: new window.cesium.NearFarScalar(1e2, 2, 5e7, 0.1)
        }
      },
    });

    this._layer.addGraphic(graphic);

    console.log('options', options.id);
    return options.id
  }

  /**
   * 移动无人机
   * @param { Object } options 
   * @param { String } options.id
   * @param { Number } options.lng 
   * @param { Number } options.lat
   * @param { Number } options.alt
   * @param { Number } options.scale
   * 
   */
  updateUAV(options) {
    let graphic = this._layer.getGraphicById(options.id);
    if (graphic != null) {
      let options_UAV = graphic.options
      if (options.lng && options.lat && options.alt) {
        options_UAV.position = [options.lng, options.lat, options.alt];

        options_UAV.style.label.text = new window.cesium.CallbackProperty(() => {
          return `经度：${options.lng.toFixed(6)}°\n纬度：${options.lat.toFixed(6)}°\n高度：${options.alt.toFixed(0)}米`;
        }, false).getValue();
      }
      if (options.scale) {
        options_UAV.style.scale = options.scale
      }

      graphic.setOptions(options_UAV)
    }
  }


  //#endregion 无人机方法

  //#region 雷达扫描方法
  /**
   * 添加雷达扫描范围
   * @param { Object } options 
   * @param { String } options.id
   * @param { Number } options.lng 
   * @param { Number } options.lat 
   * @param { Number } options.alt 
   * @param { Cesium.Cartesian3 } options.radius 椭球半径
   * 
   */
  addRadar(options) {
    options.id = options.id || new Date().getTime()
    let graphic = new window.mars3d.graphic.EllipsoidEntity({
      id: options.id,
      position: [options.lng, options.lat, options.alt],
      style: {
        radii: options.radius,
        maximumConeDegree: 90,
        material: mars3d.MaterialUtil.createMaterialProperty(mars3d.MaterialType.EllipsoidWave, {
          color: options.color || "#00ffff",
          speed: 5.0
        }),
        outline: true,
        outlineColor: window.cesium.Color.WHITE.withAlpha(0.3)
      },

    })
    graphic.addScanPlane({
      type: "heading",
      step: 0.5,
    })

    this._layer.addGraphic(graphic) //还可以另外一种写法: graphic.addTo(graphicLayer)

    return options.id

  }

  /**
   * 移动雷达扫描范围
   * @param options
   * @param { String } options.id
   * @param { Number } options.lng 
   * @param { Number } options.lat 
   * @param { Number } options.alt 
   * @param { Number } options.radius 
   * 
   * 
   * 半径
   */
  updateRadar(options) {
    let graphic = this._layer.getGraphicById(options.id);

    if (graphic != null) {
      // 清除所有扫描面
      graphic.removeAllScanPlan();
      // graphic.position = convert.pointToCartesian3(options.lng, options.lat, options.alt)
      graphic.position = [options.lng, options.lat, options.alt]
      if (options.radius) {
        graphic.options.style.radii = options.radius
      }
      //添加扫描面
      graphic.addScanPlane({
        type: "heading",
        step: 0.5,
      })
    }
  }

  //#endregion 雷达扫描方法

  //#region 圆锥
  /**
   * 添加圆锥体
   * @param { String } options.id
   * @param { Number } options.lng 
   * @param { Number } options.lat 
   * @param { Number } options.alt 
   * @param { Number } options.length 
   * @param { Number } options.topRadius 
   * @param { Number } options.bottomRadius 
   * @param { String } options.color 
   * 
   */
  addCylinder(options) {
    options = options || {}
    options.id = options.id || new Date().getTime()
    let mars3d = window.mars3d
    
    const graphic = new mars3d.graphic.CylinderPrimitive({
      id: options.id,
      position: [options.lng, options.lat, options.alt],
      style: {
        length: options.length ||9000,
        topRadius: options.topRadius ||0.0,
        bottomRadius: options.bottomRadius || 3000,
        material: mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.CircleWave, {
          color: options.color || "#02ff00",
        }),
      }
    })
    this._layer.addGraphic(graphic)
    return options.id
  }
  
  //#endregion 圆锥
  // 添加周边的圆圈刻度尺等对象
  addOutCircle() {
    var arrImg = [{
        // 刻度
        image: 'http://mars3d.cn/img/icon/calib.png',
        positions: [
          [104.41662051312065, 33.497373212878038],
          [111.11441505143736, 26.799578674450764],
        ],
      },
      {
        // 刻度尺
        image: 'http://mars3d.cn/img/icon/calib-value.png',
        positions: [
          [104.62935661723176, 33.284448605493367],
          [110.90123858756024, 27.012566635061315],
        ],
      },
      {
        // 方向
        image: 'http://mars3d.cn/img/icon/calib-dir.png',
        positions: [
          [104.93938425401629, 32.974688164437971],
          [110.59106884830371, 27.323003570057217],
        ],
      },
    ]
    for (let i = 0; i < arrImg.length; i++) {
      var item = arrImg[i]
      var primitive = new window.mars3d.graphic.RectanglePrimitive({
        positions: item.positions,
        style: {
          materialType: window.mars3d.MaterialType.Image2,
          image: item.image,
          opacity: 0.4,
        },
      })
      this._layer.addGraphic(primitive)
    }
  }
  // 走马灯围墙
  addBorderWall(options) {
    options = options || {}
    let positions = [
      [106.65553865659828, 29.883458651621646],
      [106.65553865659828, 29.884414829138696],
      [106.70894441576242, 29.867202227041177],
      [106.67927455381748, 29.791623271742709],
      [106.68944707900723, 29.780137974585526],
      [106.69961960419832, 29.750461601421745],
      [106.69707647098464, 29.732268553522407],
      [106.69622876502251, 29.720776524229096],
      [106.69453333777213, 29.715030021303077],
      [106.691990212221, 29.693956732619477],
      [106.67673142060382, 29.667129856260926],
      [106.66571118178818, 29.657547116826007],
      [106.63943215901904, 29.649880273249388],
      [106.63095505341707, 29.56838438195206],
      [106.62671650061549, 29.57030267815913],
      [106.62671650061549, 29.56838438195206],
      [106.57161531419989, 29.590442639714767],
      [106.60213289743425, 29.661380326617878],
      [106.58517868622795, 29.68629263490406],
      [106.58094013342768, 29.701620251985938],
      [106.58941723903073, 29.756206087027374],
      [106.59450349779329, 29.77056590403094],
      [106.60213289743425, 29.78396655497174],
      [106.61315312858624, 29.793537358035115],
      [106.61400084221197, 29.793537358035115],
      [106.61739168138776, 29.796408419557325],
      [106.63010733979128, 29.80310725553291],
      [106.64027986498238, 29.80502113387327],
      [106.65214781742256, 29.884414829138696],
      [106.65553865659828, 29.883458651621646],
    ]
    var scrollWall = new window.mars3d.graphic.ScrollWall({
      id: options.id,
      positions: options.positions || positions,
      style: {
        diffHeight: options.diffHeight || 100000, //高度
        color: options.color || '#ff0000',
        speed: options.speed || 10,
        reverse: options.speed ? true : false, //方向：true往上、false往下
      },
    })
    this._layer.addGraphic(scrollWall)
  }
}