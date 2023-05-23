/**
 * Mars3D平台插件,结合heatmap可视化功能插件  mars3d-heatmap
 *
 * 版本信息：v3.4.2
 * 编译日期：2023-02-04 16:16:04
 * 版权所有：Copyright by 火星科技  http://mars3d.cn
 * 使用单位：中急管(北京)网络科技有限公司 ，2021-08-18
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, (window.mars3d || require('mars3d')), (window.h337 || require('@mars3d/heatmap.js'))) :
  typeof define === 'function' && define.amd ? define(['exports', 'mars3d', '@mars3d/heatmap.js'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["mars3d-heatmap"] = {}, global.mars3d, global.h337));
})(this, (function (exports, mars3d, h337) { 'use strict';

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

  var mars3d__namespace = /*#__PURE__*/_interopNamespace(mars3d);
  var h337__namespace = /*#__PURE__*/_interopNamespace(h337);

  var HeatMaterial = "uniform sampler2D image;\n\nczm_material czm_getMaterial(czm_materialInput materialInput) {\n  czm_material material = czm_getDefaultMaterial(materialInput);\n  vec2 st = materialInput.st;\n  vec4 colorImage = texture2D(image, st);\n  if(colorImage.rgb == vec3(1.0) || colorImage.rgb == vec3(0.0)) {\n    discard;\n  }\n  material.diffuse = colorImage.rgb;\n  material.alpha = colorImage.a;\n  return material;\n}\n"; // eslint-disable-line

  if (!h337__namespace.create) {
    throw new Error("请引入 heatmap.js 库 ")
  }

  const Cesium = mars3d__namespace.Cesium;
  const BaseLayer = mars3d__namespace.layer.BaseLayer;

  // 热力图默认参数
  const DEF_HEATSTYLE = {
    maxOpacity: 0.8,
    minOpacity: 0.1,
    blur: 0.85,
    radius: 25,
    gradient: {
      0.4: "blue",
      0.6: "green",
      0.8: "yellow",
      0.9: "red"
    }
  };

  const DEF_STYLE = {
    arcRadiusScale: 1.5,
    arcBlurScale: 1.5,
    vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
  };

  /**
   * 热力图图层，基于heatmap.js库渲染。
   * 【需要引入 heatmap.js 库 和 mars3d-heatmap 插件库】
   *
   * @param {Object} options 参数对象，包括以下：
   * @param {LngLatPoint[]|Cesium.Cartesian3[]|Object[]} [options.positions] 坐标数据集合（含value热力值），有热力值时，传入LatLngPoint数组，热力值为value字段。示例:[{lat:31.123,lng:103.568,value:1.2},{lat:31.233,lng:103.938,value:2.3}]
   *
   * @param {Object} [options.rectangle] 坐标的矩形区域范围，默认内部自动计算
   * @param {Number} options.rectangle.xmin 最小经度值
   * @param {Number} options.rectangle.xmax 最大纬度值
   * @param {Number} options.rectangle.ymin 最小纬度值
   * @param {Number} options.rectangle.ymax 最大纬度值
   *
   * @param {Number} [options.max] 数据集的value值上限，默认内部计算
   * @param {Number} [options.min] 数据集的value值下限，默认内部计算
   *
   * @param {Object} [options.heatStyle] heatmap热力图本身configObject参数，详情也可查阅 [heatmap文档]{@link https://www.patrick-wied.at/static/heatmapjs/docs.html}
   * @param {Number} [options.heatStyle.maxOpacity=0.8] 最大不透明度，取值范围0.0-1.0。
   * @param {Number} [options.heatStyle.minOpacity=0.1] 最小不透明度，取值范围0.0-1.0。
   * @param {Number} [options.heatStyle.blur=0.85] 将应用于所有数据点的模糊因子。模糊因子越高，渐变将越平滑
   * @param {Number} [options.heatStyle.radius=25] 每个数据点将具有的半径（如果未在数据点本身上指定）
   * @param {Object} [options.heatStyle.gradient] 色带，表示渐变的对象，示例：{ 0.4: 'blue', 0.6: 'green',0.8: 'yellow',0.9: 'red' }
   *
   * @param {RectanglePrimitive.StyleOptions|Object} [options.style] 矢量对象样式参数，还包括：
   * @param {Boolean} [options.style.opacity=1] 透明度
   * @param {Boolean} [options.style.arc=false] 是否显示曲面热力图
   * @param {Boolean} [options.style.arcRadiusScale=1.5] 曲面热力图时，radius扩大比例
   * @param {Boolean} [options.style.arcBlurScale=1.5] 曲面热力图时，blur扩大比例
   * @param {Number} [options.style.height = 0] 高度，相对于椭球面的高度。
   * @param {Number} [options.style.diffHeight ] 曲面的起伏差值高，默认根据数据范围的比例自动计算。
   * @param {RectanglePrimitive.StyleOptions} [options.style.多个参数] rectangle矩形支持的样式
   *
   * @param {Number} [options.maxCanvasSize=5000] Canvas最大尺寸（单位：像素），调大精度更高，但过大容易内存溢出
   * @param {Number} [options.minCanvasSize=700] Canvas最小尺寸（单位：像素）
   * @param {Number} [options.delayTime=2] 显示数据时的过渡动画时长（单位：秒）
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
   * @class HeatLayer
   * @extends {BaseLayer}
   */
  class HeatLayer extends BaseLayer {
    constructor(options = {}) {
      super(options);

      this.options.maxCanvasSize = this.options.maxCanvasSize ?? document.body.clientWidth;
      this.options.maxCanvasSize = Math.min(this.options.maxCanvasSize, 5000);
      this.options.minCanvasSize = this.options.minCanvasSize ?? document.body.clientHeight;
      this.options.minCanvasSize = Math.max(this.options.minCanvasSize, 700);

      this.options.heatStyle = {
        ...DEF_HEATSTYLE,
        ...(this.options.heatStyle || {})
      };
      this.options.style = {
        ...DEF_STYLE,
        ...(this.options.style || {})
      };
    }

    /**
     * 矢量数据图层
     * @type {GraphicLayer}
     * @readonly
     */
    get layer() {
      return this._layer
    }

    /**
     * heatmap热力图本身configObject参数，详情也可查阅 [heatmap文档]{@link https://www.patrick-wied.at/static/heatmapjs/docs.html}
     * @type {Object}
     */
    get heatStyle() {
      return this.options.heatStyle
    }

    set heatStyle(value) {
      this.options.heatStyle = mars3d__namespace.Util.merge(this.options.heatStyle, value);

      if (this._heat) {
        this._heat.configure(this.options.heatStyle);
        this._updatePositionsHook(true);
      }
    }

    /**
     * 矩形的样式参数
     * @type {RectanglePrimitive.StyleOptions}
     */
    get style() {
      return this.options.style
    }

    set style(value) {
      this.options.style = mars3d__namespace.Util.merge(this.options.style, value);
    }

    /**
     * 坐标数据集合（含value热力值），示例:[{lat:31.123,lng:103.568,value:1.2},{lat:31.233,lng:103.938,value:2.3}] 。
     * 平滑更新建议使用setPositions方法
     * @type {Cesium.Cartesian3[]|LngLatPoint[]}
     */
    get positions() {
      return this._positions
    }

    set positions(value) {
      this.setPositions(value);
    }

    /**
     * 位置坐标(数组对象)，示例 [ [123.123456,32.654321,198.7], [111.123456,22.654321,50.7] ]
     * @type {Array[]}
     * @readonly
     */
    get coordinates() {
      const coords = [];
      this.points.forEach((item) => {
        coords.push(item.toArray());
      });
      return coords
    }

    /**
     * 坐标数据对应的矩形边界
     * @type {Cesium.Rectangle}
     * @readonly
     */
    get rectangle() {
      return this._rectangle
    }

    _setOptionsHook(options) {
      if (options.positions) {
        this.positions = options.positions;
      }
    }

    /**
     * 对象添加到地图前创建一些对象的钩子方法，
     * 只会调用一次
     * @return {void}  无
     * @private
     */
    _mountedHook() {
      this._layer = new mars3d__namespace.layer.GraphicLayer({
        private: true
      });
    }

    /**
     * 对象添加到地图上的创建钩子方法，
     * 每次add时都会调用
     * @return {void}  无
     * @private
     */
    _addedHook() {
      this._map.addLayer(this._layer);

      if (this.options.positions) {
        this.positions = this.options.positions;
      }

      if (this.options.flyTo) {
        this.flyToByAnimationEnd();
      }
    }

    /**
     * 对象从地图上移除的创建钩子方法，
     * 每次remove时都会调用
     * @return {void}  无
     * @private
     */
    _removedHook() {
      if (this.heatStyle.container) {
        mars3d__namespace.DomUtil.remove(this.heatStyle.container);
        delete this.heatStyle.container;
      }

      this.clear();
      this._map.removeLayer(this._layer);
    }

    /**
     * 添加新的坐标点（含热力值）
     * @param {Cesium.Cartesian3 |LngLatPoint} item 坐标点（含热力值），示例: {lat:31.123,lng:103.568,value:1.2}
     * @param {Boolean} [isGD] 是否固定区域坐标，true时可以平滑更新
     * @return {void}  无
     */
    addPosition(item, isGD) {
      this._positions = this._positions || [];
      this._positions.push(item);

      this._updatePositionsHook(isGD);
    }

    /**
     * 更新所有坐标点（含热力值）数据
     *
     * @param {Cesium.Cartesian3[] |LngLatPoint[]} arr 坐标点（含热力值），示例:[{lat:31.123,lng:103.568,value:1.2},{lat:31.233,lng:103.938,value:2.3}]
     * @param {Boolean} [isGD] 是否固定区域坐标，true时可以平滑更新
     * @return {void}  无
     */
    setPositions(arr, isGD) {
      this._positions = arr;
      this._updatePositionsHook(isGD);
    }

    /**
     * 清除矢量对象
     * @return {void}  无
     */
    clear() {
      if (this._graphic) {
        this._layer.removeGraphic(this._graphic, true);
        delete this._graphic;
      }
    }

    _updatePositionsHook(isGD) {
      if (!this.show || !this._map || !this.positions || this.positions.length === 0) {
        return this
      }

      const canvas = this._getHeatCanvas();

      if (this.style.arc) {
        if (this._graphic && isGD) {
          this._graphic.uniforms.image = canvas;
          this._graphic.uniforms.bumpMap = this._getArcHeatCanvas();
        } else {
          this._createArcGraphic(canvas);
        }
      } else {
        if (this._graphic && isGD) {
          this._graphic.uniforms.image = canvas;
        } else {
          this._createGraphic(canvas);
        }
      }
      return this
    }

    // 普通平面热力图
    _createGraphic(image) {
      this.clear();
      this._graphic = new mars3d__namespace.graphic.RectanglePrimitive({
        ...this.options,
        rectangle: this._rectangle,
        appearance: new Cesium.EllipsoidSurfaceAppearance({
          material: new Cesium.Material({
            fabric: {
              uniforms: {
                image: image
              },
              source: HeatMaterial
            },
            translucent: true
          }),
          flat: true
        })
      });
      this._layer.addGraphic(this._graphic);
    }

    // 曲面 热力图
    _createArcGraphic(canvas) {
      this.clear();

      const renderstate = Cesium.RenderState.fromCache({
        cull: {
          enabled: true
        },
        depthTest: {
          enabled: true
        },
        stencilTest: {
          enabled: true,
          frontFunction: Cesium.StencilFunction.ALWAYS,
          frontOperation: {
            fail: Cesium.StencilOperation.KEEP,
            zFail: Cesium.StencilOperation.KEEP,
            zPass: Cesium.StencilOperation.REPLACE
          },
          backFunction: Cesium.StencilFunction.ALWAYS,
          backOperation: {
            fail: Cesium.StencilOperation.KEEP,
            zFail: Cesium.StencilOperation.KEEP,
            zPass: Cesium.StencilOperation.REPLACE
          },
          reference: 0x2,
          mask: 0x2
        },
        blending: Cesium.BlendingState.ALPHA_BLEND
      });

      // 曲面的起伏差值高
      const diffHeight = Math.floor(this.style.diffHeight ?? this._mBoundsMax * 0.02) + 0.1;
      if (this.style.diffHeight) {
        delete this.style.diffHeight;
      }

      // 控制曲面的精度
      const splitNum = (this.style.splitNum, 100);
      let granularity = Math.max(this._rectangle.height, this._rectangle.width);
      this.style.granularity = granularity /= splitNum;

      // console.log(this.options.style.granularity)

      this._graphic = new mars3d__namespace.graphic.RectanglePrimitive({
        ...this.options,
        rectangle: this._rectangle,
        appearance: new Cesium.EllipsoidSurfaceAppearance({
          aboveGround: true,
          renderState: renderstate,
          material: new Cesium.Material({
            fabric: {
              uniforms: {
                image: canvas,
                repeat: new Cesium.Cartesian2(1.0, 1.0),
                color: new Cesium.Color(1.0, 1.0, 1.0, 0.01),
                bumpMap: this._getArcHeatCanvas()
              },
              source: HeatMaterial
            },
            translucent: true
          }),
          vertexShaderSource: `attribute vec3 position3DHigh;
          attribute vec3 position3DLow;
          attribute vec2 st;
          attribute float batchId;
          uniform sampler2D bumpMap_3;
          varying vec3 v_positionMC;
          varying vec3 v_positionEC;
          varying vec2 v_st;

          void main()
          {
            vec4 p = czm_computePosition();
            v_positionMC = position3DHigh + position3DLow;
            v_positionEC = (czm_modelViewRelativeToEye * p).xyz;
            v_st = st;
            vec4 color = texture2D(bumpMap_3, v_st);
            float centerBump = distance(vec3(0.0),color.rgb);
            vec3 upDir = normalize(v_positionMC.xyz);
            vec3 disPos = upDir * centerBump * ${diffHeight};
            p +=vec4(disPos,0.0);
            gl_Position = czm_modelViewProjectionRelativeToEye * p;
          }
        `,
          flat: true
        })
      });
      this._layer.addGraphic(this._graphic);
    }

    /**
     * 获取图层内所有数据的 矩形边界值
     * @param {Boolean} [options] 控制参数
     * @param {Boolean} [options.isFormat=false] 是否格式化，格式化时示例： { xmin: 73.16895, xmax: 134.86816, ymin: 12.2023, ymax: 54.11485 }
     * @return {Cesium.Rectangle|Object} isFormat：true时，返回格式化对象，isFormat：false时返回Cesium.Rectangle对象
     */
    getRectangle(options) {
      if (options?.isFormat && this._rectangle) {
        return mars3d__namespace.PolyUtil.formatRectangle(this._rectangle)
      } else {
        return this._rectangle
      }
    }

    // 处理数据并返回生成的图片
    _getHeatCanvas() {
      const positions = this._positions;

      const _points = [];
      let xmin, xmax, ymin, ymax;

      positions.forEach((item) => {
        const point = mars3d__namespace.LngLatPoint.parse(item);
        if (!point) {
          return
        }
        point.value = item.value || 1; // 热力值

        if (!this.options.rectangle) {
          if (xmin === undefined) {
            xmin = point.lng;
            xmax = point.lng;
            ymin = point.lat;
            ymax = point.lat;
          } else {
            xmin = Math.min(xmin, point.lng);
            xmax = Math.max(xmax, point.lng);
            ymin = Math.min(ymin, point.lat);
            ymax = Math.max(ymax, point.lat);
          }
        }
        _points.push(point);
      });

      // 经纬度边界
      let _bounds = this.options.rectangle || { xmin, xmax, ymin, ymax };

      // 墨卡托边界值
      const mBounds = getMercatorBounds(_bounds);

      // 计算范围内的差值和极值
      const diffLng = Math.abs(mBounds.xmax - mBounds.xmin);
      const diffLat = Math.abs(mBounds.ymax - mBounds.ymin);
      const max = Math.max(diffLng, diffLat);
      const min = Math.min(diffLng, diffLat);

      this._mBoundsMax = max;

      // 计算是否缩放
      let scale = 1;
      if (max > this.options.maxCanvasSize) {
        scale = max / this.options.maxCanvasSize;
        if (min / scale < this.options.minCanvasSize) {
          scale = min / this.options.minCanvasSize;
        }
      } else if (min < this.options.minCanvasSize) {
        scale = min / this.options.minCanvasSize;
        if (max / scale > this.options.maxCanvasSize) {
          scale = max / this.options.maxCanvasSize;
        }
      }

      const spacing = this.heatStyle.radius * 1.5;
      const canvasWidth = diffLng / scale + spacing * 2;
      const canvasHeight = diffLat / scale + spacing * 2;

      const offset = spacing * scale;
      mBounds.xmin -= offset;
      mBounds.ymin -= offset;
      mBounds.xmax += offset;
      mBounds.ymax += offset;

      this._scale = scale;

      // 加扩大值后的边界
      _bounds = geLatLngBounds(mBounds);

      this._rectangle = Cesium.Rectangle.fromDegrees(_bounds.xmin, _bounds.ymin, _bounds.xmax, _bounds.ymax);

      let maxVal = _points[0].value ?? 1;
      let minVal = _points[0].value ?? 0;
      const hetdata = [];
      _points.forEach((point) => {
        const mkt = mars3d__namespace.PointTrans.lonlat2mercator([point.lng, point.lat]);

        const value = point.value || 1;
        const coord_x = Math.round((mkt[0] - mBounds.xmin) / scale);
        const coord_y = Math.round((mBounds.ymax - mkt[1]) / scale);

        maxVal = Math.max(maxVal, value); // 求最大值
        minVal = Math.min(minVal, value);

        hetdata.push({
          x: coord_x,
          y: coord_y,
          value: value
        });
      });
      const heatData = {
        min: this.options.min ?? minVal,
        max: this.options.max ?? maxVal,
        data: hetdata
      };
      this._last_heatData = heatData;

      if (
        !this._last_mBounds ||
        mBounds.xmin !== this._last_mBounds.xmin ||
        mBounds.ymin !== this._last_mBounds.ymin ||
        mBounds.xmax !== this._last_mBounds.xmax ||
        mBounds.ymax !== this._last_mBounds.ymax
      ) {
        this._last_mBounds = mBounds;

        if (!this.heatStyle.container) {
          this.heatStyle.container = mars3d__namespace.DomUtil.create("div", "mars3d-heatmap mars3d-hideDiv", this._map.container);
        }
        this.heatStyle.container.style.cssText = `width:${canvasWidth}px;height:${canvasHeight}px;`;

        if (!this._heat) {
          this._heat = h337__namespace.create(this.heatStyle);
        } else {
          this._heat.configure(this.heatStyle);
        }
      }
      this._heat.setData(heatData);

      const canvas = mars3d__namespace.DomUtil.copyCanvas(this._heat._renderer.canvas);

      // 注释不删除，便于动态更新
      // if (this.heatStyle.container) {
      //   mars3d.DomUtil.remove(this.heatStyle.container)
      //   delete this.heatStyle.container
      // }

      return canvas
    }

    _getArcHeatCanvas() {
      this._heat.configure({
        radius: this.heatStyle.radius * this.style.arcRadiusScale,
        blur: this.heatStyle.blur * this.style.arcBlurScale,
        gradient: this.heatStyle.gradientArc || {
          0.25: "rgb(0,0,0)",
          0.55: "rgb(140,140,140)",
          0.85: "rgb(216,216,216)",
          1.0: "rgb(255,255,255)"
        }
      });
      const canvasBump = mars3d__namespace.DomUtil.copyCanvas(this._heat._renderer.canvas);

      this._heat.configure(this.options.heatStyle); // 恢复配置

      return canvasBump
    }

    /**
     * 根据坐标点获取其对应的value值和颜色值
     * @param {Cesium.Cartesian3 |LngLatPoint} item 坐标点
     * @return {Object} 格式为 {"x":2081,"y":767,"value":3,"color":"rgba(209,231,0,195)"}
     */
    getPointData(item) {
      const point = mars3d__namespace.LngLatPoint.parse(item);
      if (!point) {
        return {}
      }
      const mkt = mars3d__namespace.PointTrans.lonlat2mercator([point.lng, point.lat]);
      const mBounds = this._last_mBounds;

      const coord_x = Math.round((mkt[0] - mBounds.xmin) / this._scale);
      const coord_y = Math.round((mBounds.ymax - mkt[1]) / this._scale);
      const value = this._heat.getValueAt({ x: coord_x, y: coord_y });
      const rgba = this._heat._renderer.ctx.getImageData(coord_x - 1, coord_y - 1, 1, 1).data;

      return {
        x: coord_x,
        y: coord_y,
        value: value,
        color: "rgba(" + rgba[0] + "," + rgba[1] + "," + rgba[2] + "," + rgba[3] + ")"
      }
    }
  }

  mars3d__namespace.layer.HeatLayer = HeatLayer;
  mars3d__namespace.LayerUtil.register("heat", HeatLayer);

  function getMercatorBounds(bounds) {
    const pt1 = mars3d__namespace.PointTrans.lonlat2mercator([bounds.xmin, bounds.ymin]);
    const pt2 = mars3d__namespace.PointTrans.lonlat2mercator([bounds.xmax, bounds.ymax]);
    return { xmin: pt1[0], ymin: pt1[1], xmax: pt2[0], ymax: pt2[1] }
  }

  function geLatLngBounds(bounds) {
    const pt1 = mars3d__namespace.PointTrans.mercator2lonlat([bounds.xmin, bounds.ymin]);
    const pt2 = mars3d__namespace.PointTrans.mercator2lonlat([bounds.xmax, bounds.ymax]);
    return { xmin: pt1[0], ymin: pt1[1], xmax: pt2[0], ymax: pt2[1] }
  }

  exports.HeatLayer = HeatLayer;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
