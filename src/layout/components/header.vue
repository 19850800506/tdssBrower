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
      <div class="headTitle">
        <div class="title" @click="routerTo">设备总览</div>
        <!-- <div class="titleWx" @click="routerToWx">无线电监测</div> -->
      </div>
      <div class="info">
        <div class="screen-box">
          <i
            @click="fullscreen()"
            class="el-icon-full-screen"
            :class="isFullscreen ? 'full-screen' : ''"
          ></i>
        </div>
        <div class="log-out">
          <i @click="logOut" class="el-icon-switch-button"></i>
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
      <defensePandect v-if="defenseShow"></defensePandect>
    </div>
  </header>
</template>
<script>
import screenfull from 'screenfull'
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils/index'
import { getWeather, totalWarning } from '@/api/dataview'
import defensePandect from '../../views/placeTree/index.vue'

export default {
  components: {
    defensePandect,
  },
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
      isFullscreen: false,
    }
  },
  created() {
    window.addEventListener('resize', this.onresize)
  },
  mounted() {
    this.getTime()
    setInterval(() => {
      this.getTime()
    }, 1000)
    this.onresize()
    setInterval(() => {
      // 预警统计定时刷新
      this.getWarning()
    }, 1000 * 60)
  },
  computed: {
    ...mapGetters(['currentPositionId', 'isLogin']),
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
      this.getWarning()
    },
  },
  methods: {
    getWarning() {
      totalWarning(this.warningParams).then((res) => {
        if (res.code === 0) {
          this.today = res.data.TodayCount
          this.accumulation = res.data.AllCount
        }
      })
    },
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
      // this.$router.push('/place')
      this.defenseShow = !this.defenseShow
      this.$store.commit('SET_DATEVIEWSHOW', !this.defenseShow)
    },
    routerToWx() {
      console.log(this.$route, 'this.$router')
      if (this.$route.path === '/') {
        const routeUrl = this.$router.resolve({ path: '/dataManage' })
        window.open(routeUrl.href, '_blank')
      } else {
        this.$router.push('/')
        this.$store.commit('SET_USERID', '')
      }
    },
    // 单击全屏
    fullscreen() {
      if (!screenfull.isEnabled) {
        this.$message({ message: '你的浏览器不支持全屏', type: 'warning' })
        return
      }
      screenfull.toggle()
    },
    // 退出登录
    logOut() {
      this.$confirm('是否退出登录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$store.commit('SETISLOGIN', false)
      })
    },
    // 监听是否全屏状态
    onresize() {
      const winFlag = window.innerHeight === window.screen.height
      const isFull = window.fullScreen || document.webkitIsFullScreen
      if (isFull === undefined) {
        this.isFullscreen = winFlag
      } else {
        this.isFullscreen = winFlag || isFull
      }
      this.$store.commit('SET_ISFULL', this.isFullscreen)
    },
  },
  beforeDestory() {
    window.removeEventListener('resize', this.onresize)
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
    .headTitle {
      position: absolute;
      top: 35px;
      left: 270px;
      height: 35px;
      font-size: 14px;
      color: #18fefe;
      font-weight: 700;
      line-height: 35px;
      display: flex;
      .title {
        cursor: pointer;
        width: 103px;

        text-align: center;
        // border: 1px solid red;
      }
      .titleWx {
        cursor: pointer;
        text-align: center;
        // border: 1px solid red;
      }
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
      .log-out {
        width: 20px;
        height: 50px;
        display: flex;
        align-items: center;
        margin-left: 10px;
        .el-icon-switch-button::before {
          font-size: 20px;
          cursor: pointer;
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
