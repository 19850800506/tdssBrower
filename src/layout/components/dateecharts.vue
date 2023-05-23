<template>
  <div id="dateecharts">
    <div class="datebg">
      <div class="datebox">
        <div :class="[yearcheck ? 'blankcheck' : 'blanknocheck']"></div>
        <div
          :class="[yearcheck ? 'datecheck' : 'datenocheck']"
          @click="yearclick"
        >
          <span>年</span>
        </div>
      </div>
      <div class="datebox">
        <div :class="[monthcheck ? 'blankcheck' : 'blanknocheck']"></div>
        <div
          :class="[monthcheck ? 'datecheck' : 'datenocheck']"
          @click="monthclick"
        >
          <span>月</span>
        </div>
      </div>
      <div class="datebox">
        <div :class="[daycheck ? 'blankcheck' : 'blanknocheck']"></div>
        <div
          :class="[daycheck ? 'datecheck' : 'datenocheck']"
          @click="dayclick"
        >
          <span>日</span>
        </div>
      </div>
    </div>
    <div class="drawbg" v-show="yearcheck || monthcheck || daycheck">
      <div id="date_ec"></div>
    </div>
  </div>
</template>
<script>
import { Dynamicyear, Dynamicmonth, Dynamicday } from '@/api/date/date'

export default {
  data() {
    return {
      yearcheck: false,
      monthcheck: false,
      daycheck: false,
      series: [],
      xAxis: [],
      xAxistitle: '',
    }
  },
  mounted() {},
  methods: {
    yearclick() {
      this.monthcheck = false
      this.daycheck = false
      this.yearcheck = !this.yearcheck
      Dynamicyear({
        start_time: '2020-01-01',
        end_time: '2021-07-01',
        device_id: '1090103001000234',
        rule_id: '1040103001000105',
      }).then((response) => {
        this.series = response.data.series
        this.xAxis = response.data.xAxis
        this.xAxistitle = '年'
        this.initecharts()
      })
    },
    monthclick() {
      this.yearcheck = false
      this.daycheck = false
      this.monthcheck = !this.monthcheck
      Dynamicmonth({
        start_time: '2021-01-01',
        end_time: '2022-01-01',
        device_id: '1090103001000234',
        rule_id: '1040103001000105',
      }).then((response) => {
        this.series = response.data.series
        this.xAxis = response.data.xAxis
        this.xAxistitle = '月'
        this.initecharts()
      })
    },
    dayclick() {
      this.yearcheck = false
      this.monthcheck = false
      this.daycheck = !this.daycheck
      Dynamicday({
        start_time: '2021-07-01',
        end_time: '2021-07-12',
        device_id: '1090103001000234',
        rule_id: '1040103001000105',
      }).then((response) => {
        this.series = response.data.series
        this.xAxis = response.data.xAxis
        this.xAxistitle = '日'
        this.initecharts()
      })
    },
    initecharts() {
      // }// 统计月份对应航拍类别的数量
      const myChart = this.$echarts.init(document.getElementById('date_ec'))
      const option = {
        color: ['#ECC34D', '#13A7A4', '#30ACFF'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#57617B',
            },
          },
        },
        legend: {
          icon: 'rect',
          itemWidth: 12,
          itemHeight: 12,
          itemGap: 30,
          data: ['入侵', '警告', '正常'],
          orient: 'vertical',
          right: 0,
          top: '40%',
          textStyle: {
            fontSize: 13,
            color: '#FFFFFF',
          },
        },
        grid: {
          top: '30px',
          left: '0',
          bottom: '10px',
          right: '70px',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            name: this.xAxistitle,
            nameTextStyle: {
              padding: [25, 0, 0, 15],
              color: 'rgb(176, 229, 235,0.8)',
              fontWeight: 400,
              fontSize: 11,
            },
            nameGap: 10,
            axisLine: {
              lineStyle: {
                color: '#557577',
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dotted',
                color: '#557577',
              },
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: 'rgb(176, 229, 235,0.8)',
                fontFamily: 'DIN',
                fontWeight: 500,
                fontSize: 11,
              },
            },
            axisTick: {
              show: false,
            },
            data: this.xAxis,
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: '次',
            nameTextStyle: {
              padding: [0, 28, 0, 0],
              color: 'rgb(176, 229, 235,0.8)',
              fontWeight: 400,
              fontSize: 11,
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: '#557577',
              },
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: 'rgb(176, 229, 235,0.8)',
                fontFamily: 'DIN',
                fontWeight: 500,
                fontSize: 11,
              },
              margin: 5,
            },
            splitLine: {
              show: false,
            },
            // data: [50, 100, 150, 200, 300],
          },
        ],
        series: [
          {
            name: '入侵',
            type: 'line',
            smooth: true,
            // symbol: 'circle',
            // symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1,
              },
            },
            areaStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(236, 195, 77, 0.6)',
                    },
                    {
                      offset: 0.8,
                      color: 'rgba(236, 195, 77, 0.05)',
                    },
                  ],
                  false
                ),
                shadowColor: 'rgba(236, 195, 77, 1)',
                shadowBlur: 10,
              },
            },
            data: [160, 180, 200, 205, 190, 160, 150, 170, 190, 196, 210, 250],
          },
          {
            name: '警告',
            type: 'line',
            smooth: true,
            // symbol: 'circle',
            // symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1,
              },
            },
            areaStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(19, 167, 164, 0.6)',
                    },
                    {
                      offset: 0.8,
                      color: 'rgba(19, 167, 164, 0.05)',
                    },
                  ],
                  false
                ),
                shadowColor: 'rgba(19, 167, 164, 1)',
                shadowBlur: 10,
              },
            },
            data: [160, 120, 200, 215, 190, 180, 150, 130, 120, 166, 260, 230],
          },
          {
            name: '正常',
            type: 'line',
            smooth: true,
            // symbol: 'circle',
            // symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1,
              },
            },
            areaStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(48, 172, 255, 0.6)',
                    },
                    {
                      offset: 0.8,
                      color: 'rgba(48, 172, 255, 0.05)',
                    },
                  ],
                  false
                ),
                shadowColor: 'rgba(48, 172, 255, 1)',
                shadowBlur: 10,
              },
            },
            data: [120, 150, 210, 220, 190, 160, 170, 150, 190, 196, 210, 250],
          },
        ],
      }
      myChart.setOption(option)
    },
  },
}
</script>
<style scoped lang="scss">
#dateecharts {
  pointer-events: auto;
  position: absolute;
  top: 100px;
  .datebg {
    display: flex;
    .datebox {
      display: flex;
      height: 16px;
      margin-left: 9px;
      .blanknocheck {
        width: 9px;
        height: 100%;
        background: #2b7e7d;
      }
      .blankcheck {
        width: 9px;
        height: 100%;
        background: #b0e4eb;
      }
      .blanknocheck:hover {
        background: #b0e4eb;
      }
      .datenocheck {
        width: 15px;
        height: 100%;
        font-size: 12px;
        color: #143c3e;
        background: #2b7e7d;
        border: 1px solid #268a8d;
        span {
          display: inline-block;
          transform: scale(0.8);
        }
      }
      .datecheck {
        width: 15px;
        height: 100%;
        font-size: 12px;
        color: #143c3e;
        background: #b0e4eb;
        span {
          display: inline-block;
          transform: scale(0.8);
        }
      }
    }
  }
  .drawbg {
    width: 800px;
    height: 500px;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    background: #042928;
    #date_ec {
      width: 95%;
      height: 95%;
      margin: 20px auto;
    }
  }
}
</style>
