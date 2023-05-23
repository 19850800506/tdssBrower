<template>
  <div id="formworkbg">
    <!-- 蒙层 -->
    <div class="bgdiv"></div>
    <div class="formBg">
      <img class="bgImage" src="../../assets/images/positionImg/boxBg_1.png" alt="">
    </div>
    <div class="formwork_title">
      <div class="no_basic" :class="[activeIndex == 0 ? 'basic' : '']" @click="checkclick(0)">
      </div>
      <div class="no_defense" :class="[activeIndex == 1 ? 'defense' : '']" @click="checkclick(1)">
      </div>
    </div>
    <div class="formwork_content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeIndex: 0,
    }
  },
  mounted() {
  },
  methods: {
    // 向父组件发送changeindex事件
    checkclick(value) {
      this.activeIndex = value
      this.$emit('changeindex', value)
    },
  },
}
</script>
<style scoped lang="scss">
#formworkbg {
  position: relative;
  width: 360px;
  height: 279px;
  box-sizing: border-box;
  pointer-events: auto;
  .bgdiv {
    position: absolute;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(1px);
  }
  .formBg {
    position: absolute;
    width: 100%;
    height: 100%;
    .bgImage {
      width: 100%;
      height: 100%;
    }
  }
  .formwork_content {
    margin: 0 auto;
    width: 360px;
  }
  .formwork_title {
    position: relative;
    height: 35px;
  }
  .no_basic {
    cursor: pointer;
    position: absolute;
    left: 109px;
    top: 1px;
    width: 105px;
    height: 23px;
    background-image: url('../../assets/images/positionImg/no_pitchon_1.png'); //基本情况未选中
    background-size: cover;
    font-family: 'Microsoft YaHei';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 23px;
    text-align: center;
    z-index: 999;
  }
  .no_defense {
    cursor: pointer;
    position: absolute;
    left: 199px;
    top: 1px;
    width: 105px;
    height: 23px;
    background-image: url('../../assets/images/positionImg/no_pitchon_2.png'); //防御情况未选中
    background-size: cover;
    font-family: 'Microsoft YaHei';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 23px;
    text-align: center;
    z-index: 999;
  }
  .basic {
    background-image: url('../../assets/images/positionImg/pitchon_1.png'); //基本情况选中
    color: #fff;
  }
  .defense {
    background-image: url('../../assets/images/positionImg/pitchon_2.png'); //防御情况选中
    color: #cefcff;
  }
}
</style>
