<template>
  <div id="guangdian">
    <div class="guangdianbox" @click="flyTo()" @dblclick="enlargeclick">
      <el-tooltip
        popper-class="message-alert"
        placement="top"
        effect="dark"
        :enterable="false"
      >
        <div slot="content" class="message-box">
          <div class="message">
            <span>{{ device.posName + device.name }}</span>
            <span>{{ device.code === 0 ? '在线' : '离线' }}</span>
          </div>
        </div>
        <div
          style="position: absolute; height: 90%; width: 100%; z-index: 100"
        ></div>
      </el-tooltip>
      <div class="videobox">
        <Video
          v-show="!enlargeflag"
          :deviceId="device"
          type="smallwindow"
        ></Video>
        <img
          class="videoImg"
          v-show="enlargeflag"
          src="@/assets/images/broadcast.png"
        />
      </div>
    </div>
    <div v-dialogDrag class="photoelectricity" v-if="enlargeflag">
      <div class="headerbg dialog_header">
        <img src="../../assets/images/radarImage/Log.png" class="imglogo" />
        <span>光电</span>
      </div>
      <img
        @click="enlargeflag = false"
        src="../../assets/images/radarImage/Close.png"
        class="imgclose"
      />
      <div class="photoelectricitybox">
        <div class="cameraControl">
          <div class="control">
            <div
              class="topImg"
              @mousedown="turnbutton('up')"
              @mouseup="stopbutton('up')"
            >
              <img
                v-show="upturn"
                src="@/assets/icon/deviceOper/direct/top-click.png"
                alt=""
              />
              <img
                v-show="!upturn"
                src="@/assets/icon/deviceOper/direct/top-normal.png"
                alt=""
              />
            </div>
            <div
              class="rightImg"
              @mousedown="turnbutton('right')"
              @mouseup="stopbutton('right')"
            >
              <img
                v-show="rightturn"
                src="@/assets/icon/deviceOper/direct/right-click.png"
                alt=""
              />
              <img
                v-show="!rightturn"
                src="@/assets/icon/deviceOper/direct/right-normal.png"
                alt=""
              />
            </div>
            <div
              class="bottomImg"
              @mousedown="turnbutton('down')"
              @mouseup="stopbutton('down')"
            >
              <img
                v-show="downturn"
                src="@/assets/icon/deviceOper/direct/bottom-click.png"
                alt=""
              />
              <img
                v-show="!downturn"
                src="@/assets/icon/deviceOper/direct/bottom-normal.png"
                alt=""
              />
            </div>
            <div
              class="leftImg"
              @mousedown="turnbutton('left')"
              @mouseup="stopbutton('left')"
            >
              <img
                v-show="leftturn"
                src="@/assets/icon/deviceOper/direct/left-click.png"
                alt=""
              />
              <img
                v-show="!leftturn"
                src="@/assets/icon/deviceOper/direct/left-normal.png"
                alt=""
              />
            </div>
          </div>
        </div>
        <div class="video">
          <Video :deviceId="device" type="largewindow"></Video>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { cameraTrun } from '../../api/operation/operation'
import { parseTime } from '@/utils/index.js'
import Video from './video.vue'

export default {
  props: ['device'],
  data() {
    return {
      enlargeflag: false,
      upturn: false,
      rightturn: false,
      downturn: false,
      leftturn: false,
      clickTime: null,
    }
  },
  components: {
    Video,
  },
  methods: {
    flyTo() {
      clearTimeout(this.clickTime)
      // 执行延时
      this.clickTime = setTimeout(() => {
        if (this.device.detail.static_data.latitude) {
          window.CesiumSdk.Camera().flyToPoint({
            lat: this.device.detail.static_data.latitude.value,
            lng: this.device.detail.static_data.longitude.value,
            alt: 0,
            radius: 15000,
            heading: 0,
            pitch: -60,
          })
        }
      }, 250)
    },
    enlargeclick() {
      clearTimeout(this.clickTime)
      this.enlargeflag = true
    },
    turnbutton(direction) {
      if (this.device.code == 1) {
        this.$message.error('设备已离线')
        const obj = {
          device_id: this.device.id,
          posName: this.device.posName,
          name: this.device.name,
          code: 1, // 离线
          content: `设备已离线`,
          time: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
          type: '操作',
        }
        this.$store.state.websocket.notificationList.unshift(obj)
        return
      }
      if (direction == 'up') {
        this.upturn = true
      } else if (direction == 'right') {
        this.rightturn = true
      } else if (direction == 'down') {
        this.downturn = true
      } else if (direction == 'left') {
        this.leftturn = true
      }
      const params = {
        deviceId: this.device.id,
        direction,
        mouseType: 0,
      }
      cameraTrun(params).then((res) => {
        console.log(res, 'res')
      })
    },
    stopbutton(direction) {
      if (this.device.code == 1) {
        return
      }
      if (direction == 'up') {
        this.upturn = false
      } else if (direction == 'right') {
        this.rightturn = false
      } else if (direction == 'down') {
        this.downturn = false
      } else if (direction == 'left') {
        this.leftturn = false
      }
      const params = {
        deviceId: this.device.id,
        direction,
        mouseType: 1,
      }
      cameraTrun(params).then((res) => {
        console.log(res, 'res')
      })
    },
  },
}
</script>
<style scoped lang="scss">
#guangdian {
  position: relative;
  width: 212px;
  height: 151px;
  background-size: 100% 100%;
  background-image: url('../../assets/images/EqDetails/zhousao.png');
  .guangdianbox {
    width: 100%;
    height: 100%;
    cursor: pointer;
    display: flex;
    .videobox {
      width: 85%;
      height: 76%;
      margin-top: 13px;
      margin-left: 17px;
      .videoImg {
        width: 50%;
        display: block;
        margin: auto;
        margin-top: 10px;
      }
    }
  }
  .normal {
    position: absolute;
    top: 28px;
    right: 28px;
    width: 95px;
  }
  .online {
    position: absolute;
    top: 20px;
    right: 50px;
    width: 68px;
  }
  .photoelectricity {
    z-index: 101;
    width: 835px;
    height: 500px;
    position: absolute;
    top: -650px;
    left: -890px;
    background-image: url('../../assets/images/radarImage/Background.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    .headerbg {
      width: 95.8%;
      margin: 0 auto;
      margin-top: 17px;
      height: 22px;
      background-image: url('../../assets/images/radarImage/Top.png');
      background-size: cover;
      position: relative;
      .imglogo {
        width: 15px;
        height: 15px;
        margin: 3px 0 0 5px;
      }
      span {
        position: absolute;
        top: 3px;
        left: 27px;
        font-size: 12px;
        color: #b0e5eb;
      }
    }
    .imgclose {
      cursor: pointer;
      position: absolute;
      top: 21px;
      right: 23px;
      width: 14px;
      height: 14px;
    }
    .photoelectricitybox {
      width: 95%;
      height: 430px;
      margin-left: 21px;
      margin-top: 10px;
      display: flex;
      .video {
        width: 680px;
        height: 100%;
        margin-left: 10px;
      }
      .cameraControl {
        width: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        .control {
          width: 100px;
          height: 100px;
          position: relative;
          div {
            cursor: pointer;
          }
          .topImg {
            position: absolute;
            top: 0;
            left: 28px;
          }
          .rightImg {
            position: absolute;
            right: 0;
            top: 27.5px;
          }
          .bottomImg {
            position: absolute;
            bottom: 0;
            left: 28px;
          }
          .leftImg {
            position: absolute;
            left: 0;
            top: 27.5px;
          }
        }
      }
    }
  }
}
</style>
