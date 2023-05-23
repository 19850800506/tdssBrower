<template>
  <div id="times" @dragstart.prevent ref="wrapper">
    <div class="alarm-times">
      <div class="header dialog_header" ref="header">
        <div class="alarmimg"></div>
        <span class="text">报警次数统计</span>
        <!-- <img src="../../assets/images/Component/Horizon/Close.png" alt="" /> -->
      </div>
      <div class="datechoice">
        <div @click="imgClick('year')">
          <img
            v-if="activeImg === 'year'"
            src="../../assets/images/Statics/YearHover.png"
          />
          <img v-else src="../../assets/images/Statics/Year.png" />
        </div>
        <div @click="imgClick('month')">
          <img
            v-if="activeImg === 'month'"
            src="../../assets/images/Statics/MounthHover.png"
          />
          <img v-else src="../../assets/images/Statics/Mounth.png" />
        </div>
        <div @click="imgClick('day')">
          <img
            v-if="activeImg === 'day'"
            src="../../assets/images/Statics/DayHover.png"
          />
          <img v-else src="../../assets/images/Statics/Day.png" />
        </div>
        <div class="closeimg">
          <img
            src="../../assets/images/Component/Horizon/Close.png"
            alt=""
            @click="closeclick"
          />
        </div>
      </div>
    </div>
    <div class="drawbg">
      <div id="date_ec"></div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  getrecentmonthdata,
  getrecentdaydata,
  getconcretedaydata,
} from '@/api/date/date'

