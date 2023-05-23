<template>
  <div id="alarm">
    <div class="alarm">
      <div @click="alarmStatistics">
        <img
          v-show="!alarmShow"
          src="../../assets/images/Tool/bjcstjyds.png"
          alt=""
        />
        <img
          v-show="alarmShow"
          src="../../assets/images/Tool/bjcstjzc.png"
          alt=""
        />
      </div>
      <div @click="intrudeOrientation">
        <img
          v-show="!intrudeShow"
          src="../../assets/images/Tool/rqfwfxyds.png"
          alt=""
        />
        <img
          v-show="intrudeShow"
          src="../../assets/images/Tool/rqfwfxzc.png"
          alt=""
        />
      </div>
      <div @click="alarmRecord">
        <img
          v-show="!record"
          src="../../assets/images/Tool/bjxxyds.png"
          alt=""
        />
        <img v-show="record" src="../../assets/images/Tool/bjxxzc.png" alt="" />
      </div>
      <div @click="statisticsBtn">
        <img
          v-show="!statistics"
          src="../../assets/images/Tool/testds.png"
          alt=""
        />
        <img
          v-show="statistics"
          src="../../assets/images/Tool/testzc.png"
          alt=""
        />
      </div>
      <!-- 演示 -->
      <div @click="demonstrationBtn">
        <img
          v-show="!demonstration"
          src="../../assets/images/Tool/StartPlaying.png"
          alt=""
        />
        <img
          v-show="demonstration"
          src="../../assets/images/Tool/ClosePlaying.png"
          alt=""
        />
      </div>
    </div>
    <alarm-times
      v-dialogDrag
      v-show="alarmShow"
      :alarmShow="alarmShow"
      @closealarm="alarmShow = false"
    ></alarm-times>
    <azimuth
      v-dialogDrag
      @intrudeOrientation="intrudeOrientation"
      v-show="intrudeShow"
    ></azimuth>
    <alarm-record
      ref="alarmRecord"
      v-dialogDrag
      @alarmRecord="alarmRecord"
      v-show="record"
    ></alarm-record>
    <statistics
      v-dialogDrag
      @statisticsBtn="statisticsBtn"
      :statistics="statistics"
      v-show="statistics"
    ></statistics>
  </div>
</template>
<script>
import { parseTime } from '@/utils/index.js'
import { demonstration, demoState } from '../../api/record/alarmRecord'
import alarmTimes from '../../components/statistics/alarmTimes.vue'
import alarmRecord from '../../components/statistics/alarmRecord.vue'
import statistics from '../../components/statistics/statistics.vue'
import azimuth from '../../components/statistics/azimuth.vue'

export default {
  components: {
    alarmTimes,
    alarmRecord,
    statistics,
    azimuth,
  },
  data() {
    return {
      // disabledBtn: true,
      alarmShow: false,
      intrudeShow: false,
      record: false,
      statistics: false,
      demonstration: false,
      params: {
        open: false,
      },
      currentdate: parseTime(new Date(), '{y}-{m}-{d}'),
    }
  },
  created() {
    // this.getList()
  },

  mounted() {
    this.$bus.$on('demonstration', (val) => {
      this.demonstration = val
    })
  },
  methods: {
    getList() {
      setInterval(() => {
        demoState().then((response) => {
          if (response.data) {
            this.demonstration = true
          } else {
            this.demonstration = false
          }
        })
      }, 5000)
    },

    alarmStatistics() {
      this.alarmShow = !this.alarmShow
    },
    intrudeOrientation() {
      this.intrudeShow = !this.intrudeShow
    },
    alarmRecord() {
      this.record = !this.record
      if (this.record) {
        this.$refs.alarmRecord.alarmRecordShow(this.currentdate)
      }
    },
    statisticsBtn() {
      this.statistics = !this.statistics
    },
    demonstrationBtn() {
      this.demonstration = !this.demonstration
      this.params.open = this.demonstration
      demonstration(this.params).then((response) => {})
    },
  },
}
</script>
<style lang="scss" scoped>
#alarm {
  pointer-events: auto;
  .alarm {
    width: 250px;
    height: 45px;
    display: flex;
    justify-content: space-between;
    position: absolute;
    left: 30px;
    top: 90px;
    div {
      width: 45px;
      height: 45px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    div:hover {
      cursor: pointer;
    }
  }
}
</style>
