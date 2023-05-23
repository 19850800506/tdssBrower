/**
 * Mars3D平台插件,结合echarts可视化功能插件  mars3d-echarts
 *
 * 版本信息：v3.4.2
 * 编译日期：2023-02-04 16:16:04
 * 版权所有：Copyright by 火星科技  http://mars3d.cn
 * 使用单位：中急管(北京)网络科技有限公司 ，2021-08-18
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, (window.echarts || require('echarts')), (window.mars3d || require('mars3d'))) :
  typeof define === 'function' && define.amd ? define(['exports', 'echarts', 'mars3d'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["mars3d-echarts"] = {}, global.echarts, global.mars3d));
})(this, (function (exports, echarts, mars3d) { 'use strict';

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

  var echarts__namespace = /*#__PURE__*/_interopNamespace(echarts);
  var mars3d__namespace = /*#__PURE__*/_interopNamespace(mars3d);

  const Cesium$1 = mars3d__namespace.Cesium;


  // 地图坐标系统类。参考了开源：https://github.com/sharpzao/EchartsCesium
  class CompositeCoordinateSystem {
    //= ========= 构造方法 ==========
    constructor(scene, api) {
      this._mars3d_scene = scene;
      this.dimensions = ["lng", "lat"];
      this._mapOffset = [0, 0];

      this._api = api;
    }

    //= ========= 方法 ==========
    setMapOffset(mapOffset) {
      this._mapOffset = mapOffset;
    }

    getBMap() {
      return this._mars3d_scene
    }

    dataToPoint(data) {
      const scene = this._mars3d_scene;
      const defVal = [NaN, NaN]; // echarts内部就是用NaN来做判断的

      let heightTerrain = scene.echartsFixedHeight;
      if (scene.echartsAutoHeight) {
        heightTerrain = scene.globe.getHeight(Cesium$1.Cartographic.fromDegrees(data[0], data[1]));
      }

      const position = Cesium$1.Cartesian3.fromDegrees(data[0], data[1], heightTerrain);
      if (!position) {
        return defVal
      }

      const px = Cesium$1.SceneTransforms.wgs84ToWindowCoordinates(scene, position);
      // var px = scene.cartesianToCanvasCoordinates(position);
      if (!px) {
        return defVal
      }

      // 判断是否在球的背面
      if (scene.echartsDepthTest && scene.mode === Cesium$1.SceneMode.SCENE3D) {
        const occluder = new Cesium$1.EllipsoidalOccluder(scene.globe.ellipsoid, scene.camera.positionWC);
        const visible = occluder.isPointVisible(position);
        // visible为true说明点在球的正面，否则点在球的背面。
        // 需要注意的是不能用这种方法判断点的可见性，如果球放的比较大，点跑到屏幕外面，它返回的依然为true
        if (!visible) {
          return defVal
        }
      }
      // 判断是否在球的背面

      return [px.x - this._mapOffset[0], px.y - this._mapOffset[1]]
    }

    getViewRect() {
      const api = this._api;
      return new echarts__namespace.graphic.BoundingRect(0, 0, api.getWidth(), api.getHeight())
    }

    getRoamTransform() {
      return echarts__namespace.matrix.create()
    }
  }

  // 用于确定创建列表数据时要使用的维度
  CompositeCoordinateSystem.dimensions = ["lng", "lat"];
  CompositeCoordinateSystem.create = function (ecModel, api) {
    let coordSys;
    const scene = ecModel.scheduler.ecInstance._mars3d_scene;

    ecModel.eachComponent("mars3dMap", function (mars3dMapModel) {
      const painter = api.getZr().painter;
      if (!painter) {
        return
      }

      if (!coordSys) {
        coordSys = new CompositeCoordinateSystem(scene, api);
      }
      mars3dMapModel.coordinateSystem = coordSys;

      coordSys.setMapOffset(mars3dMapModel.__mapOffset || [0, 0]);
    });

    ecModel.eachSeries(function (seriesModel) {
      if (seriesModel.get("coordinateSystem") === "mars3dMap") {
        if (!coordSys) {
          coordSys = new CompositeCoordinateSystem(scene, api);
        }
        seriesModel.coordinateSystem = coordSys;
      }
    });
  };

  /// //////扩展echarts///////////
  if (echarts__namespace?.init) {
    echarts__namespace.registerCoordinateSystem("mars3dMap", CompositeCoordinateSystem);
    echarts__namespace.registerAction(
      {
        type: "mars3dMapRoam",
        event: "mars3dMapRoam",
        update: "updateLayout"
      },
      function (payload, ecModel) {}
    );

    echarts__namespace.extendComponentModel({
      type: "mars3dMap",
      getBMap: function () {
        return this._mars3d_scene
      },
      defaultOption: { roam: false }
    });

    echarts__namespace.extendComponentView({
      type: "mars3dMap",
      init: function (ecModel, api) {
        this.api = api;
        this.scene = ecModel.scheduler.ecInstance._mars3d_scene;
        this.scene.postRender.addEventListener(this.moveHandler, this);
      },
      moveHandler: function (type, target) {
        this.api.dispatchAction({ type: "mars3dMapRoam" });
      },
      render: function (mars3dMapModel, ecModel, api) {},
      dispose: function (target) {
        this.scene.postRender.removeEventListener(this.moveHandler, this);
      }
    });
  } else {
    throw new Error("请引入 echarts 库 ")
  }

  const Cesium = mars3d__namespace.Cesium;
  const BaseLayer = mars3d__namespace.layer.BaseLayer;
  let _div_zIndex = 999;

  /**
   * Echarts图层，
   * 【需要引入 echarts 库 和 mars3d-echarts 插件库】
   *
   * @param {Object} [options] 参数对象，包括以下：
   * @param {Object} [options.Echarts本身] 支持Echarts本身所有Options参数，具体查阅 [Echarts配置项手册]{@link https://echarts.apache.org/zh/option.html}
   *
   * @param {Boolean} [options.depthTest=true] 是否进行计算深度判断，在地球背面或被遮挡时不显示（大数据时，需要关闭）
   * @param {Number} [options.fixedHeight=0] 点的固定的海拔高度
   * @param {Boolean} [options.clampToGround=false] 点是否贴地
   * @param {Boolean} [options.pointerEvents=false] 图层是否可以进行鼠标交互，为false时可以穿透操作及缩放地图
   *
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
   * @export
   * @class EchartsLayer
   * @extends {BaseLayer}
   */
  class EchartsLayer extends BaseLayer {
    constructor(options = {}) {
      super(options);

      this._pointerEvents = this.options.pointerEvents;
    }

    /**
     * echarts对象，是echarts.init方法返回的 echartsInstance 实例
     * @type {HTMLCanvasElement}
     * @readonly
     * @see https://echarts.apache.org/zh/api.html#echartsInstance
     */
    get layer() {
      return this._echartsInstance
    }

    /**
     * 是否可以鼠标交互，为false时可以穿透操作及缩放地图，但无法进行鼠标交互及触发相关事件。true时无法缩放地球，但可以使用echarts相关的事件或toolitp等。
     * @type {Boolean}
     */
    get pointerEvents() {
      return this._pointerEvents
    }

    set pointerEvents(value) {
      this._pointerEvents = value;
      if (this._echartsContainer) {
        if (value) {
          this._echartsContainer.style.pointerEvents = "all";
        } else {
          /* 加上这个css后鼠标可以穿透，但是无法触发单击等鼠标事件 */
          this._echartsContainer.style.pointerEvents = "none";
        }
      }
    }

    _setOptionsHook(options) {
      this.setEchartsOption(options);
    }

    _showHook(show) {
      if (show) {
        this._echartsContainer.style.visibility = "visible";
      } else {
        this._echartsContainer.style.visibility = "hidden";
      }
    }

    /**
     * 对象添加到地图前创建一些对象的钩子方法，
     * 只会调用一次
     * @return {void}  无
     * @private
     */
    _mountedHook() {
      this._map.scene.echartsDepthTest = this.options.depthTest ?? true; // 是否进行计算深度（大数据时，需要关闭）
      this._map.scene.echartsAutoHeight = this.options.clampToGround ?? false;
      this._map.scene.echartsFixedHeight = this.options.fixedHeight ?? 0;
    }

    /**
     * 对象添加到地图上的创建钩子方法，
     * 每次add时都会调用
     * @return {void}  无
     * @private
     */
    _addedHook() {
      this._echartsContainer = this._createChartOverlay();
      this._echartsInstance = echarts__namespace.init(this._echartsContainer);
      this._echartsInstance._mars3d_scene = this._map.scene;

      this.setEchartsOption(this.options);
    }

    /**
     * 对象从地图上移除的创建钩子方法，
     * 每次remove时都会调用
     * @return {void}  无
     * @private
     */
    _removedHook() {
      if (this._echartsInstance) {
        this._echartsInstance.clear();
        this._echartsInstance.dispose();
        delete this._echartsInstance;
      }
      if (this._echartsContainer) {
        this._map.container.removeChild(this._echartsContainer);
        delete this._echartsContainer;
      }
    }

    _createChartOverlay() {
      const scene = this._map.scene;
      scene.canvas.setAttribute("tabIndex", 0);

      const chartContainer = mars3d__namespace.DomUtil.create("div", "mars3d-echarts", this._map.container);
      chartContainer.style.position = "absolute";
      chartContainer.style.top = "0px";
      chartContainer.style.left = "0px";
      chartContainer.style.width = scene.canvas.clientWidth + "px";
      chartContainer.style.height = scene.canvas.clientHeight + "px";
      chartContainer.style.pointerEvents = this._pointerEvents ? "all" : "none"; // auto时可以交互，但是没法放大地球， none 没法交互
      chartContainer.style.zIndex = this.options.zIndex || _div_zIndex++;

      return chartContainer
    }

    /**
     * 改变图层canvas容器尺寸，在容器大小发生改变时需要手动调用。
     * @return {void}  无
     * @see https://echarts.apache.org/zh/api.html#echartsInstance.resize
     */
    resize() {
      if (!this._echartsInstance) {
        return
      }
      const scene = this._map.scene;

      this._echartsContainer.style.width = scene.canvas.clientWidth + "px";
      this._echartsContainer.style.height = scene.canvas.clientHeight + "px";

      this._echartsInstance.resize();
    }

    /**
     * 设置图表实例的配置项以及数据，
     * 万能接口，所有参数和数据的修改都可以通过 setOption 完成，
     * ECharts 会合并新的参数和数据，然后刷新图表。
     * 如果开启动画的话，ECharts 找到两组数据之间的差异然后通过合适的动画去表现数据的变化。
     * @param {Object} option 图表的配置项和数据，具体见 [Echarts配置项手册]{@link https://echarts.apache.org/zh/option.html}。
     * @param {Boolean} [notMerge=false] 是否不跟之前设置的 option 进行合并。默认为 false。即表示合并。合并的规则，详见 组件合并模式。如果为 true，表示所有组件都会被删除，然后根据新 option 创建所有新组件。
     * @param {Boolean} [lazyUpdate=false] 在设置完 option 后是否不立即更新图表，默认为 false，即同步立即更新。如果为 true，则会在下一个 animation frame 中，才更新图表。
     * @return {void}  无
     * @see https://echarts.apache.org/zh/api.html#echartsInstance.setOption
     */
    setEchartsOption(option, notMerge, lazyUpdate) {
      if (this._echartsInstance) {
        option.mars3dMap = option.mars3dMap || {}; // 需要注册
        this._echartsInstance.setOption(option, notMerge, lazyUpdate);
      }
    }

    /**
     * 获取图层内所有数据的 矩形边界值
     * @param {Boolean} [options] 控制参数
     * @param {Boolean} [options.isFormat=false] 是否格式化，格式化时示例： { xmin: 73.16895, xmax: 134.86816, ymin: 12.2023, ymax: 54.11485 }
     * @return {Cesium.Rectangle|Object} isFormat：true时，返回格式化对象，isFormat：false时返回Cesium.Rectangle对象
     */
    getRectangle(options) {
      let xmin, xmax, ymin, ymax;

      function refPoint(coors) {
        if (!Array.isArray(coors)) {
          return
        }

        const lng = coors[0] || 0;
        const lat = coors[1] || 0;

        if (lng !== 0 && lat !== 0) {
          if (xmin === undefined) {
            xmin = lng;
            xmax = lng;
            ymin = lat;
            ymax = lat;
          } else {
            xmin = Math.min(xmin, lng);
            xmax = Math.max(xmax, lng);
            ymin = Math.min(ymin, lat);
            ymax = Math.max(ymax, lat);
          }
        }
      }

      const series = this.options.series;
      if (series) {
        series.forEach((serie) => {
          if (serie.data) {
            serie.data.forEach((item) => {
              if (item.value) {
                refPoint(item.value);
              } else if (item.coords) {
                item.coords.forEach((coord) => {
                  refPoint(coord);
                });
              }
            });
          }
        });
      }

      if (xmin === 0 && ymin === 0 && xmax === 0 && ymax === 0) {
        return null
      }

      if (options?.isFormat) {
        return { xmin: xmin, xmax: xmax, ymin: ymin, ymax: ymax }
      } else {
        return Cesium.Rectangle.fromDegrees(xmin, ymin, xmax, ymax)
      }
    }

    /// /////////////////事件相关//////////////////////

    /**
     * 绑定事件处理函数,
     *
     * @param {String} eventName  事件名称，全小写，例如'click'，'mousemove', 'legendselected' ,可以参考[echarts官网说明]{@link https://echarts.apache.org/zh/api.html#echartsInstance.on}
     * @param {Function} callback 绑定的监听器回调方法
     * @param {Object} [context]  侦听器的上下文(this关键字将指向的对象)。
     * @return {EchartsLayer} 当前对象本身,可以链式调用
     */
    on(eventName, callback, context) {
      this._echartsInstance.on(eventName, callback, context || this);
      return this
    }

    /**
     * 带条件的绑定事件处理函数
     * @param {String} eventName  事件名称，全小写，例如'click'，'mousemove', 'legendselected'
     * @param {String|Object} query  可选的过滤条件，能够只在指定的组件或者元素上进行响应。可以参考[echarts官网说明]{@link https://echarts.apache.org/zh/api.html#echartsInstance.on}
     * @param {Function} callback 绑定的监听器回调方法
     * @param {Object} [context]  侦听器的上下文(this关键字将指向的对象)
     * @return {EchartsLayer} 当前对象本身,可以链式调用
     */
    onByQuery(eventName, query, callback, context) {
      this._echartsInstance.on(eventName, query, callback, context || this);
      return this
    }

    /**
     * 解除绑定指定类型事件监听器
     *
     * @param {String} eventName  事件名称，全小写，例如'click'，'mousemove', 'legendselected'
     * @param {Function} [callback] 绑定的监听器回调方法,未传值时解绑所有指定类型对应事件
     * @param {Object} [context]  侦听器的上下文(this关键字将指向的对象)。
     * @return {EchartsLayer} 当前对象本身,可以链式调用
     */
    off(eventName, callback, context) {
      this._echartsInstance.off(eventName, callback, context || this);
      return this
    }
  }

  // 注册下
  mars3d__namespace.LayerUtil.register("echarts", EchartsLayer);

  mars3d__namespace.layer.EchartsLayer = EchartsLayer;

  exports.EchartsLayer = EchartsLayer;
  Object.keys(echarts).forEach(function (k) {
    if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
      enumerable: true,
      get: function () { return echarts[k]; }
    });
  });

  Object.defineProperty(exports, '__esModule', { value: true });

}));
