<template>
  <div class="MapControl">
    <div id="cesiumContainer" />
    <!-- 设备详情弹窗 -->
    <positionDetails
      @cancelchange="cancelchange"
      v-if="positionVisible"
      :positionVisible.sync="positionVisible"
      :detail="positionDetail"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Cookies from 'js-cookie'
import positionDetails from '../positionDetails/index.vue'
import {
  loadDeviceSpecial,
  addDivLightPoint,
  addDevicePoi,
  changeHeart,
  addRadar,
} from './device'
import { updateCar } from './ws'
import { parseTime } from '@/utils/index.js'
import {
  getAllHeartbeat,
  getJamminWorkMode,
  getDynamicAlarm,
  getDynamicLocus,
  getDynamicTurnTableAngle,
  getDynamicJamminResult,
  getDynamicScannerImg,
  getCarLocation,
  getCarState,
} from '@/api/wsInfo'
import { getStreamID } from '@/api/operation/operation'
import { getTdoa } from '@/api/device/device.js'

export default {
  data() {
    return {
      mars3d: null,
      loading: false,
      point: {}, // 中心视角信息
      adduavshowflag: false,
      deviceAggr: [], // 设备信息
      deviceAggr2: [], // 设备信息
      oldcarLocation: [], // 记录推送的上一条数据
      wsInfoTimer: null,
      todaHeartTimer: null,
      positionVisible: false,
      positionDetail: {
        detail: {},
        data: [],
      },
    }
  },
  components: {
    positionDetails,
  },
  computed: {
    ...mapGetters([
      'deviceArr',
      'isLogin',
      'currentPositionId',
      'serverWs',
      'serverdata',
      'heatBeatList',
      'notificationList',
      'radarsim',
      'equipmentmode',
      'wsMsgStatus',
      'uavListArr',
      'deviceType',
      'positionId',
    ]),
  },
  mounted() {
    // 点击弹窗外隐藏弹窗
    const doc = document.getElementById('cesiumContainer')
    doc.addEventListener('click', (el) => {
      // this.positionVisible = false
    })
    this.initMap3d(window.map3d)
    // const heartModel = {
    //   device_id: 1090006001000143,
    //   code: 1,
    // }
    // setInterval(() => {
    //   heartModel.code = Number(!heartModel.code)
    //   this.heartHandle(heartModel)
    // }, 1000)

    this.addTdoaHeart()

    // 预加载车模型
    // this.carHandle({
    //   id: `car_1`,
    // })
  },

  watch: {
    // 是否登录
    isLogin(newVal) {
      console.log(newVal, 'newVal2')
      if (newVal) {
        this.initWebsocket()

        this.getWsInfo()
      } else {
        // 退出登录操作
        // Cookies.remove('logintoken')
        // Cookies.remove('username')
        // Cookies.remove('password')

        // 清空阵地 清空设备数据
        this.$store.commit('SET_USERID', '')
        this.$store.commit('SET_POSITIONARR', [])
        this.$store.commit('SET_DEVICEARR', [])
        this.$store.commit('SET_UAVLISTARR', [])
        this.$store.commit('SET_UVALISTALL', [])
        this.$store.commit('SET_NOTIFICATION', [])

        window.CesiumSdk.Camera().flyToPoint({
          lat: 30.696292,
          lng: 117.897916,
          alt: 34793935,
          radius: 1,
          heading: 6,
          pitch: -90,
        })

        // Cookies.remove('rememberMe')
        // 清空阵地数据
        this.serverWs.close()
      }
    },
    currentPositionId(newVal) {
      // 更新阵地 切换ws推送
      const sendData = {
        command: 'update_position',
        // data: [newVal],
        data: this.positionId, // 所有阵地id集合
      }
      if (this.serverWs && this.serverWs.readyState === 1) {
        this.serverWs.send(JSON.stringify(sendData))
      }
    },
    deviceArr(newVal, oldVal) {
      const color = [
        '#ecc34d',
        '#4bdd85',
        '#4fe7cb',
        '#99FFFF',
        '#30ACFF',
        '#0B8183',
      ]
      const oldDetect = [] // 上个阵地探测设备
      const newDetect = []
      const oldStrike = [] // 上个阵地打击设备
      const newStrike = []
      // 隐藏上个阵地的设备
      oldVal.forEach((el, index) => {
        if (el.detail && el.detail.static_data) {
          // 设备点位显影
          const type = el.type.toLowerCase()
          if (
            type === 'aoa' ||
            type === 'tdoa' ||
            type === 'crack' ||
            type === 'circular'
          ) {
            oldDetect.push(el)
          } else if (type === 'omni' || type === 'guide' || type === 'crack') {
            oldStrike.push(el)
          }
          const deviceOption = {
            lng: el.detail.static_data.longitude
              ? el.detail.static_data.longitude.value
              : 0,
            lat: el.detail.static_data.latitude
              ? el.detail.static_data.latitude.value
              : 0,
            alt: el.detail.static_data.altitude
              ? el.detail.static_data.altitude.value
              : 0,
          }
          if (type === 'tdoa') {
            if (el.children && el.children.length) {
              el.children.forEach((item) => {
                const options = {
                  type,
                  id: `${el.id}_${item.id}`,
                  lng: item.lon,
                  lat: item.lat,
                  alt: item.alt,
                  typeName: el.type_name,
                  name: el.posName + el.type_name + item.address,
                  state: item.code === 0 ? '在线' : '离线',
                }
                addDevicePoi(options, false)
              })
            } else {
              addDevicePoi(
                {
                  name: el.posName + el.name,
                  type,
                  typeName: el.type_name,
                  state: el.state,
                  id: `${el.id}`,
                  lng: deviceOption.lng,
                  lat: deviceOption.lat,
                  alt: deviceOption.alt,
                  size: 10,
                  color: color[index % 5],
                },
                false
              )
            }
          } else {
            // 添加设备点位
            addDevicePoi(
              {
                name: el.posName + el.name,
                type,
                typeName: el.type_name,
                state: el.state,
                id: `${el.id}`,
                lng: deviceOption.lng,
                lat: deviceOption.lat,
                alt: 0,
                size: 10,
                color: color[index % 5],
              },
              false
            )
          }
        }
      })

      // 设备地图模型显示
      newVal.forEach((el, index) => {
        if (el.detail) {
          // 设备点位显影
          const type = el.type.toLowerCase()
          if (
            type === 'aoa' ||
            type === 'tdoa' ||
            type === 'crack' ||
            type === 'circular'
          ) {
            newDetect.push(el)
          } else if (type === 'omni' || type === 'guide' || type === 'crack') {
            newStrike.push(el)
          }
          const deviceOption = {
            lng: el.detail.static_data.longitude
              ? el.detail.static_data.longitude.value
              : 0,
            lat: el.detail.static_data.latitude
              ? el.detail.static_data.latitude.value
              : 0,
            alt: el.detail.static_data.altitude
              ? el.detail.static_data.altitude.value
              : 0,
          }
          if (type === 'tdoa') {
            if (el.children && el.children.length) {
              el.children.forEach((item) => {
                const options = {
                  type,
                  id: `${el.id}_${item.id}`,
                  lng: item.lon,
                  lat: item.lat,
                  alt: item.alt,
                  typeName: el.type_name,
                  name: el.posName + el.type_name + item.address,
                  state: item.code === 0 ? '在线' : '离线',
                }
                const graphic = addDevicePoi(options, true)
                // if (graphic) {
                //   graphic.on('click', () => {
                //     this.positionVisible = true
                //     this.positionDetail.detail = el
                //   })
                // }
              })
            } else {
              const graphic = addDevicePoi(
                {
                  name: el.posName + el.name,
                  type,
                  typeName: el.type_name,
                  state: el.state,
                  id: `${el.id}`,
                  lng: deviceOption.lng,
                  lat: deviceOption.lat,
                  alt: deviceOption.alt,
                  size: 10,
                  color: color[index % 5],
                },
                true
              )
              // if (graphic) {
              //   graphic.on('click', () => {
              //     this.positionVisible = true
              //     this.positionDetail.detail = el
              //   })
              // }
            }
          } else {
            // 添加设备点位
            const graphic = addDevicePoi(
              {
                name: el.posName + el.name,
                type,
                typeName: el.type_name,
                state: el.state,
                id: `${el.id}`,
                lng: deviceOption.lng,
                lat: deviceOption.lat,
                alt: deviceOption.alt,
                size: 10,
                color: color[index % 5],
              },
              true
            )
            // if (graphic) {
            //   graphic.on('click', () => {
            //     this.positionVisible = true
            //     this.positionDetail.detail = el
            //   })
            // }
          }
        }
      })

      // 探测设备根据AOA,TDOA,协议破解，周扫的顺序显示雷达罩
      let oldDetectType = ''
      if (!oldDetectType) {
        oldDetectType = oldDetect.find((item) => item.detail.type === 'aoa')
      }
      if (!oldDetectType) {
        oldDetectType = oldDetect.find((item) => item.detail.type === 'tdoa')
      }
      if (!oldDetectType) {
        oldDetectType = oldDetect.find((item) => item.detail.type === 'crack')
      }
      if (!oldDetectType) {
        oldDetectType = oldDetect.find(
          (item) => item.detail.type === 'circular'
        )
      }
      if (oldDetectType) {
        const deviceOptionod = {
          lng: oldDetectType.detail.static_data.longitude
            ? oldDetectType.detail.static_data.longitude.value
            : 0,
          lat: oldDetectType.detail.static_data.latitude
            ? oldDetectType.detail.static_data.latitude.value
            : 0,
          alt: oldDetectType.detail.static_data.altitude
            ? oldDetectType.detail.static_data.altitude.value
            : 0,
          radius: 3000,
          type: oldDetectType.detail.type,
          id: oldDetectType.id,
          deviceType: 'detect', // 设备类型
        }
        loadDeviceSpecial(deviceOptionod, false)
      }
      console.log(oldDetectType, 'oldDetectType')

      // 打击设备根据全向,GPS诱导,协议破解显示雷达罩
      let newDetectType = ''
      if (!newDetectType) {
        newDetectType = newDetect.find((item) => item.detail.type === 'aoa')
      }
      if (!newDetectType) {
        newDetectType = newDetect.find((item) => item.detail.type === 'tdoa')
      }
      if (!newDetectType) {
        newDetectType = newDetect.find((item) => item.detail.type === 'crack')
      }
      if (!newDetectType) {
        newDetectType = newDetect.find(
          (item) => item.detail.type === 'circular'
        )
      }
      if (newDetectType) {
        const deviceOptionnd = {
          lng: newDetectType.detail.static_data.longitude
            ? newDetectType.detail.static_data.longitude.value
            : 0,
          lat: newDetectType.detail.static_data.latitude
            ? newDetectType.detail.static_data.latitude.value
            : 0,
          alt: newDetectType.detail.static_data.altitude
            ? newDetectType.detail.static_data.altitude.value
            : 0,
          radius: newDetectType.detail.static_data.effect
            ? newDetectType.detail.static_data.effect.value > 1
              ? newDetectType.detail.static_data.effect.value
              : 3000
            : 3000,
          type: newDetectType.detail.type,
          startAngle: newDetectType.detail.static_data.默认角度
            ? newDetectType.detail.static_data.默认角度.value
            : -150,
          endAngle: newDetectType.detail.static_data.默认角度
            ? newDetectType.detail.static_data.默认角度.value + 120
            : -30,
          id: newDetectType.id,
          deviceType: 'detect', // 设备类型
        }
        let modelShow = true
        if (deviceOptionnd.type === 'aoa' || deviceOptionnd.type === 'tdoa') {
          modelShow = this.radarsim
        } else {
          modelShow = this.equipmentmode
        }
        loadDeviceSpecial(deviceOptionnd, modelShow)
      }
      console.log(newDetectType, 'newDetectType')

      let oldStrikeType = ''
      if (!oldStrikeType) {
        oldStrikeType = oldStrike.find((item) => item.detail.type === 'omni')
      }
      if (!oldStrikeType) {
        oldStrikeType = oldStrike.find((item) => item.detail.type === 'guide')
      }
      if (!oldStrikeType) {
        oldStrikeType = oldStrike.find((item) => item.detail.type === 'crack')
      }
      if (oldStrikeType) {
        const deviceOptionos = {
          lng: '',
          lat: '',
          alt: '',
          radius: 3000,
          type: oldStrikeType.detail.type,
          id: oldStrikeType.id,
          deviceType: 'strike', // 设备类型
        }
        // 有监测设备则取监测设备的圆心
        if (oldDetectType) {
          deviceOptionos.lng = oldDetectType.detail.static_data.longitude
            ? oldDetectType.detail.static_data.longitude.value
            : 0
          deviceOptionos.lat = oldDetectType.detail.static_data.latitude
            ? oldDetectType.detail.static_data.latitude.value
            : 0
          deviceOptionos.alt = oldDetectType.detail.static_data.altitude
            ? oldDetectType.detail.static_data.altitude.value
            : 0
        } else {
          deviceOptionos.lng = oldStrikeType.detail.static_data.longitude
            ? oldStrikeType.detail.static_data.longitude.value
            : 0
          deviceOptionos.lat = oldStrikeType.detail.static_data.latitude
            ? oldStrikeType.detail.static_data.latitude.value
            : 0
          deviceOptionos.alt = oldStrikeType.detail.static_data.altitude
            ? oldStrikeType.detail.static_data.altitude.value
            : 0
        }
        loadDeviceSpecial(deviceOptionos, false)
      }
      console.log(oldStrikeType, 'oldStrikeType')

      let newStrikeType = ''
      if (!newStrikeType) {
        newStrikeType = newStrike.find((item) => item.detail.type === 'omni')
      }
      if (!newStrikeType) {
        newStrikeType = newStrike.find((item) => item.detail.type === 'guide')
      }
      if (!newStrikeType) {
        newStrikeType = newStrike.find((item) => item.detail.type === 'crack')
      }
      if (newStrikeType) {
        const deviceOptionns = {
          lng: '',
          lat: '',
          alt: '',
          radius: newStrikeType.detail.static_data.effect
            ? newStrikeType.detail.static_data.effect.value
            : 3000,
          type: newStrikeType.detail.type,
          startAngle: newStrikeType.detail.static_data.默认角度
            ? newStrikeType.detail.static_data.默认角度.value
            : -150,
          endAngle: newStrikeType.detail.static_data.默认角度
            ? newStrikeType.detail.static_data.默认角度.value + 120
            : -30,
          id: newStrikeType.id,
          deviceType: 'strike', // 设备类型
        }
        // 有监测设备则取监测设备的圆心
        if (newDetectType) {
          deviceOptionns.lng = newDetectType.detail.static_data.longitude
            ? newDetectType.detail.static_data.longitude.value
            : 0
          deviceOptionns.lat = newDetectType.detail.static_data.latitude
            ? newDetectType.detail.static_data.latitude.value
            : 0
          deviceOptionns.alt = newDetectType.detail.static_data.altitude
            ? newDetectType.detail.static_data.altitude.value
            : 0
        } else {
          deviceOptionns.lng = newStrikeType.detail.static_data.longitude
            ? newStrikeType.detail.static_data.longitude.value
            : 0
          deviceOptionns.lat = newStrikeType.detail.static_data.latitude
            ? newStrikeType.detail.static_data.latitude.value
            : 0
          deviceOptionns.alt = newStrikeType.detail.static_data.altitude
            ? newStrikeType.detail.static_data.altitude.value
            : 0
        }
        loadDeviceSpecial(deviceOptionns, true)
      }
      console.log(newStrikeType, 'newStrikeType')
    },
    // 监听websocket
    serverdata(val) {
      if (val.data.data) {
        const ws_data = val.data.data
        if (val.data.command === 'heartbeat') {
          // 心跳信息
          ws_data.forEach((el) => {
            this.heartHandle(el)
          })
        } else if (val.data.command === 'carLocation') {
          // 车数据 需提前加载 默认只有一条数据取第零项
          const carData = ws_data && ws_data.length ? ws_data[0] : null
          if (carData) {
            const option = {
              ...carData.data,
              id: `car_1`,
              lng: carData.data.lon,
              lat: carData.data.lat,
              getTime: new Date().getTime(),
            }

            this.carHandle(option)
          }
          // ws_data.forEach((el, i) => {
          //   // console.log(el, 'el')
          //   const option = {
          //     ...el.data,
          //     id: `car_${el.device_id}`,
          //     lng: el.data.lon,
          //     lat: el.data.lat,
          //   }
          //   if (this.oldcarLocation) {
          //     this.oldcarLocation.forEach((ele) => {
          //       // 判断车位置没有变化添加雷达罩
          //       if (
          //         ele.device_id == el.device_id &&
          //         JSON.stringify(ele.data) === JSON.stringify(el.data)
          //       ) {
          //         const carOption = {
          //           id: el.device_id,
          //           lat: el.data.lat,
          //           lng: el.data.lon,
          //           radius: el.radius || 1000,
          //           color: '#4fe7cb',
          //           alt: 0,
          //         }
          //         addRadar(carOption)
          //       }
          //     })
          //   }
          //   this.carHandle(option)
          // })
          // this.oldcarLocation = []
          // // 记录上一条推送车的数据
          // this.oldcarLocation = ws_data
        }
      }
    },
  },
  methods: {
    initMap3d(options) {
      const mapOption = {
        scene: {
          center: {
            lat: 30.69629216,
            lng: 117.89791646,
            // alt: 225,
            alt: 34793935,
            heading: 6,
            pitch: -90,
          },
        },
      }
      window.CesiumSdk.Map = new window.mars3d.Map(
        'cesiumContainer',
        window.mars3d.Util.merge(options, mapOption)
      )

      // 设置鼠标操作习惯,更换中键和右键
      window.CesiumSdk.Map.changeMouseModel(true)
    },

    // 初始化Websocket server端
    initWebsocket() {
      const _this = this
      if ('WebSocket' in window) {
        const wsServer = new WebSocket(window.config.wsServerUrl)
        _this.$store.commit('SET_SERVERWS', wsServer)
        wsServer.onopen = function () {
          // Web Socket 已连接上，使用 send() 方法发送数据
          // ws1.send('发送数据')
        }
        wsServer.onmessage = function (evt) {
          const { data } = evt
          _this.$store.commit('SET_SERVERDATA', JSON.parse(data))

          // websocket 推送设备信息，暂停对应http请求
          const wsData = JSON.parse(data)
          const { command } = wsData.data

          if (command !== 'heartbeat') {
            _this.wsMsgStatus[command] = false
            clearTimeout(_this.wsMsgStatus[`${command}_timer`])
            _this.wsMsgStatus[`${command}_timer`] = null
          }
        }
        wsServer.onclose = function () {
          // 关闭 websocket
        }
      } else {
        // 浏览器不支持 WebSocket
        this.$message.warning('您的浏览器不支持 WebSocket!')
      }
    },

    // 处理心跳信息
    heartHandle(item) {
      const heat_device = this.heatBeatList.find(
        (el) => el.device_id == item.device_id
      )
      if (heat_device) {
        this.notificationList.find((el) => {
          if (el.device_id === heat_device.device_id) {
            if (heat_device.code !== el.code) {
              el.code = heat_device.code
              const obj = {
                posName: el.posName,
                name: el.name,
                code: heat_device.code,
                content: heat_device.code === 0 ? '在线' : '离线',
                time: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
                type: '通知',
              }
              this.$store.state.websocket.notificationList.unshift(obj)
              this.deviceArr.find(
                (el) => el.id === heat_device.device_id
              ).code = heat_device.code
            }
          }
        })
        heat_device.code = item.code
        heat_device.state = item.state || null
      } else {
        this.heatBeatList.push({ state: null, ...item })
      }
      // changeHeart(this.heatBeatList)
    },

    // 接口查询动态推送数据，防止wsScoket堵塞
    getWsInfo() {
      clearInterval(this.wsInfoTimer)
      this.wsInfoTimer = setInterval(() => {
        // eslint-disable-next-line no-restricted-syntax
        for (const key in this.wsMsgStatus) {
          if (this.wsMsgStatus[key]) {
            let fn
            if (key === 'heartbeat') {
              // 心跳
              fn = getAllHeartbeat
            } else if (key === 'workmode') {
              fn = getJamminWorkMode
            } else if (key === 'findTarget') {
              fn = getDynamicAlarm
            } else if (key === 'locus') {
              fn = getDynamicLocus
              // 没有预警不查询无人机路径
              if (!this.uavListArr.length) {
                continue
              }
            } else if (key === 'push_orient') {
              fn = getDynamicTurnTableAngle
              // 若转台设备离线不查询转台角度
              const turntableObj = this.deviceType.find(
                (el) => el.type === 'Turntable'
              )
              if (
                turntableObj &&
                turntableObj.data &&
                turntableObj.data.length
              ) {
                if (
                  !turntableObj.data.some(
                    (ele) =>
                      this.heatBeatList.find((el) => el.device_id === ele.id)
                        .code === 0
                  )
                ) {
                  continue
                }
              } else {
                continue
              }
            } else if (key === 'jamminResult') {
              // fn = getDynamicJamminResult
              // 全向 定向离线不查询打击结果
            } else if (key === 'push_img') {
              // fn = getDynamicScannerImg
              // 周扫离线不查询周扫推送图片
              // const circularObj = this.deviceType.find(
              //   (el) => el.type === 'Circular'
              // )
              // if (circularObj && circularObj.data && circularObj.data.length) {
              //   if (
              //     !circularObj.data.some(
              //       (ele) =>
              //         this.heatBeatList.find((el) => el.device_id === ele.id)
              //           .code === 0
              //     )
              //   ) {
              //     continue
              //   }
              // } else {
              //   continue
              // }
            } else if (key === 'carLocation') {
              fn = getCarLocation
            } else if (key === 'stream_id') {
              fn = getStreamID
            } else if (key === 'carJammin') {
              fn = getCarState
            }
            if (!fn) {
              continue
            }

            fn({ pid: this.currentPositionId })
              .then((res) => {
                this.wsMsgStatus[key] = false
                if (res.code === 0) {
                  this.$store.commit('SET_SERVERDATA', res)
                }

                clearTimeout(this.wsMsgStatus[`${key}_timer`])
                this.wsMsgStatus[`${key}_timer`] = null
                this.wsMsgStatus[`${key}_timer`] = setTimeout(() => {
                  this.wsMsgStatus[key] = true
                }, 5000)
              })
              .catch(() => {
                this.wsMsgStatus[key] = false
              })
          } else if (!this.wsMsgStatus[`${key}_timer`]) {
            this.wsMsgStatus[`${key}_timer`] = setTimeout(() => {
              if (this.wsMsgStatus[key] === false) {
                this.wsMsgStatus[key] = true
              }
            }, 10000)
          }
        }
      }, 1000)
    },

    // 添加tdoa心跳信息
    addTdoaHeart() {
      clearInterval(this.todaHeartTimer)
      this.todaHeartTimer = setInterval(() => {
        this.deviceArr.forEach((el) => {
          if (el.type === 'TDOA' && el.children && el.children.length) {
            getTdoa({ device_id: el.id }).then((res) => {
              if (res.code === 0 && res.data && res.data.length) {
                res.data.forEach((item) => {
                  const todaHeart = this.heatBeatList.find(
                    (ele) => ele.device_id === `${el.id}_${item.id}`
                  )
                  if (todaHeart) {
                    todaHeart.code = item.code
                  } else {
                    this.heatBeatList.push({
                      device_id: `${el.id}_${item.id}`,
                      code: item.code,
                      state: null,
                    })
                  }
                })
              }
            })
          }
        })
      }, 5000)
    },
    // 添加车数据
    carHandle(item) {
      updateCar(item)
    },
    cancelchange(value) {
      this.positionVisible = value
    },
  },
}
</script>
<style lang="scss">
.MapControl {
  // height: 100%;
  height: 100vh;
  min-height: 1080px;
  width: 100%;
  margin: 0;
  padding: 0;
  left: 0;
  top: 0;
  border: none;
  overflow: hidden;
  position: absolute;

  #cesiumContainer {
    width: 100%;
    height: 100vh;
    // height: 1120px;
    min-height: 1120px;
    margin: 0;
    padding: 0;
    overflow: hidden;
    position: relative;
  }
}
// .cesium-viewer {
//   position: absolute;
//   width: 100%;
//   height: 100%;
// }
.spot1 {
  width: 200px;

  .titlebox {
    width: 100%;
    position: relative;
    .title {
      font-weight: 400;
      font-size: 14px;
      color: #cefcff;
      height: 22px;
      line-height: 22px;
      width: 80px;
      margin: 0 auto;
      margin-top: 5px;
    }
    .baobei {
      font-weight: 300;
      font-size: 12px;
      color: #fff;
      background: red;
      height: 22px;
      line-height: 22px;
      width: 50px;
      position: absolute;
      top: 0;
      right: 0;
      text-align: center;
      border-radius: 50%;
    }
  }
  .contentbox {
    width: 98%;
    .contentitem {
      display: flex;
      justify-content: space-between;
      background-image: linear-gradient(#2a3c40, #40605e);
      padding: 2px 0;
      margin-bottom: 5px;
      div:nth-child(1) {
        color: #cefcff;
        font-size: 12px;
      }
      div:nth-child(2) {
        color: #4fe7cb;
        font-size: 12px;
      }
    }
  }
}
.spot2 {
  width: 260px;

  .titlebox {
    width: 100%;
    position: relative;
    border-bottom: 1px solid #2b9b99;
    .title {
      font-weight: 400;
      font-size: 14px;
      color: #cefcff;
      height: 22px;
      line-height: 22px;
      width: 100px;
    }
    .chacha {
      line-height: 14px;
      font-weight: 300;
      font-size: 20px;
      color: #2b9b99;
      position: absolute;
      top: 0;
      right: 0;
      text-align: center;
    }
  }
  .contentbox {
    margin-top: 20px;
    .contentitem {
      display: flex;
      justify-content: space-between;
      background-image: linear-gradient(#2a3c40, #40605e);
      padding: 2px 0;
      margin-bottom: 5px;
      div:nth-child(1) {
        color: #cefcff;
        font-size: 12px;
        margin-left: 5px;
      }
      div:nth-child(2) {
        color: #4fe7cb;
        font-size: 12px;
      }
    }
  }
}
.spot3 {
  width: 240px;

  .titlebox {
    width: 100%;
    position: relative;
    border-bottom: 1px solid #2b9b99;
    .title {
      font-weight: 400;
      font-size: 14px;
      color: #cefcff;
      height: 22px;
      line-height: 22px;
      width: 100px;
    }
    .chacha {
      line-height: 14px;
      font-weight: 300;
      font-size: 20px;
      color: #2b9b99;
      position: absolute;
      top: 0;
      right: 0;
      text-align: center;
    }
  }
  .contentbox {
    margin-top: 20px;
    .spot3_img {
      margin-bottom: 10px;
      width: 100%;
      height: 100px;
      background-image: url(../../assets/pageBg.png);
      background-size: 100% 100%;
    }
    .contentitem {
      display: flex;
      justify-content: space-between;
      background-image: linear-gradient(#2a3c40, #40605e);
      padding: 2px 0;
      margin-bottom: 5px;
      div:nth-child(1) {
        color: #cefcff;
        font-size: 12px;
        margin-left: 5px;
      }
      div:nth-child(2) {
        color: #4fe7cb;
        font-size: 12px;
      }
    }
  }
}
.mars3d-popup-background {
  background: #2a3c40;
  // background-image: url(../../assets/images/box_1.png);
  // background-size: 100% 100%;
}
.mars3d-popup-close-button {
  display: none;
}
</style>
