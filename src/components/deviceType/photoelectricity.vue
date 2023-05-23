<template>
  <div id="radiobox">
    <div class="radiobox">
      <div class="headerbg dialog_header">
        <img src="../../assets/images/radarImage/Log.png" class="imglogo" />
        <span>无线电环境监测</span>
      </div>
      <img
        @click="closebutton"
        src="../../assets/images/radarImage/Close.png"
        class="imgclose"
      />
      <dataManage></dataManage>
    </div>
  </div>
</template>
<script>
import dataManage from '../../views/dataManage/index.vue'

export default {
  components: {
    dataManage,
  },
  methods: {
    closebutton() {
      this.$emit('closeBtn')
    },
  },
}
</script>
<style lang="scss" scoped>
#radiobox {
  z-index: 101;
  .radiobox {
    width: 1835px;
    height: 90vh;
    background-image: url('../../assets/images/radarImage/Background.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    .headerbg {
      width: 98%;
      margin: 0 auto;
      margin-top: 17px;
      height: 22px;
      background-image: url('../../assets/images/radarImage/Top.png');
      background-size: cover;
      position: relative;
      .imglogo {
        width: 15px;
        height: 15px;
        margin: 3px 0 0 5px;
      }
      span {
        position: absolute;
        top: 3px;
        left: 27px;
        font-size: 12px;
        color: #b0e5eb;
      }
      .btn_container {
        position: absolute;
        top: 3px;
        right: 60px;
        display: flex;
        div {
          margin-left: 5px;
          cursor: pointer;
        }
      }
    }
    .imgclose {
      cursor: pointer;
      position: absolute;
      top: 21px;
      right: 23px;
      width: 14px;
      height: 14px;
    }
    #complete_charts {
      width: 800px;
      height: 440px;
      margin: 0 auto;
    }
    .canvas_container {
      width: 720px;
      height: 400px;
      margin: 0 auto;
      margin-top: 20px;
      position: relative;
      #stripcanvas {
        position: absolute;
        left: 0;
        top: 72px;
      }
      #canvas {
        position: absolute;
        left: 20px;
      }
    }
  }
}
</style>
