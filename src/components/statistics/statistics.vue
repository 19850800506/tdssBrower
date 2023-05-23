<template>
  <div class="statis" id="statistics">
    <div class="header dialog_header">
      <span class="text">统计</span>
    </div>
    <img
      class="linkimg"
      @click="closeBtn"
      src="../../assets/images/Component/Horizon/Close.png"
      alt=""
    />
    <div class="statisContent">
      <div class="accAlarm">
        <div class="text">累计预警次数：</div>
        <span class="content">{{ this.warningData.allalarmcount }}</span>
      </div>
      <div class="accAlarm">
        <div class="text">累计处置次数：</div>
        <span class="content">{{ this.warningData.alldealcount }}</span>
      </div>
      <div class="accAlarm">
        <div class="text">昨日预警次数：</div>
        <span class="content">{{ this.warningData.yesterdayalarmcount }}</span>
      </div>
      <div class="accAlarm">
        <div class="text">今日预警次数：</div>
        <span class="content">{{ this.warningData.todayalarmcount }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { content } from '../../api/record/alarmRecord'

export default {
  props: ['statistics'],
  data() {
    return {
      closeStatis: true,
      params: {
        positionIds: '',
      },
      // 统计预警
      warningData: {
        allalarmcount: 0,
        alldealcount: 0,
        todayalarmcount: 0,
        yesterdayalarmcount: 0,
      },
    }
  },
  computed: {
    ...mapGetters(['currentPositionId']),
  },
  watch: {
    statistics(newVal) {
      if (newVal) {
        this.getList()
      }
    },
    currentPositionId(newVal) {
      this.params.positionIds = newVal
      if (this.statistics) {
        this.getList()
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    getList() {
      content(this.params).then((response) => {
        this.warningData = { ...response.data }
      })
    },
    closeBtn() {
      this.$emit('statisticsBtn')
    },
  },
}
</script>
<style scoped lang="scss">
#statistics {
  z-index: 101;
  &.statis {
    width: 400px;
    height: 240px;
    position: absolute;
    top: 140px;
    left: 450px;
    background-image: url(../../assets/images/Component/Horizon/Background.png);
    background-size: 400px 240px;
    background-position: 0 0;
    .header {
      width: 375px;
      height: 20px;
      position: relative;
      top: 13px;
      left: 12px;
      background-image: url(../../assets/images/Titlebar/Plan/TopBackground.png);
      background-size: cover;
      span {
        display: inline-block;
        font-size: 12px;
        margin-left: 3px;
        margin-top: 2px;
        color: #b0e5eb;
      }
    }
    .linkimg {
      width: 14px;
      height: 14px;
      position: absolute;
      right: 19px;
      top: 16px;
      cursor: pointer;
    }
    .statisContent {
      width: 375px;
      height: 196px;
      position: relative;
      top: 15px;
      left: 12px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-content: space-between;
      .accAlarm {
        width: 185px;
        height: 95px;
        border: 1px solid #b0e5eb;
        .text {
          margin-top: 2px;
          margin-left: 2px;
          color: #b0e5eb;
        }
        .content {
          display: inline-block;
          width: 100%;
          height: 70px;
          text-align: center;
          line-height: 70px;
          font-size: 25px;
          color: #b0e5eb;
          font-family: 'lcdd';
        }
      }
    }
  }
}
</style>
