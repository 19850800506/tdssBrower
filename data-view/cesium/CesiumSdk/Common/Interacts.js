

export class Interact {
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
  

  //#region mapjson初始化
  addMap3d(elementId,options){
    return new window.mars3d.Map(elementId, options)
  }

  /**
   * 修改map参数
   * @param { Object } options 
   */
  setMapOptions(options){

  }
  //#endregion mapjson初始化

  
  //#region layer对象 图层方法
  /**
   * 初始化layer 图层
   * @param { Array } tilesets
   */
  initLayer(url,type) {
    window.CesiumSdk.marsRequest(url).then(res=>{
      this.addLayer(res,type)
    })
  }

  /**
   * 添加Tileset 瓦片图层
   * @param { Object } options 配置项
   * @param { String } options.url
   * @param { Object } options.position 自定义新的中心点位置
   * @param { Object } options.rotation 自定义旋转方向
   * @param { Number } options.maximumMemoryUsage 
   * @param { Number } options.maximumScreenSpaceError  
   * @param { Boolean | String } options.marsJzwStyle  开启或设置建筑物特效样式
   */
  addLayer(options,type) {
    if(options.id){
      this.removeLayer(options.id)
    }else {
      options.id  = 'layer_' + new Date().getTime()
    }
    let tileset
    type =  type || options.type 
    switch (type) {
      //添加 wmst 类型图层
      case 'wmts':
        tileset = new window.mars3d.layer.WmtsLayer(options)
        break;
      case 'image':
        tileset = new window.mars3d.layer.ImageLayer(options)
      break;
      case 'geojson':
        tileset = new window.mars3d.layer.GeoJsonLayer(options)
      break;
      case 'model':
        tileset = new window.mars3d.layer.ModelLayer(options)
      break;
      case 'echart':
        tileset = new window.mars3d.layer.EchartsLayer(options)
        window.addEventListener("resize", function () {
          tileset.resize()
        })
      break;
      default:
        tileset = new window.mars3d.layer.TilesetLayer(options)
      break;
    }

    this._map.addLayer(tileset);
    return options.id
  }

  /**
   * 移除图层
   * @param { String } id 图层id 
   */
  removeLayer(options){
    let layer = this._map.getLayerById(options.id)
    if(layer){
      this._map.removeLayer(layer,true)
    }
  }

  /**
   * 图层显示
   * @param { String } id 图层id 
   */
  showLayer(options){
    let layer = this._map.getLayerById(options.id)
    
    if(layer){
      layer.show = true
    }
    
  }

  /**
   * 图层隐藏
   * @param { String } id 图层id 
   */
  hideLayer(options){
    let layer = this._map.getLayerById(options.id)
    if(layer){
      layer.show = false
    }
    
  }

  /**
   * 绑定Layer 事件
   * @param { Object } options
   * @param { String } options.id 图层id 默认为原始图层
   * @param { String | Array } options.types 事件名称
   * @param { Function } options.callback  回调函数
   */
  layerEventOn(options){
    let layer = this._map.getLayerById(options.id) || this._layer
    
    if(layer){
      layer.on(options.types, options.callback)
    }
  }

  /**
   * 解绑Layer 事件 
   * @param { Object } options
   * @param { String } options.id 图层id 默认为原始图层
   * @param { String | Array } options.types 事件名称
   */
  layerEventOff(options){
    let layer = this._map.getLayerById(options.id) || this._layer
    if(layer){
      layer.off(options.types)
    }
  }

  /**
   * 修改Layer 配置项参数
   * @param { Object } options layer配置项
   */
  changeLayer(options){
    let layer = this._map.getLayerById(options.id)
    if(layer){
      // 不能随时刷新，需要隔一段时间刷新，避免卡顿
      clearTimeout(window.canrefresh)
      window.canrefresh = setTimeout(() => {
        layer.setOptions(option)
      }, 500)
    }
  }
  
  /**
   * 将layer转换为JSON
   * @param { String } id 
   */
  layerToJson(options){
    let layer = this._map.getLayerById(options.id)
    let json = layer.toJSON()
    return json
  }

  //#endregion layer对象 图层方法

  //#region geojson初始化
  /**
   * 初始化 geojson 数据 
   * @param { Array } geojsons 
   */
  initGeoJson(url) {
    window.CesiumSdk.marsRequest(url).then(res=>{
      this.addGeoJson(res)
    })
  }

  /**
   * 添加GeoJson 数据图层
   * @param { Object } options 
   * @param { String | Number } options.id
   * @param { String } options.url 
   * @param { Object | function } options.symbol  矢量数据的style样式
   */
  addGeoJson(options) {
    if(options.id){
      this.removeLayer(options.id)
    }else {
      options.id  = new Date().getTime()
    }
    let geojson = new window.mars3d.layer.GeoJsonLayer(options);
    this._map.addLayer(geojson)
    return options.id
  }

  //#endregion geojson初始化
 
  
}