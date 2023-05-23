<template>
  <div id="quanXiang" @click="flyTo()">
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
      src="../../assets/images/deviceType/Frame _2364.png"
      class="operatimg"
    />
  </div>
</template>
<script>
export default {
  name: 'quanXiang',
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
#quanXiang {
  position: relative;
  width: 212px;
  height: 151px;
  background-size: 100% 100%;
  background-image: url('../../assets/images/deviceType/Quanxiang_bg.png');
  .operatimg {
    position: absolute;
    top: 28px;
    right: 28px;
    width: 95px;
  }
}
</style>
