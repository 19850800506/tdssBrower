<template>
  <header id="header">
    <div class="header-box">
      <div class="logo">
        <div class="mask"></div>
        <img
          @click="fullscreen()"
          src="../../assets/images/Titlebar/titleLogo.png"
          alt=""
        />
      </div>
      <div class="title" @click="routerTo">无线电监测</div>
      <div class="info">
        <div class="screen-box">
          <i
            @click="fullscreen()"
            class="el-icon-full-screen"
            :class="isFull ? 'full-screen' : ''"
          ></i>
        </div>
        <div class="count-box">
          <div class="count">
            <img
              src="../../assets/images/Titlebar/Weather/warning.png"
              alt=""
            />
            <el-tooltip
              effect="dark"
              content="今日预警"
              placement="left"
              :enterable="false"
            >
              <span>{{ today }}</span>
            </el-tooltip>
          </div>
          <el-tooltip
            effect="dark"
            content="累计预警"
            placement="left"
            :enterable="false"
          >
            <div class="number">{{ accumulation }}</div>
          </el-tooltip>
        </div>
        <!-- <div class="weather-box">
          <div class="wind">
            <img src="../../assets/images/Titlebar/Weather/wind2.png" alt="" />
            <span>{{ win }}</span>
          </div>
          <div class="weather">
            <img src="../../assets/images/Titlebar/Weather/clouds.png" alt="" />
            <span> {{ temperature }} </span>
            <span class="du">℃</span>
          </div>
        </div> -->
        <div class="datetime">
          <div class="text time">{{ time }}</div>
          <div class="text date">
            <img src="../../assets/images/Titlebar/Weather/time.png" alt="" />
            <span>{{ date }}</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
<script>
import screenfull from 'screenfull'
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils/index'
import { getWeather, totalWarning } from '@/api/dataview'

export default {
  data() {
    return {
      temperature: '26',
      win: '三级',
      date: '',
      time: '',
      warningParams: {
        positionIds: '',
        startTime: parseTime(new Date(), '{y}-{m}-{d}'),
        endTime: parseTime(new Date(), '{y}-{m}-{d}'),
      },
      // 累计预警
      today: 0,
      accumulation: 0,
      defenseShow: false,
      isFull: false,
    }
  },
  created() {},
  mounted() {
    this.getTime()
    setInterval(() => {
      this.getTime()
    }, 1000)
    this.init()
  },
  computed: {
    ...mapGetters(['currentPositionId']),
  },
  watch: {
    currentPositionId(newVal) {
      // 获取天气
      getWeather({ id: newVal }).then((res) => {
        if (res.code === 0) {
          this.temperature = res.data.tem
          this.win = res.data.win_speed
        }
      })
      this.warningParams.positionIds = newVal
      // 预警统计
      totalWarning(this.warningParams).then((res) => {
        if (res.code === 0) {
          this.today = res.data.TodayCount
          this.accumulation = res.data.AllCount
        }
      })
    },
  },
  methods: {
    getTime() {
      const date = new Date()
      const y = date.getFullYear()
      let m = date.getMonth() + 1
      let d = date.getDate()
      let h = date.getHours()
      let i = date.getMinutes()
      let s = date.getSeconds()

      m = m < 10 ? `0${m}` : m
      d = d < 10 ? `0${d}` : d
      h = h < 10 ? `0${h}` : h
      i = i < 10 ? `0${i}` : i
      s = s < 10 ? `0${s}` : s
      this.date = `${y}-${m}-${d}`
      this.time = `${h}:${i}:${s}`
    },
    routerTo() {
      this.$router.push('/')
      this.$store.commit('SET_USERID', '')
      // this.defenseShow = !this.defenseShow
    },
    // 单击全屏
    fullscreen() {
      if (!screenfull.isEnabled) {
        this.$message({ message: '你的浏览器不支持全屏', type: 'warning' })
        return
      }
      screenfull.toggle()
    },
    init() {
      if (screenfull.isEnabled) {
        screenfull.on('change', this.change) // 开启监听
      }
    },
    change() {
      this.isFull = screenfull.isFullscreen // 更新全屏状态
    },
  },
  destory() {
    if (screenfull.isEnabled) {
      screenfull.on('change', this.change)
    }
  },
}
</script>
<style scoped lang="scss">
#header {
  position: relative;
  pointer-events: auto;
  .header-box {
    pointer-events: auto;
    width: 100%;
    height: 79px;
    background-image: url(../../assets/images/Titlebar/Background.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
    .logo {
      padding-top: 34px;
      // padding-left: 29px;
      position: relative;
      .mask {
        position: absolute;
        width: 40px;
        height: 40px;
        background: #032829;
      }
      img {
        cursor: pointer;
      }
    }
    .title {
      position: absolute;
      top: 35px;
      left: 270px;
      width: 103px;
      height: 35px;
      font-size: 14px;
      color: #18fefe;
      font-weight: 700;
      line-height: 35px;
      text-align: center;
      // border: 1px solid red;
    }
    .title:hover {
      cursor: pointer;
    }
    .info {
      position: absolute;
      top: 30px;
      right: 25px;
      // width: 300px;
      height: 50px;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      color: #18fefe;
      .screen-box {
        width: 20px;
        height: 50px;
        display: flex;
        align-items: center;
        .el-icon-full-screen {
        }
        .el-icon-full-screen::before {
          font-size: 20px;
          cursor: pointer;
        }
        .full-screen::before {
          font-size: 25px;
        }
      }
      .count-box {
        width: 50px;
        margin-top: 6px;
        text-align: center;
        .count {
          img {
            width: 16px;
            height: 16px;
          }
          span {
            font-weight: 900;
            font-size: 20px;
            font-family: DIN-Black;
          }
        }
        .number {
          font-size: 14px;
          margin-top: 2px;
          font-family: DIN;
        }
      }
      .weather-box {
        text-align: center;
        width: 80px;
        .wind {
          img {
            position: relative;
            top: 3px;
            width: 20px;
            height: 20px;
          }
          span {
            font-size: 16px;
            font-family: 'Microsoft YaHei';
          }
        }
        .weather {
          img {
            width: 16px;
            height: 16px;
            position: relative;
            top: 2px;
          }
          span {
            font-family: DIN;
            font-size: 14px;
          }
          .du {
            font-size: 11px;
            font-family: 'Microsoft YaHei';
          }
        }
      }
      .datetime {
        width: 100px;
        margin-top: 6px;
        text-align: center;
        .time {
          font-size: 20px;
          font-weight: 900;
          font-family: DIN-Black;
        }
        .date {
          font-size: 12px;
          margin-top: 2px;
          font-family: DIN;
          img {
            width: 16px;
            height: 16px;
            position: relative;
            top: 4px;
          }
        }
      }
    }
  }
}
</style>
