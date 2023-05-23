<template>
  <div id="main_menu">
    <div class="main_menu" @mouseleave="mouseLeave">
      <img
        class="menu_img"
        src="../../assets/images/Titlebar/Menu/main_menu.png"
        alt=""
      />
      <!-- 二级菜单 -->
      <div class="submenu">
        <div v-show="exampleShow || secondaryShow" class="conceal_box"></div>
        <div class="example secondary-menu">
          <img
            @click="exampleShow = !exampleShow"
            src="../../assets/images/Titlebar/Menu/coverage.png"
            alt=""
          />
          <!-- 案例库、参数、预案 -->
          <div v-show="exampleShow" class="secondary">
            <el-tooltip
              effect="dark"
              content="案例库"
              placement="top"
              :enterable="false"
            >
              <img
                :class="{ actives: caseShow == true }"
                @click="caseStore"
                src="../../assets/images/Titlebar/Menu/CaseDefult_1.png"
                alt=""
              />
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="无人机参数"
              placement="top"
              :enterable="false"
            >
              <img
                :class="{ actives: uavShow == true }"
                @click="uavParameter"
                src="../../assets/images/Titlebar/Menu/UavDefult_1.png"
                alt=""
              />
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="预案"
              placement="top"
              :enterable="false"
            >
              <img
                :class="{ actives: warningShow == true }"
                @click="warningclick"
                src="../../assets/images/Titlebar/Menu/PlanDefult_1.png"
                alt=""
              />
            </el-tooltip>
          </div>
        </div>
        <div class="analyse secondary-menu">
          <img
            @click="secondaryShow = !secondaryShow"
            src="../../assets/images/Titlebar/Menu/filter.png"
            alt=""
          />
          <!-- 报警次数统计、入侵方位分析、处置记录、统计 -->
          <div v-show="secondaryShow" class="secondary">
            <el-tooltip
              effect="dark"
              content="报警次数统计"
              placement="top"
              :enterable="false"
            >
              <img
                @click="alarmStatistics"
                src="../../assets/images/Titlebar/Menu/alert_mode.png"
                alt=""
              />
            </el-tooltip>
            <!-- <el-tooltip effect="dark" content="入侵方位分析" placement="top">
              <img
                @click="intrudeOrientation"
                src="../../assets/images/Titlebar/Menu/invade.png"
                alt=""
              />
            </el-tooltip> -->
            <!-- <el-tooltip effect="dark" content="处置记录" placement="top">
              <img
                @click="alarmRecord"
                src="../../assets/images/Titlebar/Menu/dispose.png"
                alt=""
              />
            </el-tooltip> -->
            <el-tooltip
              effect="dark"
              content="预警记录"
              placement="top"
              :enterable="false"
            >
              <img
                @click="warningRecordBtn"
                src="../../assets/images/Titlebar/Menu/analyze.png"
                alt=""
              />
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="统计"
              placement="top"
              :enterable="false"
            >
              <img
                @click="statisticsBtn"
                src="../../assets/images/Titlebar/Menu/statistics.png"
                alt=""
              />
            </el-tooltip>
            <el-tooltip
              v-if="radioShow"
              effect="dark"
              content="无线电监测"
              placement="top"
              :enterable="false"
            >
              <img
                @click="radioBtn"
                src="../../assets/images/Titlebar/Menu/invade.png"
                alt=""
              />
            </el-tooltip>
          </div>
        </div>
        <img
          class="setting"
          :class="{ actives: settingShow == true }"
          @click="settingclick"
          src="../../assets/images/Titlebar/Menu/seeting.png"
          alt=""
        />
      </div>
    </div>
    <caseStore
      v-dialogDrag
      v-show="caseShow"
      :caseShow="caseShow"
      @caseclose="caseShow = false"
    ></caseStore>
    <uavParameterVue
      v-dialogDrag
      v-show="uavShow"
      :uavShow="uavShow"
      @uavParameterclose="uavShow = false"
    ></uavParameterVue>
    <warning
      v-dialogDrag
      v-show="warningShow"
      :warningShow="warningShow"
      @warmingclose="warningShow = false"
    ></warning>
    <setting
      v-dialogDrag
      v-show="settingShow"
      @whiteclick="whiteclick"
      @settingclose="settingShow = false"
    ></setting>
    <whitelist
      v-show="whitelistShow"
      :whitelistShow="whitelistShow"
    ></whitelist>
    <alarm-times
      v-dialogDrag
      v-show="alarmShow"
      :alarmShow="alarmShow"
      @closealarm="alarmShow = false"
    ></alarm-times>
    <azimuth
      v-dialogDrag
      @intrudeOrientation="intrudeOrientation"
      :intrudeShow="intrudeShow"
      v-show="intrudeShow"
    ></azimuth>
    <alarm-record
      ref="alarmRecord"
      :type="$route.query.deviceType"
      v-dialogDrag
      :record="record"
      @alarmRecord="alarmRecord"
      v-show="record"
    ></alarm-record>
    <warningRecord
      v-dialogDrag
      @warningRecordBtn="warningRecordBtn"
      :warningRecordShow="warningRecordShow"
      v-show="warningRecordShow"
    ></warningRecord>
    <statistics
      v-dialogDrag
      @statisticsBtn="statisticsBtn"
      :statistics="statistics"
      v-show="statistics"
    ></statistics>
    <photoelectricity
      style="position: absoule; left: 0"
      @closeBtn="radio = false"
      v-dialogDrag
      v-if="radio"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import caseStore from '../../components/menus/case.vue'
