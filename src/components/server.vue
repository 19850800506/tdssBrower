<template>
  <div id="sever">
    <left />
    <!-- <middleleft /> -->
  </div>
</template>
<script>
import left from './server/left.vue'
// import middleleft from './server/middleleft.vue'

export default {
  components: {
    left,
    // middleleft,
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {},
}
</script>
<style scoped lang="scss">
#sever {
  pointer-events: auto;
  position: absolute;
  bottom: 0;
  width: 100%;
  // height: 186px;
  height: 200px;
  background-image: url('../assets/images/Statusbar/Background.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  // flex-direction: row;
  // justify-content: space-between;
  // overflow: hidden;

  .middle_right {
    width: 9.9%;
    margin-top: 24px;
    margin-left: 3px;
    img {
      width: 100%;
    }
  }
  .right_left {
    width: 20.8%;
    position: relative;
    margin-top: 22px;
    margin-left: 7px;
    .imgbg {
      position: absolute;
      width: 100%;
      z-index: 999;
    }
    .lefttop_text {
      position: absolute;
      left: 22px;
      top: 5px;
      z-index: 1000;
      color: #92c1c7;
    }
    .img1 {
      position: absolute;
      left: 6px;
      top: 20px;
      width: 164px;
      z-index: 999;
    }
    .img2 {
      position: absolute;
      left: 6px;
      top: 26px;
      width: 164px;
      z-index: 999;
    }
    .righttop_text {
      position: absolute;
      right: 22px;
      top: 5px;
      z-index: 1000;
      color: #92c1c7;
    }
    .img3 {
      position: absolute;
      right: 6px;
      top: 20px;
      width: 164px;
      z-index: 999;
    }
    .img4 {
      position: absolute;
      right: 6px;
      top: 26px;
      width: 164px;
      z-index: 999;
    }
    .leftbottom_text {
      position: absolute;
      left: 22px;
      top: 72px;
      z-index: 1000;
      color: #92c1c7;
    }
    .img5 {
      position: absolute;
      left: 6px;
      top: 87px;
      width: 164px;
      z-index: 999;
    }
    .img6 {
      position: absolute;
      left: 6px;
      top: 94px;
      width: 164px;
      z-index: 999;
    }
    .rightbottom_text {
      position: absolute;
      right: 22px;
      top: 72px;
      z-index: 1000;
      color: #92c1c7;
    }
    .img7 {
      position: absolute;
      right: 6px;
      top: 87px;
      width: 164px;
      z-index: 999;
    }
    .img8 {
      position: absolute;
      right: 6px;
      top: 94px;
      width: 164px;
      z-index: 999;
    }
    .img9 {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 100%;
    }
  }
  .right_right {
    width: 19%;
    position: relative;
    margin-top: 21px;
    margin-left: 1px;
    // background: #053237;
    height: 138px;
    .img1 {
      position: absolute;
      width: 100%;
    }
    .StateBack {
      .strikeState {
        width: 384px;
        position: absolute;
        z-index: 999;
        top: 1px;
        left: 1px;
      }
    }

    .orient {
      .img2 {
        position: absolute;
        left: 9px;
        top: 10px;
        width: 13%;
        z-index: 999;
      }
      .img3 {
        position: absolute;
        left: 2px;
        top: 0px;
        width: 100%;
        z-index: 998;
      }
    }
    .omnibearing {
      .img4 {
        position: absolute;
        left: 2px;
        top: 65px;
        width: 100%;
      }
      .img5 {
        position: absolute;
        right: 6px;
        top: 75px;
        width: 13%;
      }
    }
  }
}
</style>
