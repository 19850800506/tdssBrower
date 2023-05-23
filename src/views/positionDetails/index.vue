<template>
  <div id="position_details">
    <formwork @changeindex="changeindex">
      <img
        @click="cancelchange()"
        class="cancel"
        src="../../assets/images/positionImg/Union.png"
        alt=""
      />
    </formwork>
    <div class="basic" v-show="activeIndex == 0">
      <div class="title">
        <div>{{ detail.detail.name }}</div>
        <div v-show="true" class="connect">
          <img src="../../assets/images/positionImg/pitchon_3.png" alt="" />
        </div>
        <div v-show="false" class="no_connect">
          <img src="../../assets/images/positionImg/no_pitchon_3.png" alt="" />
        </div>
      </div>
      <div class="imgbg">
        <img :src="detail.detail.imgUrl" alt="" />
        <!-- <img
          src="../../assets/images/positionImg/dxxhcbdz.png"
          v-if="detail.detail.name === '北京AQ'"
        />
        <img
          src="../../assets/images/positionImg/zgsyypjcs.png"
          v-if="detail.detail.name === '池州阵地'"
        />
        <img
          src="../../assets/images/positionImg/jlycqjyk.png"
          v-if="detail.detail.name === '测试阵地2'"
        />
        <img
          src="../../assets/images/positionImg/kxymscjd.png"
          v-if="detail.detail.name === '海南阵地'"
        />
        <img
          src="../../assets/images/positionImg/zshcpycck.png"
          v-if="detail.detail.id === 'zshcpycck'"
        />
        <img
          src="../../assets/images/positionImg/bjdxgjjc.png"
          v-if="detail.detail.id === 'bjdxgjjc'"
        /> -->
      </div>
      <div class="text_box">
        <div class="text">
          <span>阵地类型</span><span>{{ detail.detail.type }}</span>
        </div>
        <div class="text"><span>名称防护等级</span><span>一级</span></div>
        <div class="text">
          <span>地址</span><span>{{ detail.detail.address }}</span>
        </div>
      </div>
    </div>
    <div class="defense" v-show="activeIndex == 1">
      <div class="text_box">
        <div class="text">
          <span>防御面积</span><span>{{ detail.detail.area }} km²</span>
        </div>
        <div class="text">
          <span>周边风险</span><span>{{ detail.detail.fx || 1 }}个</span>
        </div>
        <div class="text">
          <span>防御预案</span><span>{{ detail.detail.ya || 2 }}个</span>
        </div>
      </div>
      <div class="equipment">
        <div class="eq_box">
          <div v-for="(item, index) in icons" :key="index">
            <el-tooltip
              class="item"
              effect="dark"
              :content="setName(item) || item.name"
              placement="top"
              :enterable="false"
            >
              <img class="equip" :src="setImg(item, 'img')" alt="" />
            </el-tooltip>
            <div class="count" v-if="setImg(item, 'count')">
              <span>{{ setImg(item, 'count') }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="construction"><span>建设方</span><span>中急管</span></div>
    </div>
  </div>
</template>
<script>
import formwork from '@/components/formwork'

export default {
  props: ['detail', 'positionVisible'],
  data() {
    return {
      activeIndex: 0,
      cancel: true,
      icons: [
        {
          name: '雷达',
          type: 'Radar',
          hasImg: 'radar.png',
          noImg: 'radar_no.png',
        },
        {
          name: 'TDOA',
          type: 'TDOA',
          hasImg: 'TDOA.png',
          noImg: 'TDOA_no.png',
        },
        {
          name: 'AOA',
          type: 'AOA',
          hasImg: 'AOA.png',
          noImg: 'AOA_no.png',
        },
        {
          name: '协议破解',
          type: 'Crack',
          hasImg: 'xypj.png',
          noImg: 'xypj_no.png',
        },
        {
          name: '光电',
          type: 'Photoelectricity',
          hasImg: 'gdtc.png',
          noImg: 'gdtc_no.png',
        },
        {
          name: '低空防御指挥车',
          type: 'Car',
          hasImg: 'command_car.png',
          noImg: 'command_car_no.png',
        },
        {
          name: '摩托车',
          type: 'motorbike',
          hasImg: 'motorbike.png',
          noImg: 'motorbike_no.png',
        },
        {
          name: '定向',
          type: 'orient',
          hasImg: 'orient.png',
          noImg: 'orient_no.png',
        },
        {
          name: '面向干扰',
          type: 'Detect',
          hasImg: 'face.png',
          noImg: 'face_no.png',
        },
        {
          name: '全向',
          type: 'Omni',
          hasImg: 'omnibe.png',
          noImg: 'omnibe_no.png',
        },
        {
          name: '诱导',
          type: 'Guide',
          hasImg: 'GPS.png',
          noImg: 'GPS_no.png',
        },
        {
          name: '精准打击',
          type: 'accurate',
          hasImg: 'accurate.png',
          noImg: 'accurate_no.png',
        },
        {
          name: '单兵',
          type: 'single_pawn',
          hasImg: 'single_pawn.png',
          noImg: 'single_pawn_no.png',
        },
      ],
    }
  },
  components: {
    formwork,
  },
  mounted() {},
  watch: {},
  methods: {
    changeindex(value) {
      this.activeIndex = value
    },
    // 向父组件发送cancelchange事件 关闭弹窗
    cancelchange() {
      this.cancel = false
      this.$emit('cancelchange', this.cancel)
    },
    // 匹配图片 统计个数
    setName(item) {
      const device = this.detail.data.find((el) => el.type === item.type)
      if (device && device.data.length) {
        return device.type_name
      }
      return ''
    },
    setImg(item, type) {
      if (this.detail && this.detail.data) {
        const device = this.detail.data.find((el) => el.type === item.type)

        if (type === 'img') {
          if (device && device.data.length) {
            return require(`../../assets/images/positionImg/icon/${item.hasImg}`)
          }
          return require(`../../assets/images/positionImg/icon/${item.noImg}`)
        }
        if (device && device.data.length) {
          return device.data.length
        }
        return 0
      }
    },
    // setmiainImg() {
    //   console.log('../../assets/images/positionImg/' + (this.detail.detail.id ? this.detail.detail.id + '.png' : 'bjdxgjjc.png'));
    //   return require('../../assets/images/positionImg/' + this.detail.detail.id ? this.detail.detail.id + '.png' : 'bjdxgjjc.png')
    // }
  },
}
</script>
<style scoped lang="scss">
#position_details {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
  width: 360px;
  height: 279px;
  pointer-events: auto;
  .cancel {
    cursor: pointer;
    width: 10px;
    height: 10px;
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 999;
  }
  .basic {
    position: absolute;
    top: 0px;
    width: 100%;
    height: 100%;
    padding-left: 12px;
    .title {
      width: 335px;
      position: relative;
      top: 37px;
      display: flex;
      justify-content: space-between;
      div:nth-child(1) {
        padding-top: 2px;
        font-size: 11px;
        font-weight: 700;
        font-family: 'Microsoft YaHei';
        color: #4fe7cb;
      }
      .connect,
      .no_connect {
        width: 50px;
        height: 20px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .imgbg {
      border: 1px solid #4fe7cb;
      width: 336px;
      height: 122px;
      position: relative;
      top: 46px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .text_box {
      width: 336px;
      height: 78px;
      position: relative;
      top: 56px;
      .text {
        width: 336px;
        height: 22px;
        line-height: 22px;
        display: flex;
        justify-content: space-between;
        background-image: url('../../assets/images/positionImg/boxlist.png');
        margin-bottom: 4px;
        span:nth-child(1) {
          padding-left: 6px;
          font-size: 11px;
          font-family: 'Microsoft YaHei';
          color: #cefcff;
        }
        span:nth-child(2) {
          padding-right: 9px;
          font-size: 11px;
          font-weight: 700;
          font-family: 'Microsoft YaHei';
          color: #4fe7cb;
        }
      }
    }
  }
  .defense {
    position: absolute;
    top: 0px;
    width: 100%;
    height: 100%;
    padding-left: 12px;
    .text_box {
      width: 336px;
      height: 78px;
      position: relative;
      top: 36px;
      .text {
        width: 336px;
        height: 22px;
        line-height: 22px;
        display: flex;
        justify-content: space-between;
        background-image: url('../../assets/images/positionImg/boxlist.png');
        margin-bottom: 4px;
        span:nth-child(1) {
          padding-left: 6px;
          font-size: 11px;
          font-family: 'Microsoft YaHei';
          color: #cefcff;
        }
        span:nth-child(2) {
          padding-right: 9px;
          font-size: 11px;
          font-weight: 700;
          font-family: 'Microsoft YaHei';
          color: #4fe7cb;
        }
      }
    }
    .equipment {
      width: 340px;
      height: 129px;
      position: relative;
      top: 36px;
      left: -4px;
      background-image: url('../../assets/images/positionImg/eqBg.png');
      background-size: cover;
      .eq_box {
        width: 336px;
        height: 80px;
        padding-left: 12px;
        position: relative;
        top: 50px;
        left: 4px;
        display: flex;
        flex-wrap: wrap;
        div {
          width: 26px;
          height: 26px;
          margin-right: 20px;
          margin-bottom: 18px;
          position: relative;
          .equip {
            width: 100%;
            height: 100%;
          }
          .count {
            width: 20px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            background-image: url('../../assets/images/positionImg/Ellipse.png');
            background-size: cover;
            position: absolute;
            top: -10px;
            left: 16px;
            span {
              display: inline-block;
              font-size: 16px;
              transform: scale(0.5);
              text-align: center;
            }
          }
        }
      }
    }
    .construction {
      position: relative;
      top: 40px;
      width: 336px;
      height: 22px;
      line-height: 22px;
      display: flex;
      justify-content: space-between;
      background-image: url('../../assets/images/positionImg/boxlist.png');
      span:nth-child(1) {
        padding-left: 6px;
        font-size: 11px;
        font-family: 'Microsoft YaHei';
        color: #cefcff;
      }
      span:nth-child(2) {
        padding-right: 9px;
        font-size: 11px;
        font-weight: 700;
        font-family: 'Microsoft YaHei';
        color: #4fe7cb;
      }
    }
  }
}
</style>
<style scoped>
.el-tooltip__popper {
  padding: 6px 10px;
  border-radius: 2px;
  margin-bottom: 6px;
}
.el-tooltip__popper.is-dark {
  background: rgba(0, 0, 0, 0.2);
  color: #ffffff;
}
.el-tooltip__popper.is-dark[x-placement^='top'] .popper__arrow {
  border-top-color: #0b8083 !important;
}
.el-tooltip__popper[x-placement^='top'] .popper__arrow:after {
  border-top-color: #0b8083 !important;
}
</style>
