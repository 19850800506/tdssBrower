<template>
  <div id="dingXiang" @click="flyTo()">
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
    <img
      v-show="!device.animated"
      src="../../assets/images/deviceType/dx_quli.png"
      class="normalState"
    />
    <img
      v-show="device.animated"
      src="../../assets/images/deviceType/dx_pojiang.png"
      class="strikeState"
    />
    <div class="pingpu">
      <div class="imgbox" :class="device.code == 0 ? 'animat_left' : ''">
        <img src="../../assets/images/deviceType/left_content.png" />
        <img src="../../assets/images/deviceType/left_content.png" />
      </div>
    </div>
    <img
      src="../../assets/images/deviceType/center-circ1.png"
      class="left_circle"
      :class="device.code == 0 ? 'rotate' : ''"
      alt=""
    />
    <img
      src="../../assets/images/deviceType/center-circ2.png"
      class="right_circle"
      :class="device.code == 0 ? 'rotate' : ''"
      alt=""
    />
    <div class="right_pingpu">
      <div class="imgbox" :class="device.code == 0 ? 'animat_right' : ''">
        <img src="../../assets/images/deviceType/right_content.png" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'dingXiang',
  props: ['device'],
  data() {
    return {}
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
}
</script>
<style scoped lang="scss">
@keyframes pingMove {
  0% {
    transform: translateX(0px);
  }
  100% {
    transform: translateX(-50px);
  }
}
@keyframes areaArray-rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes rhombusMove {
  0% {
    transform: translateX(0px);
  }
  100% {
    transform: translateX(-30px);
  }
}
#dingXiang {
  position: relative;
  width: 212px;
  height: 151px;
  background-size: 100% 100%;
  background-image: url('../../assets/images/deviceType/dx_background.png');
  .normalState {
    position: absolute;
    top: 26px;
    right: 42px;
    width: 95px;
  }
  .strikeState {
    position: absolute;
    top: 15px;
    right: 62px;
    height: 92px;
  }
  .pingpu {
    position: absolute;
    top: 96px;
    left: 24px;
    width: 50px;
    height: 25px;
    overflow: hidden;
    .imgbox {
      display: flex;
      img {
        width: 50px;
      }
    }
    .animat_left {
      animation: pingMove 4s linear infinite;
    }
  }
  .left_circle {
    position: absolute;
    top: 100px;
    left: 86px;
    width: 19px;
  }
  .right_circle {
    position: absolute;
    top: 102px;
    left: 112px;
    width: 19px;
  }
  .rotate {
    animation: areaArray-rotate 4s linear infinite;
  }
  .right_pingpu {
    position: absolute;
    top: 105px;
    left: 140px;
    width: 50px;
    height: 14px;
    overflow: hidden;
    .imgbox {
      img {
        height: 14px;
      }
    }
    .animat_right {
      animation: rhombusMove 8s linear infinite;
    }
  }
}
</style>
