<template>
  <div id="omin">
    <!-- 定向干扰 -->
    <div class="interference-orientation" v-if="detectObj">
      <div class="interference-title">
        <span class="device-title">
          <img src="@/assets/icon/deviceOper/group.png" alt="" />
          <span>{{ detectObj.name }}</span>
        </span>
        <div
          @click="expelBtn('all')"
          v-show="detectObj.data.length > 1"
          class="expel"
        >
          <el-tooltip
            v-show="getPosiLight('expel', false)"
            class="item"
            effect="dark"
            content="驱离"
            placement="top"
            :enterable="false"
          >
            <img src="@/assets/icon/deviceOper/omni/expel-close.png" alt="" />
          </el-tooltip>
          <el-tooltip
            v-show="getPosiLight('expel', true)"
            class="item"
            effect="dark"
            content="驱离"
            placement="top"
            :enterable="false"
          >
            <img src="@/assets/icon/deviceOper/omni/expel-open.png" alt="" />
          </el-tooltip>
        </div>
        <div
          @click="forcedBth('all')"
          v-show="detectObj.data.length > 1"
          class="forced"
        >
          <el-tooltip
            v-show="getPosiLight('forced', false)"
            class="item"
            effect="dark"
            content="迫降"
            placement="top"
            :enterable="false"
          >
            <img src="@/assets/icon/deviceOper/omni/forced-close.png" alt="" />
          </el-tooltip>
          <el-tooltip
            v-show="getPosiLight('forced', true)"
            class="item"
            effect="dark"
            content="迫降"
            placement="top"
            :enterable="false"
          >
            <img src="@/assets/icon/deviceOper/omni/forced-open.png" alt="" />
          </el-tooltip>
        </div>
        <img
          style="width: 100%; display: block"
          src="@/assets/icon/deviceOper/line.png"
          alt=""
        />
      </div>
      <div
        class="device-name"
        v-for="(item, index) in detectObj.data"
        :key="index"
      >
        <div class="icondown" @click="dropdownShow(item, index)">
          <div
            v-if="
              item.detail &&
              item.detail.static_data['转台id'] &&
              item.detail.static_data['转台id'].value
            "
          >
            <img
              v-show="!item.openflag"
              src="../../assets/icon/caret-down-1.png"
            />
            <img
              v-show="item.openflag"
              src="../../assets/icon/caret-down.png"
            />
          </div>
        </div>
        <span class="name" @click="flyTo(item)">{{ item.name }}</span>
        <div class="device-expel" @click="expelBtn(item)">
          <el-tooltip
            v-show="!item.expelDirStatus"
            class="item"
            effect="dark"
            content="驱离"
            placement="top"
            :enterable="false"
          >
            <img src="@/assets/icon/deviceOper/omni/expel-close.png" alt="" />
          </el-tooltip>
          <el-tooltip
            v-show="item.expelDirStatus"
            class="item"
            effect="dark"
            content="驱离"
            placement="top"
            :enterable="false"
          >
            <img src="@/assets/icon/deviceOper/omni/expel-open.png" alt="" />
          </el-tooltip>
        </div>
        <div class="device-forced" @click="forcedBth(item)">
          <el-tooltip
            v-show="!item.forcedDirStatus"
            class="item"
            effect="dark"
            content="迫降"
            placement="top"
            :enterable="false"
          >
            <img src="@/assets/icon/deviceOper/omni/forced-close.png" alt="" />
          </el-tooltip>
          <el-tooltip
            v-show="item.forcedDirStatus"
            class="item"
            effect="dark"
            content="迫降"
            placement="top"
            :enterable="false"
          >
            <img src="@/assets/icon/deviceOper/omni/forced-open.png" alt="" />
          </el-tooltip>
        </div>

        <div
          class="direction"
          v-show="item.openflag"
          v-if="
            item.detail &&
            item.detail.static_data['转台id'] &&
            item.detail.static_data['转台id'].value
          "
        >
          <div class="centImg" @click="directClick('stop', item)">
            <img
              v-show="!item.stopChecked"
              src="@/assets/icon/deviceOper/direct/stop-normal.png"
              alt=""
            />
            <!-- <img
              v-show="item.stopChecked"
              src="@/assets/icon/deviceOper/direct/stop-click.png"
              alt=""
            /> -->
          </div>
          <div class="topImg" @click="directClick('up', item)">
            <img
              v-if="item.dirChecked === 'up'"
              src="@/assets/icon/deviceOper/direct/top-click.png"
              alt=""
            />
            <img
              v-else
              src="@/assets/icon/deviceOper/direct/top-normal.png"
              alt=""
            />
          </div>
          <div class="rightImg" @click="directClick('right', item)">
            <img
              v-if="item.dirChecked === 'right'"
              src="@/assets/icon/deviceOper/direct/right-click.png"
              alt=""
            />
            <img
              v-else
              src="@/assets/icon/deviceOper/direct/right-normal.png"
              alt=""
            />
          </div>
          <div class="bottomImg" @click="directClick('down', item)">
            <img
              v-if="item.dirChecked === 'down'"
              src="@/assets/icon/deviceOper/direct/bottom-click.png"
              alt=""
            />
            <img
              v-else
              src="@/assets/icon/deviceOper/direct/bottom-normal.png"
              alt=""
            />
          </div>
          <div class="leftImg" @click="directClick('left', item)">
            <img
              v-if="item.dirChecked === 'left'"
              src="@/assets/icon/deviceOper/direct/left-click.png"
              alt=""
            />
            <img
              v-else
              src="@/assets/icon/deviceOper/direct/left-normal.png"
              alt=""
            />
          </div>
          <div class="leftTopImg" @click="arrowRotate(300, item, index, true)">
            <img src="@/assets/icon/deviceOper/direction-spot.png" alt="" />
          </div>
          <div
            class="leftCenterImg"
            @click="arrowRotate(270, item, index, true)"
          >
            <img src="@/assets/icon/deviceOper/direction-spot.png" alt="" />
          </div>
          <div
            class="leftBottomImg"
            @click="arrowRotate(240, item, index, true)"
          >
            <img src="@/assets/icon/deviceOper/direction-spot.png" alt="" />
          </div>
          <div class="centerTopImg" @click="arrowRotate(0, item, index, true)">
            <img src="@/assets/icon/deviceOper/direction-spot.png" alt="" />
          </div>
          <div
            class="centerBottomImg"
            @click="arrowRotate(180, item, index, true)"
          >
            <img src="@/assets/icon/deviceOper/direction-spot.png" alt="" />
          </div>
          <div class="rightTopImg" @click="arrowRotate(60, item, index, true)">
            <img src="@/assets/icon/deviceOper/direction-spot.png" alt="" />
          </div>
          <div
            class="rightCenterImg"
            @click="arrowRotate(90, item, index, true)"
          >
            <img src="@/assets/icon/deviceOper/direction-spot.png" alt="" />
          </div>
          <div
            class="rightBottomImg"
            @click="arrowRotate(120, item, index, true)"
          >
            <img src="@/assets/icon/deviceOper/direction-spot.png" alt="" />
          </div>
          <div class="arrowImg" ref="arrowImg">
            <img src="@/assets/icon/deviceOper/Union.png" alt="" />
          </div>
        </div>
        <img
          style="width: 100%"
          src="@/assets/icon/deviceOper/line.png"
          alt=""
        />
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { createGuid } from '../../utils/index'
import { loadDeviceSpecial } from '../../views/mars3d/device'
import {
  expelDevice,
  expelAllDevice,
  forcedDevice,
  forcedAllDevice,
  turnStop,
  turnDirection,
  turnAngle,
  JamminStop,
} from '@/api/operation/operation'
import { parseTime } from '@/utils/index.js'

