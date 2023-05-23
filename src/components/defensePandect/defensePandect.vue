<template>
  <div id="defense-pandect">
    <div class="defense">
      <div>
        <div>防区总览</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  mounted() {},
  methods: {},
}
</script>
<style scoped lang="scss">
#defense-pandect {
  width: 100%;
  height: calc(100vh - 79px);
  background-color: #f2f2f2;
  position: absolute;
  top: 79px;
  z-index: 1001;
  .defense {
    width: 100%;
    height: 100%;
    div {
      width: 100px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      font-size: 20px;
      color: gray;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      margin: auto;
    }
  }
}
</style>
