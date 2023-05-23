<template>
  <div id="xieYi" @click="flyTo()">
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
    <!-- <div class="handlebox">
      <img
        src="../../assets/images/induceImage/icon_24_expel_defense.png"
        alt=""
      />
      <img
        src="../../assets/images/induceImage/icon_24_defense_Default.png"
        alt=""
      />
      <img src="../../assets/icon/white-list.png" alt="" />
    </div> -->
    <img
      src="../../assets/images/deviceType/xiaoyuan.png"
      class="quan"
      alt=""
    />
    <img src="../../assets/images/deviceType/quli.png" class="xieyi-quli" />
    <img
      src="../../assets/images/deviceType/right_dx.png"
      class="xieyi-right"
    />
    <img
      src="../../assets/images/deviceType/faguangTiao.png"
      class="faguang-tiao"
    />
    <div class="zhexian">
      <svg width="210px" height="14px">
        <polyline
          :class="device.animated ? 'animat' : ''"
          :points="lineData"
        ></polyline>
      </svg>
    </div>
    <div class="pingpu">
      <div class="imgbox" :class="device.animated ? 'animat' : ''">
        <img src="../../assets/images/deviceType/bottom_tiao.png" />
        <img src="../../assets/images/deviceType/bottom_tiao.png" />
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'xieYi',
  props: ['device'],
  computed: {
    ...mapGetters(['serverdata', 'heatBeatList']),
    lineData() {
      const arr = []
      for (let i = 1; i < 173; i += 2) {
        const j = Number(Math.random() * 14)
        const data = `${i} ${j}`
        arr.push(data)
      }
      return arr
    },
  },
  watch: {
    device: {
      handler(val) {
        if (val.type === 'Crack') {
          this.crackId = val.id
        }
      },
      deep: true,
      immediate: true,
    },
    serverdata(val) {
      // 监听设备心跳
      if (val.data.command === 'heartbeat' && val.data.data) {
        const ws_data = val.data.data
        const device = ws_data.find((el) => el.device_id === this.crackId)
        if (device) {
          // 设备动画
          this.animated = false
          if (device.state && JSON.parse(device.state).SenorStatus === 'find') {
            this.animated = true
          }
        }
      }
    },
  },
  data() {
    return {
      crackId: '',
      animated: false,
    }
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
  },
  // mounted() {
  //   setInterval(() => {
  //     const obj = {
  //       data: {
  //         position_id: 1111667986713748,
  //         command: 'heartbeat',
  //         data: [
  //           {
  //             device_id: 1090007001000669,
  //             code: 0,
  //             state:
  //               '{"SenorStatus":"find","WideAttack15":0,"WideAttack24":0,"WideAttack58":0}',
  //           },
  //         ],
  //         time: 1669975521619,
  //       },
  //       code: 0,
  //       msg: 'success',
  //     }
  //     this.$store.commit('SET_SERVERDATA', obj)
  //   }, 5000)
  // },
}
</script>
<style scoped lang="scss">
@keyframes lineMove {
  0% {
    stroke-dasharray: 0, 500;
  }
  100% {
    stroke-dasharray: 480, 500;
  }
}
@keyframes pingMove {
  0% {
    transform: translateX(0px);
  }
  100% {
    transform: translateX(-174px);
  }
}
#xieYi {
  position: relative;
  width: 212px;
  height: 151px;
  background-size: 100% 100%;
  background-image: url('../../assets/images/deviceType/Xieyi_bg.png');
  .handlebox {
    position: absolute;
    display: flex;
    flex-direction: column;
    left: 24px;
    top: 18px;
    img {
      width: 24px;
      height: 24px;
      margin-bottom: 4px;
    }
  }
  .quan {
    position: absolute;
    left: 24px;
    top: 99px;
    width: 26px;
  }
  .xieyi-quli {
    position: absolute;
    top: 26px;
    right: 42px;
    width: 95px;
  }
  .faguang-tiao {
    position: absolute;
    top: 24px;
    left: 16px;
    width: 4px;
  }
  .xieyi-right {
    position: absolute;
    top: 18px;
    right: 12px;
    width: 25px;
  }
  .zhexian {
    position: absolute;
    top: 108px;
    left: 20px;
    width: 85%;
    height: 14px;
    polyline {
      fill: none;
      stroke-width: 0.5px;
      stroke: #18fefe;
    }
    .animat {
      animation: lineMove 10s linear infinite;
    }
  }
  .pingpu {
    position: absolute;
    top: 123px;
    left: 20px;
    width: 174px;
    overflow: hidden;
    .imgbox {
      display: flex;
      img {
        width: 178px;
      }
      img:nth-child(2) {
        position: relative;
        left: -5px;
      }
    }
    .animat {
      animation: pingMove 10s linear infinite;
    }
  }
}
</style>
