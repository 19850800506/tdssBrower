<template>
  <div id="lunbo">
    <div class="device-ms">
      <div>
        <div class="lunbo_content">
          <slot></slot>
        </div>
      </div>
      <div class="device-status">
        <div
          class="img-box"
          v-for="(item, index) in online.data"
          :key="index"
          @click="deviceChange(index, item)"
        >
          <div class="box-item">
            <div
              class="img-border"
              :style="{
                border:
                  currentIndex == index
                    ? '1px solid  #ffffff'
                    : '1px solid #1E90FF',
              }"
            ></div>
            <img :src="initColor(item)" />
          </div>
          <!-- <div v-show="index == 1" class="box-item" @click="activeIndex = 1">
            <div
              class="img-border"
              :style="{
                border:
                  activeIndex == 1 ? '1px solid #1E90FF' : '1px solid #ffffff',
              }"
            ></div>
            <img src="../../assets/images/EqDetails/startDevice.png" />
          </div>
          <div v-show="index == 2" class="box-item" @click="activeIndex = 2">
            <div
              class="img-border"
              :style="{
                border:
                  activeIndex == 2 ? '1px solid #1E90FF' : '1px solid #ffffff',
              }"
            ></div>
            <img src="../../assets/images/EqDetails/runDevice.png" />
          </div>
          <div v-show="index == 3" class="box-item" @click="activeIndex = 3">
            <div
              class="img-border"
              :style="{
                border:
                  activeIndex == 3 ? '1px solid #1E90FF' : '1px solid #ffffff',
              }"
            ></div>
            <img src="../../assets/images/EqDetails/breakDevice.png" />
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

const findTarget = require('../../assets/images/EqDetails/findTarget.png') // 动画状态
const startDevice = require('../../assets/images/EqDetails/startDevice.png') // 在线 工作状态为normal
const runDevice = require('../../assets/images/EqDetails/runDevice.png') // 在线 未工作
const breakDevice = require('../../assets/images/EqDetails/breakDevice.png') // 离线状态

export default {
  props: ['online', 'currentIndex'],
  data() {
    return {
      // omniState: '',
      // guideState: '',
    }
  },
  computed: {
    ...mapGetters(['heatBeatList', 'serverdata', 'deviceType']),
  },
  watch: {
    // serverdata(newVal) {
    //   // 全向打击和GPS诱导设备
    //   this.omniObj = this.deviceType.find((el) => el.type === 'Omni')
    //   this.guideObj = this.deviceType.find((el) => el.type === 'Guide')
    //   // 监听定向干扰设备打击按钮的状态
    //   if (newVal.data.command === 'heartbeat') {
    //     if (this.omniObj) {
    //       this.omniObj.data.map((el) => {
    //         const data = newVal.data.data.find((ele) => ele.device_id === el.id)
    //         if (data) {
    //           // 在线
    //           if (data.code === 0) {
    //             if (data.state) {
    //               this.omniState = '开启'
    //             } else {
    //               this.omniState = '关闭'
    //             }
    //           }
    //         }
    //       })
    //     }
    //     if (this.guideObj) {
    //       this.guideObj.data.map((el) => {
    //         const data = newVal.data.data.find((ele) => ele.device_id === el.id)
    //         if (data) {
    //           // 在线
    //           if (data.code === 0) {
    //             if (data.state) {
    //               this.guideState = '开启'
    //             } else {
    //               this.guideState = '关闭'
    //             }
    //           }
    //         }
    //       })
    //     }
    //   }
    // },
  },
  mounted() {},
  methods: {
    // 轮播点位颜色
    initColor(item) {
      const device_heat = this.heatBeatList.find(
        (el) => el.device_id == item.id
      )
      item.animated = false
      if (device_heat) {
        if (device_heat.code === 0) {
          item.code = 0
          if (
            item.type === 'Detect' ||
            item.type === 'Omni' ||
            item.type === 'Guide'
          ) {
            item.animated = !!device_heat.state
          } else {
            item.animated = true
          }

          if (device_heat.state) {
            item.state = device_heat.state
            // 协议破解
            if (item.type === 'Crack') {
              if (JSON.parse(device_heat.state).SenorStatus === 'find') {
                // item.animated = true
                // 动画状态
                return findTarget
              }
              return runDevice
            }
            // AOA TDOA
            if (item.type === 'AOA' || item.type === 'TDOA') {
              if (device_heat.state === 'find') {
                // item.animated = false
                return findTarget
              }
              return runDevice
            }

            // 雷达
            if (item.type === 'Radar') {
              if (device_heat.state === 'find') {
                // item.animated = true
                return findTarget
              }
              return runDevice
            }
            // GPS诱导
            if (item.type === 'Guide') {
              // if (device_heat.code === 0) {
              //   item.animated = true
              // }
            }
            // 周扫
            if (item.type == 'Circular') {
              // item.animated = true
              // if (device_heat.code === 0) {
              //   item.animated = true
              // }
            }

            // 全向 定向
            if (item.type === 'Detect' || item.type === 'Omni') {
              if (
                device_heat.state === 'expel' ||
                device_heat.state === 'force'
              ) {
                // item.animated = true
                return findTarget
              }
              return runDevice
            }
          }
          return startDevice
        }
      }
      item.code = 1
      return breakDevice
    },
    // 点击轮播图 切换设备
    deviceChange(index, item) {
      // console.log(item, this.heatBeatList, 'deviceChange')
      this.$emit('update:currentIndex', index)
    },
  },
}
</script>
<style scoped lang="scss">
#lunbo {
  .device-ms {
    position: relative;
    margin-left: 5px;
    margin-top: 12px;
    .device-status {
      position: absolute;
      display: flex;
      left: 174px;
      bottom: 2px;
      .img-box {
        cursor: pointer;
        // margin-right: 2px;
        .box-item {
          position: relative;
          .img-border {
            position: absolute;
            top: 5px;
            width: 7px;
            height: 7px;
            border-radius: 100%;
          }
          img {
            margin-right: 2px;
            width: 6px;
            height: 6px;
          }
        }
      }
    }
  }
}
</style>