export default {
  props: ['alarmShow'],
  computed: {
    ...mapGetters(['currentPositionId']),
  },
  watch: {
    alarmShow(newVal, oldVal) {
      // 插入需要在仓库数据变化时做的逻辑处理
      if (newVal) {
        this.imgClick(this.activeImg)
      }
    },
    currentPositionId(newVal) {
      if (newVal) {
        this.params.positionIds = newVal
        if (this.alarmShow) {
          this.imgClick(this.activeImg)
        }
      }
    },
  },
  data() {
    return {
      activeImg: 'year',
      recentMonth: 12, // 最近多少个月
      recentDay: 31, // 最近多少天
      day: '',
      seriesdata: [],
      params: {
        positionIds: '', // 阵地id
      },
    }
  },
  mounted() {
    const date = new Date()
    this.day = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    // this.imgClick('year')

    // const draw = document.querySelector('#times')
    // console.log(draw, 'draw')
    // // 鼠标拖拽事件
    // document.onmousemove = (e) => {
    //   // 通过事件委托，计算移动的距离 （开始拖拽至结束拖拽的距离）
    //   const x = e.clientX
    //   const y = e.clientY

    //   draw.style.left = `${x}px`
    //   draw.style.top = `${y}px`
    // }
  },
  methods: {
    imgClick(val) {
      this.activeImg = val
      if (val === 'year') {
        // 获取最近12个月的报警数据
        getrecentmonthdata(this.params).then((response) => {
          this.seriesdata = response.data[0].countmodels.reverse()
          this.initecharts('year')
        })
      } else if (val === 'month') {
        // 获取最近31天的报警数据
        getrecentdaydata(this.params).then((response) => {
          this.seriesdata = response.data[0].countmodels.reverse()
          this.initecharts('month')
        })
      } else {
        //  获取当天的报警数据
        getconcretedaydata(this.params).then((response) => {
          this.seriesdata = response.data[0].countmodels.reverse()
          // 从前一天的时刻到现在的时刻进行排序排序
          // for (let i = 0; i < this.seriesdata.length; i++) {
          //   let { name } = this.seriesdata[i]
          //   if (name.charAt(0) === '0') {
          //     // 去掉0
          //     name = name.slice(2)
          //   }
          //   let breakflag = false
          //   if (breakflag) break
          //   else {
          //     const item = this.seriesdata[i]
          //     this.seriesdata.splice(i--, 1) // --避免程序混乱
          //     this.seriesdata.push(item)
          //   }
          //   if (Number(name) === new Date().getHours()) breakflag = true
          // }
          this.initecharts('day')
        })
      }
    },
    // 关闭按钮
    closeclick() {
      this.$emit('closealarm')
    },
    initecharts(flag) {
      const xAxisarr = []
      const seriesarr = []
      this.seriesdata.reverse()
      this.seriesdata.map((item) => {
        if (flag === 'year') {
          // let name = item.name.split('-')[1] // 去掉年
          // if (name.charAt(0) === '0') {
          //   // 去掉0
          //   name = name.slice(1)
          // }
          xAxisarr.push(item.long_name)
        } else if (flag === 'month') {
          // let name = item.name.split('-')[2] // 去掉年月
          // if (name.charAt(0) === '0') {
          //   // 去掉0
          //   name = name.slice(1)
          // }
          xAxisarr.push(item.long_name)
        } else {
          // let { name } = item
          // if (name.charAt(0) === '0') {
          //   // 去掉0
          //   name = name.slice(1)
          // }
          xAxisarr.push(item.long_name)
        }
      })

      this.seriesdata.map((item) => {
        seriesarr.push(item.count)
      })
      // }// 统计月份对应航拍类别的数量
      const myChart = this.$echarts.init(document.getElementById('date_ec'))
      const option = {
        grid: {
          top: '10px',
          left: '10px',
          bottom: '0px',
          right: '20px',
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: true,
            nameTextStyle: {
              padding: [25, 0, 0, 15],
              color: 'rgb(176, 229, 235,0.8)',
              fontWeight: 400,
              fontSize: 11,
            },
            nameGap: 10,
            axisLine: {
              lineStyle: {
                color: '#a1c4c4',
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
            data: xAxisarr,
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: '#a1c4c4',
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
          },
        ],
        series: [
          {
            name: '报警次数',
            data: seriesarr,
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(18,48,50,1)',
            },
            itemStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: '#b6e3e6' }, // 设置颜色渐变
                    { offset: 1, color: '#0e3d41' },
                  ],
                },
                borderWidth: 1,
                borderColor: '#a1c4c4',
              },
            },
          },
        ],
      }
      myChart.setOption(option)
    },
  },
}
</script>
<style scoped lang="scss">
#times {
  z-index: 101;
  width: 400px;
  height: 250px;
  position: absolute;
  top: 140px;
  left: 20px;
  background-image: url(../../assets/images/Component/Horizon/Background.png);
  background-size: 100% 100%;
  background-position: 0 0;
  transform: translate(0px, 0px);
  .alarm-times {
    display: flex;
    .header {
      width: 256px;
      height: 20px;
      position: relative;
      top: 13px;
      left: 12px;
      background-image: url(../../assets/images/Titlebar/Plan/TopBackground.png);
      background-size: cover;
      .alarmimg {
        width: 15px;
        height: 15px;
        position: absolute;
        left: 4px;
        top: 1px;
        background-image: url(../../assets/images/Statics/CloumChart.png);
        background-size: 100% 100%;
      }
      span {
        display: inline-block;
        font-size: 13px;
        margin-left: 25px;
        margin-top: 1px;
        color: #b0e5eb;
      }
      img {
        width: 12px;
        height: 12px;
        position: absolute;
        right: 3px;
        top: 3px;
      }
      img:hover {
        cursor: pointer;
      }
    }
    .datechoice {
      height: 20px;
      position: relative;
      top: 13px;
      left: 12px;
      display: flex;
      img {
        margin-left: 2px;
      }
      img:hover {
        cursor: pointer;
      }
      .closeimg {
        background: #1e6670;
        margin-left: 2px;
        width: 22px;
        img {
          margin-left: 5px;
          margin-top: 3px;
        }
        img:hover {
          cursor: pointer;
        }
      }
    }
  }
  #date_ec {
    width: 100%;
    height: 200px;
    margin-top: 20px;
  }
}
</style>
