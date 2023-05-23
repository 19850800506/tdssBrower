<template>
  <div id="dataManage">
    <div class="content">
      <el-tabs tab-position="left" @tab-click="tabClick">
        <el-tab-pane label="无线电频谱图">
          <photoeLectricity />
        </el-tab-pane>
        <el-tab-pane label="数据回放">
          <playback />
        </el-tab-pane>
        <el-tab-pane label="白名单管理">
          <whiteList />
        </el-tab-pane>
        <el-tab-pane label="无线电异常月报">
          <statistics />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import photoeLectricity from './photoeLectricity.vue'
import playback from './playback.vue'
import whiteList from './whiteList.vue'
import statistics from './statistics.vue'
import headerPlace from '@/layout/components/header.vue'

export default {
  components: {
    photoeLectricity,
    playback,
    whiteList,
    statistics,
    headerPlace,
  },
  data() {
    return {
      tabPosition: 'left',
      checkIndex: 0,
    }
  },
  methods: {
    tabClick(event) {
      console.log(event.index, 'el')
      this.checkIndex = event.index
    },
  },
}
</script>
<style lang="scss">
#dataManage {
  margin-left: 37px;
  width: 97%;
  height: 84vh;
  background-image: url('../../assets/images/placeBg.png');
  background-size: 100% 100%;
  color: #fff;
  overflow: hidden;
  .content {
    z-index: 9;
    width: 100%;
    height: calc(100vh - 76px);
    background-color: rgba(14, 50, 52, 0.8);
    .el-tabs--left {
      height: 100%;
    }
    .el-tabs__nav-scroll {
      overflow: hidden;
      // display: flex;
      // align-items: center;
      .el-tabs__item {
        text-align: right;
        color: #fff;
        // margin-bottom: 64px;
      }
      .el-tabs__item.is-active {
        color: #18fefe;
      }
    }
    .el-tabs__content {
      height: 100%;
    }
    .el-tab-pane {
      height: 100%;
    }
  }
}
</style>
