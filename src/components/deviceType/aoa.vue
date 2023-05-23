<template>
  <div id="aoa">
    <div class="aoa" @click="flyTo()">
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
          style="position: absolute; height: 90%; z-index: 100"
          :style="{ width: radioShow ? '49%' : '100%' }"
        ></div>
      </el-tooltip>
      <!-- 上频段 -->
      <div class="top-pd">
        <xiantiao
          v-for="(item, index) in 59"
          :key="index"
          class="pd-item"
          :style="{ left: index * 3 + 'px' }"
          :height="top_height"
          :time="top_time"
          :bgcolor="top_bgcolor"
          :animated="device.animated"
        />
      </div>
      <!-- 数字 -->
      <div class="suzi">
        <div v-for="(item, index) in 7" :key="index" class="suzi-item">
          {{ index }}
        </div>
      </div>
      <!-- 下频段 -->
      <div class="bottom-pd">
        <div class="pd-box" v-for="(item, index) in 59" :key="index">
          <div class="pd-jing"></div>
          <div class="pd-dong">
            <xiantiao
              class="pd-item"
              :height="bottom_height"
              :time="bottom_time"
              :bgcolor="bottom_bgcolor"
              :animated="device.animated"
            />
          </div>
        </div>
      </div>
      <!-- 底部条纹 -->
      <div class="bottom-img">
        <img src="../../assets/images/deviceType/bottom_stripe.png" alt="" />
      </div>
    </div>
    <!-- 频谱分析设备 -->
    <wireless v-if="radioShow" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import xiantiao from './xiantiao.vue'
import wireless from './wireless.vue'

export default {
  name: 'aoa',
  props: ['device'],
  components: {
    xiantiao,
    wireless,
  },
  computed: {
    ...mapGetters(['serverdata', 'heatBeatList']),
  },
  watch: {
    device: {
      handler(val) {
        if (val.type === 'AOA') {
          this.aoaId = val.id
        }
      },
      deep: true,
      immediate: true,
    },
    serverdata(val) {
      // 监听设备心跳
      if (val.data.command === 'heartbeat' && val.data.data) {
        const ws_data = val.data.data
        const device = ws_data.find((el) => el.device_id === this.aoaId)
        if (device) {
          // 设备动画
          this.animated = false
          if (device.state && device.state === 'find') {
            this.animated = true
          }
        }
      }
    },
  },

  data() {
    return {
      top_height: 62, // 线条的高度，单位px
      top_time: 1, // 动画的周期，单位s
      top_bgcolor: '#18fefe', // 线条颜色

      bottom_height: 10, // 线条的高度，单位px
      bottom_time: 1, // 动画的周期，单位s
      bottom_bgcolor: '#ECC34D', // 线条颜色
      animated: false,
      aoaId: '',
      radioShow: window.config.radioShow,
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
}
</script>
<style scoped lang="scss">
#aoa {
  display: flex;
  // overflow: hidden; //清除塌陷
  // width: 212px;
  // height: 151px;
  // background-image: url('../../assets/images/EqDetails/TDOA.png');
  // background-size: 100% 100%;
  .aoa {
    overflow: hidden; //清除塌陷
    width: 212px;
    height: 151px;
    background-image: url('../../assets/images/EqDetails/TDOA.png');
    background-size: 100% 100%;
    .top-pd {
      display: flex;
      width: 84%;
      height: 62px;
      margin: 5px auto;
      margin-top: 20px;
      position: relative;
      .pd-item {
        position: absolute;
        bottom: 0;
      }
    }
    .suzi {
      display: flex;
      justify-content: space-between;
      width: 84%;
      margin: 0 auto;
      .suzi-item {
        font-size: 14px;
        font-family: 'lcdD';
        color: #fff;
      }
    }
    .bottom-pd {
      display: flex;
      width: 84%;
      margin: 0 auto;
      .pd-box {
        width: 2px;
        margin: 2px 0;
        margin-right: 1px;
        .pd-jing {
          height: 5px;
          background: #18fefe;
          margin-bottom: 1px;
        }
        .pd-dong {
          height: 8px;
          .pd-item {
            // position: absolute;
            // top: 0;
            margin-right: 1px;
          }
        }
      }
    }
    .bottom-img {
      width: 84%;
      margin: 0 auto;
      img {
        width: 100%;
      }
    }
  }
}
</style>
