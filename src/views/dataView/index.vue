<template>
  <div id="dataView">
    <top-header />
    <!-- <date-echarts /> -->
    <uav-intrusion v-if="dateViewShow" />
    <bottom-footer v-show="dateViewShow" />
    <!-- <alarm-menu /> -->
    <position-change v-show="dateViewShow" />
    <notification v-show="dateViewShow" />
    <main-menu v-show="dateViewShow" />
    <findUavList v-show="dateViewShow" />
    <!-- <strikeResult
      v-if="assessshow && dateViewShow"
      v-dialogDrag
      :strikeParams="strikeParams"
      @closestrike="assessshow = false"
      @clearTimer="clearTimer"
    ></strikeResult> -->
    <!-- <strikeResult /> -->
    <protocolWhiteList
      v-dialogDrag
      v-if="this.whitePopup"
      :whiteListData="this.whiteListData"
      v-show="dateViewShow"
    ></protocolWhiteList>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import topHeader from '@/layout/components/header.vue'
import bottomFooter from '@/layout/components/footer.vue'
import uavIntrusion from '@/layout/components/uavintrusion.vue'
// import dateEcharts from '@/layout/components/dateecharts.vue'
// import alarmMenu from '@/layout/components/alarmMenu.vue'
import positionChange from '@/layout/components/positionChange.vue'
import notification from '@/layout/components/notification.vue'
import mainMenu from '@/layout/components/mainMenu.vue'
import findUavList from '@/layout/components/findUavList.vue'
import strikeResult from '@/layout/components/strikeResult.vue'
import protocolWhiteList from '../../components/deviceControl/protocolWhiteList.vue'

export default {
  components: {
    topHeader,
    bottomFooter,
    uavIntrusion,
    // dateEcharts,
    // alarmMenu,
    positionChange,
    notification,
    mainMenu,
    findUavList,
    strikeResult,
    protocolWhiteList,
  },
  data() {
    return {
      assessshow: false, // 打击评估
      strikeParams: {},
      timer: null,
    }
  },
  mounted() {},

  computed: {
    ...mapGetters([
      'whitePopup',
      'whiteListData',
      'serverdata',
      'dateViewShow',
    ]),
  },
  watch: {
    serverdata(newVal) {
      if (newVal.data.command === 'jamminResult') {
        if (newVal.data) {
          clearTimeout(this.timer)
          this.assessshow = true
          this.strikeParams = newVal.data.data
          this.timer = setTimeout(() => {
            this.assessshow = false
          }, 10000)
        }
      }
    },
  },
  methods: {
    clearTimer() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.assessshow = false
      }, 10000)
    },
  },
}
</script>
<style scoped lang="scss">
#dataView {
  position: absolute;
  width: 100%;
  min-height: 1080px;
  height: 100vh;
  pointer-events: none;
  overflow: hidden;
  z-index: 999;
}
</style>