export default {
  props: ['detectObj'],
  data() {
    return {
      ws: '',
      expelDirStatus: false,
      forcedDirStatus: false,
      stopChecked: false,
      dirChecked: '',
      timer: null,
      angle: 0,
      dirLoad: false, // 定向阵地驱离迫降操作loading,防止多次点击
      attackCloseHttp: {}, // 操作设备后，暂时停止监听该设备的心跳
    }
  },
  computed: {
    ...mapGetters([
      'serverdata',
      'currentPositionId',
      'interstrike',
      'disabledState',
    ]),
  },
  watch: {
    serverdata(newVal) {
      // 监听定向干扰设备打击按钮的状态
      if (newVal.data.command === 'heartbeat' && this.detectObj) {
        this.detectObj.data.map((el) => {
          const data = newVal.data.data.find((ele) => ele.device_id === el.id)
          if (data && !this.attackCloseHttp[el.id]) {
            // 在线
            if (data.code === 0) {
              el.code = 0
              if (data.state === 'expel') {
                this.$set(el, 'expelDirStatus', true)
                this.$set(el, 'forcedDirStatus', false)
              } else if (data.state === 'forced') {
                this.$set(el, 'expelDirStatus', false)
                this.$set(el, 'forcedDirStatus', true)
              } else {
                this.$set(el, 'expelDirStatus', false)
                this.$set(el, 'forcedDirStatus', false)
              }
            } else {
              // 离线
              el.code = 1
              this.$set(el, 'expelDirStatus', false)
              this.$set(el, 'forcedDirStatus', false)
            }
          }
        })
      } else if (newVal.data.command === 'push_orient') {
        if (newVal.data.data) {
          this.detectObj.data.map((el, index) => {
            newVal.data.data.find((ele) => {
              if (
                el.detail &&
                el.detail.static_data &&
                el.detail.static_data['转台id'].value === ele.device_id &&
                !this.attackCloseHttp[ele.device_id]
              ) {
                const angle = ele.data.hor
                this.arrowRotate(angle, el, index)
              }
            })
          })
        }
      }
    },
  },
  mounted() {},
  methods: {
    // 下拉图标
    dropdownShow(item, index) {
      // 操作被更高级别用户占用
      if (this.$store.state.setting.doStatusShow) {
        return
      }
      if (!item.openflag) {
        this.$set(item, 'openflag', true)
      } else {
        this.$set(item, 'openflag', false)
      }
      this.detectObj.data.forEach((el, i) => {
        if (i !== index) {
          this.$set(el, 'openflag', false)
        }
      })
    },
    // 定向驱离
    expelBtn(type) {
      // 用户没有权限
      if (this.disabledState) {
        this.$message.warning('该用户没有权限')
        return
      }
      // 操作被更高级别用户占用
      if (this.$store.state.setting.doStatusShow) {
        return
      }
      if (type === 'all') {
        // 阵地定向驱离操作
        if (this.dirLoad) {
          this.$message.warning('正在请求，请稍等。。。')
          return
        }
        this.dirLoad = true
        if (this.expelDirStatus) {
          this.dirLoad = false
          if (this.detectObj && this.detectObj.data.length) {
            this.detectObj.data.forEach((el, i) => {
              JamminStop({
                deviceId: el.id,
              }).then((res) => {
                if (res.code === 0) {
                  if (this.expelDirStatus) {
                    this.$message.success('阵地已关闭驱离')
                  }
                  this.$set(el, 'expelDirStatus', false)
                }
              })
            })
          }
        } else {
          // 开启阵地所有打击设备 驱离功能
          if (this.detectObj && this.detectObj.data.length) {
            this.dirLoad = false
            this.detectObj.data.forEach((el) => {
              expelDevice({
                deviceId: el.id,
                interval: this.interstrike,
              })
                .then((res) => {
                  if (res.code === 0) {
                    this.$message.success('阵地已开启驱离')
                    // if (this.detectObj && this.detectObj.data.length) {
                    //   this.detectObj.data.forEach((el) => {
                    //     this.$set(el, 'expelDirStatus', true)
                    //     this.$set(el, 'forcedDirStatus', false)
                    //   })
                    // }
                    this.$set(el, 'expelDirStatus', true)
                    this.$set(el, 'forcedDirStatus', false)
                  } else {
                    this.$message.error(res.msg)
                  }
                })
                .catch(() => {
                  // this.$message.success('当前阵地在线设备已开启驱离')
                  this.dirLoad = false
                })
            })
          }
        }
      } else {
        if (type.code === 1) {
          this.$message.error('设备已离线')
          const obj = {
            device_id: type.id,
            posName: type.posName,
            name: type.name,
            code: 1, // 离线
            content: `设备已离线`,
            time: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
            type: '操作',
          }
          this.$store.state.websocket.notificationList.unshift(obj)
          return
        }
        if (type.loading) {
          // 防止点击多次调用接口
          this.$message.warning('正在请求，请稍等。。。')
          return
        }
        type.loading = true

        if (type.expelDirStatus) {
          // 关闭打击
          JamminStop({
            deviceId: type.id,
          })
            .then((res) => {
              type.loading = false
              if (res.code === 0) {
                this.$set(type, 'expelDirStatus', false)
                this.$message.success('已关闭驱离')
                this.closeAttachHttp(type)
              } else {
                this.$message.error(res.msg)
              }
            })
            .catch(() => {
              type.loading = false
            })
        } else {
          // 驱离
          expelDevice({
            deviceId: type.id,
            interval: this.interstrike,
          })
            .then((res) => {
              type.loading = false
              if (res.code === 0) {
                this.$set(type, 'expelDirStatus', true)
                this.$set(type, 'forcedDirStatus', false)
                this.$message.success('已开启驱离')
                this.closeAttachHttp(type)
              } else {
                this.$message.error(res.msg)
              }
            })
            .catch(() => {
              type.loading = false
            })
        }
      }
    },
    // 定向迫降
    forcedBth(type) {
      // 用户没有权限
      if (this.disabledState) {
        this.$message.warning('该用户没有权限')
        return
      }
      // 操作被更高级别用户占用
      if (this.$store.state.setting.doStatusShow) {
        return
      }
      // console.log(this.interstrike, 'interstrike')
      if (type === 'all') {
        // 阵地定向迫降操作
        if (this.dirLoad) {
          this.$message.warning('正在请求，请稍等。。。')
          return
        }
        this.dirLoad = true

        if (this.forcedDirStatus) {
          this.dirLoad = false

          if (this.detectObj && this.detectObj.data.length) {
            this.detectObj.data.forEach((el) => {
              JamminStop({
                deviceId: el.id,
              }).then((res) => {
                if (res.code === 0) {
                  if (this.forcedDirStatus) {
                    this.$message.success('阵地已关闭迫降')
                  }

                  this.$set(el, 'forcedDirStatus', false)
                }
              })
            })
          }
        } else {
          // 开启阵地所有打击设备 迫降功能
          if (this.detectObj && this.detectObj.data.length) {
            this.dirLoad = false
            this.detectObj.data.forEach((el) => {
              forcedDevice({
                deviceId: el.id,
                interval: this.interstrike,
              })
                .then((res) => {
                  if (res.code === 0) {
                    this.$message.success('阵地已开启迫降')
                    // if (this.detectObj && this.detectObj.data.length) {
                    //   this.detectObj.data.forEach((el) => {
                    //     this.$set(el, 'expelDirStatus', false)
                    //     this.$set(el, 'forcedDirStatus', true)
                    //   })
                    // }
                    this.$set(el, 'expelDirStatus', false)
                    this.$set(el, 'forcedDirStatus', true)
                  } else {
                    this.$message.error(res.msg)
                  }
                })
                .catch(() => {
                  // this.$message.success('当前阵地在线设备已开启迫降')
                  this.dirLoad = false
                })
            })
          }
        }
      } else {
        if (type.code === 1) {
          this.$message.error('设备已离线')
          const obj = {
            device_id: type.id,
            posName: type.posName,
            name: type.name,
            code: 1, // 离线
            content: `设备已离线`,
            time: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
            type: '操作',
          }
          this.$store.state.websocket.notificationList.unshift(obj)
          return
        }
        if (type.loading) {
          // 防止点击多次调用接口
          this.$message.warning('正在请求，请稍等。。。')
          return
        }
        type.loading = true

        if (type.forcedDirStatus) {
          // 关闭打击
          JamminStop({
            deviceId: type.id,
          })
            .then((res) => {
              type.loading = false
              if (res.code === 0) {
                this.$set(type, 'forcedDirStatus', false)
                this.$message.success('已关闭迫降')
                this.closeAttachHttp(type)
              } else {
                this.$message.error(res.msg)
              }
            })
            .catch(() => {
              type.loading = false
            })
        } else {
          forcedDevice({
            deviceId: type.id,
            interval: this.interstrike,
          })
            .then((res) => {
              type.loading = false
              if (res.code === 0) {
                this.$set(type, 'forcedDirStatus', true)
                this.$set(type, 'expelDirStatus', false)
                this.$message.success('已开启迫降')
                this.closeAttachHttp(type)
              } else {
                this.$message.error(res.msg)
              }
            })
            .catch(() => {
              type.loading = false
            })
        }
      }
    },

    // 转台到指定角度
    arrowRotate(angle, item, index, flag) {
      // 用户没有权限
      if (this.disabledState) {
        this.$message.warning('该用户没有权限')
        return
      }
      // this.angle = angle
      // clearTimeout(this.timer)
      // item.angle = 0

      // 关闭转台上下左右按钮状态
      this.$set(item, 'dirChecked', '')

      let turnId
      if (item.detail.static_data['转台id']) {
        turnId = item.detail.static_data['转台id'].value
      }
      if (!turnId) {
        this.$message.warning('未找到转台')
        return
      }
      item.angle = item.angle == undefined ? 0 : item.angle
      let du
      if (item.angle < angle) {
        if (
          Math.abs(angle - item.angle) < Math.abs(angle - (item.angle + 360))
        ) {
          du = 10
        } else {
          du = -10
        }
      } else if (
        Math.abs(angle - item.angle) < Math.abs(angle + 360 - item.angle)
      ) {
        du = -10
      } else {
        du = 10
      }
      if (flag) {
        if (item.loading) {
          this.$message.warning('正在请求，请稍等。。。')
          return
        }
        item.loading = true
        turnAngle({
          deviceId: turnId,
          angle,
        })
          .then((res) => {
            item.loading = false
            if (res.code === 0) {
              if (item.detail) {
                window.CesiumSdk.Camera().flyToPoint({
                  lat: item.detail.static_data.latitude.value,
                  lng: item.detail.static_data.longitude.value,
                  alt: 0,
                  radius: 15000,
                  heading: 0,
                  pitch: -60,
                })
              }

              this.closeAttachHttp({ id: turnId })
              this.$set(item, 'angle', angle)
              this.$refs.arrowImg[index].style.transform = `rotate(${angle}deg)`
              this.$message.success('设置转台到指定角度成功')
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch(() => {
            item.loading = false
          })
      } else {
        this.directRound(item, angle, du)
      }
    },
    // 转台转向
    directClick(direct, item) {
      // 用户没有权限
      if (this.disabledState) {
        this.$message.warning('该用户没有权限')
        return
      }
      let turnId
      if (item.detail.static_data['转台id']) {
        turnId = item.detail.static_data['转台id'].value
      }
      if (!turnId) {
        this.$message.warning('未找到转台')
        return
      }
      if (direct === 'stop') {
        // clearInterval(item.timevar)
        if (!item.stopChecked) {
          // this.$set(item, 'stopChecked', true)
          turnStop({
            deviceId: turnId,
          }).then((res) => {
            if (res.code === 0) {
              this.$message.success('转台停止转动成功')
            }
          })
        } else {
          // this.$set(item, 'stopChecked', false)
        }
        this.$set(item, 'dirChecked', '')
        // this.$refs.arrowImg[0].style.transform = `rotate(0deg)`
      } else {
        this.$set(item, 'dirChecked', direct)
        let direction = ''
        let value = ''
        if (direct === 'left' || direct === 'right') {
          // clearInterval(item.timevar)
          direction = 'hor'
          value = direct
        } else if (direct === 'up' || direct === 'down') {
          // clearInterval(item.timevar)
          direction = 'ver'
          value = direct
        }
        turnDirection({
          deviceId: turnId,
          direction,
          value,
        })
          .then((res) => {
            if (res.code === 0) {
              this.$message.success('设置转台转向成功')
              if (direct !== 'up' && direct !== 'down') {
                item.angle = item.angle == undefined ? 0 : item.angle
                const du = direct === 'right' ? 10 : -10
                // this.directRound(item, 0, du)
              }
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch(() => {
            this.$set(item, 'dirChecked', '')
          })
      }
    },
    // 转台转动
    directRound(item, toAngle, dire = -10) {
      console.log(item, toAngle, 'toAngle2')
      const deviceOption = {
        lng: item.detail.static_data.longitude
          ? item.detail.static_data.longitude.value
          : 0,
        lat: item.detail.static_data.latitude
          ? item.detail.static_data.latitude.value
          : 0,
        alt: item.detail.static_data.altitude
          ? item.detail.static_data.altitude.value
          : 0,
        radius: 3000,
        type: item.detail.type,
        id: item.id,
      }
      deviceOption.startAngle = toAngle - 120
      deviceOption.endAngle = toAngle
      loadDeviceSpecial(deviceOption, true)
      // clearInterval(item.timevar)
      // item.timevar = setInterval(() => {
      //   if (toAngle) {
      //     if (item.angle % 360 == toAngle) {
      //       clearInterval(item.timevar)
      //     } else {
      //       if (item.angle >= 360) {
      //         item.angle %= 360
      //       } else if (item.angle < 0) {
      //         item.angle += 360
      //       } else {
      //         item.angle += dire
      //       }
      //       deviceOption.startAngle = -150 + item.angle
      //       deviceOption.endAngle = -30 + item.angle
      //       loadDeviceSpecial(deviceOption, true)
      //     }
      //   } else {
      //     if (item.angle >= 360) {
      //       item.angle %= 360
      //     } else if (item.angle <= 0) {
      //       item.angle += 360
      //     } else {
      //       item.angle += dire
      //     }
      //     deviceOption.startAngle = -150 + item.angle
      //     deviceOption.endAngle = -30 + item.angle
      //     loadDeviceSpecial(deviceOption, true)
      //   }
      // }, 500)
    },
    // 跳转视角
    flyTo(item) {
      // 操作被更高级别用户占用
      if (this.$store.state.setting.doStatusShow) {
        return
      }
      window.CesiumSdk.Camera().flyToPoint({
        lat: item.detail.static_data.latitude.value,
        lng: item.detail.static_data.longitude.value,
        alt: 0,
        radius: 15000,
        heading: 0,
        pitch: -60,
      })
    },
    // 定向阵地迫降 驱离高亮
    getPosiLight(type, show) {
      if (type === 'expel') {
        this.expelDirStatus = !show
        // 驱离
        if (this.detectObj && this.detectObj.data.length) {
          const status = this.detectObj.data.every((el) => el.expelDirStatus)
          this.expelDirStatus = show === status
          return show === status
        }

        return this.expelDirStatus
      }

      // 迫降
      this.forcedDirStatus = !show

      if (this.detectObj && this.detectObj.data.length) {
        const status = this.detectObj.data.every((el) => el.forcedDirStatus)
        this.forcedDirStatus = show === status
        return show === status
      }
      return this.forcedDirStatus
    },
    // 操作设备后停止监听设备心跳，防止按钮闪烁
    closeAttachHttp(item) {
      this.attackCloseHttp[item.id] = true
      clearTimeout(this.attackCloseHttp[`${item.id}_timer`])
      this.attackCloseHttp[`${item.id}_timer`] = null
      this.attackCloseHttp[`${item.id}_timer`] = setTimeout(() => {
        this.attackCloseHttp[item.id] = false
      }, 10000)
    },
  },
}
</script>
<style scoped lang="scss">
#omin {
  pointer-events: auto;
  .interference-orientation {
    width: 250px;
    /* height: 208px; */
    margin-top: 10px;
    // background-image: url(../../assets/images/control/bg_\(3\).png);
    background-image: url('../../assets/icon/deviceOper/long-background.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: 0 0;
    padding-bottom: 30px;
    .disabledBtn {
      // pointer-events: none;
    }
    .interference-title {
      width: 100%;
      height: 40px;
      line-height: 40px;
      position: relative;
      .device-title {
        display: inline-block;
        position: relative;
        img {
          width: 16px;
          height: 16px;
          position: relative;
          top: 7px;
          left: 7px;
        }
        span {
          font-size: 14px;
          color: #cefcff;
          font-weight: 700;
          position: relative;
          top: 5px;
          left: 10px;
          letter-spacing: 2px;
        }
      }
      div {
        cursor: pointer;
        width: 24px;
        height: 24px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .expel {
        position: absolute;
        top: 12px;
        right: 48px;
      }
      .forced {
        position: absolute;
        top: 12px;
        right: 17px;
      }
    }
    .device-name {
      width: 100%;
      // height: 36px;
      position: relative;
      top: 5px;
      .icondown {
        cursor: pointer;
        display: inline-block;
        width: 12px;
        height: 12px;
        margin-left: 8px;
        position: relative;
        top: -2px;
        img {
          width: 12px;
          height: 12px;
        }
      }
      .name {
        cursor: pointer;
        display: inline-block;
        font-size: 12px;
        color: #cefcff;
        font-weight: 400;
        margin-top: 10px;
        letter-spacing: 1px;
        max-width: 110px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      div {
        width: 24px;
        height: 24px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .device-expel {
        cursor: pointer;
        position: absolute;
        top: 6px;
        right: 48px;
      }
      .device-forced {
        cursor: pointer;
        position: absolute;
        top: 6px;
        right: 17px;
      }

      .direction {
        display: block;
        position: relative;
        height: 110px;
        width: 80%;
        margin: 0 auto;
        margin-top: 10px;
        background-image: url('../../assets/icon/deviceOper/direction-line.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: 0 0;
        div {
          cursor: pointer;
        }
        .centImg {
          position: absolute;
          width: 20px;
          height: 20px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 3;
        }
        .topImg {
          position: absolute;
          top: 38%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 2;
        }
        .rightImg {
          position: absolute;
          top: 50%;
          left: 58%;
          transform: translate(-50%, -50%);
          z-index: 2;
        }
        .bottomImg {
          position: absolute;
          top: 62.5%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 2;
        }
        .leftImg {
          position: absolute;
          top: 50%;
          left: 42%;
          transform: translate(-50%, -50%);
          z-index: 2;
        }
        .leftTopImg {
          width: 20px;
          height: 20px;
          position: absolute;
          top: 0;
          left: 0;
        }
        .leftCenterImg {
          width: 20px;
          height: 20px;
          position: absolute;
          top: 50%;
          left: 0;
          transform: translate(0%, -50%);
        }
        .leftBottomImg {
          width: 20px;
          height: 20px;
          position: absolute;
          top: 100%;
          left: 0;
          transform: translate(0%, -100%);
        }
        .centerTopImg {
          width: 20px;
          height: 20px;
          position: absolute;
          top: 0;
          left: 50%;
          transform: translate(-50%, 0%);
        }
        .centerBottomImg {
          width: 20px;
          height: 20px;
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translate(-50%, -100%);
        }
        .rightTopImg {
          width: 20px;
          height: 20px;
          position: absolute;
          top: 0;
          left: 100%;
          transform: translate(-100%, 0%);
        }
        .rightCenterImg {
          width: 20px;
          height: 20px;
          position: absolute;
          top: 50%;
          left: 100%;
          transform: translate(-100%, -50%);
        }
        .rightBottomImg {
          width: 20px;
          height: 20px;
          position: absolute;
          top: 100%;
          left: 100%;
          transform: translate(-100%, -100%);
        }
        .arrowImg {
          cursor: auto;
          position: relative;
          top: 12%;
          left: 47.5%;
          width: 10px;
          height: 44px;
          z-index: 1;
          transform-origin: center bottom;
          transform: rotate(0);
        }
      }
    }
  }
}
</style>
