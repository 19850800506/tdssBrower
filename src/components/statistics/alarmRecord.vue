<template>
  <div class="alarm-record" id="record">
    <div class="header dialog_header">
      <span class="text">处置记录</span>
    </div>
    <img
      class="imgclose"
      @click="closeBtn"
      src="../../assets/images/Component/Horizon/Close.png"
      alt=""
    />
    <div class="date">
      <div class="date-selector">
        <div class="year">
          <span class="left"
            ><i @click="dateQueryBtn('minus_year')" class="el-icon-caret-left"></i
          ></span>
          <input
            v-model="year"
            class="input"
            type="number"
            @input="value=value.replace(/[^\d.]/g,)"
            @keydown.enter="handleKeyDown"
          />
          <span class="right"
            ><i @click="dateQueryBtn('add_year')" class="el-icon-caret-right"></i
          ></span>
        </div>
        <div class="month">
          <span class="left"
            ><i @click="dateQueryBtn('minus_month')" class="el-icon-caret-left"></i
          ></span>
          <input
            v-model="month"
            class="input"
            type="number"
            @input="value=value.replace(/[^\d.]/g,)"
            @keydown.enter="handleKeyDown"
          />
          <span class="right"
            ><i @click="dateQueryBtn('add_month')" class="el-icon-caret-right"></i
          ></span>
        </div>
        <div class="day">
          <span class="left"
            ><i @click="dateQueryBtn('minus_day')" class="el-icon-caret-left"></i
          ></span>
          <input
            v-model="day"
            class="input"
            type="number"
            @input="value=value.replace(/[^\d.]/g,)"
            @keydown.enter="handleKeyDown"
          />
          <span class="right"
            ><i @click="dateQueryBtn('add_day')" class="el-icon-caret-right"></i
          ></span>
        </div>
      </div>
    </div>
    <div class="alarm-table">
      <el-table
        :data="alarmList"
        style="width: 100%"
        :header-cell-style="{
          background: '#0A3639',
          color: '#b0e5eb',
          fontWeight: '100',
        }"
      >
        <el-table-column
          label="ID"
          align="center"
          prop="deviceid"
          width="95px"
        />
        <el-table-column
          label="时段"
          align="center"
          prop="timeinterval"
          width="165px"
        />
        <el-table-column
          label="时长"
          align="center"
          prop="duration"
          width="50px"
        />
        <el-table-column
          label="操作"
          align="center"
          prop="model"
          width="65px"
        />
      </el-table>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { record } from '../../api/record/alarmRecord'
import { parseTime } from '@/utils/index.js'

export default {
  props: ['record'],
  data() {
    return {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
      closeRecord: true,
      today: true,
      params: {
        day: '',
        positionIds: '',
      },
      alarmList: [],
    }
  },
  computed: {
    ...mapGetters(['currentPositionId'])
  },
  watch: {
    record(newVal) {
      if (newVal) {
        this.getList()
      }
    },
    currentPositionId(newVal) {
      this.params.positionIds = newVal
      if (this.record) {
        this.getList()
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    getList() {
      this.params.day = `${this.year}-${
        this.month >= 10 ? this.month : `0${this.month}`
      }-${this.day >= 10 ? this.day : `0${this.day}`}`
      const date = parseTime(new Date(this.params.day), '{y}-{m}-{d}')
      if (this.params.day === date) {
        record(this.params).then((response) => {
          this.alarmList = response.data
        })
      } else {
        this.$notify.error({
          title: '错误',
          message: '日期错误,请重新选择',
          customClass: 'notifyclass',
        })
      }
    },
    closeBtn() {
      this.$emit('alarmRecord')
    },
    // 日期选择
    dateQueryBtn(val){
      if(val==='minus_year') {
        this.year = this.year * 1 - 1
        this.getList()
      } else if(val==='add_year') {
        this.year = this.year * 1 + 1
        this.getList()
      } else if(val==='minus_month') {
        this.month = this.month * 1 - 1
        if (this.month <= 1) {
          this.month = 1
        }
        this.getList()
      } else if(val==='add_month') {
        this.month = this.month * 1 + 1
        if (this.month >= 12) {
          this.month = 12
        }
        this.getList()
      } else if(val==='minus_day') {
        this.day = this.day * 1 - 1
        if (this.day <= 1) {
          this.day = 1
        }
        this.getList()
      } else if(val==='add_day') {
        this.day = this.day * 1 + 1
        this.getList()
      }
    },
    handleKeyDown() {
      if (this.year <= 1) {
        this.year = 2022
      }
      if (this.month <= 1) {
        this.month = 1
      }
      if (this.day <= 1) {
        this.day = 1
      }
      this.getList()
    }
  },
}
</script>
<style scoped lang="scss">
#record {
  &.alarm-record {
    width: 400px;
    height: 280px;
    position: absolute;
    bottom: 190px;
    left: 20px;
    background-image: url(../../assets/images/Component/Horizon/Background.png);
    background-size: 400px 280px;
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
    .imgclose {
      width: 12px;
      height: 12px;
      position: absolute;
      right: 18px;
      top: 18px;
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
    .alarm-table {
      width: 375px;
      height: 180px;
      position: relative;
      left: 10px;
      top: 30px;
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
