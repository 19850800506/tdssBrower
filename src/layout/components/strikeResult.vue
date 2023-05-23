<template>
  <div id="strikeResult" ref="strikeResult">
    <div class="assess">
      <div class="case-Bg dialog_header">
        <span>打击评估</span>
      </div>
      <img
        src="../../assets/images/strikePopup/Close.png"
        class="linkimg"
        @click="closeclick"
      />
      <div class="case-content">
        <div class="bgimg">
          <img src="../../assets/images/strikePopup/Uav.png" class="uavimg" />
        </div>
        <div class="content_txt">
          <div class="txtsingle">
            <div class="txtbg"></div>
            <div class="txttext">
              <div class="textkey">目标类型</div>
              <div class="textvalue">{{ strikeParams.target_type }}</div>
            </div>
          </div>
          <div class="txtsingle">
            <div class="txtbg"></div>
            <div class="txttext">
              <div class="textkey">报警时长</div>
              <div class="textvalue">
                {{ strikeParams.alarm_duration }}
              </div>
            </div>
          </div>
          <div class="txtsingle">
            <div class="txtbg"></div>
            <div class="txttext">
              <div class="textkey">目标数量</div>
              <div class="textvalue">{{ strikeParams.result }}</div>
            </div>
          </div>
          <div class="txtsingle">
            <div class="txtbg"></div>
            <div class="txttext">
              <div class="textkey">报警开始时间</div>
              <div class="textvalue">
                {{ strikeParams.alarm_start_time }}
              </div>
            </div>
          </div>
          <div class="txtsingle">
            <div class="txtbg"></div>
            <div class="txttext">
              <div class="textkey">报警时长</div>
              <div class="textvalue">
                {{ strikeParams.direct_duration }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['strikeParams'],
  data() {
    return {}
  },
  computed: {},
  mounted() {
    if (this.$refs.strikeResult) {
      this.$refs.strikeResult.onmousemove = () => {
        this.$emit('clearTimer')
      }
    }
  },
  watch: {},
  methods: {
    // 关闭按钮
    closeclick() {
      this.$emit('closestrike')
    },
  },
}
</script>
<style scoped lang="scss">
#strikeResult {
  pointer-events: auto;
  .assess {
    width: 620px;
    height: 500px;
    position: absolute;
    top: 200px;
    left: 650px;
    background-image: url('../../assets/images/strikePopup/Background.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    .case-Bg {
      width: 596px;
      margin: 0 auto;
      margin-top: 17px;
      height: 22px;
      background-image: url('../../assets/images/strikePopup/BackgroundItem.png');
      background-size: 100% 96%;
      position: relative;
      img {
        width: 22px;
        height: 22px;
      }
      span {
        position: absolute;
        top: 4px;
        left: 27px;
        font-size: 12px;
        color: #b0e5eb;
      }
    }
    .linkimg {
      position: absolute;
      right: 23px;
      top: 21px;
      width: 14px;
      height: 14px;
      cursor: pointer;
    }
    .case-content {
      width: 596px;
      margin: 5px auto;
      .bgimg {
        width: 100%;
        height: 285px;
        background-image: url('../../assets/images/strikePopup/Border.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        position: relative;
        .uavimg {
          position: absolute;
          left: 60px;
          top: 45px;
          width: 180px;
        }
      }
      .content_txt {
        margin-top: 8px;
        .txtsingle {
          width: 596px;
          height: 24px;
          position: relative;
          margin-top: 5px;
          .txtbg {
            width: 100%;
            height: 100%;
            margin: 0 auto;
            background-image: url('../../assets/images/strikePopup/BackgroundItem.png');
            background-size: 100% 96%;
            position: relative;
          }
          .txttext {
            position: absolute;
            top: 4px;
            left: 27px;
            width: 550px;
            display: flex;
            font-size: 14px;
            color: #b0e5eb;
            justify-content: space-between;
            .textvalue {
              margin-right: 5px;
            }
          }
        }
      }
    }
  }
}
</style>
