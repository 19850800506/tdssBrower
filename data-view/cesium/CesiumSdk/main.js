
import  { Interact }  from './Common/Interacts';
import  { Model }  from './Common/Model';
import  { Control }  from './Common/Control';
import  { Camera }  from './Common/Camera';
import  { Convert }  from './Common/Convert';
import  { Draw }  from './Common/Draw';


class CesiumSdk { 
  //#region 属性定义
  constructor() {
    /**
     * Cesium Viewer
     * */
    this._map = null
    /**
     * 图层
     * */
    this._layer = null

  }
  /**
   * Viewer Getter
   * */
   get Map() {
    return this._map;
  }

  /**
   * Viewer Setter
   * */
  set Map(map) {
    this._map = map;

    //创建矢量数据图层
    this._layer = new window.mars3d.layer.GraphicLayer();
    this._map.addLayer(this._layer);
  }
  //mars3d 请求
  marsRequest(url){
    return new Promise((resolve)=>{
      window.mars3d.Resource.fetchJson({
        url,
      }).then(res=>{
        resolve(res)
      })
    })
  }
  
  Interact(map,layer) {
    map = map || this._map
    layer = layer || this._layer
    return new Interact(map,layer)
  }
  Model(map,layer) {
    map = map || this._map
    layer = layer || this._layer
    return new Model(map,layer)
  }
  
  Control(map,layer) {
    map = map || this._map
    layer = layer || this._layer
    return new Control(map,layer)
  }
  Camera(map,layer) {
    map = map || this._map
    layer = layer || this._layer
    return new Camera(map,layer)
  }
  Convert(map,layer){
    map = map || this._map
    layer = layer || this._layer
    return new Convert(map,layer)
  }

  Draw(map,layer){
    map = map || this._map
    layer = layer || this._layer
    return new Draw(map,layer)
  }
}

export { CesiumSdk } 