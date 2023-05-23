<template>
  <div id="position">
    <div class="position">
      <div
        v-for="(item, index) in positionarr"
        :key="index"
        class="ptitem"
        :class="[
          item.posId == currentPositionId ? 'checked' : 'nochecked',
          isAnimate(item) ? 'animate' : '',
        ]"
        @click="ptclick(item, index)"
      >
        <div class="ptname">{{ item.name }}</div>
        <div>{{ onlineDevice(item) }}/{{ item.totalCount() }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { loadLayconfig } from '../../views/mars3d/model'
import { addDivLightPoint, addBoundaryWall } from '../../views/mars3d/device'
import {
  getPositionByUser,
  getPositionDetail,
  getPositionDevice,
  getDeviceInfoById,
} from '@/api/sectorInfo'
import { getAllHeartbeat } from '@/api/wsInfo'
import { getTdoa } from '@/api/device/device.js'

export default {
  data() {
    return {
      checkindex: 0,
      positionarr: [],
      positionList: [],
      // positionIdArr: [],
      positionsIdArr: [],
    }
  },
  computed: {
    ...mapGetters([
      'isLogin',
      'userId',
      'deviceArr',
      'currentPositionId',
      'heatBeatList',
      'serverdata',
      'uavListArr',
      'uavListAll',
      'electronicfence',
    ]),
  },
  watch: {
    isLogin(newVal) {
      // 退出登录操作
      if (!newVal) {
        this.positionarr = []
      }
    },
    // 根据用户id获取用户拥有的阵地
    userId(val) {
      if (val) {
        this.getPositionByUser()
      }
    },
    currentPositionId(newVal, oldVal) {
      // 切换阵地查询阵地设备在线状态 工作状态
      if (oldVal) {
        getAllHeartbeat({ pid: newVal }).then((res) => {
          if (res.code === 0) {
            // 更新心跳推送
            this.$store.commit('SET_SERVERDATA', res)
          }
        })
      }
    },
    // 电子围栏显隐
    electronicfence(val) {
      if (this.positionList.length) {
        this.positionList.forEach((el) => {
          addBoundaryWall(el, val)
        })
      }
    },
  },
  mounted() {},

  methods: {
    // 阵地是否闪烁
    isAnimate(item) {
      if (item.posId === this.currentPositionId) {
        return false
      }
      return this.uavListAll.find((it) => it.position_id === item.posId)
    },
    // 获取用户拥有的阵地
    getPositionByUser() {
      const _this = this
      getPositionByUser({
        user_id: this.userId,
      }).then((response) => {
        if (response.code === 0) {
          // 阵地id集合
          // this.positionIdArr = response.data.map((el) => el.position_id)
          this.positionsIdArr = response.data.map((el) => el.position_id)
          this.$store.commit('SET_POSITIONID', this.positionsIdArr)
          // 当前用户阵地集合
          this.positionarr = response.data.map((el) => {
            return {
              posId: el.position_id,
              name: '',
              deviceArr: [],
              posDetail: {},
              onlineCount() {
                // 设备code 0 在线 1离线
                return this.deviceArr.filter((ele) => ele.code === 0).length
              },
              totalCount() {
                return this.deviceArr.length
              },
            }
          })

          // 循环查询阵地详情 阵地设备
          this.positionarr.forEach((el, index) => {
            // 阵地详情
            getPositionDetail({ id: el.posId }).then((res) => {
              if (res.code === 0) {
                el.posDetail = res.data
                el.name = res.data.name
                el.geo_json = res.data.geo_json
                // //模型
                if (el.geo_json) {
                  const geojson = {
                    id: `geojson_${el.posId}`,
                    pid: 'geojson_place',
                    name: el.name,
                    type: 'geojson',
                    data: el.geo_json,
                    symbol: {
                      type: 'polygonP',
                      styleOptions: {
                        color: '#FF6F6F',
                        opacity: 0.1,
                        outline: true,
                        outlineWidth: 1,
                        outlineColor: '#FF6F6F',
                      },
                    },
                  }
                  this.positionList.push(geojson)
                  loadLayconfig(geojson)
                  addBoundaryWall(geojson, true)
                }

                // 默认选择 跳转第一个阵地
                if (index === 0) {
                  this.$store.commit('SET_CHECKPOSITIONID', el.posId)
                  this.$store.commit('SET_POSITIONDETAIL', el.posDetail)
                  window.CesiumSdk.Camera().flyToPoint({
                    lat: el.posDetail.center.latitude,
                    lng: el.posDetail.center.longitude,
                    alt: 1,
                    radius: 5000,
                    heading: 0,
                    pitch: -60,
                  })
                }
              }
            })

            const p1 = new Promise((resolve) => {
              // 阵地拥有的设备
              getPositionDevice({ position_id: el.posId }).then((res) => {
                if (res.code === 0) {
                  resolve(res.data.map((ele) => ele.device))
                }
              })
            })

            const p2 = new Promise((resolve) => {
              // 阵地拥有的设备的在线状态
              getAllHeartbeat({ pid: el.posId }).then((res) => {
                if (res.code === 0) {
                  _this.$store.commit('SET_SERVERDATA', res)

                  resolve(res.data.data)
                }
              })
            })
            Promise.all([p1, p2]).then((result) => {
              result[0].forEach((ele) => {
                // 添加设备在线状态 工作状态
                const device_status = result[1].find(
                  (item) => item.device_id === ele.id
                )
                // 设备初始心跳、工作状态
                ele.code = device_status ? device_status.code : 1

                ele.state =
                  device_status && device_status.code ? '离线' : '在线'

                // 所属阵地名称
                ele.posName = el.name
                ele.posId = el.posId
                // 模型
              })
              el.deviceArr = result[0]
              // 设备详情
              el.deviceArr.forEach((elev) => {
                // 若含有tdoa设备单独查询 tdoa 单独查询
                if (elev.type.toLowerCase() === 'tdoa') {
                  getTdoa({ device_id: elev.id })
                    .then((res) => {
                      if (res.code === 0 && res.data && res.data.length) {
                        elev.children = res.data
                      }

                      getDeviceInfoById({ id: elev.id }).then((res) => {
                        if (res.code === 0) {
                          elev.detail = res.data

                          // 更新设备 全部设备详情都已查询
                          if (
                            index === 0 &&
                            el.deviceArr.every((item) => item.detail)
                          ) {
                            this.$store.commit(
                              'SET_DEVICEARR',
                              JSON.parse(JSON.stringify(el.deviceArr))
                            )
                          }
                        }
                      })
                    })
                    .catch(() => {
                      getDeviceInfoById({ id: elev.id }).then((res) => {
                        if (res.code === 0) {
                          elev.detail = res.data

                          // 更新设备 全部设备详情都已查询
                          if (
                            index === 0 &&
                            el.deviceArr.every((item) => item.detail)
                          ) {
                            this.$store.commit(
                              'SET_DEVICEARR',
                              JSON.parse(JSON.stringify(el.deviceArr))
                            )
                          }
                        }
                      })
                    })
                } else {
                  getDeviceInfoById({ id: elev.id }).then((res) => {
                    if (res.code === 0) {
                      elev.detail = res.data

                      // 更新设备 全部设备详情都已查询
                      if (
                        index === 0 &&
                        el.deviceArr.every((item) => item.detail)
                      ) {
                        this.$store.commit(
                          'SET_DEVICEARR',
                          JSON.parse(JSON.stringify(el.deviceArr))
                        )
                      }
                    }
                  })
                }
              })
              // 更新默认选中第一个阵地 设备
              if (index === 0) {
                this.$store.commit('SET_DEVICEARR', el.deviceArr)
              }
            })
          })

          this.$store.commit('SET_POSITIONARR', this.positionarr)
        }
      })
    },
    // 在线设备
    onlineDevice(item) {
      const arr = item.deviceArr.filter((el) => {
        const heat_device = this.heatBeatList.find(
          (ele) => el.id === ele.device_id
        )
        if (heat_device) {
          item.code = heat_device.code
          item.state = heat_device.state
        }
        return heat_device && heat_device.code === 0
      })
      return arr.length
    },
    // 阵地点击事件
    ptclick(item) {
      this.$store.commit('SET_CHECKPOSITIONID', item.posId)
      this.$store.commit('SET_DEVICEARR', item.deviceArr)
      this.$store.commit('SET_POSITIONDETAIL', item.posDetail)
      // 跳转所选阵地
      window.CesiumSdk.Camera().flyToPoint({
        lat: item.posDetail.center.latitude,
        lng: item.posDetail.center.longitude,
        alt: 1,
        radius: 5000,
        heading: 0,
        pitch: -60,
      })
    },
  },
}
</script>
<style lang="scss" scoped>
@keyframes border-twinkle {
  0% {
    border: 0px;
  }
  100% {
    border: 0.5px solid red;
  }
}
.animate {
  animation: border-twinkle 1s infinite;
}
#position {
  pointer-events: auto;
  .position {
    // width: 100px;
    height: 250px;
    position: absolute;
    left: 0;
    top: 100px;
    .ptitem {
      height: 32px;
      line-height: 32px;
      color: #000;
      font-size: 16px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-around;
      .ptname {
        display: none;
        font-size: 14px;
      }
    }
    .checked {
      width: 147px;
      background: #021519;
      color: #cefcff;
      // color:#18fefe
      border: 1.5px solid #18fefe;
      .ptname {
        // color: #052b33;
        display: flex;
        font-size: 14px;
      }
    }
    .nochecked {
      width: 42px;
      background: #021519;
      color: #cefcff;
      border: 0px;
    }
    .ptitem:hover {
      cursor: pointer;
      width: 147px;
      font-size: 16px;
      background: rgba(206, 252, 255, 0.8) !important;
      color: #052b33 !important;
      .ptname {
        // color: #052b33;
        display: flex;
        font-size: 14px;
      }
    }
  }
}
</style>
