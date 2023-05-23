<template>
  <div id="middle">
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
      <!-- <div
        style="position: absolute; height: 90%; width: 100%; z-index: 999"
      ></div> -->

      <div class="middle_left">
        <div
          class="handleimgbox"
          @click="flyTo()"
          @dblclick="enlargeclick(imgurl)"
        >
          <img
            class="viode_frame"
            src="../../assets/images/radarImage/video-frame.png"
            alt=""
          />
          <img
            class="handleimg"
            :class="imgurl ? 'animateMove' : ''"
            :style="{
              '--imgWidth': imgWidth,
            }"
            :src="imgurl"
            alt=""
          />
        </div>
        <!-- <div v-else class="handleimgbox">
        <img
          class="handleimg"
          src="../../assets/images/radarImage/tupian.png"
          alt=""
        />
      </div> -->

        <!-- <div class="handleimgbox" @dblclick="enlargeclick">
        <img
          class="viode_frame"
          src="../../assets/images/radarImage/video-frame.png"
          alt=""
        />
        <img
          class="handleimg"
          :class="true ? 'animateMove' : ''"
          :style="{
            '--imgWidth': imgWidth,
          }"
          src="../../assets/images/radarImage/test.png"
          alt=""
        />
      </div> -->
        <img
          class="compass"
          src="../../assets/images/radarImage/compass.png"
          alt=""
        />
        <img
          ref="scanpointer"
          class="scan_pointer"
          :class="imgurl ? 'animate' : ''"
          src="../../assets/images/radarImage/scan_pointer.png"
          alt=""
        />
        <!-- <img
        v-show="targetShow"
        :style="position"
        class="target-dot"
        src="../../assets/icon/target.png"
        alt=""
      /> -->
      </div>
    </el-tooltip>
    <div v-dialogDrag class="moveimgbox" v-if="enlargeflag">
      <div class="headerbg dialog_header">
        <img src="../../assets/images/radarImage/Log.png" class="imglogo" />
        <span>光电跟踪</span>
      </div>
      <img
        src="../../assets/images/radarImage/Close.png"
        class="imgclose"
        @click="enlargeflag = false"
      />
      <div class="clickimgbox">
        <img :src="imgeLUrl" class="clickimg" />
        <!-- <img src="../../assets/images/radarImage/test.jpg" class="clickimg" /> -->
      </div>
      <div class="foottrack" id="foottrack">
        <div class="slider"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { GetStream } from '@/api/getmsg/getmsg'

const imgDefault = require('../../assets/images/radarImage/test.jpg')

