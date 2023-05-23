<template>
  <div class="placeDetail">
    <div class="box_content">
      <div class="title">博鳌防区</div>
      <div class="list">地点：海南省琼海市</div>
      <div class="list">范围：东经110.7°～40.5°，北纬18.58°～19.28°</div>
      <div class="list">重点目标：琼海博鳌机场、博鳌站</div>
      <div class="list">
        气候：
        热带海洋性季风气候，受季风影响大，光照充足，高温多雨，台风频繁，四季不明显，旱季和雨季分明。
        历年平均气温为24.6°C，历年平均降水量2053.5毫米，历年平均日照1972.6小时，终年无霜雪。
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {}
  },
  mounted() {},
  methods: {},
}
</script>
<style lang="scss" scoped>
.placeDetail {
  width: 400px;
  height: 100%;
  background-color: #fff;
  padding: 50px 20px;
  // overflow: hidden;
  .box_content {
    width: 360px;
    height: 100%;
    border: 1px solid #8a8a8a;
    // margin: 50px 20px;
    > div {
      padding: 10px;
      font-size: 14px;
    }
    .title {
      font-size: 20px;
      padding: 20px;
    }
  }
}
</style>
