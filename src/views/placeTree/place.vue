<template>
  <div
    class="tree-custom container"
    style="margin-top: 40px"
    @click.stop="clickNode(treeData)"
  >
    <!-- v-if="(treeData.children && treeData.children.length) || treeData.isLeaf" -->
    <!-- <div class="node-label node-label-first border-right">
      <div class="label">博鳌防区</div>
      <span class="label_num">7/10</span>
    </div> -->
    <div class="tree-custom-node tree-container">
      <div
        class="tree-custom"
        v-for="(item, index) in totalDevices"
        :key="index"
      >
        <div class="node-label border-right">
          <div class="label">{{ item.name }}</div>
          <span class="label_num"
            >{{ onlineDevice(item) }}/{{ item.totalCount }}</span
          >
        </div>
        <div class="tree-custom-node">
          <div class="tree-custom-node">
            <div
              class="tree-custom"
              :class="[
                ind == item.deviceInfoAll.length - 1 ? '' : 'border-bottom',
                ind == 0 ? '' : 'border-top',
              ]"
              v-for="(ite, ind) in item.deviceInfoAll"
              :key="ind"
            >
              <div class="node-label border-left">
                <div class="label">{{ ite.name }}</div>
                <span class="label_num"
                  >{{ getOnlineCount(ite) }}/{{ ite.count }}</span
                >
              </div>
              <div class="tree-custom-node last_node">
                <div
                  class="tree-custom"
                  v-for="(it, i) in ite.data"
                  :key="i"
                  @click="eqinfo(it)"
                >
                  <div
                    class="node-label"
                    :class="[
                      deviceState(it).code == '1' ? 'drop' : '',
                      deviceState(it).code == '0' ? 'normal' : '',
                    ]"
                  >
                    <div class="label">{{ it.posName + it.name }}</div>
                    <div class="label_bottom">
                      <div class="label_ip">192.168.1.123</div>
                      <div class="label_status">
                        {{ it.state }}
                      </div>
                    </div>
                  </div>
                  <div class="tree-custom-node"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="device-information" v-if="deviceInfo">
      <div class="device-name">
        {{ deviceInfo.posName }} - {{ deviceInfo.name }}
      </div>
      <div class="device-item">
        <span>设备状态：</span>
        <span :class="deviceInfo.code == 0 ? 'online' : 'offline'">{{
          deviceInfo.state
        }}</span>
      </div>
      <div class="device-item">
        <span>经度：</span>
        <span>{{
          deviceInfo.detail.static_data.longitude
            ? deviceInfo.detail.static_data.longitude.value
            : 0
        }}</span>
      </div>
      <div class="device-item">
        <span>纬度：</span>
        <span>{{
          deviceInfo.detail.static_data.latitude
            ? deviceInfo.detail.static_data.latitude.value
            : 0
        }}</span>
      </div>
      <div class="device-item">
        <span>高度：</span>
        <span
          >{{
            deviceInfo.detail.static_data.altitude
              ? deviceInfo.detail.static_data.altitude.value
              : 0
          }}米</span
        >
      </div>
      <div class="device-item">
        <span>打击范围：</span>
        <span
          >{{
            deviceInfo.detail.static_data.effect
              ? deviceInfo.detail.static_data.effect.value
              : 0
          }}米</span
        >
      </div>
      <div class="device-item">
        <span>所属阵地：</span>
        <span>{{ deviceInfo.posName }}</span>
      </div>
      <!-- 设备操作盘 -->
      <div class="operation-container">
        <!-- GPS诱导 -->
        <div v-show="deviceInfo.type == 'Guide'" class="deviceOperation">
          <span class="name">{{ deviceInfo.name }}</span>
          <div class="device-expel" @click="gpsdefense">
            <el-tooltip
              class="item"
              effect="dark"
              content="拒止"
              placement="top"
              :enterable="false"
            >
              <img :src="defenseStatus ? gpsOnDefense : gpsOffDefense" alt="" />
            </el-tooltip>
          </div>
          <div class="device-forced" @click="gpsexpel">
            <el-tooltip
              class="item"
              effect="dark"
              content="驱离"
              placement="top"
              :enterable="false"
            >
              <img :src="expelStatus ? gpsOnExpel : gpsOffExpel" alt="" />
            </el-tooltip>
          </div>
          <div class="induce-direction">
            <div class="centImg">
              <img
                src="../../assets/icon/deviceOper/GPSGuide/center-spot.png"
                alt=""
              />
            </div>
            <div class="leftTopImg" @click="arrowRotate(300, 8)">
              <img
                src="../../assets/icon/deviceOper/direction-spot.png"
                alt=""
              />
            </div>
            <div class="leftCenterImg" @click="arrowRotate(270, 7)">
              <img
                src="../../assets/icon/deviceOper/direction-spot.png"
                alt=""
              />
            </div>
            <div class="leftBottomImg" @click="arrowRotate(240, 6)">
              <img
                src="../../assets/icon/deviceOper/direction-spot.png"
                alt=""
              />
            </div>
            <div class="centerTopImg" @click="arrowRotate(0, 1)">
              <img
                src="../../assets/icon/deviceOper/direction-spot.png"
                alt=""
              />
            </div>
            <div class="centerBottomImg" @click="arrowRotate(180, 5)">
              <img
                src="../../assets/icon/deviceOper/direction-spot.png"
                alt=""
              />
            </div>
            <div class="rightTopImg" @click="arrowRotate(60, 2)">
              <img
                src="../../assets/icon/deviceOper/direction-spot.png"
                alt=""
              />
            </div>
            <div class="rightCenterImg" @click="arrowRotate(90, 3)">
              <img
                src="../../assets/icon/deviceOper/direction-spot.png"
                alt=""
              />
            </div>
            <div class="rightBottomImg" @click="arrowRotate(120, 4)">
              <img
                src="../../assets/icon/deviceOper/direction-spot.png"
                alt=""
              />
            </div>
            <div class="arrowImg" ref="arrowImg">
              <img src="../../assets/icon/deviceOper/Union.png" alt="" />
            </div>
          </div>
        </div>
        <!-- 全向打击 -->
        <div v-show="deviceInfo.type == 'Omni'" class="deviceOperation">
          <span class="name">{{ deviceInfo.name }}</span>
          <div class="device-expel" @click="omniexpel">
            <el-tooltip
              class="item"
              effect="dark"
              content="驱离"
              placement="top"
              :enterable="false"
            >
              <img :src="omniExpelStatus ? omniOnExpel : omniOffExpel" alt="" />
            </el-tooltip>
          </div>
          <div class="device-forced" @click="omniforced">
            <el-tooltip
              class="item"
              effect="dark"
              content="迫降"
              placement="top"
              :enterable="false"
            >
              <img
                :src="omniForcedSatus ? omniOnForced : omniOffForced"
                alt=""
              />
            </el-tooltip>
          </div>
        </div>
        <!-- 面阵 -->
        <div v-show="deviceInfo.type == 'Detect'" class="deviceOperation">
          <span class="name">{{ deviceInfo.name }}</span>
          <div class="device-expel" @click="orientexpel">
            <el-tooltip
              class="item"
              effect="dark"
              content="驱离"
              placement="top"
              :enterable="false"
            >
              <img
                :src="orientExpelStatus ? detectOnExpel : detectOffExpel"
                alt=""
              />
            </el-tooltip>
          </div>
          <div class="device-forced" @click="orientforced">
            <el-tooltip
              class="item"
              effect="dark"
              content="迫降"
              placement="top"
              :enterable="false"
            >
              <img
                :src="orientForcedStatus ? detectOnForced : detectOffForced"
                alt=""
              />
            </el-tooltip>
          </div>
          <div
            class="orient-direction"
            v-if="
              this.deviceInfo.detail &&
              this.deviceInfo.detail.static_data['转台id'] &&
              this.deviceInfo.detail.static_data['转台id'].value
            "
          >
            <div class="centImg" @click="directClick('stop')">
              <img
                src="@/assets/icon/deviceOper/direct/stop-normal.png"
                alt=""
              />
            </div>
            <div class="topImg" @click="directClick('up')">
              <img
                :src="this.dirChecked == 'up' ? upOnImage : upOffImage"
                alt=""
              />
            </div>
            <div class="rightImg" @click="directClick('right')">
              <img
                :src="this.dirChecked == 'right' ? rightOnImage : rightOffImage"
                alt=""
              />
            </div>
            <div class="bottomImg" @click="directClick('down')">
              <img
                :src="this.dirChecked == 'down' ? downOnImage : downOffImage"
                alt=""
              />
            </div>
            <div class="leftImg" @click="directClick('left')">
              <img
                :src="this.dirChecked == 'left' ? leftOnImage : leftOffImage"
                alt=""
              />
            </div>
            <div class="leftTopImg" @click="rotateArrow(300, true)">
              <img src="@/assets/icon/deviceOper/direction-spot.png" alt="" />
            </div>
            <div class="leftCenterImg" @click="rotateArrow(270, true)">
              <img src="@/assets/icon/deviceOper/direction-spot.png" alt="" />
            </div>
            <div class="leftBottomImg" @click="rotateArrow(240, true)">
              <img src="@/assets/icon/deviceOper/direction-spot.png" alt="" />
            </div>
            <div class="centerTopImg" @click="rotateArrow(0, true)">
              <img src="@/assets/icon/deviceOper/direction-spot.png" alt="" />
            </div>
            <div class="centerBottomImg" @click="rotateArrow(180, true)">
              <img src="@/assets/icon/deviceOper/direction-spot.png" alt="" />
            </div>
            <div class="rightTopImg" @click="rotateArrow(60, true)">
              <img src="@/assets/icon/deviceOper/direction-spot.png" alt="" />
            </div>
            <div class="rightCenterImg" @click="rotateArrow(90, true)">
              <img src="@/assets/icon/deviceOper/direction-spot.png" alt="" />
            </div>
            <div class="rightBottomImg" @click="rotateArrow(120, true)">
              <img src="@/assets/icon/deviceOper/direction-spot.png" alt="" />
            </div>
            <div class="imgArrow" ref="imgArrow">
              <img src="@/assets/icon/deviceOper/Union.png" alt="" />
            </div>
          </div>
        </div>
        <!-- 协议破解 -->
        <div v-show="deviceInfo.type == 'Crack'" class="deviceOperation">
          <div class="protocol-direction">
            <div class="title">{{ deviceInfo.name }}</div>
            <div class="broad-strike">
              <div class="title">宽带打击</div>
              <div class="strikeBtn">
                <div @click="frequencyBtn('0.9')">
                  <img
                    v-show="!frequencyOpn"
                    src="../../assets/images/control/frequency_1.png"
                    alt=""
                  />
                  <img
                    v-show="frequencyOpn"
                    src="../../assets/images/control/frequency_1-open.png"
                    alt=""
                  />
                </div>
                <div @click="frequencyBtn('1.5')">
                  <img
                    v-show="!frequencyOpf"
                    src="../../assets/images/control/frequency_2.png"
                    alt=""
                  />
                  <img
                    v-show="frequencyOpf"
                    src="../../assets/images/control/frequency_2-open.png"
                    alt=""
                  />
                </div>
                <div @click="frequencyBtn('2.4')">
                  <img
                    v-show="!frequencyTpf"
                    src="../../assets/images/control/frequency_3.png"
                    alt=""
                  />
                  <img
                    v-show="frequencyTpf"
                    src="../../assets/images/control/frequency_3-open.png"
                    alt=""
                  />
                </div>
                <div @click="frequencyBtn('5.8')">
                  <img
                    v-show="!frequencyEpf"
                    src="../../assets/images/control/frequency_4.png"
                    alt=""
                  />
                  <img
                    v-show="frequencyEpf"
                    src="../../assets/images/control/frequency_4-open.png"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 光电 -->
        <div
          v-show="deviceInfo.type == 'Photoelectricity'"
          class="deviceOperation"
        >
          <span class="name">{{ deviceInfo.name }}</span>
          <div class="device-expel" @click="photoelecexpel">
            <el-tooltip
              class="item"
              effect="dark"
              content="驱离"
              placement="top"
              :enterable="false"
            >
              <img
                :src="
                  photoelecExpelStatus ? photoelecOnExpel : photoelecOffExpel
                "
                alt=""
              />
            </el-tooltip>
          </div>
          <div class="device-forced" @click="photoelecforced">
            <el-tooltip
              class="item"
              effect="dark"
              content="迫降"
              placement="top"
              :enterable="false"
            >
              <img
                :src="
                  photoelecForcedStatus ? photoelecOnForced : photoelecOffForced
                "
                alt=""
              />
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils/index.js'
import {
  guideExpel,
  guideDefense,
  guideStop,
  expelDevice,
  JamminStop,
  forcedDevice,
  turnStop,
  turnDirection,
  turnAngle,
  expelElectronic,
  forcedElectronic,
  stopElectronic,
} from '@/api/operation/operation'
import { broadbandStrike } from '@/api/operation/protocol.js'
import { loadDeviceSpecial } from '../mars3d/device'
// GPS诱导 按钮图片
const gpsOffDefense = require('../../assets/icon/deviceOper/GPSGuide/defense-close.png')
const gpsOnDefense = require('../../assets/icon/deviceOper/GPSGuide/defense-open.png')
const gpsOffExpel = require('../../assets/icon/deviceOper/GPSGuide/expel-close.png')
const gpsOnExpel = require('../../assets/icon/deviceOper/GPSGuide/expel-open.png')
// 全向打击 按钮图片
const omniOffExpel = require('../../assets/icon/deviceOper/omni/expel-close.png')
const omniOnExpel = require('../../assets/icon/deviceOper/omni/expel-open.png')
const omniOffForced = require('../../assets/icon/deviceOper/omni/forced-close.png')
const omniOnForced = require('../../assets/icon/deviceOper/omni/forced-open.png')
// 面阵 转台按钮图片
const detectOffExpel = require('../../assets/icon/deviceOper/omni/expel-close.png')
const detectOnExpel = require('../../assets/icon/deviceOper/omni/expel-open.png')
const detectOffForced = require('../../assets/icon/deviceOper/omni/forced-close.png')
const detectOnForced = require('../../assets/icon/deviceOper/omni/forced-open.png')
const upOnImage = require('../../assets/icon/deviceOper/direct/top-click.png')
const upOffImage = require('../../assets/icon/deviceOper/direct/top-normal.png')
const rightOnImage = require('../../assets/icon/deviceOper/direct/right-click.png')
const rightOffImage = require('../../assets/icon/deviceOper/direct/right-normal.png')
const downOnImage = require('../../assets/icon/deviceOper/direct/bottom-click.png')
const downOffImage = require('../../assets/icon/deviceOper/direct/bottom-normal.png')
const leftOnImage = require('../../assets/icon/deviceOper/direct/left-click.png')
const leftOffImage = require('../../assets/icon/deviceOper/direct/left-normal.png')
// 光电 按钮图片
const photoelecOnExpel = require('../../assets/icon/deviceOper/omni/expel-open.png')
const photoelecOffExpel = require('../../assets/icon/deviceOper/omni/expel-close.png')
const photoelecOnForced = require('../../assets/icon/deviceOper/omni/forced-open.png')
const photoelecOffForced = require('../../assets/icon/deviceOper/omni/forced-close.png')

