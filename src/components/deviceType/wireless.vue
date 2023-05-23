<template>
  <div id="wireless" v-if="radioShow">
    <el-tooltip
      popper-class="message-alert"
      placement="top"
      effect="dark"
      :enterable="false"
    >
      <div slot="content" class="message-box">
        <div class="message">频谱分析设备</div>
      </div>
      <div class="wireless">
        <div id="wireless_charts" @dblclick="enlargeflag = true"></div>
        <!-- 底部条纹 -->
        <div class="bottom-img">
          <img src="../../assets/images/deviceType/bottom_stripe.png" alt="" />
        </div>
      </div>
    </el-tooltip>
    <photoelectricity
      :enlargeflag="enlargeflag"
      @closeBtn="enlargeflag = false"
      v-dialogDrag
      v-if="enlargeflag"
      style="position: absolute; top: -820px; left: -816px"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import photoelectricity from './photoelectricity.vue'
import { getwirelesschart } from '../../api/wireless.js'

export default {
  components: {
    photoelectricity,
  },
  data() {
    return {
      enlargeflag: false,
      timer: null,
      radioShow: window.config.radioShow,
    }
  },
  computed: {
    ...mapGetters(['isLogin']),
  },
  mounted() {
    this.timer = setInterval(() => {
      getwirelesschart({
        scale: 1024,
      })
        .then((res) => {
          if (res.code === 0) {
            this.initecharts(res.data)
          }
        })
        .catch(() => {
          clearInterval(this.timer)
        })
    }, 5000)
  },
  methods: {
    initecharts(data) {
      const deviceCharts = this.$echarts.init(
        document.getElementById('wireless_charts')
      )
      const option = {
        grid: {
          top: '10px',
          left: '0px',
          right: '0px',
          bottom: '0px',
        },
        xAxis: {
          show: false,
          type: 'category',
          nameLocation: 'middle',
        },
        yAxis: {
          show: false,
          type: 'value',
        },
        series: [
          {
            data,
            // data: [-40, -50, -60, -55, -65, -140, -120, -100],
            type: 'line',
            showAllSymbol: false,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#18fefe',
                },
              },
            },
            areaStyle: {
              color: 'rgba(24, 254, 254, 0.5)',
            },
          },
        ],
      }
      deviceCharts.setOption(option)
    },
  },
}
</script>
<style scoped lang="scss">
#wireless {
  .wireless {
    width: 212px;
    height: 151px;
    background-image: url('../../assets/images/EqDetails/TDOA.png');
    background-size: 100% 100%;
    // margin-top: 12px;
    margin-left: 5px;
    overflow: hidden; //清除塌陷
    #wireless_charts {
      margin: 0 auto;
      margin-top: 15px;
      cursor: pointer;
      width: 180px;
      height: 105px;
    }
    .bottom-img {
      width: 84%;
      margin: 0 auto;
      img {
        width: 100%;
      }
    }
  }
  // .moveimgbox {
  //   z-index: 1000;
  //   width: 835px;
  //   height: 500px;
  //   position: fixed;
  //   top: 0;
  //   bottom: 0;
  //   left: -20px;
  //   right: 0;
  //   margin: auto;
  //   background-image: url('../../assets/images/radarImage/Background.png');
  //   background-size: 100% 100%;
  //   background-repeat: no-repeat;
  //   .headerbg {
  //     width: 95.8%;
  //     margin: 0 auto;
  //     margin-top: 17px;
  //     height: 22px;
  //     background-image: url('../../assets/images/radarImage/Top.png');
  //     background-size: cover;
  //     position: relative;
  //     .imglogo {
  //       width: 15px;
  //       height: 15px;
  //       margin: 3px 0 0 5px;
  //     }
  //     .imgclose {
  //       cursor: pointer;
  //       position: absolute;
  //       top: 4px;
  //       right: 10px;
  //       width: 12px;
  //       height: 12px;
  //     }
  //     span {
  //       position: absolute;
  //       top: 3px;
  //       left: 27px;
  //       font-size: 12px;
  //       color: #b0e5eb;
  //     }
  //     .btn_container {
  //       position: absolute;
  //       top: 3px;
  //       right: 60px;
  //       display: flex;
  //       div {
  //         margin-left: 5px;
  //         cursor: pointer;
  //       }
  //     }
  //   }
  //   #complete_charts {
  //     width: 800px;
  //     height: 440px;
  //     margin: 0 auto;
  //   }
  //   .canvas_container {
  //     width: 720px;
  //     height: 400px;
  //     margin: 0 auto;
  //     margin-top: 20px;
  //     position: relative;
  //     #stripcanvas {
  //       position: absolute;
  //       left: 0;
  //       top: 72px;
  //     }
  //     #canvas {
  //       position: absolute;
  //       left: 20px;
  //     }
  //   }
  // }
}
</style>
