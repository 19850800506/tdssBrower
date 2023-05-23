<template>
  <div id="induce" @click="flyTo()">
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
    <div class="induce-box">
      <!-- 驱离 -->
      <div class="expel-box">
        <div v-show="!device.animated" class="right-expel">
          <img src="../../assets/images/induceImage/expel.png" alt="" />
        </div>
        <div v-show="device.animated" class="strikeState">
          <img src="../../assets/images/induceImage/nofly.png" alt="" />
        </div>
      </div>
      <img
        v-if="device.code == 0"
        class="bottom-reseau"
        src="../../assets/images/induceImage/ripple.gif"
        alt=""
      />
      <img
        v-else
        class="bottom-reseau"
        src="../../assets/images/induceImage/bottom_reseau.png"
        alt=""
      />
    </div>
  </div>
</template>
<script>
export default {
  props: ['device'],
  data() {
    return {}
  },
  mounted() {
    console.log(this.device, 'device')
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
#induce {
  position: relative;
  width: 212px;
  height: 151px;
  background-size: 100% 100%;
  background-image: url('../../assets/images/induceImage/induceBg_1.png');
  .induce-box {
    position: absolute;
    display: flex;
    flex-direction: column;
    .expel-box {
      width: 130px;
      margin-top: 18px;
      margin-left: 20px;
      .right-expel {
        position: absolute;
        height: 78px;
        width: 85px;
        height: 62px;
        left: 73px;
        top: 31px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .strikeState {
        position: absolute;
        width: 61px;
        left: 79px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .bottom-reseau {
      width: 174px;
      height: 30px;
      margin-top: 83px;
      margin-left: 20px;
    }
  }
}
</style>