export default {
  name: 'placeTree',
  props: {
    treeData: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  computed: {
    ...mapGetters([
      'userId',
      'positionArr',
      'heatBeatList',
      'interstrike',
      'serverdata',
    ]),
  },
  components: {},
  data() {
    return {
      nodeDate: null,
      deviceInfoAll: [], // 左侧设备分类数据
      totalDevices: [], // 设备总览数额
      deviceInfo: null, // 设备详情
      defenseStatus: false, // 诱导 拒止
      expelStatus: false, // 诱导 驱离
      loading: false,
      omniExpelStatus: false, // 全向 驱离
      omniForcedSatus: false, // 全向 迫降
      photoelecExpelStatus: false, // 光电 驱离
      photoelecForcedStatus: false, // 光电 迫降
      // 协议破解 宽带打击
      frequencyOpn: false,
      frequencyOpf: false,
      frequencyTpf: false,
      frequencyEpf: false,
      // 协议破解 防止多次点击
      loadingOpn: false,
      loadingOpf: false,
      loadingTpf: false,
      loadingEpf: false,
      orientExpelStatus: false, // 定向驱离
      orientForcedStatus: false, // 定向迫降
      orientStopStatus: false, // 定向转台 状态
      dirChecked: '',
      timer: null,
      // GPS诱导按钮图片
      gpsOffDefense,
      gpsOnDefense,
      gpsOffExpel,
      gpsOnExpel,
      // 全向打击
      omniOffExpel,
      omniOnExpel,
      omniOffForced,
      omniOnForced,
      // 转台按钮图片
      detectOnExpel,
      detectOffExpel,
      detectOnForced,
      detectOffForced,
      upOnImage,
      upOffImage,
      rightOnImage,
      rightOffImage,
      downOnImage,
      downOffImage,
      leftOnImage,
      leftOffImage,
      // 光电按钮图片
      photoelecOnExpel,
      photoelecOffExpel,
      photoelecOnForced,
      photoelecOffForced,
    }
  },
  watch: {
    serverdata(newVal) {
      if (newVal.data.command === 'heartbeat' && this.deviceInfo) {
        const data = newVal.data.data.find(
          (el) => el.device_id === this.deviceInfo.id
        )
        if (data && data.code === 0) {
          if (this.deviceInfo.type === 'Guide') {
            // GPS诱导
            if (data.state === 'defense') {
              // 防御状态
              this.defenseStatus = true
              this.expelStatus = false
              this.$refs.arrowImg.style.transform = `rotate(0deg)`
            } else if (data.state.split('_')[0] === 'expel') {
              // 驱离状态
              const dir = data.state.split('_')[1]
              let angle
              if (dir == '1') {
                angle = 0
              } else if (dir == '2') {
                angle = 60
              } else if (dir == '3') {
                angle = 90
              } else if (dir == '4') {
                angle = 120
              } else if (dir == '5') {
                angle = 180
              } else if (dir == '6') {
                angle = 240
              } else if (dir == '7') {
                angle = 270
              } else if (dir == '8') {
                angle = 300
              }
              this.expelStatus = true
              this.defenseStatus = false
              this.$refs.arrowImg.style.transform = `rotate(${angle}deg)`
            } else {
              this.expelStatus = false
              this.defenseStatus = false
              this.$refs.arrowImg.style.transform = `rotate(0deg)`
            }
          } else if (this.deviceInfo.type === 'Omni') {
            // 全向
            if (data.state === 'expel') {
              this.omniExpelStatus = true
              this.omniForcedSatus = false
            } else if (data.state === 'forced') {
              this.omniExpelStatus = false
              this.omniForcedSatus = true
            } else {
              this.omniExpelStatus = false
              this.omniForcedSatus = false
            }
          } else if (this.deviceInfo.type === 'Detect') {
            // 定向
            if (data.state === 'expel') {
              this.orientExpelStatus = true
              this.orientForcedStatus = false
            } else if (data.state === 'forced') {
              this.orientExpelStatus = false
              this.orientForcedStatus = true
            } else {
              this.orientExpelStatus = false
              this.orientForcedStatus = false
            }
          } else if (this.deviceInfo.type === 'Crack') {
            // 协议破解
            if (data.state) {
              const state = JSON.parse(data.state)
              if (state.WideAttack9 === 2) {
                this.frequencyOpn = true
              } else {
                this.frequencyOpn = false
              }
              if (state.WideAttack15 === 2) {
                this.frequencyOpf = true
              } else {
                this.frequencyOpf = false
              }
              if (state.WideAttack24 === 2) {
                this.frequencyTpf = true
              } else {
                this.frequencyTpf = false
              }
              if (state.WideAttack58 === 2) {
                this.frequencyEpf = true
              } else {
                this.frequencyEpf = false
              }
            } else {
              this.frequencyOpn = false
              this.frequencyOpf = false
              this.frequencyTpf = false
              this.frequencyEpf = false
            }
          } else if (this.deviceInfo.type === 'Photoelectricity') {
            // 光电
            if (data.state) {
              const state = JSON.parse(data.state)
              if (state.direct_state === 'expel') {
                this.photoelecExpelStatus = true
                this.photoelecForcedStatus = false
              } else if (state.direct_state === 'forced') {
                this.photoelecExpelStatus = false
                this.photoelecForcedStatus = true
              } else if (state.direct_state === 'normal') {
                this.photoelecExpelStatus = false
                this.photoelecForcedStatus = false
              }
            }
          }
        }
      }
    },
  },
  mounted() {
    this.totalDevices = JSON.parse(JSON.stringify(this.positionArr))
    this.totalDevices.forEach((item) => {
      item.deviceInfoAll = []
      item.totalCount = item.deviceArr.length
      item.deviceArr.forEach((el) => {
        const type = item.deviceInfoAll.find((ele) => ele.type === el.type)
        if (type) {
          if (
            el.type.toLowerCase() === 'tdoa' &&
            el.children &&
            el.children.length
          ) {
            el.children.forEach((item) => {
              type.count++
              type.data.push({
                ...el,
                name: el.type_name + item.address,
                lng: item.lon,
                lat: item.lat,
                alt: item.alt,
                code: item.code,
                id: `${el.id}_${item.id}`,
              })
            })
          } else {
            type.count++
            type.data.push(el)
          }
        } else {
          const deviceType = {
            count: 0,
            name: el.type_name,
            type: el.type,
            data: [],
            currentIndex: 0,
          }

          if (
            el.type.toLowerCase() === 'tdoa' &&
            el.children &&
            el.children.length
          ) {
            el.children.forEach((item) => {
              deviceType.count++
              deviceType.data.push({
                ...el,
                name: el.type_name + item.address,
                lng: item.lon,
                lat: item.lat,
                alt: item.alt,
                code: item.code,
                id: `${el.id}_${item.id}`,
              })
            })
          } else {
            deviceType.count++
            deviceType.data.push(el)
          }

          item.deviceInfoAll.push(deviceType)
        }
      })
    })
    console.log(this.totalDevices, 'this.totalDevices')
    // const data = JSON.parse(JSON.stringify(this.treeData))
    // // this.dealData([data])
    // this.nodeDate = this.dealData([data])
  },
  methods: {
    // 查询设备是否在线
    getOnlineCount(item) {
      const arr = item.data.filter((el) => {
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
    deviceState(item) {
      const heat_device = this.heatBeatList.find(
        (el) => el.device_id == item.id
      )
      if (heat_device) {
        item.state = heat_device.code == 0 ? '在线' : '离线'
        item.code = heat_device.code
      }
      return item
    },
    // 点击节点
    clickNode(node) {
      // console.log(node)
    },
    eqinfo(data) {
      this.deviceInfo = data
    },
    // GPS诱导 拒止
    gpsdefense() {
      if (this.deviceInfo.code == 1) {
        this.$message.error('设备已离线')
        const obj = {
          device_id: this.deviceInfo.id,
          posName: this.deviceInfo.posName,
          name: this.deviceInfo.name,
          code: 1, // 离线
          content: `设备已离线`,
          time: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
          type: '操作',
        }
        this.$store.state.websocket.notificationList.unshift(obj)
        return
      }
      if (!this.defenseStatus) {
        if (this.loading) {
          // 防止点击多次调用接口
          this.$message.warning('正在请求，请稍等。。。')
          return
        }
        this.loading = true
        // 开启防御 防御高亮，取消驱离高亮
        guideDefense({
          deviceId: this.deviceInfo.id,
        })
          .then((res) => {
            this.loading = false
            if (res.code === 0) {
              this.defenseStatus = true
              this.expelStatus = false
              this.$refs.arrowImg.style.transform = `rotate(0deg)`
              this.$message.success('已开启防御')
            }
          })
          .catch(() => {
            this.loading = false
          })
      } else {
        if (this.loading) {
          // 防止点击多次调用接口
          return
        }
        this.loading = true
        // 关闭防御 取消防御高亮
        guideStop({
          deviceId: this.deviceInfo.id,
        })
          .then((res) => {
            this.loading = false
            if (res.code === 0) {
              this.defenseStatus = false
              this.$message.success('已关闭防御')
            }
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    // gps诱导 驱离
    gpsexpel() {
      if (this.expelStatus) {
        // 驱离高亮时点击关闭gps诱导
        if (this.loading) {
          // 防止点击多次调用接口
          return
        }
        this.loading = true
        guideStop({
          deviceId: this.deviceInfo.id,
        })
          .then((res) => {
            this.loading = false
            if (res.code === 0) {
              this.expelStatus = false
              this.$message.success('已关闭驱离')
              this.$refs.arrowImg.style.transform = `rotate(0deg)`
            }
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    // 操作点击方向按钮，开启驱离，驱离按钮高亮
    arrowRotate(angle, direction) {
      if (this.deviceInfo.code == 1) {
        this.$message.error('设备已离线')
        const obj = {
          device_id: this.deviceInfo.id,
          posName: this.deviceInfo.posName,
          name: this.deviceInfo.name,
          code: 1, // 离线
          content: `设备已离线`,
          time: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
          type: '操作',
        }
        this.$store.state.websocket.notificationList.unshift(obj)
        return
      }
      if (this.loading) {
        // 防止点击多次调用接口
        this.$message.warning('正在请求接口，请稍等。。。')
        return
      }
      this.loading = true
      guideExpel({
        deviceId: this.deviceInfo.id,
        direction,
      })
        .then((res) => {
          if (res.code === 0) {
            this.loading = false
            this.defenseStatus = false
            this.expelStatus = true
            this.$refs.arrowImg.style.transform = `rotate(${angle}deg)`
            this.$message.success('已开启驱离')
          }
        })
        .catch(() => {
          this.expelStatus = false
          this.$refs.arrowImg.style.transform = `rotate(0deg)`
          this.loading = false
        })
    },
    // 全向驱离
    omniexpel() {
      if (this.deviceInfo.code == 1) {
        this.$message.error('设备已离线')
        const obj = {
          device_id: this.deviceInfo.id,
          posName: this.deviceInfo.posName,
          name: this.deviceInfo.name,
          code: 1, // 离线
          content: `设备已离线`,
          time: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
          type: '操作',
        }
        this.$store.state.websocket.notificationList.unshift(obj)
        return
      }
      if (!this.omniExpelStatus) {
        if (this.loading) {
          this.$message.warning('正在请求接口，请稍等。。。')
          // 防止点击多次调用接口
          return
        }
        this.loading = true
        expelDevice({
          deviceId: this.deviceInfo.id,
          interval: this.interstrike,
        })
          .then((res) => {
            this.loading = false
            if (res.code === 0) {
              this.omniExpelStatus = true
              this.omniForcedSatus = false
              this.$message.success('已开启驱离')
            }
          })
          .catch(() => {
            this.loading = false
            this.omniExpelStatus = false
          })
      } else {
        if (this.loading) {
          this.$message.warning('正在请求接口，请稍等。。。')
          // 防止点击多次调用接口
          return
        }
        this.loading = true
        JamminStop({
          deviceId: this.deviceInfo.id,
        })
          .then((res) => {
            this.loading = false
            if (res.code === 0) {
              this.omniExpelStatus = false
              this.$message.success('已关闭驱离')
            }
          })
          .catch(() => {
            this.loading = false
            this.omniExpelStatus = true
          })
      }
    },
    // 全向迫降
    omniforced() {
      if (this.deviceInfo.code == 1) {
        this.$message.error('设备已离线')
        const obj = {
          device_id: this.deviceInfo.id,
          posName: this.deviceInfo.posName,
          name: this.deviceInfo.name,
          code: 1, // 离线
          content: `设备已离线`,
          time: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
          type: '操作',
        }
        this.$store.state.websocket.notificationList.unshift(obj)
        return
      }
      if (!this.omniForcedSatus) {
        if (this.loading) {
          this.$message.warning('正在请求接口，请稍等。。。')
          // 防止点击多次调用接口
          return
        }
        this.loading = true
        forcedDevice({
          deviceId: this.deviceInfo.id,
          interval: this.interstrike,
        })
          .then((res) => {
            this.loading = false
            if (res.code === 0) {
              this.omniForcedSatus = true
              this.omniExpelStatus = false
              this.$message.success('已开启迫降')
            }
          })
          .catch(() => {
            this.loading = false
            this.omniForcedSatus = false
          })
      } else {
        if (this.loading) {
          this.$message.warning('正在请求接口，请稍等。。。')
          // 防止点击多次调用接口
          return
        }
        this.loading = true
        JamminStop({
          deviceId: this.deviceInfo.id,
        })
          .then((res) => {
            this.loading = false
            if (res.code === 0) {
              this.omniForcedSatus = false
              this.$message.success('已关闭驱离')
            }
          })
          .catch(() => {
            this.loading = false
            this.omniForcedSatus = true
          })
      }
    },
    // 面阵 驱离
    orientexpel() {
      if (this.deviceInfo.code == 1) {
        this.$message.error('设备已离线')
        const obj = {
          device_id: this.deviceInfo.id,
          posName: this.deviceInfo.posName,
          name: this.deviceInfo.name,
          code: 1, // 离线
          content: `设备已离线`,
          time: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
          type: '操作',
        }
        this.$store.state.websocket.notificationList.unshift(obj)
        return
      }
      if (this.loading) {
        // 防止点击多次调用接口
        this.$message.warning('正在请求，请稍等。。。')
        return
      }
      this.loading = true
      if (!this.orientExpelStatus) {
        expelDevice({
          deviceId: this.deviceInfo.id,
          interval: this.interstrike,
        })
          .then((res) => {
            this.loading = false
            if (res.code === 0) {
              this.orientExpelStatus = true
              this.orientForcedStatus = false
              this.$message.success('已开启驱离')
            }
          })
          .catch(() => {
            this.loading = false
          })
      } else {
        // 关闭驱离
        JamminStop({
          deviceId: this.deviceInfo.id,
        })
          .then((res) => {
            this.loading = false
            if (res.code === 0) {
              this.orientExpelStatus = false
              this.$message.success('已关闭驱离')
            }
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    // 面阵 迫降
    orientforced() {
      if (this.deviceInfo.code == 1) {
        this.$message.error('设备已离线')
        const obj = {
          device_id: this.deviceInfo.id,
          posName: this.deviceInfo.posName,
          name: this.deviceInfo.name,
          code: 1, // 离线
          content: `设备已离线`,
          time: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
          type: '操作',
        }
        this.$store.state.websocket.notificationList.unshift(obj)
        return
      }
      if (this.loading) {
        // 防止点击多次调用接口
        this.$message.warning('正在请求，请稍等。。。')
        return
      }
      this.loading = true
      if (!this.orientForcedStatus) {
        forcedDevice({
          deviceId: this.deviceInfo.id,
          interval: this.interstrike,
        })
          .then((res) => {
            this.loading = false
            if (res.code === 0) {
              this.orientForcedStatus = true
              this.orientExpelStatus = false
              this.$message.success('已开启迫降')
            }
          })
          .catch(() => {
            this.loading = false
          })
      } else {
        // 关闭迫降
        JamminStop({
          deviceId: this.deviceInfo.id,
        })
          .then((res) => {
            this.loading = false
            if (res.code === 0) {
              this.orientForcedStatus = false
              this.$message.success('已关闭迫降')
            }
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    // 面阵 转台转向
    directClick(direct) {
      if (this.deviceInfo.code == 1) {
        this.$message.error('设备已离线')
        const obj = {
          device_id: this.deviceInfo.id,
          posName: this.deviceInfo.posName,
          name: this.deviceInfo.name,
          code: 1, // 离线
          content: `设备已离线`,
          time: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
          type: '操作',
        }
        this.$store.state.websocket.notificationList.unshift(obj)
        return
      }
      let turnId
      if (this.deviceInfo.detail.static_data['转台id']) {
        turnId = this.deviceInfo.detail.static_data['转台id'].value
      }
      if (!turnId) {
        this.$message.warning('未找到转台')
        return
      }
      if (direct === 'stop') {
        clearTimeout(this.timer)
        this.orientStopStatus = true
        if (!this.orientStopStatus) {
          turnStop({
            deviceId: turnId,
          }).then((res) => {
            if (res.code === 0) {
              this.$message.success('转台停止转动成功')
            }
          })
        }
        this.dirChecked = ''
      } else {
        this.dirChecked = direct
        let direction = ''
        let value = ''
        if (direct === 'left' || direct === 'right') {
          clearTimeout(item.timer)
          direction = 'hor'
          value = direct
        } else if (direct === 'up' || direct === 'down') {
          clearTimeout(item.timer)
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
                this.deviceInfo.angle =
                  this.deviceInfo.angle == undefined ? 0 : this.deviceInfo.angle
                const du = direct === 'right' ? 10 : -10
                this.directRound(0, du)
              }
            }
          })
          .catch(() => {
            this.dirChecked = ''
          })
      }
    },
    // 转台到指定角度
    rotateArrow(angle) {
      if (this.deviceInfo.code == 1) {
        this.$message.error('设备已离线')
        const obj = {
          device_id: this.deviceInfo.id,
          posName: this.deviceInfo.posName,
          name: this.deviceInfo.name,
          code: 1, // 离线
          content: `设备已离线`,
          time: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
          type: '操作',
        }
        this.$store.state.websocket.notificationList.unshift(obj)
        return
      }
      this.dirChecked = ''
      let turnId
      if (this.deviceInfo.detail.static_data['转台id']) {
        turnId = this.deviceInfo.detail.static_data['转台id'].value
      }
      if (!turnId) {
        this.$message.warning('未找到转台')
        return
      }
      if (this.loading) {
        this.$message.warning('正在请求，请稍等。。。')
        return
      }
      this.loading = true
      this.deviceInfo.angle =
        this.deviceInfo.angle == undefined ? 0 : this.deviceInfo.angle
      let du
      if (this.deviceInfo.angle < angle) {
        if (
          Math.abs(angle - this.deviceInfo.angle) <
          Math.abs(angle - (this.deviceInfo.angle + 360))
        ) {
          du = 10
        } else {
          du = -10
        }
      } else if (
        Math.abs(angle - this.deviceInfo.angle) <
        Math.abs(angle + 360 - this.deviceInfo.angle)
      ) {
        du = -10
      } else {
        du = 10
      }
      turnAngle({
        deviceId: turnId,
        angle,
      })
        .then((res) => {
          this.loading = false
          if (res.code === 0) {
            this.deviceInfo.angle = angle
            this.$refs.imgArrow.style.transform = `rotate(${angle}deg)`
            this.$message.success('设置转台到指定角度成功')
            // this.directRound(angle, du)
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 转台转动
    directRound(toAngle, dire = -10) {
      const deviceOption = {
        lng: this.deviceInfo.detail.static_data.longitude
          ? this.deviceInfo.detail.static_data.longitude.value
          : 0,
        lat: this.deviceInfo.detail.static_data.latitude
          ? this.deviceInfo.detail.static_data.latitude.value
          : 0,
        alt: this.deviceInfo.detail.static_data.altitude
          ? this.deviceInfo.detail.static_data.altitude.value
          : 0,
        radius: 3000,
        type: this.deviceInfo.detail.type,
        id: this.deviceInfo.id,
      }
      this.timer = setInterval(() => {
        if (toAngle) {
          if (this.deviceInfo.angle % 360 == toAngle) {
            clearTimeout(this.timer)
          } else {
            if (this.deviceInfo.angle >= 360) {
              this.deviceInfo.angle %= 360
            } else if (this.deviceInfo.angle < 0) {
              this.deviceInfo.angle += 360
            } else {
              this.deviceInfo.angle += dire
            }
            deviceOption.startAngle = -150 + this.deviceInfo.angle
            deviceOption.endAngle = -30 + this.deviceInfo.angle
            loadDeviceSpecial(deviceOption, true)
          }
        } else {
          if (this.deviceInfo.angle >= 360) {
            this.deviceInfo.angle %= 360
          } else if (this.deviceInfo.angle <= 0) {
            this.deviceInfo.angle += 360
          } else {
            this.deviceInfo.angle += dire
          }
          deviceOption.startAngle = -150 + this.deviceInfo.angle
          deviceOption.endAngle = -30 + this.deviceInfo.angle
          loadDeviceSpecial(deviceOption, true)
        }
      }, 500)
    },
    // 协议破解 宽带打击
    frequencyBtn(value) {
      if (this.deviceInfo.code == 1) {
        this.$message.error('设备已离线')
        const obj = {
          device_id: this.deviceInfo.id,
          posName: this.deviceInfo.posName,
          name: this.deviceInfo.name,
          code: 1, // 离线
          content: `设备已离线`,
          time: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
          type: '操作',
        }
        this.$store.state.websocket.notificationList.unshift(obj)
        return
      }
      const params = {
        deviceId: this.deviceInfo.id,
        band: '',
        open: false,
      }
      if (value === '0.9') {
        params.band = 'band9'
        params.open = !this.frequencyOpn
        if (this.loadingOpn) {
          // 防止点击多次调用接口
          this.$message.warning('正在请求接口，请稍等。。。')
          return
        }
        this.loadingOpn = true
      } else if (value === '1.5') {
        params.band = 'band15'
        params.open = !this.frequencyOpf
        if (this.loadingOpf) {
          // 防止点击多次调用接口
          this.$message.warning('正在请求接口，请稍等。。。')
          return
        }
        this.loadingOpf = true
      } else if (value === '2.4') {
        params.band = 'band24'
        params.open = !this.frequencyTpf
        if (this.loadingTpf) {
          // 防止点击多次调用接口
          this.$message.warning('正在请求接口，请稍等。。。')
          return
        }
        this.loadingTpf = true
      } else if (value === '5.8') {
        params.band = 'band58'
        params.open = !this.frequencyEpf
        if (this.loadingEpf) {
          // 防止点击多次调用接口
          this.$message.warning('正在请求接口，请稍等。。。')
          return
        }
        this.loadingEpf = true
      }
      broadbandStrike(params)
        .then((res) => {
          if (res.code === 0) {
            // 频段按钮是否高亮
            if (value === '0.9') {
              this.loadingOpn = false
              this.frequencyOpn = params.open
            } else if (value === '1.5') {
              this.loadingOpf = false
              this.frequencyOpf = params.open
            } else if (value === '2.4') {
              this.loadingTpf = false
              this.frequencyTpf = params.open
            } else if (value === '5.8') {
              this.loadingEpf = false
              this.frequencyEpf = params.open
            }
            this.$message.success(
              params.open ? '宽带打击已开启' : '宽带打击已关闭'
            )
          }
        })
        .catch(() => {
          this.loadingOpn = false
          this.loadingOpf = false
          this.loadingTpf = false
          this.loadingEpf = false
        })
    },
    // 光电 驱离
    photoelecexpel() {
      if (this.deviceInfo.code == 1) {
        this.$message.error('设备已离线')
        const obj = {
          device_id: this.deviceInfo.id,
          posName: this.deviceInfo.posName,
          name: this.deviceInfo.name,
          code: 1, // 离线
          content: `设备已离线`,
          time: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
          type: '操作',
        }
        this.$store.state.websocket.notificationList.unshift(obj)
        return
      }
      if (!this.photoelecExpelStatus) {
        if (this.loading) {
          this.$message.warning('正在请求接口，请稍等。。。')
          // 防止点击多次调用接口
          return
        }
        this.loading = true
        expelElectronic({
          deviceId: this.deviceInfo.id,
        })
          .then((res) => {
            this.loading = false
            if (res.code === 0) {
              this.photoelecExpelStatus = true
              this.photoelecForcedStatus = false
              this.$message.success('已开启驱离')
            }
          })
          .catch(() => {
            this.loading = false
            this.photoelecExpelStatus = false
          })
      } else {
        if (this.loading) {
          // 防止点击多次调用接口
          this.$message.warning('正在请求接口，请稍等。。。')
          return
        }
        this.loading = true
        stopElectronic({
          deviceId: this.deviceInfo.id,
        })
          .then((res) => {
            this.loading = false
            if (res.code === 0) {
              this.photoelecExpelStatus = false
              this.$message.success('已关闭驱离')
            }
          })
          .catch(() => {
            this.loading = false
            this.photoelecExpelStatus = true
          })
      }
    },
    // 光电 迫降
    photoelecforced() {
      if (this.deviceInfo.code == 1) {
        this.$message.error('设备已离线')
        const obj = {
          device_id: this.deviceInfo.id,
          posName: this.deviceInfo.posName,
          name: this.deviceInfo.name,
          code: 1, // 离线
          content: `设备已离线`,
          time: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
          type: '操作',
        }
        this.$store.state.websocket.notificationList.unshift(obj)
        return
      }
      if (!this.photoelecForcedStatus) {
        if (this.loading) {
          this.$message.warning('正在请求接口，请稍等。。。')
          // 防止点击多次调用接口
          return
        }
        this.loading = true
        forcedElectronic({
          deviceId: this.deviceInfo.id,
        })
          .then((res) => {
            this.loading = false
            if (res.code === 0) {
              this.photoelecExpelStatus = false
              this.photoelecForcedStatus = true
              this.$message.success('已开启迫降')
            }
          })
          .catch(() => {
            this.loading = false
            this.photoelecForcedStatus = false
          })
      } else {
        if (this.loading) {
          // 防止点击多次调用接口
          this.$message.warning('正在请求接口，请稍等。。。')
          return
        }
        this.loading = true
        stopElectronic({
          deviceId: this.deviceInfo.id,
        })
          .then((res) => {
            this.loading = false
            if (res.code === 0) {
              this.photoelecForcedStatus = false
              this.$message.success('已关闭迫降')
            }
          })
          .catch(() => {
            this.loading = false
            this.photoelecForcedStatus = true
          })
      }
    },
  },
}
</script>
<style lang="scss">
.tree-custom {
  display: flex;
  position: relative;
  align-items: center;
  height: 100%;
  .node-label {
    display: flex;
    align-items: center;
    margin-left: 60px;
    // min-width: 200px;
    width: 200px;
    // &::after {
    //   border-left: 2px solid #a0a0a0;
    //   content: '';
    //   position: absolute;
    //   bottom: 50%;
    //   left: 0;
    //   width: 60px;
    //   height: 50%;
    // }
  }
  .tree-custom-node {
    display: flex;
    flex-direction: column;
    margin-right: 10px;
    height: 100%;

    // div:first-child {
    //   > .node-label {
    //     &::after {
    //       border-left: none;
    //     }
    //   }
    // }
    // div:last-child {
    //   &::after {
    //     border-left: none;
    //   }
    // }
  }
  .tree-container {
    width: 1250px;
    height: 784px;
    overflow-x: scroll;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      background: #4fe7cb;
    }
    &::-webkit-scrollbar-corner {
      /*滚动条里面小方块*/
      background: #0c292b;
    }
  }
  // &::before {
  //   border-top: 2px solid #a0a0a0;
  //   content: '';
  //   position: absolute;
  //   bottom: 0;
  //   left: 0;
  //   width: 60px;
  //   height: 50%;
  // }
  // &::after {
  //   border-left: 2px solid #a0a0a0;
  //   content: '';
  //   position: absolute;
  //   bottom: 0;
  //   left: 0;
  //   width: 60px;
  //   height: 50%;
  // }
  .node-label {
    width: 195px;
    height: 50px;
    background-color: rgba(24, 186, 188, 0.3);
    border: 1px solid #18babc;
    display: flex;
    justify-content: space-around;
    // flex: 1;
    &.normal {
      background-color: rgba(46, 140, 129, 0.3);
      border: 1px solid #2e8c81;
    }
    &.drop {
      background-color: rgba(185, 116, 61, 0.3);
      border: 1px solid #b9743d;
    }
    &.pojiang {
      background-color: rgba(33, 98, 158, 0.3);
      border: 1px solid #21629e;
    }
    &.baojing {
      background-color: rgba(3177, 44, 44, 0.3);
      border: 1px solid #b12c2c;
    }
  }
  // "lat":46,"lng":109,"alt":40000000,"heading":0,"pitch":-90
  .node-label-first {
    width: 60px;
    height: 280px;

    display: flex;
    justify-content: center;
    flex-direction: column;
    .label {
      writing-mode: vertical-rl;
      text-align: center;
      margin-bottom: 20px;
    }
    background-color: rgba(24, 186, 188, 0.3);
    border: 1px solid #18babc;
  }
  .last_node {
    display: flex;
    flex-direction: row;
    width: 255px;
    .node-label {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: flex-start;
      padding: 0 20px;
      .label_bottom {
        display: flex;
        width: 100%;
        justify-content: space-between;
      }
    }
  }
  .border-right {
    &::before {
      border-top: 2px solid #02a7f0;
      content: '';
      position: absolute;
      bottom: 0;
      left: 120px;
      width: 30px;
      height: 50%;
    }
  }
  .border-right {
    &::before {
      border-top: 2px solid #02a7f0;
      content: '';
      position: absolute;
      bottom: 0;
      left: 255px;
      width: 30px;
      height: 50%;
    }
  }
  .border-left {
    &::after {
      border-top: 2px solid #02a7f0;
      content: '';
      position: absolute;
      bottom: 0;
      left: 30px;
      width: 30px;
      height: 50%;
    }
  }
  .border-top {
    &::before {
      border-left: 2px solid #02a7f0;
      content: '';
      position: absolute;
      top: 0;
      left: 30px;
      width: 30px;
      height: 50%;
    }
  }
  .border-bottom {
    &::after {
      border-left: 2px solid #02a7f0;
      content: '';
      position: absolute;
      bottom: 0;
      left: 30px;
      width: 30px;
      height: 50%;
    }
  }
  .node-label-first.border-right {
    &::before {
      left: 120px;
    }
  }
  .device-information {
    width: 350px;
    height: 700px;
    margin-left: 20px;
    border: 2px solid #696969;
    .device-name {
      margin-top: 20px;
      margin-left: 40px;
    }
    .device-item {
      margin-top: 10px;
      margin-left: 20px;
      .online {
        color: #18babc;
      }
      .offline {
        color: #b12c2c;
      }
    }
    .operation-container {
      margin: 20px;
      height: 24px;
      .deviceOperation {
        position: relative;
        .name {
          font-size: 12px;
          color: #cefcff;
          font-weight: 400;
          letter-spacing: 1px;
          display: inline-block;
          line-height: 24px;
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
          position: absolute;
          top: 0;
          left: 145px;
          cursor: pointer;
        }
        .device-forced {
          position: absolute;
          top: 0;
          left: 176px;
          cursor: pointer;
        }
        // 诱导样式
        .induce-direction {
          display: block;
          position: relative;
          height: 110px;
          width: 200px;
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
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
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
            position: relative;
            top: 28%;
            left: 47%;
            width: 10px;
            transform-origin: center bottom;
            transform: rotate(0);
          }
        }
        // 面阵
        .orient-direction {
          display: block;
          position: relative;
          height: 110px;
          width: 200px;
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
            left: 57%;
            transform: translate(-50%, -50%);
            z-index: 2;
          }
          .bottomImg {
            position: absolute;
            top: 63%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 2;
          }
          .leftImg {
            position: absolute;
            top: 50%;
            left: 42.5%;
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
          .imgArrow {
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
        // 协议破解
        .protocol-direction {
          width: 200px;
          .title {
            width: 100%;
            line-height: 24px;
            color: #cefcff;
          }
          .broad-strike {
            width: 100%;
            height: 24px;
            display: flex;
            justify-content: center;
            .title {
              width: 100%;
              color: #cefcff;
            }
            .strikeBtn {
              display: inline-block;
              width: 200px;
              display: flex;
              justify-content: center;
              margin-right: 17px;
              .name {
                font-size: 12px;
                color: #cefcff;
                font-weight: 400;
                letter-spacing: 1px;
                display: inline-block;
                line-height: 24px;
                max-width: 110px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
              div {
                cursor: pointer;
                width: 24px;
                height: 24px;
                margin-right: 7px;
                img {
                  width: 100%;
                  height: 100%;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
