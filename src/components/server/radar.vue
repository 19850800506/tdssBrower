<template>
  <div id="radar" @click="flyTo()">
    <div class="radar-box">
      <img
        class="radar-lp"
        src="../../assets/images/radarImage/radarLp.png"
        alt=""
      />
      <div class="pointer-box">
        <img
          ref="pointer"
          class="radar-pointer"
          src="../../assets/images/radarImage/radar_pointer.png"
          alt=""
        />
      </div>
      <img
        v-show="targetShow"
        :style="position"
        class="target-dot"
        src="../../assets/icon/target.png"
        alt=""
      />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  props: ['device'],
  data() {
    return {
      targetShow: false,
      radarId: '',
    }
  },
  computed: {
    ...mapGetters(['serverdata']),
    position() {
      return {
        top: `${65}px`,
        left: `${38}px`,
      }
    },
  },
  watch: {
    device: {
      handler(val) {
        if (val.type === 'Radar') {
          this.radarId = val.id
        }

        if (val.animated) {
          this.radarAnimation()
        } else {
          clearInterval(this.timevar)
        }
      },
      deep: true,
      immediate: true,
    },
    serverdata(newVal) {
      // 监听设备心跳
      // if (newVal.data.command === 'heartbeat' && newVal.data.data) {
      //   const ws_data = newVal.data.data
      //   const device = ws_data.find((el) => el.device_id === this.radarId)
      //   if (device) {
      //     // 雷达动画
      //     if (device.state === 'find') {
      //       this.radarAnimation()
      //     } else {
      //       // 红点
      //       // this.targetShow = true
      //       clearInterval(this.timevar)
      //     }
      //   }
      // }
    },
  },
  methods: {
    // 视角跳转
    flyTo() {
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
    },
    radarAnimation() {
      let i = 1
      this.timevar = setInterval(() => {
        if (i <= 360) {
          this.controlautorotate(1 * i)
          i += 1
        } else {
          i = 1
        }
      }, 50)
    },
    controlautorotate(angle) {
      if (this.$refs.pointer) {
        this.$refs.pointer.style.transform = `rotate(${angle}deg)`
      }
    },
  },
}
</script>
<style scoped lang="scss">
#radar {
  .radar-box {
    width: 212px;
    height: 151px;
    background-image: url('../../assets/images/radarImage/radarBg.png');
    background-size: 100% 100%;
    margin-top: 12px;
    margin-left: 5px;
    .radar-lp {
      width: 155px;
      height: 134px;
      position: absolute;
      top: 2px;
      left: 30px;
    }
    .pointer-box {
      width: 170px;
      height: 135px;
      position: absolute;
      left: 22.5px;
      top: 2px;
      overflow: hidden;
      .radar-pointer {
        width: 170px;
        height: 170px;
        position: absolute;
        top: -16px;
        // left: 22px;
      }
    }

    .target-dot {
      width: 14px;
      height: 14px;
      position: absolute;
    }
  }
}
</style>
