/**
 * Mars3D平台插件,支持气象 风向图 功能插件  mars3d-wind
 *
 * 版本信息：v3.4.2
 * 编译日期：2023-02-04 16:16:02
 * 版权所有：Copyright by 火星科技  http://mars3d.cn
 * 使用单位：中急管(北京)网络科技有限公司 ，2021-08-18
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, (window.mars3d || require('mars3d'))) :
  typeof define === 'function' && define.amd ? define(['exports', 'mars3d'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["mars3d-wind"] = {}, global.mars3d));
})(this, (function (exports, mars3d) { 'use strict';

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

  /**
   * 风场相关 静态方法，【需要引入 mars3d-wind 插件库】
   * @module WindUtil
   */
  const Cesium$7 = mars3d__namespace.Cesium;

  /**
   * 风速风向 转 U值
   *
   * @export
   * @param {Number} speed 风速
   * @param {Number} direction 风向
   * @return {Number} U值
   */
  function getU(speed, direction) {
    const u = speed * Math.cos(Cesium$7.Math.toRadians(direction));
    return u
  }

  /**
   * 风速风向 转 V值
   *
   * @export
   * @param {Number} speed 风速
   * @param {Number} direction 风向
   * @return {Number} V值
   */
  function getV(speed, direction) {
    const v = speed * Math.sin(Cesium$7.Math.toRadians(direction));
    return v
  }

  /**
   * UV值 转 风速, 风速是uv分量的平方和
   *
   * @export
   * @param {Number} u U值
   * @param {Number} v V值
   * @return {Number} 风速
   */
  function getSpeed(u, v) {
    const speed = Math.sqrt(Math.pow(u, 2) + Math.pow(v, 2));
    return speed
  }

  /**
   * UV 转 风向
   *
   * @export
   * @param {Number} u U值
   * @param {Number} v V值
   * @return {Number} 风向
   */
  function getDirection(u, v) {
    let direction = Cesium$7.Math.toDegrees(Math.atan2(v, u));
    direction += direction < 0 ? 360 : 0;

    return direction
  }

  var WindUtil = {
    __proto__: null,
    getU: getU,
    getV: getV,
    getSpeed: getSpeed,
    getDirection: getDirection
  };

  const Cesium$6 = mars3d__namespace.Cesium;

  class CustomPrimitive {
    constructor(options) {
      this.commandType = options.commandType;

      this.geometry = options.geometry;
      this.attributeLocations = options.attributeLocations;
      this.primitiveType = options.primitiveType;

      this.uniformMap = options.uniformMap;

      this.vertexShaderSource = options.vertexShaderSource;
      this.fragmentShaderSource = options.fragmentShaderSource;

      this.rawRenderState = options.rawRenderState;
      this.framebuffer = options.framebuffer;

      this.outputTexture = options.outputTexture;

      this.autoClear = options.autoClear ?? false;
      this.preExecute = options.preExecute;

      this.show = true;
      this.commandToExecute = undefined;
      this.clearCommand = undefined;
      if (this.autoClear) {
        this.clearCommand = new Cesium$6.ClearCommand({
          color: new Cesium$6.Color(0.0, 0.0, 0.0, 0.0),
          depth: 1.0,
          framebuffer: this.framebuffer,
          pass: Cesium$6.Pass.OPAQUE
        });
      }
    }

    createCommand(context) {
      switch (this.commandType) {
        case "Draw": {
          const vertexArray = Cesium$6.VertexArray.fromGeometry({
            context: context,
            geometry: this.geometry,
            attributeLocations: this.attributeLocations,
            bufferUsage: Cesium$6.BufferUsage.STATIC_DRAW
          });

          const shaderProgram = Cesium$6.ShaderProgram.fromCache({
            context: context,
            attributeLocations: this.attributeLocations,
            vertexShaderSource: this.vertexShaderSource,
            fragmentShaderSource: this.fragmentShaderSource
          });

          const renderState = Cesium$6.RenderState.fromCache(this.rawRenderState);
          return new Cesium$6.DrawCommand({
            owner: this,
            vertexArray: vertexArray,
            primitiveType: this.primitiveType,
            uniformMap: this.uniformMap,
            modelMatrix: Cesium$6.Matrix4.IDENTITY,
            shaderProgram: shaderProgram,
            framebuffer: this.framebuffer,
            renderState: renderState,
            pass: Cesium$6.Pass.OPAQUE
          })
        }
        case "Compute": {
          return new Cesium$6.ComputeCommand({
            owner: this,
            fragmentShaderSource: this.fragmentShaderSource,
            uniformMap: this.uniformMap,
            outputTexture: this.outputTexture,
            persists: true
          })
        }
      }
    }

    setGeometry(context, geometry) {
      this.geometry = geometry;
      const vertexArray = Cesium$6.VertexArray.fromGeometry({
        context: context,
        geometry: this.geometry,
        attributeLocations: this.attributeLocations,
        bufferUsage: Cesium$6.BufferUsage.STATIC_DRAW
      });
      this.commandToExecute.vertexArray = vertexArray;
    }

    update(frameState) {
      if (!this.show) {
        return
      }
      if (frameState.mode !== Cesium$6.SceneMode.SCENE3D) {
        // 三维模式下
        return
      }

      if (!Cesium$6.defined(this.commandToExecute)) {
        this.commandToExecute = this.createCommand(frameState.context);
      }

      if (Cesium$6.defined(this.preExecute)) {
        this.preExecute();
      }

      if (Cesium$6.defined(this.clearCommand)) {
        frameState.commandList.push(this.clearCommand);
      }
      frameState.commandList.push(this.commandToExecute);
    }

    isDestroyed() {
      return false
    }

    destroy() {
      if (Cesium$6.defined(this.commandToExecute)) {
        this.commandToExecute.shaderProgram = this.commandToExecute.shaderProgram && this.commandToExecute.shaderProgram.destroy();
      }
      return Cesium$6.destroyObject(this)
    }
  }

  const Cesium$5 = mars3d__namespace.Cesium;

  const Util = (function () {
    const getFullscreenQuad = function () {
      const fullscreenQuad = new Cesium$5.Geometry({
        attributes: new Cesium$5.GeometryAttributes({
          position: new Cesium$5.GeometryAttribute({
            componentDatatype: Cesium$5.ComponentDatatype.FLOAT,
            componentsPerAttribute: 3,
            //  v3----v2
            //  |     |
            //  |     |
            //  v0----v1
            values: new Float32Array([
              -1,
              -1,
              0, // v0
              1,
              -1,
              0, // v1
              1,
              1,
              0, // v2
              -1,
              1,
              0 // v3
            ])
          }),
          st: new Cesium$5.GeometryAttribute({
            componentDatatype: Cesium$5.ComponentDatatype.FLOAT,
            componentsPerAttribute: 2,
            values: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1])
          })
        }),
        indices: new Uint32Array([3, 2, 0, 0, 2, 1])
      });
      return fullscreenQuad
    };

    const createTexture = function (options, typedArray) {
      if (Cesium$5.defined(typedArray)) {
        // typed array needs to be passed as source option, this is required by Cesium.Texture
        const source = {};
        source.arrayBufferView = typedArray;
        options.source = source;
      }

      const texture = new Cesium$5.Texture(options);
      return texture
    };

    const createFramebuffer = function (context, colorTexture, depthTexture) {
      const framebuffer = new Cesium$5.Framebuffer({
        context: context,
        colorTextures: [colorTexture],
        depthTexture: depthTexture
      });
      return framebuffer
    };

    const createRawRenderState = function (options) {
      const translucent = true;
      const closed = false;
      const existing = {
        viewport: options.viewport,
        depthTest: options.depthTest,
        depthMask: options.depthMask,
        blending: options.blending
      };

      const rawRenderState = Cesium$5.Appearance.getDefaultRenderState(translucent, closed, existing);
      return rawRenderState
    };

    const viewRectangleToLonLatRange = function (viewRectangle) {
      const range = {};

      const postiveWest = Cesium$5.Math.mod(viewRectangle.west, Cesium$5.Math.TWO_PI);
      const postiveEast = Cesium$5.Math.mod(viewRectangle.east, Cesium$5.Math.TWO_PI);
      const width = viewRectangle.width;

      let longitudeMin;
      let longitudeMax;
      if (width > Cesium$5.Math.THREE_PI_OVER_TWO) {
        longitudeMin = 0.0;
        longitudeMax = Cesium$5.Math.TWO_PI;
      } else {
        if (postiveEast - postiveWest < width) {
          longitudeMin = postiveWest;
          longitudeMax = postiveWest + width;
        } else {
          longitudeMin = postiveWest;
          longitudeMax = postiveEast;
        }
      }

      range.lon = {
        min: Cesium$5.Math.toDegrees(longitudeMin),
        max: Cesium$5.Math.toDegrees(longitudeMax)
      };

      const south = viewRectangle.south;
      const north = viewRectangle.north;
      const height = viewRectangle.height;

      const extendHeight = height > Cesium$5.Math.PI / 12 ? height / 2 : 0;
      let extendedSouth = Cesium$5.Math.clampToLatitudeRange(south - extendHeight);
      let extendedNorth = Cesium$5.Math.clampToLatitudeRange(north + extendHeight);

      // extend the bound in high latitude area to make sure it can cover all the visible area
      if (extendedSouth < -Cesium$5.Math.PI_OVER_THREE) {
        extendedSouth = -Cesium$5.Math.PI_OVER_TWO;
      }
      if (extendedNorth > Cesium$5.Math.PI_OVER_THREE) {
        extendedNorth = Cesium$5.Math.PI_OVER_TWO;
      }

      range.lat = {
        min: Cesium$5.Math.toDegrees(extendedSouth),
        max: Cesium$5.Math.toDegrees(extendedNorth)
      };

      return range
    };

    return {
      getFullscreenQuad: getFullscreenQuad,
      createTexture: createTexture,
      createFramebuffer: createFramebuffer,
      createRawRenderState: createRawRenderState,
      viewRectangleToLonLatRange: viewRectangleToLonLatRange
    }
  })();

  var segmentDraw_vert = "attribute vec2 st;\n// it is not normal itself, but used to control normal\nattribute vec3 normal; // (point to use, offset sign, not used component)\n\nuniform sampler2D currentParticlesPosition;\nuniform sampler2D postProcessingPosition;\nuniform sampler2D postProcessingSpeed;\n\nuniform float particleHeight;\n\nuniform float aspect;\nuniform float pixelSize;\nuniform float lineWidth;\n\nvarying float speedNormalization;\n\nvec3 convertCoordinate(vec3 lonLatLev) {\n    // WGS84 (lon, lat, lev) -> ECEF (x, y, z)\n    // see https://en.wikipedia.org/wiki/Geographic_coordinate_conversion#From_geodetic_to_ECEF_coordinates for detail\n\n    // WGS 84 geometric constants \n    float a = 6378137.0; // Semi-major axis \n    float b = 6356752.3142; // Semi-minor axis \n    float e2 = 6.69437999014e-3; // First eccentricity squared\n\n    float latitude = radians(lonLatLev.y);\n    float longitude = radians(lonLatLev.x);\n\n    float cosLat = cos(latitude);\n    float sinLat = sin(latitude);\n    float cosLon = cos(longitude);\n    float sinLon = sin(longitude);\n\n    float N_Phi = a / sqrt(1.0 - e2 * sinLat * sinLat);\n    float h = particleHeight; // it should be high enough otherwise the particle may not pass the terrain depth test\n\n    vec3 cartesian = vec3(0.0);\n    cartesian.x = (N_Phi + h) * cosLat * cosLon;\n    cartesian.y = (N_Phi + h) * cosLat * sinLon;\n    cartesian.z = ((b * b) / (a * a) * N_Phi + h) * sinLat;\n    return cartesian;\n}\n\nvec4 calcProjectedCoordinate(vec3 lonLatLev) {\n    // the range of longitude in Cesium is [-180, 180] but the range of longitude in the NetCDF file is [0, 360]\n    // [0, 180] is corresponding to [0, 180] and [180, 360] is corresponding to [-180, 0]\n    lonLatLev.x = mod(lonLatLev.x + 180.0, 360.0) - 180.0;\n    vec3 particlePosition = convertCoordinate(lonLatLev);\n    vec4 projectedCoordinate = czm_modelViewProjection * vec4(particlePosition, 1.0);\n    return projectedCoordinate;\n}\n\nvec4 calcOffset(vec4 currentProjectedCoordinate, vec4 nextProjectedCoordinate, float offsetSign) {\n    vec2 aspectVec2 = vec2(aspect, 1.0);\n    vec2 currentXY = (currentProjectedCoordinate.xy / currentProjectedCoordinate.w) * aspectVec2;\n    vec2 nextXY = (nextProjectedCoordinate.xy / nextProjectedCoordinate.w) * aspectVec2;\n\n    float offsetLength = lineWidth / 2.0;\n    vec2 direction = normalize(nextXY - currentXY);\n    vec2 normalVector = vec2(-direction.y, direction.x);\n    normalVector.x = normalVector.x / aspect;\n    normalVector = offsetLength * normalVector;\n\n    vec4 offset = vec4(offsetSign * normalVector, 0.0, 0.0);\n    return offset;\n}\n\nvoid main() {\n    vec2 particleIndex = st;\n\n    vec3 currentPosition = texture2D(currentParticlesPosition, particleIndex).rgb;\n    vec4 nextPosition = texture2D(postProcessingPosition, particleIndex);\n\n    vec4 currentProjectedCoordinate = vec4(0.0);\n    vec4 nextProjectedCoordinate = vec4(0.0);\n    if (nextPosition.w > 0.0) {\n        currentProjectedCoordinate = calcProjectedCoordinate(currentPosition);\n        nextProjectedCoordinate = calcProjectedCoordinate(currentPosition);\n    } else {\n        currentProjectedCoordinate = calcProjectedCoordinate(currentPosition);\n        nextProjectedCoordinate = calcProjectedCoordinate(nextPosition.xyz);\n    }\n\n    float pointToUse = normal.x; // -1 is currentProjectedCoordinate and +1 is nextProjectedCoordinate\n    float offsetSign = normal.y;\n\n    vec4 offset = pixelSize * calcOffset(currentProjectedCoordinate, nextProjectedCoordinate, offsetSign);\n    if (pointToUse < 0.0) {\n        gl_Position = currentProjectedCoordinate + offset;\n    } else {\n        gl_Position = nextProjectedCoordinate + offset;\n    }\n\n    speedNormalization = texture2D(postProcessingSpeed, particleIndex).a;\n}"; // eslint-disable-line

  var segmentDraw_frag = "uniform sampler2D colorTable;\n\nvarying float speedNormalization;\n\nvoid main() {\n    gl_FragColor = texture2D(colorTable, vec2(speedNormalization, 0.0));\n}"; // eslint-disable-line

  var fullscreen_vert = "attribute vec3 position;\r\nattribute vec2 st;\r\n\r\nvarying vec2 textureCoordinate;\r\n\r\nvoid main() {\r\n    textureCoordinate = st;\r\n    gl_Position = vec4(position, 1.0);\r\n}"; // eslint-disable-line

  var trailDraw_frag = "uniform sampler2D segmentsColorTexture;\r\nuniform sampler2D segmentsDepthTexture;\r\n\r\nuniform sampler2D currentTrailsColor;\r\nuniform sampler2D trailsDepthTexture;\r\n\r\nuniform float fadeOpacity;\r\n\r\nvarying vec2 textureCoordinate;\r\n\r\nvoid main() {\r\n    vec4 pointsColor = texture2D(segmentsColorTexture, textureCoordinate);\r\n    vec4 trailsColor = texture2D(currentTrailsColor, textureCoordinate);\r\n\r\n    trailsColor = floor(fadeOpacity * 255.0 * trailsColor) / 255.0; // make sure the trailsColor will be strictly decreased\r\n\r\n    float pointsDepth = texture2D(segmentsDepthTexture, textureCoordinate).r;\r\n    float trailsDepth = texture2D(trailsDepthTexture, textureCoordinate).r;\r\n    float globeDepth = czm_unpackDepth(texture2D(czm_globeDepthTexture, textureCoordinate));\r\n\r\n    gl_FragColor = vec4(0.0);\r\n    if (pointsDepth < globeDepth) {\r\n        gl_FragColor = gl_FragColor + pointsColor;\r\n    }\r\n    if (trailsDepth < globeDepth) {\r\n        gl_FragColor = gl_FragColor + trailsColor;\r\n    }\r\n    gl_FragDepthEXT = min(pointsDepth, trailsDepth);\r\n}"; // eslint-disable-line

  var screenDraw_frag = "uniform sampler2D trailsColorTexture;\r\nuniform sampler2D trailsDepthTexture;\r\n\r\nvarying vec2 textureCoordinate;\r\n\r\nvoid main() {\r\n    vec4 trailsColor = texture2D(trailsColorTexture, textureCoordinate);\r\n    float trailsDepth = texture2D(trailsDepthTexture, textureCoordinate).r;\r\n    float globeDepth = czm_unpackDepth(texture2D(czm_globeDepthTexture, textureCoordinate));\r\n\r\n    if (trailsDepth < globeDepth) {\r\n        gl_FragColor = trailsColor;\r\n    } else {\r\n        gl_FragColor = vec4(0.0);\r\n    }\r\n}"; // eslint-disable-line

  const Cesium$4 = mars3d__namespace.Cesium;

  class ParticlesRendering {
    constructor(context, data, options, viewerParameters, particlesComputing) {
      this.createRenderingTextures(context, data, options.colors);
      this.createRenderingFramebuffers(context);
      this.createRenderingPrimitives(context, options, viewerParameters, particlesComputing);
    }

    createRenderingTextures(context, data, colors) {
      const colorTextureOptions = {
        context: context,
        width: context.drawingBufferWidth,
        height: context.drawingBufferHeight,
        pixelFormat: Cesium$4.PixelFormat.RGBA,
        pixelDatatype: Cesium$4.PixelDatatype.UNSIGNED_BYTE
      };
      const depthTextureOptions = {
        context: context,
        width: context.drawingBufferWidth,
        height: context.drawingBufferHeight,
        pixelFormat: Cesium$4.PixelFormat.DEPTH_COMPONENT,
        pixelDatatype: Cesium$4.PixelDatatype.UNSIGNED_INT
      };

      // 颜色处理
      const colorNum = colors.length;
      const colorTable = new Float32Array(colorNum * 3);
      for (let i = 0; i < colorNum; i++) {
        const color = Cesium$4.Color.fromCssColorString(colors[i]);
        colorTable[3 * i] = color.red;
        colorTable[3 * i + 1] = color.green;
        colorTable[3 * i + 2] = color.blue;
      }
      const colorTableTextureOptions = {
        context: context,
        width: colorNum,
        height: 1,
        pixelFormat: Cesium$4.PixelFormat.RGB,
        pixelDatatype: Cesium$4.PixelDatatype.FLOAT,
        sampler: new Cesium$4.Sampler({
          minificationFilter: Cesium$4.TextureMinificationFilter.LINEAR,
          magnificationFilter: Cesium$4.TextureMagnificationFilter.LINEAR
        })
      };

      this.textures = {
        segmentsColor: Util.createTexture(colorTextureOptions),
        segmentsDepth: Util.createTexture(depthTextureOptions),

        currentTrailsColor: Util.createTexture(colorTextureOptions),
        currentTrailsDepth: Util.createTexture(depthTextureOptions),

        nextTrailsColor: Util.createTexture(colorTextureOptions),
        nextTrailsDepth: Util.createTexture(depthTextureOptions),

        colorTable: Util.createTexture(colorTableTextureOptions, colorTable)
      };
    }

    createRenderingFramebuffers(context) {
      this.framebuffers = {
        segments: Util.createFramebuffer(context, this.textures.segmentsColor, this.textures.segmentsDepth),
        currentTrails: Util.createFramebuffer(context, this.textures.currentTrailsColor, this.textures.currentTrailsDepth),
        nextTrails: Util.createFramebuffer(context, this.textures.nextTrailsColor, this.textures.nextTrailsDepth)
      };
    }

    createSegmentsGeometry(options) {
      const repeatVertex = 4;

      let st = [];
      for (let s = 0; s < options.particlesTextureSize; s++) {
        for (let t = 0; t < options.particlesTextureSize; t++) {
          for (let i = 0; i < repeatVertex; i++) {
            st.push(s / options.particlesTextureSize);
            st.push(t / options.particlesTextureSize);
          }
        }
      }
      st = new Float32Array(st);

      let normal = [];
      const pointToUse = [-1, 1];
      const offsetSign = [-1, 1];
      for (let i = 0; i < options.maxParticles; i++) {
        for (let j = 0; j < repeatVertex / 2; j++) {
          for (let k = 0; k < repeatVertex / 2; k++) {
            normal.push(pointToUse[j]);
            normal.push(offsetSign[k]);
            normal.push(0);
          }
        }
      }
      normal = new Float32Array(normal);

      const indexSize = 6 * options.maxParticles;
      const vertexIndexes = new Uint32Array(indexSize);
      for (let i = 0, j = 0, vertex = 0; i < options.maxParticles; i++) {
        vertexIndexes[j++] = vertex + 0;
        vertexIndexes[j++] = vertex + 1;
        vertexIndexes[j++] = vertex + 2;
        vertexIndexes[j++] = vertex + 2;
        vertexIndexes[j++] = vertex + 1;
        vertexIndexes[j++] = vertex + 3;
        vertex += 4;
      }

      const geometry = new Cesium$4.Geometry({
        attributes: new Cesium$4.GeometryAttributes({
          st: new Cesium$4.GeometryAttribute({
            componentDatatype: Cesium$4.ComponentDatatype.FLOAT,
            componentsPerAttribute: 2,
            values: st
          }),
          normal: new Cesium$4.GeometryAttribute({
            componentDatatype: Cesium$4.ComponentDatatype.FLOAT,
            componentsPerAttribute: 3,
            values: normal
          })
        }),
        indices: vertexIndexes
      });

      return geometry
    }

    createRenderingPrimitives(context, options, viewerParameters, particlesComputing) {
      const that = this;
      this.primitives = {
        segments: new CustomPrimitive({
          commandType: "Draw",
          attributeLocations: {
            st: 0,
            normal: 1
          },
          geometry: this.createSegmentsGeometry(options),
          primitiveType: Cesium$4.PrimitiveType.TRIANGLES,
          uniformMap: {
            currentParticlesPosition: function () {
              return particlesComputing.particlesTextures.currentParticlesPosition
            },
            postProcessingPosition: function () {
              return particlesComputing.particlesTextures.postProcessingPosition
            },
            postProcessingSpeed: function () {
              return particlesComputing.particlesTextures.postProcessingSpeed
            },
            colorTable: function () {
              return that.textures.colorTable
            },
            aspect: function () {
              return context.drawingBufferWidth / context.drawingBufferHeight
            },
            pixelSize: function () {
              return viewerParameters.pixelSize
            },
            lineWidth: function () {
              return options.lineWidth
            },
            particleHeight: function () {
              return options.particleHeight
            }
          },
          vertexShaderSource: new Cesium$4.ShaderSource({
            sources: [segmentDraw_vert]
          }),
          fragmentShaderSource: new Cesium$4.ShaderSource({
            sources: [segmentDraw_frag]
          }),
          rawRenderState: Util.createRawRenderState({
            // undefined value means let Cesium deal with it
            viewport: undefined,
            depthTest: {
              enabled: true
            },
            depthMask: true
          }),
          framebuffer: this.framebuffers.segments,
          autoClear: true
        }),

        trails: new CustomPrimitive({
          commandType: "Draw",
          attributeLocations: {
            position: 0,
            st: 1
          },
          geometry: Util.getFullscreenQuad(),
          primitiveType: Cesium$4.PrimitiveType.TRIANGLES,
          uniformMap: {
            segmentsColorTexture: function () {
              return that.textures.segmentsColor
            },
            segmentsDepthTexture: function () {
              return that.textures.segmentsDepth
            },
            currentTrailsColor: function () {
              return that.framebuffers.currentTrails.getColorTexture(0)
            },
            trailsDepthTexture: function () {
              return that.framebuffers.currentTrails.depthTexture
            },
            fadeOpacity: function () {
              return options.fadeOpacity
            }
          },
          // prevent Cesium from writing depth because the depth here should be written manually
          vertexShaderSource: new Cesium$4.ShaderSource({
            defines: ["DISABLE_GL_POSITION_LOG_DEPTH"],
            sources: [fullscreen_vert]
          }),
          fragmentShaderSource: new Cesium$4.ShaderSource({
            defines: ["DISABLE_LOG_DEPTH_FRAGMENT_WRITE"],
            sources: [trailDraw_frag]
          }),
          rawRenderState: Util.createRawRenderState({
            viewport: undefined,
            depthTest: {
              enabled: true,
              func: Cesium$4.DepthFunction.ALWAYS // always pass depth test for full control of depth information
            },
            depthMask: true
          }),
          framebuffer: this.framebuffers.nextTrails,
          autoClear: true,
          preExecute: function () {
            // swap framebuffers before binding
            const temp = that.framebuffers.currentTrails;
            that.framebuffers.currentTrails = that.framebuffers.nextTrails;
            that.framebuffers.nextTrails = temp;

            // keep the framebuffers up to date
            that.primitives.trails.commandToExecute.framebuffer = that.framebuffers.nextTrails;
            that.primitives.trails.clearCommand.framebuffer = that.framebuffers.nextTrails;
          }
        }),

        screen: new CustomPrimitive({
          commandType: "Draw",
          attributeLocations: {
            position: 0,
            st: 1
          },
          geometry: Util.getFullscreenQuad(),
          primitiveType: Cesium$4.PrimitiveType.TRIANGLES,
          uniformMap: {
            trailsColorTexture: function () {
              return that.framebuffers.nextTrails.getColorTexture(0)
            },
            trailsDepthTexture: function () {
              return that.framebuffers.nextTrails.depthTexture
            }
          },
          // prevent Cesium from writing depth because the depth here should be written manually
          vertexShaderSource: new Cesium$4.ShaderSource({
            defines: ["DISABLE_GL_POSITION_LOG_DEPTH"],
            sources: [fullscreen_vert]
          }),
          fragmentShaderSource: new Cesium$4.ShaderSource({
            defines: ["DISABLE_LOG_DEPTH_FRAGMENT_WRITE"],
            sources: [screenDraw_frag]
          }),
          rawRenderState: Util.createRawRenderState({
            viewport: undefined,
            depthTest: {
              enabled: false
            },
            depthMask: true,
            blending: {
              enabled: true
            }
          }),
          framebuffer: undefined // undefined value means let Cesium deal with it
        })
      };
    }
  }

  var getWind_frag = "// the size of UV textures: width = lon, height = lat*lev\nuniform sampler2D U; // eastward wind \nuniform sampler2D V; // northward wind\n\nuniform sampler2D currentParticlesPosition; // (lon, lat, lev)\n\nuniform vec3 dimension; // (lon, lat, lev)\nuniform vec3 minimum; // minimum of each dimension\nuniform vec3 maximum; // maximum of each dimension\nuniform vec3 interval; // interval of each dimension\n\nvarying vec2 v_textureCoordinates;\n\nvec2 mapPositionToNormalizedIndex2D(vec3 lonLatLev) {\n    // ensure the range of longitude and latitude\n    lonLatLev.x = mod(lonLatLev.x, 360.0);\n    lonLatLev.y = clamp(lonLatLev.y, -90.0, 90.0);\n\n    vec3 index3D = vec3(0.0);\n    index3D.x = (lonLatLev.x - minimum.x) / interval.x;\n    index3D.y = (lonLatLev.y - minimum.y) / interval.y;\n    index3D.z = (lonLatLev.z - minimum.z) / interval.z;\n\n    // the st texture coordinate corresponding to (col, row) index\n    // example\n    // data array is [0, 1, 2, 3, 4, 5], width = 3, height = 2\n    // the content of texture will be\n    // t 1.0\n    //    |  3 4 5\n    //    |\n    //    |  0 1 2\n    //   0.0------1.0 s\n\n    vec2 index2D = vec2(index3D.x, index3D.z * dimension.y + index3D.y);\n    vec2 normalizedIndex2D = vec2(index2D.x / dimension.x, index2D.y / (dimension.y * dimension.z));\n    return normalizedIndex2D;\n}\n\nfloat getWind(sampler2D windTexture, vec3 lonLatLev) {\n    vec2 normalizedIndex2D = mapPositionToNormalizedIndex2D(lonLatLev);\n    float result = texture2D(windTexture, normalizedIndex2D).r;\n    return result;\n}\n\nconst mat4 kernelMatrix = mat4(\n    0.0, -1.0, 2.0, -1.0, // first column\n    2.0, 0.0, -5.0, 3.0, // second column\n    0.0, 1.0, 4.0, -3.0, // third column\n    0.0, 0.0, -1.0, 1.0 // fourth column\n);\nfloat oneDimensionInterpolation(float t, float p0, float p1, float p2, float p3) {\n    vec4 tVec4 = vec4(1.0, t, t * t, t * t * t);\n    tVec4 = tVec4 / 2.0;\n    vec4 pVec4 = vec4(p0, p1, p2, p3);\n    return dot((tVec4 * kernelMatrix), pVec4);\n}\n\nfloat calculateB(sampler2D windTexture, float t, float lon, float lat, float lev) {\n    float lon0 = floor(lon) - 1.0 * interval.x;\n    float lon1 = floor(lon);\n    float lon2 = floor(lon) + 1.0 * interval.x;\n    float lon3 = floor(lon) + 2.0 * interval.x;\n\n    float p0 = getWind(windTexture, vec3(lon0, lat, lev));\n    float p1 = getWind(windTexture, vec3(lon1, lat, lev));\n    float p2 = getWind(windTexture, vec3(lon2, lat, lev));\n    float p3 = getWind(windTexture, vec3(lon3, lat, lev));\n\n    return oneDimensionInterpolation(t, p0, p1, p2, p3);\n}\n\nfloat interpolateOneTexture(sampler2D windTexture, vec3 lonLatLev) {\n    float lon = lonLatLev.x;\n    float lat = lonLatLev.y;\n    float lev = lonLatLev.z;\n\n    float lat0 = floor(lat) - 1.0 * interval.y;\n    float lat1 = floor(lat);\n    float lat2 = floor(lat) + 1.0 * interval.y;\n    float lat3 = floor(lat) + 2.0 * interval.y;\n\n    vec2 coefficient = lonLatLev.xy - floor(lonLatLev.xy);\n    float b0 = calculateB(windTexture, coefficient.x, lon, lat0, lev);\n    float b1 = calculateB(windTexture, coefficient.x, lon, lat1, lev);\n    float b2 = calculateB(windTexture, coefficient.x, lon, lat2, lev);\n    float b3 = calculateB(windTexture, coefficient.x, lon, lat3, lev);\n\n    return oneDimensionInterpolation(coefficient.y, b0, b1, b2, b3);\n}\n\nvec3 bicubic(vec3 lonLatLev) {\n    // https://en.wikipedia.org/wiki/Bicubic_interpolation#Bicubic_convolution_algorithm\n    float u = interpolateOneTexture(U, lonLatLev);\n    float v = interpolateOneTexture(V, lonLatLev);\n    float w = 0.0;\n    return vec3(u, v, w);\n}\n\nvoid main() {\n    // texture coordinate must be normalized\n    vec3 lonLatLev = texture2D(currentParticlesPosition, v_textureCoordinates).rgb;\n    vec3 windVector = bicubic(lonLatLev);\n    gl_FragColor = vec4(windVector, 0.0);\n}"; // eslint-disable-line

  var updateSpeed_frag = "uniform sampler2D currentParticlesSpeed; // (u, v, w, normalization)\nuniform sampler2D particlesWind;\n\n// used to calculate the wind norm\nuniform vec2 uSpeedRange; // (min, max);\nuniform vec2 vSpeedRange;\nuniform float pixelSize;\nuniform float speedFactor;\n\nvarying vec2 v_textureCoordinates;\n\nfloat calculateWindNorm(vec3 speed) {\n    vec3 percent = vec3(0.0);\n    percent.x = (speed.x - uSpeedRange.x) / (uSpeedRange.y - uSpeedRange.x);\n    percent.y = (speed.y - vSpeedRange.x) / (vSpeedRange.y - vSpeedRange.x);\n    float normalization = length(percent);\n\n    return normalization;\n}\n\nvoid main() {\n    // texture coordinate must be normalized\n    vec3 currentSpeed = texture2D(currentParticlesSpeed, v_textureCoordinates).rgb;\n    vec3 windVector = texture2D(particlesWind, v_textureCoordinates).rgb;\n\n    vec4 nextSpeed = vec4(speedFactor * pixelSize * windVector, calculateWindNorm(windVector));\n    gl_FragColor = nextSpeed;\n}"; // eslint-disable-line

  var updatePosition_frag = "uniform sampler2D currentParticlesPosition; // (lon, lat, lev)\nuniform sampler2D currentParticlesSpeed; // (u, v, w, normalization)\n\nvarying vec2 v_textureCoordinates;\n\nvec2 lengthOfLonLat(vec3 lonLatLev) {\n    // unit conversion: meters -> longitude latitude degrees\n    // see https://en.wikipedia.org/wiki/Geographic_coordinate_system#Length_of_a_degree for detail\n\n    // Calculate the length of a degree of latitude and longitude in meters\n    float latitude = radians(lonLatLev.y);\n\n    float term1 = 111132.92;\n    float term2 = 559.82 * cos(2.0 * latitude);\n    float term3 = 1.175 * cos(4.0 * latitude);\n    float term4 = 0.0023 * cos(6.0 * latitude);\n    float latLength = term1 - term2 + term3 - term4;\n\n    float term5 = 111412.84 * cos(latitude);\n    float term6 = 93.5 * cos(3.0 * latitude);\n    float term7 = 0.118 * cos(5.0 * latitude);\n    float longLength = term5 - term6 + term7;\n\n    return vec2(longLength, latLength);\n}\n\nvoid updatePosition(vec3 lonLatLev, vec3 speed) {\n    vec2 lonLatLength = lengthOfLonLat(lonLatLev);\n    float u = speed.x / lonLatLength.x;\n    float v = speed.y / lonLatLength.y;\n    float w = 0.0;\n    vec3 windVectorInLonLatLev = vec3(u, v, w);\n\n    vec3 nextParticle = lonLatLev + windVectorInLonLatLev;\n\n    gl_FragColor = vec4(nextParticle, 0.0);\n}\n\nvoid main() {\n    // texture coordinate must be normalized\n    vec3 lonLatLev = texture2D(currentParticlesPosition, v_textureCoordinates).rgb;\n    vec3 speed = texture2D(currentParticlesSpeed, v_textureCoordinates).rgb;\n\n    updatePosition(lonLatLev, speed);\n}"; // eslint-disable-line

  var postProcessingPosition_frag = "uniform sampler2D nextParticlesPosition;\nuniform sampler2D nextParticlesSpeed; // (u, v, w, normalization)\n\n// range (min, max)\nuniform vec2 lonRange;\nuniform vec2 latRange;\n\nuniform float randomCoefficient; // use to improve the pseudo-random generator\nuniform float dropRate; // drop rate is a chance a particle will restart at random position to avoid degeneration\nuniform float dropRateBump;\n\nvarying vec2 v_textureCoordinates;\n\n// pseudo-random generator\nconst vec3 randomConstants = vec3(12.9898, 78.233, 4375.85453);\nconst vec2 normalRange = vec2(0.0, 1.0);\nfloat rand(vec2 seed, vec2 range) {\n    vec2 randomSeed = randomCoefficient * seed;\n    float temp = dot(randomConstants.xy, randomSeed);\n    temp = fract(sin(temp) * (randomConstants.z + temp));\n    return temp * (range.y - range.x) + range.x;\n}\n\nvec3 generateRandomParticle(vec2 seed, float lev) {\n    // ensure the longitude is in [0, 360]\n    float randomLon = mod(rand(seed, lonRange), 360.0);\n    float randomLat = rand(-seed, latRange);\n\n    return vec3(randomLon, randomLat, lev);\n}\n\nbool particleOutbound(vec3 particle) {\n    return particle.y < -90.0 || particle.y > 90.0;\n}\n\nvoid main() {\n    vec3 nextParticle = texture2D(nextParticlesPosition, v_textureCoordinates).rgb;\n    vec4 nextSpeed = texture2D(nextParticlesSpeed, v_textureCoordinates);\n    float particleDropRate = dropRate + dropRateBump * nextSpeed.a;\n\n    vec2 seed1 = nextParticle.xy + v_textureCoordinates;\n    vec2 seed2 = nextSpeed.xy + v_textureCoordinates;\n    vec3 randomParticle = generateRandomParticle(seed1, nextParticle.z);\n    float randomNumber = rand(seed2, normalRange);\n\n    if (randomNumber < particleDropRate || particleOutbound(nextParticle)) {\n        gl_FragColor = vec4(randomParticle, 1.0); // 1.0 means this is a random particle\n    } else {\n        gl_FragColor = vec4(nextParticle, 0.0);\n    }\n}"; // eslint-disable-line

  var postProcessingSpeed_frag = "uniform sampler2D postProcessingPosition;\nuniform sampler2D nextParticlesSpeed;\n\nvarying vec2 v_textureCoordinates;\n\nvoid main() {\n    vec4 randomParticle = texture2D(postProcessingPosition, v_textureCoordinates);\n    vec4 particleSpeed = texture2D(nextParticlesSpeed, v_textureCoordinates);\n\n    if (randomParticle.a > 0.0) {\n        gl_FragColor = vec4(0.0);\n    } else {\n        gl_FragColor = particleSpeed;\n    }\n}"; // eslint-disable-line

  const Cesium$3 = mars3d__namespace.Cesium;

  class ParticlesComputing {
    constructor(context, data, options, viewerParameters) {
      this.data = data;

      this.createWindTextures(context, data);
      this.createParticlesTextures(context, options, viewerParameters);
      this.createComputingPrimitives(data, options, viewerParameters);
    }

    createWindTextures(context, data) {
      const windTextureOptions = {
        context: context,
        width: data.dimensions.lon,
        height: data.dimensions.lat * (data.dimensions.lev || 1),
        pixelFormat: Cesium$3.PixelFormat.LUMINANCE,
        pixelDatatype: Cesium$3.PixelDatatype.FLOAT,
        flipY: false,
        sampler: new Cesium$3.Sampler({
          // the values of texture will not be interpolated
          minificationFilter: Cesium$3.TextureMinificationFilter.NEAREST,
          magnificationFilter: Cesium$3.TextureMagnificationFilter.NEAREST
        })
      };

      this.windTextures = {
        U: Util.createTexture(windTextureOptions, data.U.array),
        V: Util.createTexture(windTextureOptions, data.V.array)
      };
    }

    createParticlesTextures(context, options, viewerParameters) {
      const particlesTextureOptions = {
        context: context,
        width: options.particlesTextureSize,
        height: options.particlesTextureSize,
        pixelFormat: Cesium$3.PixelFormat.RGBA,
        pixelDatatype: Cesium$3.PixelDatatype.FLOAT,
        flipY: false,
        sampler: new Cesium$3.Sampler({
          // the values of texture will not be interpolated
          minificationFilter: Cesium$3.TextureMinificationFilter.NEAREST,
          magnificationFilter: Cesium$3.TextureMagnificationFilter.NEAREST
        })
      };

      const particlesArray = this.randomizeParticles(options.maxParticles, viewerParameters);
      const zeroArray = new Float32Array(4 * options.maxParticles).fill(0);

      this.particlesTextures = {
        particlesWind: Util.createTexture(particlesTextureOptions),

        currentParticlesPosition: Util.createTexture(particlesTextureOptions, particlesArray),
        nextParticlesPosition: Util.createTexture(particlesTextureOptions, particlesArray),

        currentParticlesSpeed: Util.createTexture(particlesTextureOptions, zeroArray),
        nextParticlesSpeed: Util.createTexture(particlesTextureOptions, zeroArray),

        postProcessingPosition: Util.createTexture(particlesTextureOptions, particlesArray),
        postProcessingSpeed: Util.createTexture(particlesTextureOptions, zeroArray)
      };
    }

    randomizeParticles(maxParticles, viewerParameters) {
      const array = new Float32Array(4 * maxParticles);
      for (let i = 0; i < maxParticles; i++) {
        array[4 * i] = Cesium$3.Math.randomBetween(viewerParameters.lonRange.x, viewerParameters.lonRange.y);
        array[4 * i + 1] = Cesium$3.Math.randomBetween(viewerParameters.latRange.x, viewerParameters.latRange.y);
        array[4 * i + 2] = Cesium$3.Math.randomBetween(this.data.lev.min, this.data.lev.max);
        array[4 * i + 3] = 0.0;
      }
      return array
    }

    destroyParticlesTextures() {
      Object.keys(this.particlesTextures).forEach((key) => {
        this.particlesTextures[key].destroy();
      });
    }

    createComputingPrimitives(data, options, viewerParameters) {
      const dimension = new Cesium$3.Cartesian3(data.dimensions.lon, data.dimensions.lat, data.dimensions.lev);
      const minimum = new Cesium$3.Cartesian3(data.lon.min, data.lat.min, data.lev.min);
      const maximum = new Cesium$3.Cartesian3(data.lon.max, data.lat.max, data.lev.max);
      const interval = new Cesium$3.Cartesian3(
        (maximum.x - minimum.x) / (dimension.x - 1),
        (maximum.y - minimum.y) / (dimension.y - 1),
        dimension.z > 1 ? (maximum.z - minimum.z) / (dimension.z - 1) : 1.0
      );
      const uSpeedRange = new Cesium$3.Cartesian2(data.U.min, data.U.max);
      const vSpeedRange = new Cesium$3.Cartesian2(data.V.min, data.V.max);

      const that = this;

      this.primitives = {
        getWind: new CustomPrimitive({
          commandType: "Compute",
          uniformMap: {
            U: function () {
              return that.windTextures.U
            },
            V: function () {
              return that.windTextures.V
            },
            currentParticlesPosition: function () {
              return that.particlesTextures.currentParticlesPosition
            },
            dimension: function () {
              return dimension
            },
            minimum: function () {
              return minimum
            },
            maximum: function () {
              return maximum
            },
            interval: function () {
              return interval
            }
          },
          fragmentShaderSource: new Cesium$3.ShaderSource({
            sources: [getWind_frag]
          }),
          outputTexture: this.particlesTextures.particlesWind,
          preExecute: function () {
            // keep the outputTexture up to date
            that.primitives.getWind.commandToExecute.outputTexture = that.particlesTextures.particlesWind;
          }
        }),

        updateSpeed: new CustomPrimitive({
          commandType: "Compute",
          uniformMap: {
            currentParticlesSpeed: function () {
              return that.particlesTextures.currentParticlesSpeed
            },
            particlesWind: function () {
              return that.particlesTextures.particlesWind
            },
            uSpeedRange: function () {
              return uSpeedRange
            },
            vSpeedRange: function () {
              return vSpeedRange
            },
            pixelSize: function () {
              return viewerParameters.pixelSize
            },
            speedFactor: function () {
              return options.speedFactor
            }
          },
          fragmentShaderSource: new Cesium$3.ShaderSource({
            sources: [updateSpeed_frag]
          }),
          outputTexture: this.particlesTextures.nextParticlesSpeed,
          preExecute: function () {
            // swap textures before binding
            const temp = that.particlesTextures.currentParticlesSpeed;
            that.particlesTextures.currentParticlesSpeed = that.particlesTextures.postProcessingSpeed;
            that.particlesTextures.postProcessingSpeed = temp;

            // keep the outputTexture up to date
            that.primitives.updateSpeed.commandToExecute.outputTexture = that.particlesTextures.nextParticlesSpeed;
          }
        }),

        updatePosition: new CustomPrimitive({
          commandType: "Compute",
          uniformMap: {
            currentParticlesPosition: function () {
              return that.particlesTextures.currentParticlesPosition
            },
            currentParticlesSpeed: function () {
              return that.particlesTextures.currentParticlesSpeed
            }
          },
          fragmentShaderSource: new Cesium$3.ShaderSource({
            sources: [updatePosition_frag]
          }),
          outputTexture: this.particlesTextures.nextParticlesPosition,
          preExecute: function () {
            // swap textures before binding
            const temp = that.particlesTextures.currentParticlesPosition;
            that.particlesTextures.currentParticlesPosition = that.particlesTextures.postProcessingPosition;
            that.particlesTextures.postProcessingPosition = temp;

            // keep the outputTexture up to date
            that.primitives.updatePosition.commandToExecute.outputTexture = that.particlesTextures.nextParticlesPosition;
          }
        }),

        postProcessingPosition: new CustomPrimitive({
          commandType: "Compute",
          uniformMap: {
            nextParticlesPosition: function () {
              return that.particlesTextures.nextParticlesPosition
            },
            nextParticlesSpeed: function () {
              return that.particlesTextures.nextParticlesSpeed
            },
            lonRange: function () {
              return viewerParameters.lonRange
            },
            latRange: function () {
              return viewerParameters.latRange
            },
            randomCoefficient: function () {
              const randomCoefficient = Math.random();
              return randomCoefficient
            },
            dropRate: function () {
              return options.dropRate
            },
            dropRateBump: function () {
              return options.dropRateBump
            }
          },
          fragmentShaderSource: new Cesium$3.ShaderSource({
            sources: [postProcessingPosition_frag]
          }),
          outputTexture: this.particlesTextures.postProcessingPosition,
          preExecute: function () {
            // keep the outputTexture up to date
            that.primitives.postProcessingPosition.commandToExecute.outputTexture = that.particlesTextures.postProcessingPosition;
          }
        }),

        postProcessingSpeed: new CustomPrimitive({
          commandType: "Compute",
          uniformMap: {
            postProcessingPosition: function () {
              return that.particlesTextures.postProcessingPosition
            },
            nextParticlesSpeed: function () {
              return that.particlesTextures.nextParticlesSpeed
            }
          },
          fragmentShaderSource: new Cesium$3.ShaderSource({
            sources: [postProcessingSpeed_frag]
          }),
          outputTexture: this.particlesTextures.postProcessingSpeed,
          preExecute: function () {
            // keep the outputTexture up to date
            that.primitives.postProcessingSpeed.commandToExecute.outputTexture = that.particlesTextures.postProcessingSpeed;
          }
        })
      };
    }
  }

  const Cesium$2 = mars3d__namespace.Cesium;

  class ParticleSystem {
    constructor(context, data, options, viewerParameters) {
      this.context = context;

      data = { ...data };

      // 兼容不同格式数据
      if (data.udata && data.vdata) {
        data.dimensions = {};
        data.dimensions.lon = data.cols;
        data.dimensions.lat = data.rows;
        data.dimensions.lev = data.lev || 1;

        data.lon = {};
        data.lon.min = data.xmin;
        data.lon.max = data.xmax;

        data.lat = {};
        data.lat.min = data.ymin;
        data.lat.max = data.ymax;

        data.lev = {};
        data.lev.min = data.levmin ?? 1;
        data.lev.max = data.levmax ?? 1;

        data.U = {};
        data.U.array = new Float32Array(data.udata);
        data.U.min = data.umin ?? Math.min(...data.udata);
        data.U.max = data.umax ?? Math.max(...data.udata);

        data.V = {};
        data.V.array = new Float32Array(data.vdata);
        data.V.min = data.vmin ?? Math.min(...data.vdata);
        data.V.max = data.vmax ?? Math.max(...data.vdata);
      }
      this.data = data;

      this.options = options;
      this.viewerParameters = viewerParameters;

      this.particlesComputing = new ParticlesComputing(this.context, this.data, this.options, this.viewerParameters);
      this.particlesRendering = new ParticlesRendering(this.context, this.data, this.options, this.viewerParameters, this.particlesComputing);
    }

    canvasResize(context) {
      this.particlesComputing.destroyParticlesTextures();
      Object.keys(this.particlesComputing.windTextures).forEach((key) => {
        this.particlesComputing.windTextures[key].destroy();
      });

      this.particlesRendering.textures.colorTable.destroy();
      Object.keys(this.particlesRendering.framebuffers).forEach((key) => {
        this.particlesRendering.framebuffers[key].destroy();
      });

      this.context = context;
      this.particlesComputing = new ParticlesComputing(this.context, this.data, this.options, this.viewerParameters);
      this.particlesRendering = new ParticlesRendering(this.context, this.data, this.options, this.viewerParameters, this.particlesComputing);
    }

    clearFramebuffers() {
      const clearCommand = new Cesium$2.ClearCommand({
        color: new Cesium$2.Color(0.0, 0.0, 0.0, 0.0),
        depth: 1.0,
        framebuffer: undefined,
        pass: Cesium$2.Pass.OPAQUE
      });

      Object.keys(this.particlesRendering.framebuffers).forEach((key) => {
        clearCommand.framebuffer = this.particlesRendering.framebuffers[key];
        clearCommand.execute(this.context);
      });
    }

    refreshParticles(maxParticlesChanged) {
      this.clearFramebuffers();

      this.particlesComputing.destroyParticlesTextures();
      this.particlesComputing.createParticlesTextures(this.context, this.options, this.viewerParameters);

      if (maxParticlesChanged) {
        const geometry = this.particlesRendering.createSegmentsGeometry(this.options);
        this.particlesRendering.primitives.segments.geometry = geometry;
        const vertexArray = Cesium$2.VertexArray.fromGeometry({
          context: this.context,
          geometry: geometry,
          attributeLocations: this.particlesRendering.primitives.segments.attributeLocations,
          bufferUsage: Cesium$2.BufferUsage.STATIC_DRAW
        });
        this.particlesRendering.primitives.segments.commandToExecute.vertexArray = vertexArray;
      }
    }

    setOptions(options) {
      let maxParticlesChanged = false;
      if (this.options.maxParticles !== options.maxParticles) {
        maxParticlesChanged = true;
      }

      Object.keys(options).forEach((key) => {
        this.options[key] = options[key];
      });

      this.refreshParticles(maxParticlesChanged);
    }

    applyViewerParameters(viewerParameters) {
      Object.keys(viewerParameters).forEach((key) => {
        this.viewerParameters[key] = viewerParameters[key];
      });

      this.refreshParticles(false);
    }

    destroy() {
      clearTimeout(this.canrefresh);

      this.particlesComputing.destroyParticlesTextures();
      Object.keys(this.particlesComputing.windTextures).forEach((key) => {
        this.particlesComputing.windTextures[key].destroy();
      });

      this.particlesRendering.textures.colorTable.destroy();
      Object.keys(this.particlesRendering.framebuffers).forEach((key) => {
        this.particlesRendering.framebuffers[key].destroy();
      });

      // 删除所有绑定的数据
      for (const i in this) {
        delete this[i];
      }
    }
  }

  const Cesium$1 = mars3d__namespace.Cesium;

  const BaseLayer$1 = mars3d__namespace.layer.BaseLayer;

  /**
   * 风场图层， data数据结构
   *
   * @typedef {Object} WindLayer.DataOptions
   *
   * @property {Number} rows 行总数
   * @property {Number} cols 列总数
   * @property {Number} xmin 最小经度（度数，-180-180）
   * @property {Number} xmax 最大经度（度数，-180-180）
   * @property {Number} ymin 最小纬度（度数，-90-90）
   * @property {Number} ymax 最大纬度（度数，-90-90）
   * @property {Number[]} udata U值一维数组, 数组长度应该是 rows*cols。
   * @property {Number} [umin] 最小U值
   * @property {Number} [umax] 最大U值
   * @property {Number[]} vdata V值一维数组, 数组长度应该是 rows*cols。
   * @property {Number} [vmin] 最小v值
   * @property {Number} [vmax] 最大v值
   */

  const DEF_OPTIONS = {
    particlesNumber: 4096,
    fixedHeight: 0.0,
    fadeOpacity: 0.996,
    dropRate: 0.003,
    dropRateBump: 0.01,
    speedFactor: 0.5,
    lineWidth: 2.0,
    colors: ["rgb(206,255,255)"]
  };

  /**
   * 风场图层，基于粒子实现，
   * 【需要引入 mars3d-wind 插件库】
   *
   * @param {Object} [options] 参数对象，包括以下：
   * @param {WindLayer.DataOptions} [options.data] 风场数据
   * @param {Number} [options.particlesNumber =4096] 初始粒子总数
   * @param {Number} [options.fadeOpacity =0.996] 消失不透明度
   * @param {Number} [options.dropRate =0.003] 下降率
   * @param {Number} [options.dropRateBump =0.01] 下降速度
   * @param {Number} [options.speedFactor = 0.5] 速度系数
   * @param {Number} [options.lineWidth =2.0] 线宽度
   * @param {Number} [options.fixedHeight =0] 粒子点的固定的海拔高度
   * @param {String[]} [options.colors=["rgb(206,255,255)"]] 颜色色带数组
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
   * @class WindLayer
   * @extends {BaseLayer}
   */
  class WindLayer extends BaseLayer$1 {
    constructor(options = {}) {
      options = { ...DEF_OPTIONS, ...options };
      super(options);

      this._setOptionsHook(options);
    }

    /**
     * 存放风场粒子对象的容器
     * @type {Cesium.PrimitiveCollection}
     * @readonly
     */
    get layer() {
      return this.primitives
    }

    /**
     * 风场数据，数据结构见类的构造方法说明
     * @type {WindLayer.DataOptions}
     */
    get data() {
      return this._data
    }

    set data(value) {
      this.setData(value);
    }

    /**
     * 颜色色带数组
     * @type {String[]}
     */
    get colors() {
      return this.options.colors
    }

    set colors(value) {
      this.options.colors = value;

      if (this.particleSystem) {
        this.particleSystem.setOptions({ colors: value });
      }
      this.resize();
    }

    /**
     * 对象添加到地图前创建一些对象的钩子方法，
     * 只会调用一次
     * @return {void}  无
     * @private
     */
    _mountedHook() {}

    /**
     * 对象添加到地图上的创建钩子方法，
     * 每次add时都会调用
     * @return {void}  无
     * @private
     */
    _addedHook() {
      this.scene = this._map.scene;
      this.camera = this._map.camera;

      this.primitives = new Cesium$1.PrimitiveCollection();
      this._map.scene.primitives.add(this.primitives);

      this.viewerParameters = {
        lonRange: new Cesium$1.Cartesian2(),
        latRange: new Cesium$1.Cartesian2(),
        pixelSize: 0.0
      };
      // use a smaller earth radius to make sure distance to camera > 0
      this.globeBoundingSphere = new Cesium$1.BoundingSphere(Cesium$1.Cartesian3.ZERO, 0.99 * 6378137.0);
      this.updateViewerParameters();

      // 添加 resize 绑定事件
      window.addEventListener("resize", this.resize.bind(this), false);

      // 鼠标滚动、旋转后 需要重新生成风场
      this.mouse_down = false;
      this.mouse_move = false;

      this._map.on(mars3d__namespace.EventType.wheel, this._onMapWhellEvent, this);
      this._map.on(mars3d__namespace.EventType.mouseDown, this._onMouseDownEvent, this);
      this._map.on(mars3d__namespace.EventType.mouseUp, this._onMouseUpEvent, this);
      this._map.on(mars3d__namespace.EventType.mouseMove, this._onMouseMoveEvent, this);

      if (this._data) {
        this.setData(this._data);
      }
    }

    /**
     * 对象从地图上移除的创建钩子方法，
     * 每次remove时都会调用
     * @return {void}  无
     * @private
     */
    _removedHook() {
      window.removeEventListener("resize", this.resize);
      this._map.off(mars3d__namespace.EventType.preRender, this._onMap_preRenderEvent, this);

      this._map.off(mars3d__namespace.EventType.wheel, this._onMapWhellEvent, this);
      this._map.off(mars3d__namespace.EventType.mouseDown, this._onMouseDownEvent, this);
      this._map.off(mars3d__namespace.EventType.mouseUp, this._onMouseUpEvent, this);
      this._map.off(mars3d__namespace.EventType.mouseMove, this._onMouseMoveEvent, this);

      this.primitives.removeAll();
      this._map.scene.primitives.remove(this.primitives);
    }

    // 更新canvas的高宽
    resize() {
      if (!this.show || !this.particleSystem) {
        return
      }

      this.primitives.show = false;
      this.primitives.removeAll();

      this._map.once(mars3d__namespace.EventType.preRender, this._onMap_preRenderEvent, this);
    }

    _onMap_preRenderEvent(event) {
      this.particleSystem.canvasResize(this.scene.context);
      this.addPrimitives();
      this.primitives.show = true;
    }

    // 鼠标交互
    _onMapWhellEvent(event) {
      clearTimeout(this.refreshTimer);
      if (!this.show || !this.particleSystem) {
        return
      }

      this.primitives.show = false;
      this.refreshTimer = setTimeout(() => {
        if (!this.show) {
          return
        }
        this.redraw();
      }, 200);
    }

    _onMouseDownEvent(event) {
      this.mouse_down = true;
    }

    _onMouseMoveEvent(event) {
      if (!this.show || !this.particleSystem) {
        return
      }

      if (this.mouse_down) {
        this.primitives.show = false;
        this.mouse_move = true;
      }
    }

    _onMouseUpEvent(event) {
      if (!this.show || !this.particleSystem) {
        return
      }

      if (this.mouse_down && this.mouse_move) {
        this.redraw();
      }
      this.primitives.show = true;
      this.mouse_down = false;
      this.mouse_move = false;
    }

    redraw() {
      if (!this._map || !this.show) {
        return
      }
      this.updateViewerParameters();
      this.particleSystem.applyViewerParameters(this.viewerParameters);
      this.primitives.show = true;
    }

    /**
     * 设置 风场数据
     * @param {WindLayer.DataOptions} data 风场数据
     * @return {void}  无
     */
    setData(data) {
      this._data = data;

      if (this.particleSystem) {
        this.particleSystem.destroy();
      }

      this.particleSystem = new ParticleSystem(this.scene.context, data, this.getOptions(), this.viewerParameters);
      this.addPrimitives();
    }

    _setOptionsHook(options) {
      if (options) {
        for (const key in options) {
          this[key] = options[key];
        }
      }
      if (this.particleSystem) {
        this.particleSystem.setOptions(this.getOptions());
      }
    }

    getOptions() {
      // make sure particlesNumber is exactly the square of particlesTextureSize
      const particlesTextureSize = Math.ceil(Math.sqrt(this.particlesNumber));
      this.particlesNumber = particlesTextureSize * particlesTextureSize;

      return {
        particlesTextureSize: particlesTextureSize,
        maxParticles: this.particlesNumber,
        particleHeight: this.fixedHeight,
        fadeOpacity: this.fadeOpacity,
        dropRate: this.dropRate,
        dropRateBump: this.dropRateBump,
        speedFactor: this.speedFactor,
        lineWidth: this.lineWidth,
        globeLayer: this.globeLayer,
        WMS_URL: this.WMS_URL,
        colors: this.colors
      }
    }

    addPrimitives() {
      // the order of primitives.add() should respect the dependency of primitives
      this.primitives.add(this.particleSystem.particlesComputing.primitives.getWind);
      this.primitives.add(this.particleSystem.particlesComputing.primitives.updateSpeed);
      this.primitives.add(this.particleSystem.particlesComputing.primitives.updatePosition);
      this.primitives.add(this.particleSystem.particlesComputing.primitives.postProcessingPosition);
      this.primitives.add(this.particleSystem.particlesComputing.primitives.postProcessingSpeed);

      this.primitives.add(this.particleSystem.particlesRendering.primitives.segments);
      this.primitives.add(this.particleSystem.particlesRendering.primitives.trails);
      this.primitives.add(this.particleSystem.particlesRendering.primitives.screen);
    }

    updateViewerParameters() {
      let viewRectangle = this.camera.computeViewRectangle(this.scene.globe.ellipsoid);
      if (!viewRectangle) {
        // 非3d模式下会为空
        const extent = this._map.getExtent(); // mars3d扩展的方法
        viewRectangle = Cesium$1.Rectangle.fromDegrees(extent.xmin, extent.ymin, extent.xmax, extent.ymax);
      }

      const lonLatRange = Util.viewRectangleToLonLatRange(viewRectangle);
      this.viewerParameters.lonRange.x = lonLatRange.lon.min;
      this.viewerParameters.lonRange.y = lonLatRange.lon.max;
      this.viewerParameters.latRange.x = lonLatRange.lat.min;
      this.viewerParameters.latRange.y = lonLatRange.lat.max;

      const pixelSize = this.camera.getPixelSize(this.globeBoundingSphere, this.scene.drawingBufferWidth, this.scene.drawingBufferHeight);

      if (pixelSize > 0) {
        this.viewerParameters.pixelSize = pixelSize;
      }
    }
  }

  // 注册下
  mars3d__namespace.LayerUtil.register("wind", WindLayer);

  mars3d__namespace.layer.WindLayer = WindLayer;

  // 粒子对象
  class CanvasParticle {
    //= ========= 构造方法 ==========
    constructor() {
      this.lng = null; // 粒子初始经度
      this.lat = null; // 粒子初始纬度
      // this.x = null;//粒子初始x位置(相对于棋盘网格，比如x方向有360个格，x取值就是0-360，这个是初始化时随机生成的)
      // this.y = null;//粒子初始y位置(同上)
      this.tlng = null; // 粒子下一步将要移动的经度，这个需要计算得来
      this.tlat = null; // 粒子下一步将要移动的y纬度，这个需要计算得来
      this.age = null; // 粒子生命周期计时器，每次-1
      // this.speed = null;//粒子移动速度，可以根据速度渲染不同颜色
    }
  }

  // 棋盘类,根据风场数据生产风场棋盘网格
  // u表示经度方向上的风，u为正，表示西风，从西边吹来的风。
  // v表示纬度方向上的风，v为正，表示南风，从南边吹来的风。
  class CanvasWindField {
    //= ========= 构造方法 ==========
    constructor(data, reverseY) {
      // 行列总数
      this.rows = data.rows;
      this.cols = data.cols;

      // 经纬度边界
      this.xmin = data.xmin;
      this.xmax = data.xmax;
      this.ymin = data.ymin;
      this.ymax = data.ymax;

      this.grid = [];

      const uComponent = data.udata;
      const vComponent = data.vdata;

      let hasGrid = false;
      if (uComponent.length === this.rows && uComponent[0].length === this.cols) {
        hasGrid = true; // 本身是grid方式构建的
      }

      let index = 0;
      let arrRow = null;
      let uv = null;

      for (let row = 0; row < this.rows; row++) {
        arrRow = [];
        for (let col = 0; col < this.cols; col++, index++) {
          if (hasGrid) {
            uv = this._calcUV(uComponent[row][col], vComponent[row][col]);
          } else {
            uv = this._calcUV(uComponent[index], vComponent[index]);
          }

          arrRow.push(uv);
        }
        this.grid.push(arrRow);
      }
      if (reverseY) {
        this.grid.reverse();
      }
      // console.log(this.grid);
    }

    // 根据经纬度，算出棋盘格位置
    toGridXY(lng, lat) {
      const x = ((lng - this.xmin) / (this.xmax - this.xmin)) * (this.cols - 1);
      const y = ((this.ymax - lat) / (this.ymax - this.ymin)) * (this.rows - 1);
      return { x, y }
    }

    // 根据棋盘格获取UV值
    getUVByXY(x, y) {
      if (x < 0 || x >= this.cols || y >= this.rows) {
        return [0, 0, 0]
      }
      const x0 = Math.floor(x);
      const y0 = Math.floor(y);

      if (x0 === x && y0 === y) {
        return this.grid[y][x]
      }

      const x1 = x0 + 1;
      const y1 = y0 + 1;

      const g00 = this.getUVByXY(x0, y0);
      const g10 = this.getUVByXY(x1, y0);
      const g01 = this.getUVByXY(x0, y1);
      const g11 = this.getUVByXY(x1, y1);
      let result = null;
      try {
        result = this._bilinearInterpolation(x - x0, y - y0, g00, g10, g01, g11);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(x, y);
      }
      return result
    }

    // 双线性插值算法计算给定节点的速度
    // https://blog.csdn.net/qq_37577735/article/details/80041586
    _bilinearInterpolation(x, y, g00, g10, g01, g11) {
      const rx = 1 - x;
      const ry = 1 - y;
      const a = rx * ry;
      const b = x * ry;
      const c = rx * y;
      const d = x * y;
      const u = g00[0] * a + g10[0] * b + g01[0] * c + g11[0] * d;
      const v = g00[1] * a + g10[1] * b + g01[1] * c + g11[1] * d;
      return this._calcUV(u, v)
    }

    _calcUV(u, v) {
      // u表示经度方向上的风，u为正，表示西风，从西边吹来的风。
      // v表示纬度方向上的风，v为正，表示南风，从南边吹来的风。
      return [+u, +v, Math.sqrt(u * u + v * v)] // u, v，风速
    }

    // 根据经纬度格获取UV值
    getUVByPoint(lng, lat) {
      if (!this.isInExtent(lng, lat)) {
        return null
      }
      const gridpos = this.toGridXY(lng, lat);
      const uv = this.getUVByXY(gridpos.x, gridpos.y);
      return uv
    }

    // 粒子是否在地图范围内
    isInExtent(lng, lat) {
      if (lng >= this.xmin && lng <= this.xmax && lat >= this.ymin && lat <= this.ymax) {
        return true
      } else {
        return false
      }
    }

    getRandomLatLng() {
      const lng = fRandomByfloat(this.xmin, this.xmax);
      const lat = fRandomByfloat(this.ymin, this.ymax);
      return { lat, lng }
    }
  }

  // 随机数生成器（小数）
  function fRandomByfloat(under, over) {
    return under + Math.random() * (over - under)
  }

  const Cesium = mars3d__namespace.Cesium;

  const BaseLayer = mars3d__namespace.layer.BaseLayer;

  /**
   * Canvas风场图层， data数据结构
   *
   * @typedef {Object} CanvasWindLayer.DataOptions
   *
   * @property {Number} rows 行总数
   * @property {Number} cols 列总数
   * @property {Number} xmin 最小经度（度数，-180-180）
   * @property {Number} xmax 最大经度（度数，-180-180）
   * @property {Number} ymin 最小纬度（度数，-90-90）
   * @property {Number} ymax 最大纬度（度数，-90-90）
   * @property {Number[]|Array[]} udata U值一维数组, 数组长度应该是 rows*cols 。也支持按rows行cols列构建好的二维数组。
   * @property {Number[]|Array[]} vdata V值一维数组, 数组长度应该是 rows*cols 。也支持按rows行cols列构建好的二维数组。
   *
   */

  /**
   * Canvas风场图层，
   * 基于Canvas绘制，【需要引入 mars3d-wind 插件库】
   *
   * @param {Object} [options] 参数对象，包括以下：
   * @param {CanvasWindLayer.DataOptions} [options.data] 风场数据
   * @param {Number} [options.speedRate =50] 风前进速率，意思是将当前风场横向纵向分成100份，再乘以风速就能得到移动位置，无论地图缩放到哪一级别都是一样的速度，可以用该数值控制线流动的快慢，值越大，越慢，
   * @param {Number} [options.particlesNumber =4096] 初始粒子总数
   * @param {Number} [options.maxAge =120] 每个粒子的最大生存周期
   * @param {Number} [options.frameRate =10] 每秒刷新次数，因为requestAnimationFrame固定每秒60次的渲染，所以如果不想这么快，就把该数值调小一些
   * @param {String} [options.color ='#ffffff'] 线颜色
   * @param {Number} [options.lineWidth =1] 线宽度
   * @param {Number} [options.fixedHeight =0] 点的固定的海拔高度
   *
   * @param {Boolean} [options.reverseY =false] 是否翻转纬度数组顺序，正常数据是从北往南的（纬度从大到小），如果反向时请传reverseY为true
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
   *
   * @export
   * @class CanvasWindLayer
   * @extends {BaseLayer}
   */
  class CanvasWindLayer extends BaseLayer {
    //= ========= 构造方法 ==========
    constructor(options = {}) {
      super(options);

      this._setOptionsHook(options);

      /**
       * 图层对应的Canvas对象
       * @type {HTMLCanvasElement}
       * @readonly
       */
      this.canvas = null;
    }

    _setOptionsHook(options) {
      this.calc_speedRate = [0, 0]; // 根据speedRate参数计算经纬度步进长度
      this.particles = [];
      this.speedRate = options.speedRate || 50;
      this._particlesNumber = options.particlesNumber || 4096;
      this._maxAge = options.maxAge || 120;
      this.frameTime = 1000 / (options.frameRate || 10);
      this._pointerEvents = this.options.pointerEvents ?? false;

      /**
       * 线颜色
       * @type {String}
       */
      this.color = options.color || "#ffffff";

      /**
       * 线宽度
       * @type {Number}
       */
      this.lineWidth = options.lineWidth || 1;

      /**
       * 点的固定的海拔高度
       * @type {Number}
       */
      this.fixedHeight = options.fixedHeight ?? 0;

      /**
       * 是否翻转纬度数组顺序，正常数据是从北往南的（纬度从大到小），如果反向时请传reverseY为true
       * @type {Boolean}
       */
      this.reverseY = options.reverseY ?? false;
    }

    /**
     * 图层对应的Canvas对象
     * @type {HTMLCanvasElement}
     * @readonly
     */
    get layer() {
      return this.canvas
    }

    /**
     * Canvas对象宽度（单位：像素）
     * @type {Number}
     * @readonly
     */
    get canvasWidth() {
      return this._map.scene.canvas.clientWidth
    }

    /**
     * Canvas对象高度（单位：像素）
     * @type {Number}
     * @readonly
     */
    get canvasHeight() {
      return this._map.scene.canvas.clientHeight
    }

    /**
     * 图层是否可以鼠标交互，为false时可以穿透操作及缩放地图
     * @type {Boolean}
     */
    get pointerEvents() {
      return this._pointerEvents
    }

    set pointerEvents(value) {
      this._pointerEvents = value;
      if (!this.canvas) {
        return
      }

      if (value) {
        this.canvas.style["pointer-events"] = "all";
      } else {
        /* 加上这个css后鼠标可以穿透，但是无法触发单击等鼠标事件 */
        this.canvas.style["pointer-events"] = "none";
      }
    }

    /**
     * 风前进速率，意思是将当前风场横向纵向分成100份，再乘以风速就能得到移动位置，无论地图缩放到哪一级别都是一样的速度，可以用该数值控制线流动的快慢，值越大，越慢，
     * @type {Number}
     */
    get speedRate() {
      return this._speedRate
    }

    set speedRate(value) {
      this._speedRate = (100 - (value > 99 ? 99 : value)) * 100;
      this._calcStep();
    }

    /**
     * 初始粒子总数
     * @type {Number}
     */
    get particlesNumber() {
      return this._particlesNumber
    }

    set particlesNumber(value) {
      this._particlesNumber = value;

      // 不能随时刷新，需要隔一段时间刷新，避免卡顿
      clearTimeout(this._canrefresh);
      this._canrefresh = setTimeout(() => {
        this.redraw();
      }, 500);
    }

    /**
     * 每个粒子的最大生存周期
     * @type {Number}
     */
    get maxAge() {
      return this._maxAge
    }

    set maxAge(value) {
      this._maxAge = value;

      // 不能随时刷新，需要隔一段时间刷新，避免卡顿
      clearTimeout(this._canrefresh);
      this._canrefresh = setTimeout(() => {
        this.redraw();
      }, 500);
    }

    /**
     * 风场数据，数据结构见类的构造方法说明
     * @type {CanvasWindLayer.DataOptions}
     */
    get data() {
      return this.windData
    }

    set data(value) {
      this.setData(value);
    }

    _showHook(val) {
      if (val) {
        this._addedHook();
      } else {
        if (this.windData) {
          this.options.data = this.windData;
        }
        this._removedHook();
      }
    }

    /**
     * 对象添加到地图前创建一些对象的钩子方法，
     * 只会调用一次
     * @return {void}  无
     * @private
     */
    _mountedHook() {}

    /**
     * 对象添加到地图上的创建钩子方法，
     * 每次add时都会调用
     * @return {void}  无
     * @private
     */
    _addedHook() {
      this.canvas = this._createCanvas();
      this.canvasContext = this.canvas.getContext("2d"); // canvas上下文

      this.bindEvent();

      if (this.options.data) {
        this.setData(this.options.data);
      }
    }

    /**
     * 对象从地图上移除的创建钩子方法，
     * 每次remove时都会调用
     * @return {void}  无
     * @private
     */
    _removedHook() {
      this.clear();
      this.unbindEvent();

      if (this.canvas) {
        this._map.container.removeChild(this.canvas);
        delete this.canvas;
      }
    }

    // canvas
    _createCanvas() {
      const windContainer = window.document.createElement("canvas");
      windContainer.style.position = "absolute";
      windContainer.style.top = "0px";
      windContainer.style.left = "0px";
      windContainer.style.width = "100%";
      windContainer.style.height = "100%";
      windContainer.style.pointerEvents = this._pointerEvents ? "auto" : "none"; // auto时可以交互，但是没法放大地球， none 没法交互
      windContainer.style.zIndex = 10;

      windContainer.setAttribute("id", "canvasWindy");
      windContainer.setAttribute("class", "canvasWindy");
      this._map.container.appendChild(windContainer);

      const scene = this._map.scene;
      windContainer.width = scene.canvas.clientWidth;
      windContainer.height = scene.canvas.clientHeight;

      return windContainer
    }

    // 更新canvas的高宽
    resize() {
      if (this.canvas) {
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
      }
    }

    // 事件处理
    bindEvent() {
      const that = this;

      // 更新动画
      let then = Date.now()
      ;(function frame() {
        // animateFrame: requestAnimationFrame事件句柄，用来清除操作
        that.animateFrame = window.requestAnimationFrame(frame);
        const now = Date.now();
        const delta = now - then;
        if (delta > that.frameTime) {
          then = now - (delta % that.frameTime);
          that.update(); // 按帧率执行
        }
      })();

      // 添加 resize 绑定事件
      window.addEventListener("resize", this.resize.bind(this), false);

      // 鼠标滚动、旋转后 需要重新生成风场
      this.mouse_down = false;
      this.mouse_move = false;

      this._map.on(mars3d__namespace.EventType.wheel, this._onMapWhellEvent, this);
      this._map.on(mars3d__namespace.EventType.mouseDown, this._onMouseDownEvent, this);
      this._map.on(mars3d__namespace.EventType.mouseUp, this._onMouseUpEvent, this);
    }

    unbindEvent() {
      window.cancelAnimationFrame(this.animateFrame);
      delete this.animateFrame;

      window.removeEventListener("resize", this.resize);

      this._map.off(mars3d__namespace.EventType.wheel, this._onMapWhellEvent, this);
      this._map.off(mars3d__namespace.EventType.mouseDown, this._onMouseDownEvent, this);
      this._map.off(mars3d__namespace.EventType.mouseUp, this._onMouseUpEvent, this);
      this._map.off(mars3d__namespace.EventType.mouseMove, this._onMouseMoveEvent, this);
    }

    _onMapWhellEvent(event) {
      clearTimeout(this.refreshTimer);
      if (!this.show || !this.canvas) {
        return
      }

      this.canvas.style.visibility = "hidden";
      this.refreshTimer = setTimeout(() => {
        if (!this.show) {
          return
        }
        this.redraw();
        this.canvas.style.visibility = "visible";
      }, 200);
    }

    _onMouseDownEvent(event) {
      this.mouse_down = true;

      this._map.off(mars3d__namespace.EventType.mouseMove, this._onMouseMoveEvent, this);
      this._map.on(mars3d__namespace.EventType.mouseMove, this._onMouseMoveEvent, this);
    }

    _onMouseMoveEvent(event) {
      if (!this.show || !this.canvas) {
        return
      }

      if (this.mouse_down) {
        this.canvas.style.visibility = "hidden";
        this.mouse_move = true;
      }
    }

    _onMouseUpEvent(event) {
      if (!this.show || !this.canvas) {
        return
      }
      this._map.off(mars3d__namespace.EventType.mouseMove, this._onMouseMoveEvent, this);

      if (this.mouse_down && this.mouse_move) {
        this.redraw();
      }
      this.canvas.style.visibility = "visible";
      this.mouse_down = false;
      this.mouse_move = false;
    }

    /**
     * 重绘，根据现有参数重新生成风场
     * @return {void}  无
     */
    redraw() {
      if (!this.show || !this.windField) {
        return
      }
      this.particles = [];
      this.drawWind();
    }

    /**
     * 设置 风场数据
     * @param {Object} data 风场数据
     * @return {void}  无
     */
    setData(data) {
      this.clear();
      this.windData = data; // 风场json数据

      // 创建风场网格
      this.windField = new CanvasWindField(this.windData, this.reverseY);
      this.drawWind();
    }

    // 绘制粒子效果处理
    drawWind() {
      // 计算经纬度步进长度
      this._calcStep();

      // 创建风场粒子
      for (let i = 0; i < this.particlesNumber; i++) {
        const particle = this.randomParticle(new CanvasParticle());
        this.particles.push(particle);
      }
      this.canvasContext.fillStyle = "rgba(0, 0, 0, 0.97)";
      this.canvasContext.globalAlpha = 0.6;
      this.update();
    }

    // 计算经纬度步进长度
    _calcStep() {
      if (!this.windField) {
        return
      }

      this.calc_speedRate = [(this.windField.xmax - this.windField.xmin) / this.speedRate, (this.windField.ymax - this.windField.ymin) / this.speedRate];
    }

    update() {
      if (!this.show || this.particles.length <= 0) {
        return
      }

      let nextLng = null;
      let nextLat = null;
      let uv = null;

      this.particles.forEach((particle) => {
        if (particle.age <= 0) {
          this.randomParticle(particle);
        }
        if (particle.age > 0) {
          const tlng = particle.tlng; // 上一次的位置
          const tlat = particle.tlat;

          // u表示经度方向上的风，u为正，表示西风，从西边吹来的风。
          // v表示纬度方向上的风，v为正，表示南风，从南边吹来的风。
          uv = this.windField.getUVByPoint(tlng, tlat);
          if (uv) {
            nextLng = tlng + this.calc_speedRate[0] * uv[0];
            nextLat = tlat + this.calc_speedRate[1] * uv[1];

            particle.lng = tlng;
            particle.lat = tlat;
            particle.tlng = nextLng;
            particle.tlat = nextLat;
            particle.age--;
          } else {
            particle.age = 0;
          }
        }
      });

      this._drawLines();
    }

    // 根据粒子当前所处的位置(棋盘网格位置)，计算经纬度，在根据经纬度返回屏幕坐标
    _tomap(lng, lat, particle) {
      const position = Cesium.Cartesian3.fromDegrees(lng, lat, this.fixedHeight);

      // 判断是否在球的背面
      const scene = this._map.scene;
      if (scene.mode === Cesium.SceneMode.SCENE3D) {
        const occluder = new Cesium.EllipsoidalOccluder(scene.globe.ellipsoid, scene.camera.positionWC);
        const visible = occluder.isPointVisible(position);
        // visible为true说明点在球的正面，否则点在球的背面。
        // 需要注意的是不能用这种方法判断点的可见性，如果球放的比较大，点跑到屏幕外面，它返回的依然为true
        if (!visible) {
          particle.age = 0;
          return null
        }
      }
      // 判断是否在球的背面

      const pos = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this._map.scene, position);
      if (pos) {
        return [pos.x, pos.y]
      } else {
        return null
      }
    }

    _drawLines() {
      const that = this;
      const particles = this.particles;
      this.canvasContext.lineWidth = that.lineWidth;
      // 后绘制的图形和前绘制的图形如果发生遮挡的话，只显示后绘制的图形跟前一个绘制的图形重合的前绘制的图形部分，示例：https://www.w3school.com.cn/tiy/t.asp?f=html5_canvas_globalcompop_all
      this.canvasContext.globalCompositeOperation = "destination-in";
      this.canvasContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.canvasContext.globalCompositeOperation = "lighter"; // 重叠部分的颜色会被重新计算
      this.canvasContext.globalAlpha = 0.9;
      this.canvasContext.beginPath();
      this.canvasContext.strokeStyle = this.color;

      const is2d = this._map.scene.mode !== Cesium.SceneMode.SCENE3D;

      particles.forEach(function (particle) {
        const movetopos = that._tomap(particle.lng, particle.lat, particle);
        const linetopos = that._tomap(particle.tlng, particle.tlat, particle);

        // console.log(movetopos,linetopos);
        if (movetopos != null && linetopos != null) {
          const step = Math.abs(movetopos[0] - linetopos[0]);
          if (is2d && step >= that.canvasWidth) ; else {
            that.canvasContext.moveTo(movetopos[0], movetopos[1]);
            that.canvasContext.lineTo(linetopos[0], linetopos[1]);
          }
        }
      });
      this.canvasContext.stroke();
    }

    // 根据当前风场extent随机生成粒子
    randomParticle(particle) {
      let point, uv;
      for (let i = 0; i < 30; i++) {
        point = this.windField.getRandomLatLng();
        uv = this.windField.getUVByPoint(point.lng, point.lat);

        if (uv && uv[2] > 0) {
          break
        }
      }
      if (!uv) {
        return particle
      }

      const nextLng = point.lng + this.calc_speedRate[0] * uv[0];
      const nextLat = point.lat + this.calc_speedRate[1] * uv[1];

      particle.lng = point.lng;
      particle.lat = point.lat;
      particle.tlng = nextLng;
      particle.tlat = nextLat;
      particle.age = Math.round(Math.random() * this.maxAge); // 每一次生成都不一样
      return particle
    }

    /**
     * 清除数据
     * @return {void}  无
     */
    clear() {
      this.particles = [];
      delete this.windField;
      delete this.windData;
    }
  }

  // 注册下
  mars3d__namespace.LayerUtil.register("canvasWind", CanvasWindLayer);

  mars3d__namespace.layer.CanvasWindLayer = CanvasWindLayer;

  // eslint-disable-next-line no-import-assign
  mars3d__namespace.WindUtil = WindUtil;

  exports.CanvasWindLayer = CanvasWindLayer;
  exports.WindLayer = WindLayer;
  exports.WindUtil = WindUtil;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
