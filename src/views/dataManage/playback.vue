<template>
  <div id="playback">
    <div class="playback">
      <div v-loading="loading" ref="playback_charts" id="playback_charts"></div>
      <div class="canvas_container" v-loading="loading">
        <canvas v-show="pubuFlag" id="playbackCanvas"></canvas>
        <canvas ref="playbackPuCanvas" id="playbackPuCanvas"></canvas>
      </div>
    </div>
    <div class="rightBox">
      <div style="display: flex; align-items: center">
        <div style="width: 20%">选择日期</div>
        <el-date-picker
          style="margin-left: 10px; width: 80%"
          v-model="playMonth"
          type="date"
          size="mini"
          class="date"
          placeholder="选择月"
        >
        </el-date-picker>
      </div>
      <div class="startTime">
        <div style="width: 20%">开始时间</div>
        <el-time-picker
          style="margin: 10px 0 10px 10px; width: 80%"
          size="mini"
          v-model="playStartTime"
        >
        </el-time-picker>
      </div>
      <div class="endTime">
        <div style="width: 20%">结束时间</div>
        <el-time-picker
          style="margin-left: 10px; width: 80%"
          size="mini"
          v-model="playEndTime"
        >
        </el-time-picker>
      </div>
      <el-button
        class="rightButton"
        type="primary"
        size="small"
        @click="getData"
      >
        查询</el-button
      >
    </div>
  </div>
</template>
<script>
import {
  getwirelesschart,
  getcompletechart,
  getscaleplate,
} from '@/api/wireless.js'
import { getReload } from '@/api/radio/radio'
import { Spectrogram } from '../../components/deviceType/spectrogram'

export default {
  data() {
    return {
      countIndex: 0,
      spectro: null,
      runing: false,
      runid: null,
      strip: null,
      pubuFlag: false,
      playMonth: '2023-02-27',
      playStartTime: '2023-02-27 01:01:01',
      playEndTime: '2023-02-27 23:01:01',
      offsetLength: 1,
      completeCharts: null,
      loading: false,
      offset: 0,
    }
  },

  mounted() {
    this.getData()
  },
  beforeDestroy() {
    clearInterval(this.pinpu)
    if (this.completeCharts) this.completeCharts.clear()
    if (this.spectro) this.spectro.clear()
  },
  methods: {
    getData() {
      const scavas = document.getElementById('playbackCanvas')
      scavas.width = 10
      scavas.height = 256
      this.strip = scavas.getContext('2d')
      this.spectro = Spectrogram(document.getElementById('playbackPuCanvas'), {
        canvas: {
          width: 700,
          height: 400,
        },
      })
      this.spectro.init()
      this.loading = true
      this.drawing()
    },
    drawing() {
      getReload({
        day: this.playMonth,
        starttime: this.playStartTime.split(' ')[1],
        stoptime: this.playEndTime.split(' ')[1],
        offset: this.offset,
      }).then((res) => {
        if (res.code === 0) {
          if (this.loading) {
            this.loading = false
          }
          this.offsetLength = res.length
          const rulers = []
          for (let i = 0; i < res.ruler.length; i++) {
            rulers.push(Math.ceil(res.ruler[i] / 1000000))
          }
          this.initcompletecharts(res.data, rulers)
          if (res.data) {
            if (!this.pubuFlag) {
              this.pubuFlag = true
            }
            this.spectro.draw(res.data)
            const colors = this.spectro._colors
            for (let i = 0; i < 256; i++) {
              this.strip.fillStyle = colors[i * 4]
              this.strip.fillRect(1, 256 - i, 10, 1)
            }
          }
        } else {
          clearTimeout(this.pinpu)
        }
      })
      this.pinpu = setTimeout(() => {
        if (this.offset <= this.offsetLength - 1) {
          this.offset += 1
          this.drawing()
        } else {
          this.offset = 0
        } // 0~res.length-1
      }, 500)
    },
    closebutton() {
      this.$emit('closeBtn')
    },
    changeMonth() {
      // this.getData()
    },
    initcompletecharts(data, xData) {
      this.completeCharts = this.$echarts.init(
        document.getElementById('playback_charts')
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
#playback {
  z-index: 101;
  height: 100%;
  .playback {
    position: relative;
    width: 80%;
    height: 100%;
    #playback_charts {
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
      #playbackCanvas {
        position: absolute;
        left: 0;
        top: 72px;
      }
      #playbackPuCanvas {
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
    .rightButton {
      margin-top: 10px;
      float: right;
    }
  }
  .startTime {
    display: flex;
    margin-top: 10px;
    align-items: center;
  }
  .endTime {
    display: flex;
    margin-top: 10px;
    align-items: center;
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
