/**
 * Mars3D平台插件,结合mapv可视化功能插件  mars3d-mapv
 *
 * 版本信息：v3.4.2
 * 编译日期：2023-02-04 16:16:04
 * 版权所有：Copyright by 火星科技  http://mars3d.cn
 * 使用单位：中急管(北京)网络科技有限公司 ，2021-08-18
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, (window.mapv || require('mapv')), (window.mars3d || require('mars3d'))) :
  typeof define === 'function' && define.amd ? define(['exports', 'mapv', 'mars3d'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["mars3d-mapv"] = {}, global.mapv, global.mars3d));
})(this, (function (exports, mapv, mars3d) { 'use strict';

  function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () { return e[k]; }
          });
        }
      });
    }
    n["default"] = e;
    return n;
  }

  var mapv__namespace = /*#__PURE__*/_interopNamespace(mapv);
  var mars3d__namespace = /*#__PURE__*/_interopNamespace(mars3d);

  /* eslint-disable no-unused-expressions */

  const Cesium$1 = mars3d__namespace.Cesium;

  const baiduMapLayer = mapv__namespace ? mapv__namespace.baiduMapLayer : null;

  // eslint-disable-next-line no-proto
  const BaseLayer$1 = baiduMapLayer ? baiduMapLayer.__proto__ : Function;

  class MapVRenderer extends BaseLayer$1 {
    //= ========= 构造方法 ==========
    constructor(map, dataset, options, mapVLayer) {
      super(map, dataset, options);
      if (!BaseLayer$1) {
        return
      }

      this.map = map;
      this.scene = map.scene;

      this.dataSet = dataset;
      options = options || {};

      this.init(options);
      this.argCheck(options);
      this.initDevicePixelRatio();
      this.canvasLayer = mapVLayer;
      this.stopAniamation = !1;
      this.animation = options.animation;
      // this.bindEvent()
    }

    //= ========= 方法 ==========
    initDevicePixelRatio() {
      this.devicePixelRatio = window.devicePixelRatio || 1;
    }

    addAnimatorEvent() {}
    animatorMovestartEvent() {
      const t = this.options.animation;
      this.isEnabledTime() && this.animator && (this.steps.step = t.stepsRange.start);
    }

    animatorMoveendEvent() {
      this.isEnabledTime() && this.animator;
    }

    // bindEvent() {
    //   if (this.options.methods.click) {
    //     this.map.on("click", this.clickEvent, this)
    //   }
    //   if (this.options.methods.mousemove) {
    //     this.map.on("mouseMove", this.mousemoveEvent, this)
    //   }
    // }

    // unbindEvent() {
    //   this.map.off("click", this.clickEvent, this)
    //   this.map.off("mouseMove", this.mousemoveEvent, this)
    // }

    // clickEvent(event) {
    //   super.clickEvent(event.windowPosition, event)
    // }

    // mousemoveEvent(event) {
    //   super.mousemoveEvent(event.windowPosition, event)
    // }

    getContext() {
      return this.canvasLayer.canvas.getContext(this.context)
    }

    init(t) {
      this.options = t;
      this.initDataRange(t);
      this.context = this.options.context || "2d";

      if (this.options.zIndex && this.canvasLayer && this.canvasLayer.setZIndex) {
        this.canvasLayer.setZIndex(this.options.zIndex);
      }

      this.initAnimator();
    }

    _canvasUpdate(t) {
      const scene = this.scene;
      if (this.canvasLayer && !this.stopAniamation) {
        const i = this.options.animation;
        const n = this.getContext();
        if (this.isEnabledTime()) {
          // eslint-disable-next-line no-void
          if (void 0 === t) {
            // eslint-disable-next-line no-void
            return void this.clear(n)
          }
          this.context === "2d" &&
            (n.save(),
            (n.globalCompositeOperation = "destination-out"),
            (n.fillStyle = "rgba(0, 0, 0, .1)"),
            n.fillRect(0, 0, n.canvas.width, n.canvas.height),
            n.restore());
        } else {
          this.clear(n);
        }
        if (this.context === "2d") {
          for (const o in this.options) {
            n[o] = this.options[o];
          }
        } else {
          n.clear(n.COLOR_BUFFER_BIT);
        }
        const a = {
          transferCoordinate: function (data) {
            const defVal = null; // [-999, -999]

            let heightTerrain = scene.mapvFixedHeight;
            if (scene.mapvAutoHeight) {
              heightTerrain = scene.globe.getHeight(Cesium$1.Cartographic.fromDegrees(data[0], data[1]));
            }

            // 坐标转换
            const position = Cesium$1.Cartesian3.fromDegrees(data[0], data[1], heightTerrain);
            if (!position) {
              return defVal
            }
            const px = scene.cartesianToCanvasCoordinates(position);
            if (!px) {
              return defVal
            }

            // 判断是否在球的背面
            if (scene.mapvDepthTest && scene.mode === Cesium$1.SceneMode.SCENE3D) {
              const occluder = new Cesium$1.EllipsoidalOccluder(scene.globe.ellipsoid, scene.camera.positionWC);
              const visible = occluder.isPointVisible(position);
              // visible为true说明点在球的正面，否则点在球的背面。
              // 需要注意的是不能用这种方法判断点的可见性，如果球放的比较大，点跑到屏幕外面，它返回的依然为true
              if (!visible) {
                return defVal
              }
            }
            // 判断是否在球的背面

            return [px.x, px.y]
          }
        };
        // eslint-disable-next-line no-void
        void 0 !== t &&
          (a.filter = function (e) {
            const n = i.trails || 10;
            return !!(t && e.time > t - n && e.time < t)
          });
        const c = this.dataSet.get(a);
        // eslint-disable-next-line no-sequences
        this.processData(c), this.options.unit === "m" && this.options.size, (this.options._size = this.options.size);

        const h = scene.cartesianToCanvasCoordinates(Cesium$1.Cartesian3.fromDegrees(0, 0));
        if (!h) {
          return
        }

        this.drawContext(n, new mapv__namespace.DataSet(c), this.options, h);
        this.options.updateCallback && this.options.updateCallback(t);
      }
    }

    updateData(t, e) {
      let i = t;
      // eslint-disable-next-line
      i && i.get && (i = i.get()), void 0 !== i && this.dataSet.set(i);

      super.update({
        options: e
      });
    }

    addData(t, e) {
      let i = t;
      // eslint-disable-next-line
      t && t.get && (i = t.get()),
        this.dataSet.add(i),
        this.update({
          options: e
        });
    }

    getData() {
      return this.dataSet
    }

    removeData(t) {
      if (this.dataSet) {
        const e = this.dataSet.get({
          filter: function (e) {
            return t == null || typeof t !== "function" || !t(e)
          }
        });
        this.dataSet.set(e);
        this.update({
          options: null
        });
      }
    }

    clearData() {
      this.dataSet && this.dataSet.clear();
      this.update({
        options: null
      });
    }

    draw() {
      this.canvasLayer.draw();
    }

    clear(t) {
      t && t.clearRect && t.clearRect(0, 0, t.canvas.width, t.canvas.height);
    }

    destroy() {
      // this.unbindEvent()
      this.clear(this.getContext());
      this.clearData();
      this.animator && this.animator.stop();
      this.animator = null;
      this.canvasLayer = null;
    }
  }

  // 修改mapv内部方法，已适应数据在球背面或看不见的区域的数据不显示的处理
  if (mapv__namespace?.DataSet) {
    mapv__namespace.DataSet.prototype.transferCoordinate = function (data, transferFn, fromColumn, toColumnName) {
      toColumnName = toColumnName || "_coordinates";
      fromColumn = fromColumn || "coordinates";

      for (let i = 0; i < data.length; i++) {
        const geometry = data[i].geometry;
        const coordinates = geometry[fromColumn];
        switch (geometry.type) {
          case "Point":
            {
              const pt = transferFn(coordinates);
              if (pt) {
                geometry[toColumnName] = pt;
              } else {
                geometry[toColumnName] = [-999, -999];
              }
            }
            break
          case "LineString":
            {
              const newCoordinates = [];
              for (let j = 0; j < coordinates.length; j++) {
                const pt = transferFn(coordinates[j]);
                if (pt) {
                  newCoordinates.push(pt);
                }
              }
              geometry[toColumnName] = newCoordinates;
            }
            break
          case "MultiLineString":
          case "Polygon":
            {
              const newCoordinates = getPolygon(coordinates);
              geometry[toColumnName] = newCoordinates;
            }
            break
          case "MultiPolygon":
            {
              const newCoordinates = [];
              for (let c = 0; c < coordinates.length; c++) {
                const polygon = getPolygon(coordinates[c]);
                if (polygon.length > 0) {
                  newCoordinates.push(polygon);
                }
              }

              geometry[toColumnName] = newCoordinates;
            }
            break
        }
      }

      function getPolygon(coordinates) {
        const newCoordinates = [];
        for (let c = 0; c < coordinates.length; c++) {
          const coordinate = coordinates[c];
          const newcoordinate = [];
          for (let j = 0; j < coordinate.length; j++) {
            const pt = transferFn(coordinate[j]);
            if (pt) {
              newcoordinate.push(pt);
            }
          }
          if (newcoordinate.length > 0) {
            newCoordinates.push(newcoordinate);
          }
        }
        return newCoordinates
      }

      return data
    };
  } else {
    throw new Error("请引入 mapv 库 ")
  }

  const Cesium = mars3d__namespace.Cesium;
  const BaseLayer = mars3d__namespace.layer.BaseLayer;

  let divId = 0;

  /**
   * MapV图层
   * 【需要引入 mapv.js 库 和 mars3d-mapv 插件库】
   *
   * @param {Object} options 图层参数，包括：
   * @param {Object} [options.data] new mapv.DataSet(data)的data值，如有传入时可以用于替代dataSet参数
   * @param {Boolean} [options.depthTest=true] 是否进行计算深度判断，在地球背面或被遮挡时不显示（大数据时，需要关闭）
   * @param {Number} [options.fixedHeight=0] 点的固定的海拔高度
   * @param {Boolean} [options.clampToGround=false] 点是否贴地
   * @param {*} [options.多个参数] 支持mapv本身所有drawOptions图层样式参数，具体查阅 [mapv库drawOptions文档]{@link https://github.com/huiyan-fe/mapv/wiki/%E7%B1%BB%E5%8F%82%E8%80%83} ，也可以 [在线编辑图层样式]{@link https://mapv.baidu.com/editor/}
   *
   * @param {String|Number} [options.id = createGuid()] 图层id标识
   * @param {String|Number} [options.pid = -1] 图层父级的id，一般图层管理中使用
   * @param {String} [options.name = ''] 图层名称
   * @param {Boolean} [options.show = true] 图层是否显示
   * @param {BaseClass|Boolean} [options.eventParent]  指定的事件冒泡对象，默认为map对象，false时不冒泡
   * @param {Object} [options.center] 图层自定义定位视角 {@link Map#setCameraView}
   * @param {Number} options.center.lng 经度值, 180 - 180
   * @param {Number} options.center.lat 纬度值, -90 - 90
   * @param {Number} [options.center.alt] 高度值
   * @param {Number} [options.center.heading] 方向角度值，绕垂直于地心的轴旋转角度, 0-360
   * @param {Number} [options.center.pitch] 俯仰角度值，绕纬度线旋转角度, 0-360
   * @param {Number} [options.center.roll] 翻滚角度值，绕经度线旋转角度, 0-360
   * @param {Boolean} [options.flyTo] 加载完成数据后是否自动飞行定位到数据所在的区域。
   *
   * @param {*} [dataSet]  mapv.DataSet数据集,可以参考[ MapV数据集对象说明]{@link https://github.com/huiyan-fe/mapv/blob/master/src/data/DataSet.md}
   * @export
   * @class MapVLayer
   * @extends {BaseLayer}
   */
  class MapVLayer extends BaseLayer {
    //= ========= 构造方法 ==========
    constructor(options, dataSet) {
      super(options);

      this._pointerEvents = this.options.pointerEvents;
      this.dataSet = dataSet || new mapv__namespace.DataSet(options.data);

      /**
       * 图层对应的Canvas对象
       * @type {HTMLCanvasElement}
       * @readonly
       */
      this.canvas = null;
    }

    // /**
    //  * 是否可以鼠标交互，为false时可以穿透操作及缩放地图，但无法进行鼠标交互及触发相关事件。true时无法缩放地球，但可以使用mapv相关的事件
    //  * @type {Boolean}
    //  */
    get pointerEvents() {
      return this._pointerEvents
    }

    set pointerEvents(value) {
      this._pointerEvents = value;
      if (this.canvas) {
        if (value) {
          this.canvas.style.pointerEvents = "all";
        } else {
          /* 加上这个css后鼠标可以穿透，但是无法触发单击等鼠标事件 */
          this.canvas.style.pointerEvents = "none";
        }
      }
    }

    //= ========= 方法 ==========
    _showHook(show) {
      if (show) {
        this.canvas.style.display = "block";
      } else {
        this.canvas.style.display = "none";
      }
    }

    /**
     * 对象添加到地图前创建一些对象的钩子方法，
     * 只会调用一次
     * @return {void}  无
     * @private
     */
    _mountedHook() {
      this._map.scene.mapvDepthTest = this.options.depthTest ?? true; // 是否进行计算深度（大数据时，需要关闭）
      this._map.scene.mapvAutoHeight = this.options.clampToGround ?? false;
      this._map.scene.mapvFixedHeight = this.options.fixedHeight ?? 0;
    }

    /**
     * 对象添加到地图上的创建钩子方法，
     * 每次add时都会调用
     * @return {void}  无
     * @private
     */
    _addedHook() {
      if (this.dataSet && (!this.dataSet._data || this.dataSet._data.length === 0)) {
        this.dataSet._data = [].concat(this.dataSet._dataCache);
      }
      this._mapVRenderer = new MapVRenderer(this._map, this.dataSet, this.options, this);

      this.initDevicePixelRatio();
      this.canvas = this._createCanvas();
      this.render = this.render.bind(this);

      this.bindEvent();
      this._reset();
    }

    /**
     * 对象从地图上移除的创建钩子方法，
     * 每次remove时都会调用
     * @return {void}  无
     * @private
     */
    _removedHook() {
      // 释放
      this.unbindEvent();

      if (this._mapVRenderer) {
        this._mapVRenderer.destroy();
        this._mapVRenderer = null;
      }
      this.canvas.parentElement.removeChild(this.canvas);
    }

    initDevicePixelRatio() {
      this.devicePixelRatio = window.devicePixelRatio || 1;
    }

    bindEvent() {
      // 绑定cesium事件与mapv联动
      this._map.on(mars3d__namespace.EventType.mouseDown, this._onMoveStartEvent, this); // 按下
      // this._map.on(mars3d.EventType.mouseUp, this._onMoveEndEvent, this) //释放
      this._map.on(mars3d__namespace.EventType.cameraMoveStart, this._onMoveStartEvent, this);
      this._map.on(mars3d__namespace.EventType.cameraMoveEnd, this._onMoveEndEvent, this);

      if (this.options?.methods?.click) {
        this._map.on(mars3d__namespace.EventType.click, this._onMapClick, this);
      }
      if (this.options?.methods?.mousemove) {
        this._map.on(mars3d__namespace.EventType.mouseMove, this._onMapMouseMove, this);
      }
    }

    unbindEvent() {
      this._map.off(mars3d__namespace.EventType.mouseDown, this._onMoveStartEvent, this); // 按下
      // this._map.off(mars3d.EventType.mouseUp, this._onMoveEndEvent, this) //释放
      this._map.off(mars3d__namespace.EventType.cameraMoveStart, this._onMoveStartEvent, this);
      this._map.off(mars3d__namespace.EventType.cameraMoveEnd, this._onMoveEndEvent, this);

      this._map.off(mars3d__namespace.EventType.postRender, this._reset, this);

      if (this.options?.methods?.click) {
        this._map.off(mars3d__namespace.EventType.click, this._onMapClick, this);
      }
      if (this.options?.methods?.mousemove) {
        this._map.off(mars3d__namespace.EventType.mouseMove, this._onMapMouseMove, this);
      }
    }

    _onMoveStartEvent() {
      if (this._mapVRenderer) {
        this._mapVRenderer.animatorMovestartEvent();

        this._map.off(mars3d__namespace.EventType.postRender, this._reset, this);
        this._map.on(mars3d__namespace.EventType.postRender, this._reset, this);
      }
    }

    _onMoveEndEvent() {
      if (this._mapVRenderer) {
        this._map.off(mars3d__namespace.EventType.postRender, this._reset, this);

        this._mapVRenderer.animatorMoveendEvent();
        this._reset();
      }
    }

    _setOptionsHook(options) {
      this._removedHook();
      this._addedHook();
    }

    /**
     * 新增mapv数据
     * @param {*} dataSet  mapv.DataSet数据集,可以参考[ MapV数据集对象说明]{@link https://github.com/huiyan-fe/mapv/blob/master/src/data/DataSet.md}
     * @returns {void} 无
     */
    addData(dataSet) {
      if (this._mapVRenderer) {
        this._mapVRenderer.addData(dataSet, this.options);
      }
    }

    /**
     * 更新mapv数据
     * @param {*} dataSet  mapv.DataSet数据集,可以参考[ MapV数据集对象说明]{@link https://github.com/huiyan-fe/mapv/blob/master/src/data/DataSet.md}
     * @returns {void} 无
     */
    updateData(dataSet) {
      if (this._mapVRenderer) {
        this._mapVRenderer.updateData(dataSet, this.options);
      }
    }

    /**
     * 获取数据
     * @return {*} mapv.DataSet数据集,可以参考[ MapV数据集对象说明]{@link https://github.com/huiyan-fe/mapv/blob/master/src/data/DataSet.md}
     */
    getData() {
      if (this._mapVRenderer) {
        this.dataSet = this._mapVRenderer.getData();
      }
      return this.dataSet
    }

    /**
     * 删除指定数据
     * @param {*} data  mapv.DataSet数据集
     * @returns {void} 无
     */
    removeData(data) {
      if (this._mapVRenderer) {
        this._mapVRenderer.removeData(data);
      }
    }

    /**
     * 删除所有数据
     * @returns {void} 无
     */
    removeAllData() {
      if (this._mapVRenderer) {
        this._mapVRenderer.clearData();
      }
    }

    _createCanvas() {
      const container = mars3d__namespace.DomUtil.create("canvas", "mars3d-mapv", this._map.container);
      container.id = this.options.layerid || "mapv" + divId++;
      container.style.position = "absolute";
      container.style.top = "0px";
      container.style.left = "0px";
      container.style.pointerEvents = this._pointerEvents ? "auto" : "none"; // auto时可以交互，但是没法放大地球, none没法交互
      container.style.zIndex = this.options.zIndex || 100;
      container.width = parseInt(this._map.canvas.width);
      container.height = parseInt(this._map.canvas.height);
      container.style.width = this._map.canvas.style.width;
      container.style.height = this._map.canvas.style.height;

      if (this.options.context === "2d") {
        const e = this.devicePixelRatio;
        container.getContext(this.options.context).scale(e, e);
      }
      return container
    }

    _reset() {
      this.resize();
      this.render();
    }

    /**
     * 重绘图层
     * @return {void}  无
     */
    draw() {
      this._reset();
    }

    remove() {
      if (this._mapVRenderer) {
        this._mapVRenderer.destroy();
        this._mapVRenderer = null;
      }
      this.canvas.parentElement.removeChild(this.canvas);
    }

    render() {
      this._mapVRenderer._canvasUpdate();
    }

    /**
     * 改变图层canvas容器尺寸
     * @return {void}  无
     */
    resize() {
      if (this.canvas) {
        const container = this.canvas;
        container.style.position = "absolute";
        container.style.top = "0px";
        container.style.left = "0px";
        container.width = parseInt(this._map.canvas.width);
        container.height = parseInt(this._map.canvas.height);
        container.style.width = this._map.canvas.style.width;
        container.style.height = this._map.canvas.style.height;
      }
    }

    /**
     * 获取图层内所有数据的 矩形边界值
     * @param {Boolean} [options] 控制参数
     * @param {Boolean} [options.isFormat=false] 是否格式化，格式化时示例： { xmin: 73.16895, xmax: 134.86816, ymin: 12.2023, ymax: 54.11485 }
     * @return {Cesium.Rectangle|Object} isFormat：true时，返回格式化对象，isFormat：false时返回Cesium.Rectangle对象
     */
    getRectangle(options) {
      if (!this.dataSet || !this.dataSet._data) {
        return
      }

      const extent = mars3d__namespace.Util.getExtentByGeoJSON({ type: "FeatureCollection", features: this.dataSet._data });
      if (!extent) {
        return
      }

      if (options?.isFormat) {
        return extent
      } else {
        return Cesium.Rectangle.fromDegrees(extent.xmin, extent.ymin, extent.xmax, extent.ymax)
      }
    }

    /// /////////////////事件相关//////////////////////
    _onMapClick(event) {
      this._cache_event = event;
      if (this._mapVRenderer) {
        this._mapVRenderer.clickEvent(event.windowPosition, event);
      }
    }

    _onMapMouseMove(event) {
      this._cache_event = event;
      if (this._mapVRenderer) {
        this._mapVRenderer.mousemoveEvent(event.windowPosition, event);
      }
    }

    /**
     * 绑定事件处理函数,
     *
     * @param {String} eventName  事件名称，全小写，例如'click'，'mouseMove'
     * @param {Function} callback 绑定的监听器回调方法
     * @param {Object} [context]  侦听器的上下文(this关键字将指向的对象)。
     * @return {EchartsLayer} 当前对象本身,可以链式调用
     */
    on(eventName, callback, context) {
      this.options.methods = this.options.methods || {};

      if (eventName === mars3d__namespace.EventType.click) {
        this.options.methods.click = (e) => {
          if (e) {
            callback.bind(context)({ ...this._cache_event, layer: this, data: e });
          }
        };
        this._map.on(mars3d__namespace.EventType.click, this._onMapClick, this);
      } else if (eventName === mars3d__namespace.EventType.mouseMove) {
        this.options.methods.mousemove = (e) => {
          if (e) {
            callback.bind(context)({ ...this._cache_event, layer: this, data: e });
          }
        };
        this._map.on(mars3d__namespace.EventType.mouseMove, this._onMapMouseMove, this);
      }
      return this
    }

    /**
     * 解除绑定指定类型事件监听器
     *
     * @param {String} eventName  事件名称，全小写，例如'click'，'mouseMove'
     * @param {Function} [callback] 绑定的监听器回调方法,未传值时解绑所有指定类型对应事件
     * @return {EchartsLayer} 当前对象本身,可以链式调用
     */
    off(eventName, callback) {
      if (eventName === "click") {
        this._map.off(eventName, this._onMapClick, this);
        if (this.options.methods?.mousemove) {
          delete this.options.methods.click;
        }
      } else if (eventName === "mouseMove") {
        this._map.off(eventName, this._onMapMouseMove, this);
        if (this.options.methods?.mousemove) {
          delete this.options.methods.mousemove;
        }
      }
      return this
    }
  }

  // 注册下
  mars3d__namespace.LayerUtil.register("mapv", MapVLayer);

  mars3d__namespace.layer.MapVLayer = MapVLayer;

  exports.MapVLayer = MapVLayer;
  Object.keys(mapv).forEach(function (k) {
    if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
      enumerable: true,
      get: function () { return mapv[k]; }
    });
  });

  Object.defineProperty(exports, '__esModule', { value: true });

}));
