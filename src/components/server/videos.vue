<template>
  <div class="middle_left">
    <img
      src="../../assets/images/Component/Circular/Background.png"
      class="imgbg"
    />
    <img
      @dragstart.prevent
      src="../../assets/images/Component/Circular/ScanPointer.png"
      class="pointerimg"
      id="pointerid"
      @click="mlclick"
    />
    <div class="handleimgbox" @dblclick="enlargeclick">
      <img :src="imgurl" class="handleimg" />
    </div>

    <div class="moveimgbox" v-show="enlargeflag">
      <div class="headerbg">
        <img
          src="../../assets/images/Component/Horizon/Log.png"
          class="imglogo"
        />
        <img
          src="../../assets/images/Component/Horizon/Close.png"
          class="imgclose"
          @click="enlargeflag = false"
        />
        <span>光电跟踪</span>
      </div>
      <div class="clickimgbox">
        <img :src="imgurl" class="clickimg" />
      </div>
      <div class="foottrack" id="foottrack">
        <div class="slider"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { GetStream } from '@/api/getmsg/getmsg'

export default {
  name: 'videos',
  data() {
    return {
      center: [0, 0],
      angle: 0,
      enlargeflag: false,
      imgmsg: {}, // 图片信息
      imgurl: '', // 图片URL
      zhousaoeqstatus: false, // 周扫设备是否在线
      zhousaoeqtimer: null,
      autozhuan: false,
      idmsgarr: [],
      DeviceInfoAll: [],
    }
  },
  computed: {
    serverdata() {
      return this.$store.state.websocket.serverdata
    },
  },
  watch: {
    serverdata(newVal, oldVal) {
      // 插入需要在仓库数据变化时做的逻辑处理
      this.initWebsocket(newVal)
    },
  },
  mounted() {
    // 设置轮盘拖拽
    const elpointerid = document.getElementById('pointerid')
    this.mouseDownAndMove(elpointerid, (event) => {
      this.controlrotate(event)
    })
    this.$bus.$on('DeviceInfoAll', (val) => {
      this.DeviceInfoAll = val
    })
  },
  methods: {
    initWebsocket(serverdata) {
      const deviceid = this.DeviceInfoAll.filter(
        (item) =>
          item.model_name === '周扫探测设备' && item.position === '池州青阳区'
      )
      if (serverdata.command === 'shared_heartbeat') {
        // 周扫探测设备是否在线判断
        // console.log(deviceid, 'deviceid323s')
        if (serverdata.device_id === deviceid[0].id) {
          // console.log(this.heert_flag, 'heert_flag')
          if (serverdata.data.state !== 'dropped') {
            if (!this.zhousaoeqstatus) {
              this.zhousaoeqstatus = true
              this.zhousaoeqtimer = setTimeout(() => {
                this.zhousaoeqstatus = false
              }, 30000) // 5秒后删除
            } else {
              clearTimeout(this.zhousaoeqtimer)
              this.zhousaoeqtimer = setTimeout(() => {
                this.zhousaoeqstatus = false
                clearInterval(this.timevar)
                this.imgmsg = {}
                const pointerimg = document.getElementsByClassName('pointerimg')
                pointerimg[0].style.transform = `rotate(0deg)` // 先将图片归位避免offsetX,Y有偏差
              }, 30000) // 5秒后删除
            }
          } else {
            clearTimeout(this.zhousaoeqtimer)
            this.zhousaoeqstatus = false
            clearInterval(this.timevar)
            this.imgmsg = {}
            const pointerimg = document.getElementsByClassName('pointerimg')
            pointerimg[0].style.transform = `rotate(0deg)` // 先将图片归位避免offsetX,Y有偏差
          }
        }
      }
      if (serverdata.command === 'push' && this.zhousaoeqstatus) {
        if (JSON.stringify(this.imgmsg) === '{}') {
          let i = 1
          this.timevar = setInterval(() => {
            if (i <= 360) {
              this.controlautorotate(1 * i)
              i += 1
            } else {
              i = 1
            }
          }, 50)
        }
        this.imgmsg = serverdata.data.value
        GetStream({
          bucket: this.imgmsg.bucket,
          name: this.imgmsg.object,
        }).then((response) => {
          if (response.size) {
            const myBlob = new window.Blob([response], { type: 'image/jpeg' })
            const qrUrl = window.URL.createObjectURL(myBlob)
            this.imgurl = qrUrl
          }
        })
      }
    },
    mlclick(event) {
      this.controlrotate(event)
    },
    // 点击图片放大
    enlargeclick() {
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
        slider[0].style.width = `${sliderwidth}px` // 设置滑块宽度
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

    // 控制轮盘和图片同步旋转角度
    controlrotate(event) {
      const pointerimg = document.getElementsByClassName('pointerimg')
      const handleimgbox = document.getElementsByClassName('handleimgbox')
      const handleimg = document.getElementsByClassName('handleimg')
      pointerimg[0].style.transform = `rotate(0deg)` // 先将图片归位避免offsetX,Y有偏差
      this.center[0] = pointerimg[0].offsetWidth / 2 // 计算圆心
      this.center[1] = pointerimg[0].offsetHeight / 2
      this.angle = this.rotateangle(event.offsetX, event.offsetY) // 计算旋转角度
      pointerimg[0].style.transform = `rotate(${this.angle}deg)` // 改变图片旋转角度
      const move =
        ((handleimg[0].offsetWidth - handleimgbox[0].offsetWidth) / 360) *
        this.angle
      handleimg[0].style.left = `-${move}px`
      // handleimg[0].style.left = `${this.move}px)` // 改变图片可视距离
    },
    // 控制轮盘和图片自动同步旋转
    controlautorotate(angle) {
      const pointerimg = document.getElementsByClassName('pointerimg')
      const handleimgbox = document.getElementsByClassName('handleimgbox')
      const handleimg = document.getElementsByClassName('handleimg')
      pointerimg[0].style.transform = `rotate(${angle}deg)` // 改变图片旋转角度
      const move =
        ((handleimg[0].offsetWidth - handleimgbox[0].offsetWidth) / 360) * angle
      handleimg[0].style.left = `-${move}px`
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
      }
    },
    // 轮盘拖拽
    mouseDownAndMove(dom, callback) {
      // 添加鼠标按下监听
      dom.onmousedown = () => {
        // 当鼠标按下时, 添加鼠标移动监听
        dom.onmousemove = (event) => {
          // 超过指针范围时移除 鼠标移动监听
          dom.onmouseout = (event) => {
            dom.onmousemove = null
          }
          callback(event)
        }
      }
      // 添加鼠标弹起监听 , 即鼠标不在按下
      dom.onmouseup = () => {
        // 此时移除 鼠标移动监听
        dom.onmousemove = null
      }
    },
    // 判单旋转角度
    rotateangle(positionX, positionY) {
      if (positionX >= this.center[0] && positionY < this.center[1]) {
        // 第一象限
        return (
          Math.atan(
            (positionX - this.center[0]) / -(positionY - this.center[1])
          ) *
          (360 / (2 * Math.PI))
        )
      }
      if (positionX > this.center[0] && positionY >= this.center[1]) {
        // 第二象限
        return (
          Math.atan(
            (positionY - this.center[1]) / (positionX - this.center[0])
          ) *
            (360 / (2 * Math.PI)) +
          90
        )
      }
      if (positionX <= this.center[0] && positionY > this.center[1]) {
        // 第三象限
        return (
          Math.atan(
            -(positionX - this.center[0]) / (positionY - this.center[1])
          ) *
            (360 / (2 * Math.PI)) +
          180
        )
      }
      if (positionX < this.center[0] && positionY <= this.center[1]) {
        // 第四象限
        return (
          Math.atan(
            -(positionY - this.center[1]) / -(positionX - this.center[0])
          ) *
            (360 / (2 * Math.PI)) +
          270
        )
      }
    },
  },
}
</script>
<style scoped lang="scss">
.middle_left {
  width: 19.7%;
  margin-top: 22px;
  margin-left: 5px;
  position: relative;
  .imgbg {
    width: 100%;
  }
  .pointerimg {
    position: absolute;
    left: 10.8%;
    top: 5.8%;
    width: 30%;
    height: 72%;
  }
  .handleimgbox {
    position: absolute;
    left: 52.2%;
    top: 5.7%;
    width: 45.6%;
    height: 72.2%;
    overflow: hidden;
    .handleimg {
      // width: 400px;
      height: 1.4rem;
      position: relative;
      left: 0;
    }
  }
}
.moveimgbox {
  width: 835px;
  height: 500px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: -20px;
  right: 0;
  margin: auto;
  background-image: url('../../assets/images/Component/Horizon/Background.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  .headerbg {
    width: 95.8%;
    margin: 0 auto;
    margin-top: 17px;
    height: 22px;
    background-image: url('../../assets/images/Component/Horizon/Top.png');
    background-size: cover;
    position: relative;
    .imglogo {
      width: 15px;
      height: 15px;
      margin: 3px 0 0 5px;
    }
    .imgclose {
      position: absolute;
      top: 4px;
      right: 10px;
      width: 14px;
      height: 14px;
      z-index: 100;
    }
    span {
      position: absolute;
      top: 3px;
      left: 27px;
      font-size: 12px;
      color: #b0e5eb;
    }
  }
  .clickimgbox {
    margin: 0 auto;
    margin-top: 1px;
    width: 95.8%;
    height: 79%;
    overflow: hidden;
    .clickimg {
      // width: 1600px;
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
    }
  }
}
</style>