export default {
  props: ['device'],
  data() {
    return {
      imgurl: '',
      imgeLUrl: '',
      online: true,
      deviceOnline: true,
      deviceId: '',
      targetShow: false,
      enlargeflag: false,
      imgShow: false,
      imgWidth: 0,
      clickTimeId: null,
    }
  },
  mounted() {
    this.getList()
    setTimeout(() => {
      this.online = false
      this.getList()
      this.targetShow = true
    }, 12000)
  },
  computed: {
    position() {
      return {
        top: `${117}px`,
        left: `${22}px`,
      }
    },
    ...mapGetters(['serverdata']),
  },
  watch: {
    imgurl(val) {
      if (val) {
        setTimeout(() => {
          const handleimg = document.getElementsByClassName('handleimg')
          this.imgWidth = `${176 - handleimg[0].offsetWidth}px`
        }, 500) // 用于计算图片移动的距离
      }
    },
    device: {
      handler(val) {
        this.deviceId = val.id
        if (val.code === 0) {
          this.deviceOnline = true
        } else {
          this.deviceOnline = false
        }
      },
      deep: true,
      immediate: true,
    },
    serverdata(newVal) {
      if (newVal.data.command === 'push_img') {
        if (this.deviceOnline) {
          if (newVal.data.data && newVal.data.data.length) {
            const index = newVal.data.data.findIndex(
              (item) => item.device_id === this.deviceId
            )
            GetStream({
              bucket: newVal.data.data[index].data.bucket,
              name: newVal.data.data[index].data.object,
            }).then((res) => {
              this.imgShow = true
              if (res.size) {
                const myBlob = new window.Blob([res], { type: 'image/jpeg' })
                const qrUrl = window.URL.createObjectURL(myBlob)
                this.imgurl = qrUrl
              }
            })
          }
        } else {
          this.imgurl = imgDefault
        }
      }
    },
  },
  methods: {
    // 视角跳转
    flyTo() {
      clearTimeout(this.clickTimeId)
      // 执行延时
      this.clickTimeId = setTimeout(() => {
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
    getList() {
      if (this.online) {
        let i = 1
        this.timevar =
          (() => {
            if (i <= 360) {
              this.controlautorotate(1 * i)
              i += 1
            } else {
              i = 1
            }
          },
          50)
      } else {
        clearInterval(this.timevar)
      }
    },
    controlautorotate(angle) {
      // this.$refs.scanpointer.style.transform = `rotate(${angle}deg)`
    },

    // 点击图片放大
    enlargeclick(imgurl) {
      clearTimeout(this.clickTimeId)
      this.imgeLUrl = imgurl
      return new Promise((resolve, reject) => {
        // 执行先后顺序
        this.enlargeflag = true
        resolve()
      }).then(() => {
        const clickimgbox = document.getElementsByClassName('clickimgbox')
        const clickimg = document.getElementsByClassName('clickimg')
        const foottrack = document.getElementsByClassName('foottrack')
        const slider = document.getElementsByClassName('slider')
        const sliderwidth =
          (clickimgbox[0].offsetWidth * foottrack[0].offsetWidth) /
          clickimg[0].offsetWidth
        // slider[0].style.width = `${sliderwidth}px` // 设置滑块宽度
        // 设置轨道拖拽
        const foottrackid = document.getElementById('foottrack')
        foottrackid.onclick = (event) => {
          this.controlmove(event)
        }
        this.mouseDownAndMove(foottrackid, (event) => {
          this.controlmove(event)
        })
      })
    },
    // 控制滑块和图片同步移动
    controlmove(event) {
      const clickimgbox = document.getElementsByClassName('clickimgbox')
      const clickimg = document.getElementsByClassName('clickimg')
      const foottrack = document.getElementsByClassName('foottrack')
      const slider = document.getElementsByClassName('slider')
      slider[0].style.left = '0px'
      const movepx = event.offsetX - slider[0].offsetWidth / 2
      if (movepx > 0) {
        if (
          event.offsetX <=
          foottrack[0].offsetWidth - slider[0].offsetWidth / 2
        ) {
          slider[0].style.left = `${movepx}px`
          clickimg[0].style.left = `${
            -(movepx * (clickimg[0].offsetWidth - clickimgbox[0].offsetWidth)) /
            (foottrack[0].offsetWidth - slider[0].offsetWidth)
          }px`
        } else {
          slider[0].style.left = `${
            foottrack[0].offsetWidth - slider[0].offsetWidth
          }px`
        }
      } else if (movepx < 0) {
        slider[0].style.left = '0px'
        clickimg[0].style.left = '0px'
      }
    },
    // 拖拽事件
    mouseDownAndMove(dom, callback) {
      // 添加鼠标按下监听
      dom.onmousedown = () => {
        // 当鼠标按下时, 添加鼠标移动监听
        dom.onmousemove = (event) => {
          callback(event)
        }
        // 超过指针范围时移除 鼠标移动监听
        dom.onmouseout = (event) => {
          if (event.offsetY <= 0 || event.offsetY >= dom.offsetHeight) {
            dom.onmousemove = null
          }
        }
      }
      // 添加鼠标弹起监听 , 即鼠标不在按下
      dom.onmouseup = () => {
        // 此时移除 鼠标移动监听
        dom.onmousemove = null
      }
    },
  },
}
</script>
<style scoped lang="scss">
@keyframes scan-rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes scan-move {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(var(--imgWidth));
  }
}
.animate {
  animation: scan-rotate 10s infinite;
}
.animateMove {
  animation: scan-move 10s infinite;
}
#middle {
  width: 212px;
  height: 151px;
  background-size: 100% 100%;
  background-image: url('../../assets/images/EqDetails/zhousao.png');
  .middle_left {
    overflow: hidden;
    .handleimgbox {
      cursor: pointer;
      position: relative;
      overflow: hidden;
      width: 176px;
      height: 112px;
      margin-left: 22px;
      margin-top: 12px;
      .viode_frame {
        position: absolute;
        width: 100%;
        height: 100%;
      }
      .handleimg {
        height: 100%;
        position: absolute;
        left: 0;
      }
    }
    .compass {
      width: 50px;
      height: 50px;
      position: absolute;
      left: 10px;
      top: 87px;
    }
    .scan_pointer {
      width: 44.5px;
      height: 44.5px;
      position: absolute;
      left: 13.5px;
      top: 88px;
    }
    .target-dot {
      width: 10px;
      height: 10px;
      position: absolute;
    }
  }
  .moveimgbox {
    z-index: 101;
    width: 835px;
    height: 500px;
    position: fixed;
    top: -650px;
    left: -22px;
    // position: fixed;
    // top: 0;
    // bottom: 0;
    // left: -20px;
    // right: 0;
    // margin: auto;
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
    .clickimgbox {
      margin: 0 auto;
      margin-top: 1px;
      width: 95.8%;
      height: 79%;
      overflow: hidden;
      .clickimg {
        height: 100%;
        position: relative;
        left: 0;
      }
    }
    .foottrack {
      width: 95.8%;
      height: 46px;
      bottom: 5px;
      margin: 0 auto;
      margin-top: 6px;
      border: 1px solid #d6de0a;
      position: relative;
      overflow: hidden;
      .slider {
        height: 100%;
        width: 50px;
        background-color: #21787b;
        position: absolute;
        left: 0;
        cursor: pointer;
      }
    }
  }
}
</style>
