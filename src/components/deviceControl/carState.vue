<template>
  <div id="carState">
    <!-- 车状态 -->
    <div class="carState" v-if="carObj">
      <div class="carState-title">
        <span class="device-title">
          <img src="@/assets/icon/deviceOper/group.png" alt="" />
          <span>{{ carObj.name }}</span>
        </span>
        <img
          style="width: 100%; display: block"
          src="@/assets/icon/deviceOper/line.png"
          alt=""
        />
      </div>
      <div
        class="device-name"
        v-for="(item, index) in carObj.data"
        :key="index"
      >
        <div class="icondown"></div>
        <span class="name" @click="flyTo(item)">{{ item.name }}</span>
        <div class="device-state">
          <img
            v-show="!carstateShow"
            src="@/assets/icon/deviceOper/GPSGuide/defense-close.png"
            alt=""
          />
          <img
            v-show="carstateShow"
            src="@/assets/icon/deviceOper/GPSGuide/defense-open.png"
            alt=""
          />
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

export default {
  props: ['carObj'],
  data() {
    return {
      carstateShow: false,
    }
  },
  computed: {
    ...mapGetters(['serverdata', 'currentPositionId', 'interstrike']),
  },
  watch: {
    serverdata(newVal) {
      if (newVal.data.command === 'carJammin' && this.carObj) {
        this.carObj.data.map((el) => {
          const data = newVal.data.data.find((ele) => ele.device_id === el.id)
          if (data) {
            if (data.data === 0) {
              this.carstateShow = true
            } else {
              this.carstateShow = false
            }
          }
        })
      }
    },
  },
  methods: {
    // 跳转视角
    flyTo(item) {
      console.log(item, 'item')
      // 操作被更高级别用户占用
      if (this.$store.state.setting.doStatusShow) {
      }
      // window.CesiumSdk.Camera().flyToPoint({
      //   lat: item.detail.static_data.latitude.value,
      //   lng: item.detail.static_data.longitude.value,
      //   alt: 0,
      //   radius: 15000,
      //   heading: 0,
      //   pitch: -60,
      // })
    },
  },
}
</script>
<style lang="scss" scoped>
#carState {
  pointer-events: auto;
  .carState {
    width: 250px;
    margin-top: 10px;
    background-image: url('../../assets/icon/deviceOper/long-background.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: 0 0;
    padding-bottom: 30px;
    .carState-title {
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
    }
    .device-name {
      width: 100%;
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
        // img {
        //   width: 12px;
        //   height: 12px;
        // }
      }
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
      .device-state {
        width: 24px;
        height: 24px;
        position: absolute;
        top: 6px;
        right: 48px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
