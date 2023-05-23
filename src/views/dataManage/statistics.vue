<template>
  <div id="statistics">
    <div class="tab" v-loading="loading">
      <div class="unusualBox">
        <div class="title">无线电异常月报</div>
        <div id="unusual_charts"></div>
      </div>
      <div class="bottomBox">
        <div class="hourData">
          <div class="hourTitle">逐小时分析</div>
          <div id="hour_charts"></div>
        </div>
        <div class="top10Data">
          <div class="top10Title">Top10异常频点</div>
          <div id="top10_charts"></div>
        </div>
      </div>
    </div>
    <div class="rightBox">
      <el-date-picker
        style="width: 92%"
        v-model="unuMonth"
        @change="changeMonth"
        type="month"
        size="mini"
        class="date"
        placeholder="选择月"
      >
      </el-date-picker>
      <el-button
        class="exportBtn rightButton"
        type="primary"
        size="mini"
        @click="exportBtn"
      >
        异常下载</el-button
      >
    </div>
  </div>
</template>
<script>
import { getMothlyreport, downloadExceptiond } from '@/api/radio/radio'
import { parseTime } from '@/utils/index.js'

export default {
  data() {
    return {
      unuMonth: '2023-03',
      activeName: 'first',
      freq_result: [],
      hourly_result: {},
      monthly_result: {},
      loading: false,
      unusualCharts: '',
      hourlyCharts: '',
      freqCharts: '',
    }
  },

  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      getMothlyreport({ month: parseTime(this.unuMonth, '{y}-{m}') }).then(
        (res) => {
          if (res.code === 0) {
            this.loading = false
            this.freq_result = res.data.freq_result
            this.hourly_result = res.data.hourly_result
            this.monthly_result = res.data.monthly_result
            this.inituUnusual()
            this.initHour()
            this.initTop()
          }
        }
      )
    },
    handleClick() {},
    changeMonth() {
      this.getData()
    },
    exportBtn() {
      this.loading = true
      downloadExceptiond({ month: parseTime(this.unuMonth, '{y}-{m}') }).then(
        (res) => {
          this.loading = false
          const url = `data:text/csv;charset=utf-8,\ufeff${encodeURIComponent(
            res
          )}`
          // 创建a标签，并隐藏改a标签
          const link = document.createElement('a')
          link.style.display = 'none'
          // a标签的href属性指定下载链接
          link.href = url
          // setAttribute() 方法添加指定的属性，并为其赋指定的值。
          link.setAttribute(
            'download',
            `${parseTime(this.unuMonth, '{y}-{m}')}.csv`
          )
          document.body.appendChild(link)
          link.click()
        }
      )
    },
    closebutton() {
      this.$emit('closeBtn')
    },
    inituUnusual() {
      const xData = []
      const yData = []
      for (const key in this.monthly_result) {
        yData.push(this.monthly_result[key])
        xData.push(parseTime(key, '{m}-{d}'))
      }
      // for (let i = 0; i <= 31; i++) {
      //   xData.push(`01/${i}`)
      //   yData.push(Math.floor(Math.random() * 110))
      // }
      const unusual_charts = document.getElementById('unusual_charts')
      // unusual_charts.style.width = `${
      //   document.getElementsByClassName('content')[0].offsetWidth * 0.7
      // }px`
      this.unusualCharts = this.$echarts.init(unusual_charts)
      const option = {
        grid: {
          left: '46px',
          right: '40px',
        },
        xAxis: {
          name: '日期',
          nameTextStyle: {
            color: '#fff',
          },
          type: 'category',
          data: xData,
          axisLabel: {
            color: '#fff',
            interval: 1,
          },
        },
        yAxis: {
          name: '次数',
          nameTextStyle: {
            color: '#fff',
          },
          type: 'value',
          axisLabel: {
            color: '#fff',
          },
        },
        series: [
          {
            data: yData,
            type: 'bar',
            itemStyle: {
              normal: {
                color: '#61a5e8',
              },
            },
            label: {
              normal: {
                show: true,
                position: 'top',
              },
            },
          },
        ],
      }
      this.unusualCharts.setOption(option)
      const opts = {
        type: 'png',
        pixelRatio: 1,
        backgroundColor: '#242a29',
        excludeComponents: ['toolbox'],
      }
      const unusualBase64 = this.unusualCharts.getDataURL(opts).split(',')[1]
      this.$store.commit('SET_UNUSUAL', unusualBase64)
    },
    initHour() {
      const xData = []
      const yData = []
      for (const key in this.hourly_result) {
        xData.push(key)
      }
      xData.sort()
      xData.forEach((el) => {
        yData.push(this.hourly_result[el])
      })
      // for (let i = 0; i <= 24; i++) {
      //   xData.push(`${i}点`)
      //   yData.push(Math.floor(Math.random() * 10))
      // }
      const hour_charts = document.getElementById('hour_charts')
      // hour_charts.style.width = `${
      //   document.getElementsByClassName('content')[0].offsetWidth * 0.35
      // }px`
      this.hourlyCharts = this.$echarts.init(hour_charts)
      const option = {
        grid: {
          left: '80px',
          right: '40px',
        },
        xAxis: {
          name: '小时',
          nameTextStyle: {
            color: '#fff',
          },
          type: 'category',
          data: xData,
          axisLabel: {
            color: '#fff',
            // interval: 1,
          },
        },
        yAxis: {
          name: '次数',
          nameTextStyle: {
            color: '#fff',
          },
          type: 'value',
          axisLabel: {
            color: '#fff',
          },
        },
        series: [
          {
            data: yData,
            type: 'bar',
            itemStyle: {
              normal: {
                color: '#61a5e8',
              },
            },
            label: {
              normal: {
                show: true,
                position: 'top',
              },
            },
          },
        ],
      }
      this.hourlyCharts.setOption(option)
      const opts = {
        type: 'png',
        pixelRatio: 1,
        backgroundColor: '#242a29',
        excludeComponents: ['toolbox'],
      }
      const hourlyBase64 = this.hourlyCharts.getDataURL(opts).split(',')[1]
      this.$store.commit('SET_HOURLY', hourlyBase64)
    },
    initTop() {
      const xData = []
      const yData = []
      this.freq_result.forEach((item) => {
        xData.push(item[1])
        yData.push(`${item[0]}GHz`)
      })
      const top10_charts = document.getElementById('top10_charts')
      // top10_charts.style.width = `${
      //   document.getElementsByClassName('content')[0].offsetWidth * 0.35
      // }px`
      this.freqCharts = this.$echarts.init(top10_charts)

      const option = {
        grid: {
          left: '80px',
          right: '40px',
        },
        xAxis: {
          type: 'value',
          axisLabel: {
            color: '#fff',
            interval: 4,
          },
        },
        yAxis: {
          type: 'category',
          data: yData,
          // data: [
          //   '82MHz',
          //   '39MHz',
          //   '180MHz',
          //   '90MHz',
          //   '32MHz',
          //   '44MHz',
          //   '28MHz',
          // ],
          axisLabel: {
            color: '#fff',
          },
        },
        series: [
          {
            data: xData,
            // data: [2, 4, 6, 8, 10, 12, 18],
            type: 'bar',
            itemStyle: {
              normal: {
                color: '#61a5e8',
              },
            },
            label: {
              normal: {
                show: true,
                position: 'right',
              },
            },
          },
        ],
      }
      this.freqCharts.setOption(option)
      const opts = {
        type: 'png',
        pixelRatio: 1,
        backgroundColor: '#242a29',
        excludeComponents: ['toolbox'],
      }
      const freqBase64 = this.freqCharts.getDataURL(opts).split(',')[1]
      this.$store.commit('SET_FREQ', freqBase64)
    },
  },
}
</script>
<style lang="scss">
#statistics {
  z-index: 101;
  height: 100%;
  .tab {
    width: 80%;
    .unusualBox {
      .title {
        color: #fff;
        width: 200px;
        margin: 10px auto;
        font-size: 18px;
      }
      #unusual_charts {
        margin-left: 20px;
        width: 1260px;
        height: 460px;
      }
    }
    .bottomBox {
      display: flex;
      .hourData {
        width: 50%;
        .hourTitle {
          color: #fff;
          width: 200px;
          margin: 10px auto;
          font-size: 18px;
        }
        #hour_charts {
          width: 630px;
          height: 360px;
        }
      }
      .top10Data {
        width: 50%;
        .top10Title {
          color: #fff;
          width: 200px;
          margin: 10px auto;
          font-size: 18px;
        }
        #top10_charts {
          width: 630px;
          height: 360px;
        }
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
    padding: 20px;
    z-index: 9;
    .rightButton {
      margin-top: 20px;
      float: right;
      position: relative;
      right: 30px;
    }
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
