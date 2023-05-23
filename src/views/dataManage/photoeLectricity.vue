<template>
  <div id="moveimgbox">
    <div class="moveimgbox">
      <div v-loading="puLoading" id="jcComplete_charts"></div>
      <div v-show="puChecked" class="canvas_container" v-loading="pbLoading">
        <canvas v-show="pubuFlag" id="jcStripcanvas"></canvas>
        <canvas id="jsCanvas"></canvas>
      </div>
    </div>
    <div class="rightBox">
      <el-checkbox v-model="puChecked">瀑布图显影</el-checkbox>
    </div>
  </div>
</template>
<script>
import {
  getwirelesschart,
  getcompletechart,
  getscaleplate,
} from '@/api/wireless.js'
import { Spectrogram } from '../../components/deviceType/spectrogram'

export default {
  data() {
    return {
      countIndex: 0,
      spectro: null,
      runing: false,
      runid: null,
      strip: null,
      puChecked: true,
      pubuFlag: false,
      completeCharts: null,
      puLoading: false,
      pbLoading: false,
    }
  },

  mounted() {
    getscaleplate().then((response) => {
      const scavas = document.getElementById('jcStripcanvas')
      scavas.width = 10
      scavas.height = 256
      this.strip = scavas.getContext('2d')
      this.spectro = Spectrogram(document.getElementById('jsCanvas'), {
        canvas: {
          width: 700,
          height: 400,
        },
      })
      this.spectro.init()
      this.puLoading = true
      this.pbLoading = true
      this.pinpu = setInterval(() => {
        if (response.code == 0) {
          getcompletechart().then((res) => {
            if (res.code == 0) {
              this.puLoading = false
              const rulers = []
              for (let i = 0; i < response.data.length; i++) {
                rulers.push(Math.ceil(response.data[i] / 1000000))
              }
              this.initcompletecharts(res.data, rulers)
            }
          })
        }
        getwirelesschart({
          scale: 10,
        }).then((res) => {
          this.pbLoading = false
          if (!this.pubuFlag) {
            this.pubuFlag = true
          }
          this.spectro.draw(res.data)
        })
        const colors = this.spectro._colors
        for (let i = 0; i < 256; i++) {
          this.strip.fillStyle = colors[i * 4]
          this.strip.fillRect(1, 256 - i, 10, 1)
        }
      }, 500)
    })
  },
  beforeDestroy() {
    clearInterval(this.pinpu)
    clearInterval(this.pubu)
    if (this.completeCharts) this.completeCharts.clear()
    if (this.spectro) this.spectro.clear()
  },
  methods: {
    closebutton() {
      this.$emit('closeBtn')
    },
    initcompletecharts(data, xData) {
      this.completeCharts = this.$echarts.init(
        document.getElementById('jcComplete_charts')
      )
      const option = {
        grid: {
          top: '10%',
          left: '10%',
          right: '10%',
          bottom: '10%',
        },
        xAxis: {
          type: 'category',
          minInterval: 1,
          name: 'MHZ',
          nameTextStyle: {
            padding: [-15, 0, 0, 1050],
            fontWeight: 400,
            fontSize: 11,
          },
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#fff',
            },
          },
          nameLocation: 'middle',
          data: xData,
        },
        yAxis: {
          name: 'dBm',
          type: 'value',
          max: -20,
          min: -140,
          splitLine: {
            show: false,
            lineStyle: {
              color: '#fff',
            },
          },
          axisLine: {
            lineStyle: {
              color: '#fff',
            },
          },
        },
        // dataZoom: [
        //   {
        //     show: true,
        //     height: 30,
        //     xAxisIndex: [0],
        //     bottom: 10,
        //     handleSize: '110%',
        //     handleStyle: {
        //       color: '#18fefe',
        //     },
        //     textStyle: {
        //       color: '#fff',
        //     },
        //   },
        //   {
        //     type: 'inside',
        //     show: true,
        //     height: 15,
        //   },
        // ],
        series: [
          {
            data,
            sampling: 'lttb',
            type: 'line',
            showAllSymbol: false,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#18fefe',
                },
              },
            },
            // areaStyle: {
            //   color: 'rgba(24, 254, 254, 0.5)',
            // },
            symbol: 'none',
          },
        ],
      }
      this.completeCharts.setOption(option)
    },
  },
}
</script>
<style lang="scss">
#moveimgbox {
  z-index: 101;
  height: 100%;
  .moveimgbox {
    position: relative;
    width: 80%;
    height: 100%;
    #jcComplete_charts {
      margin: 0 auto;
      width: 1256px;
      height: 440px;
    }
    .canvas_container {
      width: 1000px;
      height: 440px;
      margin: 20px auto;
      position: relative;
      left: -20px;
      #jcStripcanvas {
        position: absolute;
        left: 0;
        top: 72px;
      }
      #jsCanvas {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 20px;
      }
    }
  }
  .rightBox {
    position: absolute;
    width: 20%;
    height: 100%;
    right: 0;
    top: 0;
    border-left: 2px solid #fff;
    padding: 30px 20px;
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #18fefe;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #18fefe;
    border-color: #18fefe;
  }
  .el-input__inner {
    color: #fff;
    background: transparent;
    // margin-left: 20px;
  }
  .el-loading-mask {
    opacity: 0.1;
  }
  .el-loading-spinner .path {
    stroke: #00f;
  }
}
</style>
