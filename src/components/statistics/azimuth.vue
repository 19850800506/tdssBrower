<template>
  <div id="azimuth" class="dialog_static" ref="wrapper">
    <div class="alarm-times">
      <div class="header dialog_header" ref="header">
        <div class="alarmimg"></div>
        <span class="text">入侵方位分析</span>
      </div>
      <div class="datechoice">
        <div @click="imgClick(3)">
          <img
            v-if="activeImg == 3"
            src="../../assets/images/Statics/YearHover.png"
          />
          <img v-else src="../../assets/images/Statics/Year.png" />
        </div>
        <div @click="imgClick(2)">
          <img
            v-if="activeImg == 2"
            src="../../assets/images/Statics/MounthHover.png"
          />
          <img v-else src="../../assets/images/Statics/Mounth.png" />
        </div>
        <div @click="imgClick(1)">
          <img
            v-if="activeImg == 1"
            src="../../assets/images/Statics/DayHover.png"
          />
          <img v-else src="../../assets/images/Statics/Day.png" />
        </div>
        <div class="closeimg" @click="closeDia">
          <img src="../../assets/images/Component/Horizon/Close.png" />
        </div>
      </div>
    </div>
    <div class="drawbg">
      <div id="azimuth_radar"></div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getinvasionlocationinfo } from '@/api/date/date'

export default {
  props: ['intrudeShow'],
  data() {
    return {
      activeImg: 3,
      chartData: [],
      positionId: '',
    }
  },
  mounted() {
    // this.$nextTick(() => {
    // this.initecharts()
    // })
    // this.imgClick(3)
  },
  computed: {
    ...mapGetters(['currentPositionId']),
  },
  watch: {
    intrudeShow(newVal) {
      if (newVal) {
        this.imgClick(this.activeImg)
      }
    },
    currentPositionId(newVal) {
      this.positionId = newVal
      if (this.intrudeShow) {
        this.imgClick(this.activeImg)
      }
    },
  },
  methods: {
    imgClick(val) {
      this.activeImg = val

      // type  获取类型：1：日，2：月，3：年
      const params = {
        type: this.activeImg,
        positionId: this.positionId,
      }

      this.chartData = []

      getinvasionlocationinfo(params).then((res) => {
        if (res.code === 0) {
          for (const key in res.data) {
            this.chartData.push({ name: key, count: res.data[key] })
          }
        }
        this.initecharts()
      })
    },

    getData() {
      this.chartData = [
        {
          order: 1,
          name: '北',
          count: 11,
        },
        {
          order: 2,
          name: '东北',
          count: 52,
        },
        {
          order: 3,
          name: '东',
          count: 10,
        },
        {
          order: 4,
          name: '东南',
          count: 0,
        },
        {
          order: 5,
          name: '南',
          count: 114,
        },
        {
          order: 6,
          name: '西南',
          count: 11,
        },
        {
          order: 7,
          name: '西',
          count: 8,
        },
        {
          order: 8,
          name: '西北',
          count: 6,
        },
      ]
    },
    initecharts() {
      // this.getData()
      const radarData = this.chartData
      // 方向
      const direction = ['北', '西北', '西', '西南', '南', '东南', '东', '东北']
      // 求雷达图最大值 默认10
      let max = 10

      const maxCount = Math.max.apply(
        null,
        radarData.map((el) => el.count)
      )
      max = maxCount > max ? maxCount : max

      const indicator = direction.map((el) => {
        const { count } = radarData.find((ele) => ele.name === el)
        return {
          text: `${el}(${count})`,
          count,
          max,
        }
      })

      const chartOptions = {
        // tooltip: {
        //   trigger: 'axis',
        // },
        radar: {
          indicator,
          radius: 70,
          center: ['center', 'center'],
          name: {
            textStyle: {
              color: '#87d1d3',
            },
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#11393c',
            },
          },
          splitLine: {
            lineStyle: {
              color: '#144045',
              opacity: 0.5,
            },
          },
          splitArea: {
            areaStyle: {
              color: ['#174b51', '#144043'],
            },
          },
        },
        series: [
          {
            type: 'radar',
            // tooltip: {
            //   trigger: 'item',
            // },
            data: [
              {
                value: indicator.map((el) => el.count),
              },
            ],
            areaStyle: {
              normal: {
                color: '#a2d5d9',
              },
            },
            symbolSize: 0,
            lineStyle: {
              color: '#a1d3d8',
              opacity: 0,
            },
          },
        ],
      }
      const myChart = this.$echarts.init(
        document.getElementById('azimuth_radar')
      )
      myChart.setOption(chartOptions)
    },
    closeDia() {
      this.$emit('intrudeOrientation')
    },
  },
}
</script>
<style scoped lang="scss">
#azimuth {
  width: 400px;
  height: 250px;
  position: absolute;
  top: 140px;
  left: 450px;
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
        background-image: url(../../assets/images/Statics/radarChart.png);
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
  #azimuth_radar {
    width: 400px;
    height: 200px;
    margin-top: 20px;
  }
}
</style>
