import { Convert } from './Convert'
var convert =  new Convert()

export class Camera {
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
  
  //#region 球体视角自转
  startMapRotate(options){
    this.stopMapRotate()
    
    window.CesiumSdk.mapRotateFn = ()=>{ this.mapRotate(options) }
    this._map.on(window.mars3d.EventType.clockTick,window.CesiumSdk.mapRotateFn)
  }
  stopMapRotate() {
    this._map.off(window.mars3d.EventType.clockTick,window.CesiumSdk.mapRotateFn)
  }
  /**
   * 球体旋转
   * @param { Object } options 
   * @param { Number } options.speed 速率方向 -1~1
   * @param { Number } lng 经度
   * @param { Number } lat 纬度
   * @param { Number } alt 高度  旋转点，默认Z轴
   */
  mapRotate(options) {
    let Cartesian3,speed
    console.log(typeof(options));
    Cartesian3 = window.cesium.Cartesian3.UNIT_Z
    if(options !== null &&  typeof(options) === 'object'){
      speed = options.speed
      if(options.lng && options.lat && options.alt)
        Cartesian3 = convert.pointToCartesian3(options.lng,options.lat,options.alt)// 将经纬度转换为Cartesian3 笛卡尔点
    }
     
    this._map.camera.rotate(Cartesian3,speed)
  }
  //#endregion 球体视角自转
  
  //#region 视角飞行
  /**
   * 视角飞行
   * @param { Array } options 飞行点位数组
   */
   setCameraViewList(options){
    // 创建视点 示例
    const pointArray = [
      { lng: 108.961601, lat: 34.217109, alt: 509.2, heading: 314.5, pitch: -22.5, duration: 8, stop: 0 },
      { lng: 108.96164, lat: 34.222159, alt: 510.3, heading: 211.2, pitch: -22.5, duration: 5, stop: 0 },
      { lng: 108.957259, lat: 34.221967, alt: 494.3, heading: 127.5, pitch: -17.2, duration: 5, stop: 0 },
      { lng: 108.957319, lat: 34.217225, alt: 515.5, heading: 25.4, pitch: -25.3, duration: 5 }
    ]
    options = options || pointArray

    // 视角切换（分步执行）
    this._map.setCameraViewList(options)
  }
  //#endregion 视角飞行

  //#region 绕点飞行
  /**
   * 创建环绕点位
   * @param { Object } options 
   * @param { Boolean } options.direction 方向 true逆时针，false顺时针
   * @param { Number } options.time 给定飞行一周所需时间(单位 秒)，控制速度
   * @param { Number } options.autoStopAngle //到达指定角度后自动停止
   */
  createRotatePoint(options){
    let defaultOption = {
      direction: false, 
      time: 50
      // autoStopAngle: 360,
    }
    options = options|| defaultOption
    window.rotatePoint = new window.mars3d.thing.RotatePoint(options)
    this._map.addThing(window.rotatePoint)

    
    window.rotatePoint.start()
  }
  /**
   * 开始环绕点位飞行
   * @param { Object } options 
   * @param { Number } options.lng
   * @param { Number } options.lat
   * @param { Number } options.alt
   */
  stratRotatePoint(options){
    if(window.rotatePoint){
      let point = this._map.getCenter() //默认屏幕中心点飞行
      if(options !== null &&  typeof(options) === 'object'){
        if(options.lng && options.lat && options.alt) {
          point = convert.lngLatPoint(options.lng,options.lat,options.alt)
        }
      }
      
      window.rotatePoint.start(point)
    }else {
      this.createRotatePoint()
    }
  }
  //关闭环绕点位飞行
  stopRotatePoint(){
    window.rotatePoint ?window.rotatePoint.stop():''
  }

  //#endregion 绕点飞行
  /**
   * 回到初始视角
   * @param { Object } options 
   * @param { Number } options.duration 飞行时间
   */
  flyHome(options){
    this._map.flyHome(options)
  }

  
  /**
   * 视角定位至目标点位
   * @param { Object } options 
   * @param { Number } options.lng
   * @param { Number } options.lat
   * @param { Number } options.alt
   * 
   */
   flyToPoint(options){
    if(options !== null &&  typeof(options) === 'object'){
      if(options.lng && options.lat && options.alt) {
        let point = convert.lngLatPoint(options.lng,options.lat,options.alt)
        delete options.lng
        delete options.lat
        delete options.alt

        this._map.flyToPoint(point,options)
      }
    }
  }
  /**
   * 定位至Layer 图层对象
   * @param { Object } options 
   * @param { Number } options.id
   * @param { Number } options.duration
   */
  flyToLayer(options){
    let layer = this._map.getLayerById(options.id)
    delete options.id
    layer.flyTo(options)
  }
}