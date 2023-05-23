<template>
  <div class="warning-record" id="record">
    <div v-show="false" id="alarmEcharts"></div>
    <div v-show="false" id="abnorMonthEcharts"></div>
    <div v-show="false" id="abnorHourEcharts"></div>
    <div v-show="false" id="abnorpointEchart"></div>
    <div class="header dialog_header">
      <span class="text">预警记录</span>
    </div>
    <img
      class="linkimg"
      @click="closeBtn"
      src="../../assets/images/Component/Horizon/Close.png"
      alt=""
    />
    <div class="handle-box">
      <div class="start-time">
        <span>开始日期：</span>
        <el-date-picker
          v-model="params.start_time"
          class="el-range-input"
          type="month"
          placeholder="请选择开始日期"
        >
        </el-date-picker>
      </div>
      <el-button
        class="searchBtn"
        type="primary"
        size="mini"
        icon="el-icon-search"
        @click="getList('search')"
        >查询</el-button
      >
      <el-button
        class="exportBtn"
        type="primary"
        size="mini"
        @click="exportBtn"
      >
        导出</el-button
      >
    </div>
    <div class="alarm-table">
      <el-table
        :data="warningInfo"
        style="width: 96%"
        height="443"
        :header-cell-style="{
          background: '#0A3639',
          color: '#b0e5eb',
          fontWeight: '100',
        }"
      >
        <el-table-column
          type="index"
          label="序号"
          width="55"
          align="left"
          :index="Nindex"
        >
        </el-table-column>
        <el-table-column
          v-for="(item, i) in columnData"
          :key="i"
          :label="item.label"
          :prop="item.prop"
          align="left"
        />
      </el-table>
    </div>
    <div class="pagination-box" v-show="total > 0">
      <div class="pagination">
        <div @click="fitstBtn()">
          <img src="../../assets/images/Common/First.png" alt="" />
        </div>
        <div @click="previousBtn()">
          <img src="../../assets/images/Common/Previous.png" alt="" />
        </div>
        <p>
          <span>第</span>
          <input
            @input="value = value.replace(/[^\d.]/g)"
            v-model="params.page"
            type="number"
            @keydown.enter="handleKeyDown"
          />
          <span>页</span>
        </p>
        <div @click="nextBtn()">
          <img src="../../assets/images/Common/Next.png" alt="" />
        </div>
        <div @click="lastBtn()">
          <img src="../../assets/images/Common/Last.png" alt="" />
        </div>
        <p>共 {{ this.total }} 页</p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  getWarningInfo,
  getAlarmStatistics,
  exportAlarm,
} from '../../api/record/alarmRecord'
import { parseTime } from '@/utils/index.js'
import { getMothlyreport } from '../../api/radio/radio'

