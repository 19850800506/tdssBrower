<template>
  <div id="induce">
    <div class="induce" v-if="guideObj">
      <div class="induce-title">
        <span class="device-title">
          <img src="@/assets/icon/deviceOper/group.png" alt="" />
          <span>{{ guideObj.name }}</span>
        </span>
        <!-- <div class="no-fly" @click="noFlyChange">
          <el-tooltip
            v-show="!noFlyStatus"
            class="item"
            effect="dark"
            content="禁飞"
            placement="top"
          >
            <img
              src="@/assets/icon/deviceOper/GPSGuide/noFly-close.png"
              alt=""
            />
          </el-tooltip>
          <el-tooltip
            v-show="noFlyStatus"
            class="item"
            effect="dark"
            content="禁飞"
            placement="top"
          >
            <img
              src="@/assets/icon/deviceOper/GPSGuide/noFly-open.png"
              alt=""
            />
          </el-tooltip>
        </div> -->
        <!-- <div class="expel" @click="defenseChange">
          <el-tooltip
            v-show="!defenseStatus"
            class="item"
            effect="dark"
            content="防御"
            placement="top"
          >
            <img
              src="@/assets/icon/deviceOper/GPSGuide/defense-close.png"
              alt=""
            />
          </el-tooltip>
          <el-tooltip
            v-show="defenseStatus"
            class="item"
            effect="dark"
            content="防御"
            placement="top"
          >
            <img
              src="@/assets/icon/deviceOper/GPSGuide/defense-open.png"
              alt=""
            />
          </el-tooltip>
        </div> -->
        <img
          style="width: 100%; display: block"
          src="@/assets/icon/deviceOper/line.png"
          alt=""
        />
      </div>
      <div
        class="device-name"
        v-for="(item, index) in guideObj.data"
        :key="index"
      >
        <div class="icondown" @click="dropdownShow(item, index)">
          <img v-if="!item.openflag" src="../../assets/icon/caret-down-1.png" />
          <img v-if="item.openflag" src="../../assets/icon/caret-down.png" />
        </div>
        <span class="name" @click="flyTo(item)">{{ item.name }}</span>
        <!-- <div class="device-no-fly" @click="noFlyItemChange(item)">
          <el-tooltip
            v-show="!item.noFlyStatus"
            class="item"
            effect="dark"
            content="禁飞"
            placement="top"
          >
            <img
              src="@/assets/icon/deviceOper/GPSGuide/noFly-close.png"
              alt=""
            />
          </el-tooltip>
          <el-tooltip
            v-show="item.noFlyStatus"
            class="item"
            effect="dark"
            content="禁飞"
            placement="top"
          >
            <img
              src="@/assets/icon/deviceOper/GPSGuide/noFly-open.png"
              alt=""
            />
          </el-tooltip>
        </div> -->
        <div class="device-expel" @click="defenseItemChange(item, index)">
          <el-tooltip
            v-show="!item.defenseStatus"
            class="item"
            effect="dark"
            content="拒止"
            placement="top"
            :enterable="false"
          >
            <img
              src="@/assets/icon/deviceOper/GPSGuide/defense-close.png"
              alt=""
            />
          </el-tooltip>
          <el-tooltip
            v-show="item.defenseStatus"
            class="item"
            effect="dark"
            content="拒止"
            placement="top"
            :enterable="false"
          >
            <img
              src="@/assets/icon/deviceOper/GPSGuide/defense-open.png"
              alt=""
            />
          </el-tooltip>
        </div>
        <div class="device-forced" @click="expelItemChange(item, index)">
          <el-tooltip
            v-show="!item.expelStatus"
            class="item"
            effect="dark"
            content="驱离"
            placement="top"
            :enterable="false"
          >
            <img
              src="@/assets/icon/deviceOper/GPSGuide/expel-close.png"
              alt=""
            />
          </el-tooltip>
          <el-tooltip
            v-show="item.expelStatus"
            class="item"
            effect="dark"
            content="驱离"
            placement="top"
            :enterable="false"
          >
            <img
              src="@/assets/icon/deviceOper/GPSGuide/expel-open.png"
              alt=""
            />
          </el-tooltip>
        </div>
        <div class="direction" v-show="item.openflag">
          <div class="centImg">
            <img
              src="@/assets/icon/deviceOper/GPSGuide/center-spot.png"
              alt=""
            />
          </div>
          <div class="leftTopImg" @click="arrowRotate(300, 8, item, index)">
            <img src="@/assets/icon/deviceOper/direction-spot.png" alt="" />
          </div>
          <div class="leftCenterImg" @click="arrowRotate(270, 7, item, index)">
            <img src="@/assets/icon/deviceOper/direction-spot.png" alt="" />
          </div>
          <div class="leftBottomImg" @click="arrowRotate(240, 6, item, index)">
            <img src="@/assets/icon/deviceOper/direction-spot.png" alt="" />
          </div>
          <div class="centerTopImg" @click="arrowRotate(0, 1, item, index)">
            <img src="@/assets/icon/deviceOper/direction-spot.png" alt="" />
          </div>
          <div
            class="centerBottomImg"
            @click="arrowRotate(180, 5, item, index)"
          >
            <img src="@/assets/icon/deviceOper/direction-spot.png" alt="" />
          </div>
          <div class="rightTopImg" @click="arrowRotate(60, 2, item, index)">
            <img src="@/assets/icon/deviceOper/direction-spot.png" alt="" />
          </div>
          <div class="rightCenterImg" @click="arrowRotate(90, 3, item, index)">
            <img src="@/assets/icon/deviceOper/direction-spot.png" alt="" />
          </div>
          <div class="rightBottomImg" @click="arrowRotate(120, 4, item, index)">
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
import {
  guideExpel,
  guideDefense,
  guideStop,
  JamminStop,
} from '@/api/operation/operation'
import { parseTime } from '@/utils/index.js'