import uavParameterVue from '../../components/menus/uavParameter.vue'
import warning from '../../components/menus/warning.vue'
import setting from '../../components/menus/setting.vue'
import whitelist from '../../components/menus/whitelist.vue'
import { parseTime } from '@/utils/index.js'
import alarmTimes from '../../components/statistics/alarmTimes.vue'
import alarmRecord from '../../components/statistics/alarmRecord.vue'
import statistics from '../../components/statistics/statistics.vue'
import azimuth from '../../components/statistics/azimuth.vue'
import warningRecord from '../../components/statistics/warningRecord.vue'
import photoelectricity from '../../components/deviceType/photoelectricity.vue'

export default {
  components: {
    caseStore,
    uavParameterVue,
    warning,
    setting,
    whitelist,
    alarmTimes,
    alarmRecord,
    statistics,
    azimuth,
    warningRecord,
    photoelectricity,
  },
  data() {
    return {
      caseShow: false, // 案例库
      uavShow: false, // 无人机库
      warningShow: false, // 预案
      settingShow: false, // 设置
      whitelistShow: false, // 白名单
      alarmShow: false, // 报警次数统计
      intrudeShow: false, // 入侵方位分析
      warningRecordShow: false, // 报警记录分析
      record: false, // 处置记录
      statistics: false, // 统计
      radio: false, // 无线电监测
      exampleShow: false, // 实例菜单
      secondaryShow: false, // 分析菜单
      radioShow: window.config.radioShow,
      params: {
        open: false,
      },
      currentdate: parseTime(new Date(), '{y}-{m}-{d}'),
    }
  },
  mounted() {},
  methods: {
    // 鼠标移出菜单子菜单自动收回
    mouseLeave() {
      this.exampleShow = false
      this.secondaryShow = false
    },
    caseStore() {
      this.caseShow = !this.caseShow
      this.uavShow = false
      this.warningShow = false
      this.settingShow = false
    },
    uavParameter() {
      this.caseShow = false
      this.uavShow = !this.uavShow
      this.warningShow = false
      this.settingShow = false
    },
    warningclick() {
      this.uavShow = false
      this.caseShow = false
      this.warningShow = !this.warningShow
      this.settingShow = false
    },
    settingclick() {
      this.uavShow = false
      this.caseShow = false
      this.warningShow = false
      this.settingShow = !this.settingShow
    },
    whiteclick(value) {
      this.whitelistShow = value
    },
    alarmStatistics() {
      this.alarmShow = !this.alarmShow
    },
    intrudeOrientation() {
      this.intrudeShow = !this.intrudeShow
    },
    alarmRecord() {
      this.record = !this.record
    },
    statisticsBtn() {
      this.statistics = !this.statistics
    },
    radioBtn() {
      this.radio = !this.radio
    },
    warningRecordBtn() {
      this.warningRecordShow = !this.warningRecordShow
    },
  },
}
</script>
<style scoped lang="scss">
#main_menu {
  pointer-events: auto;
  .main_menu:hover .submenu {
    display: block;
  }
  .main_menu {
    position: absolute;
    right: 30px;
    top: 90px;
    img {
      width: 44px;
      height: 44px;
      cursor: pointer;
    }
    .submenu {
      display: none;
      position: absolute;
      .conceal_box {
        position: absolute;
        width: 138px;
        height: 185px;
        top: -45px;
        left: -138px;
      }
      .secondary-menu {
        img {
          width: 38px;
          height: 38px;
          margin-top: 5px;
          margin-left: 3px;
        }
        .secondary {
          width: auto;
          height: 45px;
          position: absolute;
          display: flex;
          img {
            margin-right: 5px;
            margin-top: 0;
          }
        }
      }
      .example {
        .secondary {
          top: 5px;
          left: -138px;
        }
      }
      .analyse {
        .secondary {
          top: 50px;
          right: 40px;
        }
      }
      .setting {
        width: 38px;
        height: 38px;
        margin-left: 3px;
        margin-top: 5px;
      }
    }
  }
}
</style>