export default {
  props: ['warningRecordShow'],
  data() {
    return {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      columnData: [
        {
          label: '开始时间',
          prop: 'start_time',
        },
        {
          label: '结束时间',
          prop: 'end_time',
        },
        {
          label: '报警时长(s)',
          prop: 'dur_seconds',
        },
        {
          label: '是否处置',
          prop: 'handled',
        },
      ],
      params: {
        page: 1,
        pageSize: 10,
        start_time: new Date(new Date().getFullYear(), new Date().getMonth()),
        end_time: new Date(new Date().getFullYear(), new Date().getMonth() + 1),
        pid: '',
        enable: true,
      },
      alarmParams: {
        pid: '',
        year: '',
        mounth: '',
        enable: true,
        img_data: [], // 预警统计数据图
        radio_mounth: [], // 无线电异常月报图
        radio_hour: [], // 无线电异常小时分析图
        radio_top10: [], // Top10异常频点
      },
      warningInfo: [],
      total: 0,
      alarmChart: null,
      loading: false,
    }
  },
  computed: {
    ...mapGetters(['currentPositionId', 'unusual', 'hourly', 'freq']),
  },
  watch: {
    warningRecordShow(newVal) {
      if (newVal) {
        this.params.pid = this.currentPositionId
        this.alarmParams.pid = this.currentPositionId
        this.getList()
      }
    },
    currentPositionId(newVal) {
      this.params.pid = newVal
      this.alarmParams.pid = newVal
      if (this.warningRecordShow) {
        this.getList()
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    Nindex(index) {
      const { page } = this.params
      const { pageSize } = this.params
      return index + 1 + (page - 1) * pageSize
    },
    getList(value) {
      if (value === 'search') {
        this.params.page = 1
      }
      this.warningInfo = []
      // if (this.params.start_time && this.params.end_time) {
      //   if (
      //     new Date(this.params.end_time).getTime() <
      //     new Date(this.params.start_time).getTime()
      //   ) {
      //     this.$message.warning('结束时间不能小于开启时间')
      //     return
      //   }
      // }
      this.params.start_time = parseTime(this.params.start_time, '{y}-{m}-{d}')
      const endTime = new Date(
        new Date(this.params.start_time).getFullYear(),
        new Date(this.params.start_time).getMonth() + 1
      )
      this.params.end_time = parseTime(endTime, '{y}-{m}-{d}')
      getWarningInfo(this.params).then((res) => {
        if (res.code === 0) {
          this.total = res.data.pageCount
          this.warningInfo = res.data.data
          this.warningInfo.map(
            (item) => (item.handled = item.handled ? '是' : '否')
          )
        }
      })
    },
    closeBtn() {
      this.$emit('warningRecordBtn')
    },
    fitstBtn() {
      this.params.page = 1
      this.getList()
    },
    lastBtn() {
      this.params.page = this.total
      this.getList()
    },
    previousBtn() {
      if (this.params.page > 1 && this.params.page <= this.total) {
        this.params.page = this.params.page - 1
        if (this.params.page <= 1) {
          this.params.page = 1
        }
        this.getList()
      }
    },
    nextBtn() {
      if (this.params.page >= 1 && this.params.page < this.total) {
        this.params.page = this.params.page * 1 + 1
        if (this.params.page >= this.total) {
          this.params.page = this.total
        }
        this.getList()
      }
    },
    // 导出模板
    exportBtn() {
      if (this.loading) {
        this.$message.warning('正在请求，请稍等。。。')
        return
      }
      const date = parseTime(this.params.start_time, '{y}-{m}')
      this.alarmParams.year = date.split('-')[0]
      this.alarmParams.mounth = date.split('-')[1].replace(/\b(0+)/gi, '')
      this.loading = true
      getAlarmStatistics({
        pid: this.alarmParams.pid,
        year: this.alarmParams.year,
        mounth: this.alarmParams.mounth,
        enable: true,
      })
        .then((res) => {
          if (res.code == 0) {
            this.alarmChart = this.$echarts.init(
              document.getElementById('alarmEcharts')
            )
            this.initecharts(res.data)
            if (window.config.radioShow) {
              getMothlyreport({
                month: date,
              })
                .then((res) => {
                  this.abnorMonthChart = this.$echarts.init(
                    document.getElementById('abnorMonthEcharts')
                  )
                  this.initmonthlyMagazine(res.data.monthly_result)
                  //
                  this.abnorHourChart = this.$echarts.init(
                    document.getElementById('abnorHourEcharts')
                  )
                  this.inithourAnalyse(res.data.hourly_result)
                  //
                  this.abnorPointChart = this.$echarts.init(
                    document.getElementById('abnorpointEchart')
                  )
                  this.initnorpoint(res.data.freq_result)
                  setTimeout(() => {
                    exportAlarm(this.alarmParams)
                      .then((res) => {
                        this.loading = false
                        const url = URL.createObjectURL(res)
                        const domA = document.createElement('a')
                        domA.setAttribute('download', '')
                        domA.setAttribute('href', url)
                        domA.download = `${date}：预警报告.docx`
                        domA.click()
                      })
                      .catch(() => {
                        this.loading = false
                      })
                  }, 1000)
                })
                .catch(() => {
                  this.loading = false
                })
            } else {
              setTimeout(() => {
                const { alarmParams } = this
                delete alarmParams.radio_hour
                delete alarmParams.radio_mounth
                delete alarmParams.radio_top10
                exportAlarm(alarmParams)
                  .then((response) => {
                    this.loading = false
                    if (response.code === 1) {
                      this.$message.error(response.msg)
                    } else {
                      const url = URL.createObjectURL(response)
                      const domA = document.createElement('a')
                      domA.setAttribute('download', '')
                      domA.setAttribute('href', url)
                      domA.download = `${date}：预警报告.docx`
                      domA.click()
                    }
                  })
                  .catch(() => {
                    this.loading = false
                  })
              }, 1000)
            }
          }
        })
        .catch(() => {
          this.loading = false
        })
      this.image = ''
    },
    initecharts(value) {
      const option = {
        color: ['rgba(236, 195, 77, 1)', 'rgba(19, 167, 164, 1)'],
        legend: {
          top: 20,
          textStyle: {
            color: '#fff',
          },
          data: ['预警', '处置'],
        },
        xAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#fff',
            },
          },
          data: value.xdata,
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#fff',
            },
          },
        },
        series: [
          {
            name: '预警',
            data: value.ydata_alarm,
            type: 'line',
          },
          {
            name: '处置',
            data: value.ydata_handled,
            type: 'line',
          },
        ],
      }
      this.alarmChart.setOption(option)
      setTimeout(() => {
        const opts = {
          type: 'png',
          pixelRatio: 1,
          backgroundColor: '#242a29',
          excludeComponents: ['toolbox'],
        }
        const resBase64 = this.alarmChart.getDataURL(opts).split(',')[1]
        if (resBase64) {
          this.alarmParams.img_data = resBase64
        }
      }, 500)
    },
    // 月报异常次数
    initmonthlyMagazine(value) {
      const xData = []
      const yData = []
      for (const key in value) {
        yData.push(value[key])
        xData.push(parseTime(key, '{m}-{d}'))
      }
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
          name: '异常发生次数',
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
      this.abnorMonthChart.setOption(option)
      setTimeout(() => {
        const opts = {
          type: 'png',
          pixelRatio: 1,
          backgroundColor: '#242a29',
          excludeComponents: ['toolbox'],
        }
        const monthresBase64 = this.abnorMonthChart
          .getDataURL(opts)
          .split(',')[1]
        if (monthresBase64) {
          this.alarmParams.radio_mounth = monthresBase64
        }
      }, 500)
    },
    // 异常小时分析
    inithourAnalyse(value) {
      const xData = []
      const yData = []
      for (const key in value) {
        xData.push(key)
      }
      xData.sort()
      xData.forEach((el) => {
        yData.push(value[el])
      })
      const option = {
        grid: {
          left: '50px',
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
          name: '总量',
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
      this.abnorHourChart.setOption(option)
      setTimeout(() => {
        const opts = {
          type: 'png',
          pixelRatio: 1,
          backgroundColor: '#242a29',
          excludeComponents: ['toolbox'],
        }
        const hourresBase64 = this.abnorHourChart.getDataURL(opts).split(',')[1]
        if (hourresBase64) {
          this.alarmParams.radio_hour = hourresBase64
        }
      }, 500)
    },
    // 异常频点
    initnorpoint(value) {
      const xData = []
      const yData = []
      value.forEach((item) => {
        xData.push(item[1])
        yData.push(`${item[0]}GHz`)
      })
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
          axisLabel: {
            color: '#fff',
          },
        },
        series: [
          {
            data: xData,
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
      this.abnorPointChart.setOption(option)
      setTimeout(() => {
        const opts = {
          type: 'png',
          pixelRatio: 1,
          backgroundColor: '#242a29',
          excludeComponents: ['toolbox'],
        }
        const pointresBase64 = this.abnorPointChart
          .getDataURL(opts)
          .split(',')[1]
        if (pointresBase64) {
          this.alarmParams.radio_top10 = pointresBase64
        }
      }, 500)
    },
  },
}
</script>
<style scoped lang="scss">
#record {
  z-index: 101;
  position: relative;
  &.warning-record {
    width: 800px;
    height: 600px;
    position: absolute;
    bottom: 190px;
    left: 463px;
    background-position: 0 0;
    background-image: url('../../assets/images/Component/Horizon/Background.png');
    background-size: 100% 100%;
    #alarmEcharts,
    #abnorMonthEcharts,
    #abnorHourEcharts,
    #abnorpointEchart {
      position: absolute;
      top: 70px;
      left: 25px;
      width: 750px;
      height: 500px;
    }
    .header {
      width: 774px;
      height: 20px;
      position: relative;
      top: 13px;
      left: 13px;
      background-image: url('../../assets/images/Titlebar/Plan/TopBackground.png');
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
      cursor: pointer;
      width: 14px;
      height: 14px;
      position: absolute;
      right: 20px;
      top: 17px;
    }
    .date {
      width: 375px;
      height: 30px;
      position: relative;
      top: 20px;
      left: 12px;
      .date-selector {
        width: 200px;
        height: 30px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        background-image: url(../../assets/images/Titlebar/Setting/AttackType.png);
        background-size: 200px 30px;
        background-position: 0 0;
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
        }
        .year,
        .month,
        .day {
          width: 60px;
          height: 22px;
          display: flex;
          justify-content: space-between;
          span {
            display: inline-block;
            width: 10px;
            height: 22px;
            background-color: #43686c;
            display: flex;
            align-items: center;
            i {
              color: black;
            }
            i:hover {
              cursor: pointer;
            }
          }
          .left {
            border-radius: 8px 0 0 8px;
          }
          .right {
            border-radius: 0 8px 8px 0;
          }
          .input {
            width: 37px;
            height: 22px;
            border: none;
            background-color: #43686c;
            color: #b0e5eb;
            text-align: center;
          }
        }
      }
      .tool-date {
        width: 45px;
        height: 30px;
        background-image: url(../../assets/images/Login/LoginDefult.png);
        background-size: 45px 30px;
        background-position: 0 0;
        line-height: 30px;
        text-align: center;
        color: black;
        position: absolute;
        top: 0;
        left: 210px;
      }
      .share {
        width: 30px;
        height: 30px;
        background-image: url(../../assets/images/Titlebar/Plan/Checked.png);
        background-size: cover;
        position: absolute;
        top: 0;
        right: 5px;
      }
    }
    .handle-box {
      width: 750px;
      height: 30px;
      display: flex;
      align-items: center;
      margin-top: 20px;
      margin-left: 20px;
      .start-time {
        span {
          color: #b0e5eb;
        }
      }
    }
    .alarm-table {
      width: 99%;
      position: relative;
      left: 25px;
      top: 14px;
      overflow-x: hidden;
      .line {
        width: 375px;
        height: 10px;
        border-top: 2px solid white;
      }
      ::v-deep .el-table,
      .el-table__expanded-cell {
        background-color: transparent;
        color: #b0e5eb;
      }
      ::v-deep .el-table thead tr th.is-leaf {
        border: 0px solid #ebeef5;
        border-right: none;
      }
      ::v-deep .el-table {
        border: 0;
        th,
        tr,
        td {
          border: 0;
        }
        &::before {
          height: 0px;
        }
        &::after {
          width: 0;
        }
        .el-table__fixed:before {
          height: 0;
        }
      }
      //整个table的背景颜色
      ::v-deep .el-table,
      .el-table__expanded-cell {
        background-color: transparent;
        color: #b0e5eb;
      }
      ::v-deep .el-table tr {
        background-color: transparent !important;
        height: 55px;
      }
      ::v-deep .el-table tbody tr:hover > td {
        background-color: rgba($color: #0a3639, $alpha: 0.5) !important;
      }
      ::v-deep .el-table-enable-row-transition .el-table__body td,
      .el-table .cell {
        background-color: transparent;
      }
    }
    .alarm-table::-webkit-scrollbar {
      width: 0 !important;
    }
    .alarm-table {
      -ms-overflow-style: none;
    }
    .alarm-table {
      overflow: -moz-scrollbars-none;
    }
    .pagination-box {
      width: 100%;
      height: 30px;
      // margin-left: 22px;
      margin: 0 auto;
      margin-top: 40px;
      .pagination {
        display: flex;
        justify-content: center;
        position: relative;
        div {
          width: 25px;
          height: 25px;
          position: relative;
          bottom: -5px;
          margin-right: 4px;
        }
        div:hover {
          background-color: #064f54;
        }
        div:nth-child(1) img,
        div:nth-child(5) img {
          width: 14px;
          height: 14px;
          position: absolute;
          left: 5px;
          top: 8px;
        }
        div:nth-child(2) img,
        div:nth-child(4) img {
          width: 8px;
          height: 14px;
          position: absolute;
          left: 8px;
          top: 8px;
        }

        p:nth-child(3) {
          position: relative;
          span {
            display: inline-block;
            margin: 10px 3px 0 3px;
          }
          input::-webkit-outer-spin-button,
          input::-webkit-inner-spin-button {
            -webkit-appearance: none;
          }
          input {
            height: 22px;
            width: 40px;
            border-radius: 3px;
            border: none;
            background-color: #066465;
            position: relative;
            bottom: 0px;
            color: white;
            padding-left: 3px;
          }
        }
        p:nth-child(6) {
          margin-top: 12px;
          font-size: 13px;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.el-notification {
  &.notifyclass {
    background-color: #042929;
    border-radius: 0;
    width: 420px;
    .el-notification__title {
      color: #b0e5eb;
    }
    .el-notification__content {
      color: #d3d3d3;
    }
  }
}
</style>
