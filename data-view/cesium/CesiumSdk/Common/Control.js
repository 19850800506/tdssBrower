export class Control {
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

  // 在map地图上绑定右键菜单 
  bindMapMenu(menuItems) {
    console.log(this._map);
    const contextmenuItems = menuItems || this._map.getDefaultContextMenu() // 内置的默认右键菜单获取方法
    console.log('contextmenuItems',contextmenuItems)
    this._map.bindContextMenu(contextmenuItems) 
  }
  // 解除Map已绑定的右键菜单
  unBindMapMenu() {
    this._map.unbindContextMenu()
  }

  // 在layer图层上绑定右键菜单
  bindLayerMenu(graphicLayer,menuItems) {
    
    graphicLayer = graphicLayer || this._layer
    console.log('graphicLayer',graphicLayer);
    menuItems = menuItems || [
      {
        text: "开始编辑对象",
        icon: "fa fa-edit",
        show: function (e) {
          const graphic = e.graphic
          if (!graphic || !graphic.startEditing) {
            return false
          }
          return !graphic.isEditing
        },
        callback: function (e) {
          const graphic = e.graphic
          if (!graphic) {
            return false
          }
          if (graphic) {
            graphicLayer.startEditing(graphic)
          }
        }
      },
      {
        text: "停止编辑对象",
        icon: "fa fa-edit",
        show: function (e) {
          const graphic = e.graphic
         
          if (!graphic) {
            return false
          }
          return graphic.isEditing
        },
        callback: function (e) {
          const graphic = e.graphic
          if (!graphic) {
            return false
          }
          if (graphic) {
            // if(graphic.options.type === 'UAV'){
              // let options_UAV = graphic.options
              // console.log(graphic,graphic.point,options_UAV);
              // console.log(options_UAV.positions.getValue());
              // if(options.lng && options.lat && options.alt){
              //   options_UAV.position = [options.lng, options.lat, options.alt];

              //   options_UAV.style.label.text = new window.cesium.CallbackProperty(()=>{
              //     return `经度：${options.lng.toFixed(6)}°\n纬度：${options.lat.toFixed(6)}°\n高度：${options.alt.toFixed(0)}米`;
              //   }, false).getValue();
              // }
            // }
            graphicLayer.stopEditing(graphic)
          }
        }
      },
      {
        text: "删除对象",
        icon: "fa fa-trash-o",
        callback: function (e) {
          const graphic = e.graphic
          if (graphic) {
            graphicLayer.removeGraphic(graphic)
          }
        }
      },
      {
        text: "计算长度",
        icon: "fa fa-medium",
        show: function (e) {
          const graphic = e.graphic
          return (
            graphic.type === "scrollWall" ||
            graphic.type === "polyline" ||
            graphic.type === "curve" ||
            graphic.type === "polylineVolume" ||
            graphic.type === "corridor" ||
            graphic.type === "wall" 
          )
        },
        callback: function (e) {
          const graphic = e.graphic
          const strDis = mars3d.MeasureUtil.formatDistance(graphic.distance)
          alert("该对象的长度为:" + strDis)
        }
      },
      {
        text: "计算周长",
        icon: "fa fa-medium",
        show: function (e) {
          const graphic = e.graphic
          return graphic.type === "circle" || graphic.type === "rectangle" || graphic.type === "polygon"
        },
        callback: function (e) {
          const graphic = e.graphic
          const strDis = mars3d.MeasureUtil.formatDistance(graphic.distance)
          alert("该对象的周长为:" + strDis)
        }
      },
      {
        text: "计算面积",
        icon: "fa fa-reorder",
        show: function (e) {
          const graphic = e.graphic
          return graphic.type === "circle" || graphic.type === "rectangle" || graphic.type === "polygon"
        },
        callback: function (e) {
          const graphic = e.graphic
          const strArea = mars3d.MeasureUtil.formatArea(graphic.area)
          alert("该对象的面积为:" + strArea)
        }
      }
    ]
    graphicLayer.bindContextMenu(menuItems)
  }
  // 解除layer图层上绑定的右键菜单
  unBindLayerMenu(graphicLayer) {
    graphicLayer = graphicLayer || this._layer
    graphicLayer.unbindContextMenu()
  }
  //  在graphic数据上绑定右键菜单
  bindGraphicMenu(graphic) {
    graphic.bindContextMenu([
      {
        text: '删除graphic对象',
        icon: 'fa fa-trash-o',
        callback: function (e) {
          const graphic = e.graphic
          if (graphic) {
            graphic.remove()
          }
        },
      },
    ])
  }
  // 解除Map已绑定的右键菜单
  unBindGraphicMenu(graphic) {
    graphic.unbindContextMenu()
  }
}