export default {
  props: ['guideObj'],
  computed: {
    ...mapGetters(['serverdata', 'disabledState']),
  },
  watch: {
    serverdata(newVal) {
      // 根据心跳监听gps诱导按钮状态的状态
      if (newVal.data.command === 'heartbeat' && this.guideObj) {
        this.guideObj.data.map((el, index) => {
          const data = newVal.data.data.find((ele) => ele.device_id === el.id)
          if (data && !this.gpsCloseHttp[el.id]) {
            if (data.code === 0) {
              el.code = 0
              // 设备在线
              if (data.state === 'defense') {
                // 防御状态
                this.$set(el, 'defenseStatus', true)
                this.$set(el, 'expelStatus', false)
                this.$refs.arrowImg[index].style.transform = `rotate(0deg)`
              } else if (data.state && data.state.split('_')[0] === 'expel') {
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
                this.$set(el, 'defenseStatus', false)
                this.$set(el, 'expelStatus', true)
                // this.$set(el, 'openflag', true)

                this.$refs.arrowImg[
                  index
                ].style.transform = `rotate(${angle}deg)`
              } else {
                // 其他状态 normal 或者为空
                this.$set(el, 'defenseStatus', false)
                this.$set(el, 'expelStatus', false)
                this.$refs.arrowImg[index].style.transform = `rotate(0deg)`
              }
            } else {
              el.code = 1
              // 设备离线 取消防御、驱离高亮，重置方向箭头
              this.$set(el, 'defenseStatus', false)
              this.$set(el, 'expelStatus', false)
              this.$refs.arrowImg[index].style.transform = `rotate(0deg)`
            }
          }
        })
      }
    },
  },
  data() {
    return {
      noFlyStatus: false,
      defenseStatus: false,
      gpsCloseHttp: {}, // 操作设备后，暂时停止监听该设备的心跳
    }
  },
  methods: {
    // 视角跳转
    flyTo(item) {
      console.log(item, 'item22')
      // 操作被更高级别用户占用
      if (this.$store.state.setting.doStatusShow) {
        return
      }
      if (item.detail.static_data.latitude) {
        window.CesiumSdk.Camera().flyToPoint({
          lat: item.detail.static_data.latitude.value,
          lng: item.detail.static_data.longitude.value,
          alt: 0,
          radius: 15000,
          heading: 0,
          pitch: -60,
        })
      }
    },
    noFlyChange() {
      this.noFlyStatus = !this.noFlyStatus
    },
    // 下拉图标
    dropdownShow(item, index) {
      // 操作被更高级别用户占用
      if (this.$store.state.setting.doStatusShow) {
        return
      }
      this.$set(item, 'openflag', !item.openflag)
      // 关闭其他展开
      this.guideObj.data.forEach((el, i) => {
        if (index !== i) {
          this.$set(el, 'openflag', false)
        }
      })
    },
    noFlyItemChange(item) {
      if (!item.noFlyStatus) {
        this.$set(item, 'noFlyStatus', true)
      } else {
        this.$set(item, 'noFlyStatus', false)
      }
    },
    defenseChange() {
      this.defenseStatus = !this.defenseStatus
    },
    // 单个GPS诱导防御操作 开启关闭
    defenseItemChange(item, index) {
      // 用户没有权限
      if (this.disabledState) {
        this.$message.warning('该用户没有权限')
        return
      }
      // 操作被更高级别用户占用
      if (this.$store.state.setting.doStatusShow) {
        return
      }
      if (item.code == 1) {
        this.$message.error('设备已离线')
        const obj = {
          device_id: item.id,
          posName: item.posName,
          name: item.name,
          code: 1, // 离线
          content: `设备已离线`,
          time: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
          type: '操作',
        }
        this.$store.state.websocket.notificationList.unshift(obj)
        return
      }
      if (!item.defenseStatus) {
        if (item.loading) {
          // 防止点击多次调用接口
          this.$message.warning('正在请求，请稍等。。。')
          return
        }
        item.loading = true

        // 开启防御 防御高亮，取消驱离高亮
        guideDefense({
          deviceId: item.id,
        })
          .then((res) => {
            item.loading = false
            if (res.code === 0) {
              this.$set(item, 'defenseStatus', true)
              this.$refs.arrowImg[index].style.transform = `rotate(0deg)`
              this.$set(item, 'expelStatus', false)
              this.$set(item, 'openflag', false)
              this.$message.success('已开启防御')

              this.closeGuideHttp(item)
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch(() => {
            item.loading = false
          })
      } else {
        if (item.loading) {
          // 防止点击多次调用接口
          return
        }
        item.loading = true
        // 关闭防御 取消防御高亮
        guideStop({
          deviceId: item.id,
        })
          .then((res) => {
            item.loading = false
            if (res.code === 0) {
              this.$set(item, 'defenseStatus', false)
              this.$message.success('已关闭防御')
              this.closeGuideHttp(item)
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch(() => {
            item.loading = false
          })
      }
    },
    expelItemChange(item, index) {
      // 用户没有权限
      if (this.disabledState) {
        this.$message.warning('该用户没有权限')
        return
      }
      // 操作被更高级别用户占用
      if (this.$store.state.setting.doStatusShow) {
        return
      }
      if (!item.expelStatus) {
        // 驱离未高亮点击 展开收缩方向
        this.dropdownShow(item, index)
      } else {
        // 驱离高亮时点击关闭gps诱导
        if (item.loading) {
          // 防止点击多次调用接口
          return
        }
        item.loading = true

        guideStop({
          deviceId: item.id,
        })
          .then((res) => {
            item.loading = false
            if (res.code === 0) {
              this.$set(item, 'expelStatus', false)
              this.$message.success('已关闭驱离')
              this.$refs.arrowImg[index].style.transform = `rotate(0deg)`
              this.closeGuideHttp(item)
              this.$set(item, 'openflag', false)
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch(() => {
            item.loading = false
          })
      }
    },
    // 操作点击方向按钮，开启驱离，驱离按钮高亮
    arrowRotate(angle, direction, item, index) {
      // 用户没有权限
      if (this.disabledState) {
        this.$message.warning('该用户没有权限')
        return
      }
      if (item.code == 1) {
        this.$message.error('设备已离线')
        const obj = {
          device_id: item.id,
          posName: item.posName,
          name: item.name,
          code: 1, // 离线
          content: `设备已离线`,
          time: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
          type: '操作',
        }
        this.$store.state.websocket.notificationList.unshift(obj)
        return
      }
      if (item.loading) {
        // 防止点击多次调用接口
        this.$message.warning('正在请求接口，请稍等。。。')
        return
      }
      item.loading = true
      guideExpel({
        deviceId: item.id,
        direction,
      })
        .then((res) => {
          item.loading = false
          if (res.code === 0) {
            this.$set(item, 'defenseStatus', false)
            this.$set(item, 'expelStatus', true)
            this.$refs.arrowImg[index].style.transform = `rotate(${angle}deg)`
            this.$message.success('已开启驱离')

            this.closeGuideHttp(item)
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(() => {
          this.$set(item, 'expelStatus', false)
          this.$refs.arrowImg[index].style.transform = `rotate(0deg)`
          item.loading = false
        })
    },
    // 操作设备后停止监听设备心跳，防止按钮闪烁
    closeGuideHttp(item) {
      this.gpsCloseHttp[item.id] = true
      clearTimeout(this.gpsCloseHttp[`${item.id}_timer`])
      this.gpsCloseHttp[`${item.id}_timer`] = null
      this.gpsCloseHttp[`${item.id}_timer`] = setTimeout(() => {
        this.gpsCloseHttp[item.id] = false
      }, 10000)
    },
  },
}
</script>
<style scoped lang="scss">
#induce {
  pointer-events: auto;
  .induce {
    width: 250px;
    /* height: 208px; */
    margin-top: 10px;
    // background-image: url(../../assets/images/control/bg_\(3\).png);
    background-image: url('../../assets/icon/deviceOper/long-background.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: 0 0;
    padding-bottom: 30px;
    .induce-title {
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
      .no-fly {
        position: absolute;
        top: 12px;
        right: 79px;
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
          width: 100%;
          height: 100%;
        }
      }
      // .title {
      //   width: 100%;
      //   height: 100%;
      //   margin-left: 2px;
      //   line-height: 36px;
      //   color: #cefcff;
      // }
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
        cursor: pointer;
        width: 24px;
        height: 24px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .device-no-fly {
        position: absolute;
        top: 6px;
        right: 79px;
      }
      .device-expel {
        position: absolute;
        top: 6px;
        right: 48px;
      }
      .device-forced {
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
    }
  }
}
</style>
