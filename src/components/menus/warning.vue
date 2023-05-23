<template>
  <div id="warming">
    <div class="case-store">
      <div class="case-Bg dialog_header">
        <img src="../../assets/images/Titlebar/Menu/PlanDefult.png" alt="" />
        <span>预案</span>
      </div>
      <img
        src="../../assets/images/Component/Horizon/Close.png"
        class="linkimg"
        @click="warmingclose"
      />
      <div class="case-content">
        <div
          @click="line(index)"
          :class="{ active: currentIndex == index }"
          class="content"
          v-for="(item, index) in warningList"
          :key="index"
        >
          <div class="uav-image">
            <div class="imgbox">
              <img src="../../assets/images/Titlebar/Plan/Header.png" alt="" />
            </div>
            <div class="textbox">{{ item.warnlevel }}</div>
          </div>
          <div class="uav-content">
            <div class="content-name">
              <span class="span2">预案名称:</span>
              <span class="span2">{{ item.name }}</span>
              <div class="areashow" @click="yanjingBtn(item, index)">
                <img
                  v-if="!item.openflag"
                  src="../../assets/icon/yanjing_nochecked.png"
                  alt=""
                />
                <img
                  v-if="item.openflag"
                  src="../../assets/icon/yanjing_checked.png"
                  alt=""
                />
              </div>
            </div>
            <div class="content-box">
              <div class="type">
                <span>处置方式:</span>
                <span>
                  {{ item.dispose }}
                </span>
              </div>
              <div class="type">
                <span>警戒半径:</span>
                <span>{{ item.distance }}M</span>
              </div>
              <div class="describe">
                预案描述:
                <span>{{ item.describe }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { GetScenarios } from '@/api/case/caseStore'
import { addBoundaryWall } from '../../views/mars3d/device'

export default {
  props: ['warningShow'],
  computed: {
    ...mapGetters(['positionDetail']),
  },
  data() {
    return {
      params: {
        pageIndex: 1,
        pageSize: 2,
      },
      parameterList: [],
      warningList: [
        {
          id: 'first',
          warnlevel: '一级预案',
          name: '核心区防御预案',
          dispose: '全部开启',
          distance: 500,
          describe: '目标进入核心区，开启所有打击设备。',
        },
        {
          id: 'second',
          warnlevel: '二级预案',
          name: '防御区防御预案',
          dispose: '导航诱骗',
          distance: 1000,
          describe: '目标进入防御区，开启所有导航诱骗，使无人机反向飞离。',
        },
        {
          id: 'thirdly',
          warnlevel: '三级预案',
          name: '预警区防御预案',
          dispose: '无',
          distance: 2000,
          describe: '目标进入预警区，实时跟踪目标位置和状态。',
        },
      ],
      currentIndex: -1,
    }
  },
  watch: {
    warningShow(newVal, oldVal) {
      if (newVal) {
        // this.getList()
      }
    },
  },
  mounted() {},
  methods: {
    line(index) {
      this.currentIndex = index
    },
    getList() {
      GetScenarios(this.params).then((response) => {
        console.log(response.data, 'data')
        this.parameterList = response.data
        this.currentIndex = -1
      })
    },
    warmingclose() {
      this.$emit('warmingclose')
    },
    // 区域显隐
    yanjingBtn(item, index) {
      this.$set(item, 'openflag', !item.openflag)
      const geojson = {
        id: `geojson_${item.id}`,
        pid: 'geojson_place',
        type: 'geojson',
        data: [],
        color: '',
      }
      if (this.warningList[index].warnlevel === '一级预案') {
        geojson.data = this.positionDetail.geo_json
        geojson.color = '#ff0000'
        addBoundaryWall(geojson, item.openflag)
      } else if (this.warningList[index].warnlevel === '二级预案') {
        geojson.data = this.positionDetail.geo_json_expel
        geojson.color = '#0000ff'
        addBoundaryWall(geojson, item.openflag)
      } else if (this.warningList[index].warnlevel === '三级预案') {
        geojson.data = this.positionDetail.geo_json_alarm
        geojson.color = '#00ff00'
        addBoundaryWall(geojson, item.openflag)
      }
    },
  },
}
</script>
<style scoped lang="scss">
#warming {
  z-index: 101;
  .case-store {
    width: 620px;
    height: 380px;
    position: absolute;
    left: 650px;
    top: 80px;
    // position: fixed;
    // top: 0;
    // bottom: 0;
    // left: 0;
    // right: 0;
    // margin: auto;
    background-image: url(../../assets/images/Component/Horizon/Background.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    .case-Bg {
      width: 586px;
      margin: 0 auto;
      margin-top: 17px;
      height: 22px;
      // border: 1px solid red;
      background-image: url(../../assets/images/Component/Horizon/Top.png);
      background-size: cover;
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
      width: 575px;
      height: 395px;
      margin-left: 25px;
      margin-top: 12px;
      .content:hover {
        background-image: url('../../assets/images/Titlebar/Setting/Input.png');
        background-size: 580px 100%;
        background-position: 0 0;
      }
      .active {
        background-image: url('../../assets/images/Titlebar/Setting/Input.png') !important;
        background-size: 580px 100%;
        background-position: 0 0;
      }
      .content {
        width: 578px;
        height: 100px;
        background-image: url('../../assets/images/Titlebar/Plan/ListBoxItemBackground.png');
        background-size: 581px 100%;
        background-position: 0 0;
        background-repeat: no-repeat;
        margin-bottom: 2px;
        position: relative;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        .uav-image {
          width: 85px;
          height: 96px;
          margin-left: 5px;
          position: relative;
          top: 2px;
          background-image: url('../../assets/images/Titlebar/Plan/HeaderBorder.png');
          background-size: 83px 100%;
          background-position: 0 0;
          .imgbox {
            width: 55%;
            margin: 0 auto;
            margin-top: 15px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .textbox {
            font-size: 14px;
            color: #d8b652;
            text-align: center;
            margin-top: 5px;
          }
        }
        .uav-content {
          width: 490px;
          height: 98px;
          position: relative;
          top: 2px;
          .content-name {
            width: 100%;
            height: 30px;
            line-height: 30px;
            position: relative;
            .span1 {
              padding-left: 5px;
            }
            .span2 {
              padding-left: 10px;
              font-size: 13px;
            }
            .areashow {
              position: absolute;
              right: 10px;
              top: 5px;
              img {
                cursor: pointer;
                width: 20px;
                height: 20px;
              }
            }
          }
          .content-box {
            width: 490px;
            height: 68px;
            color: #b0e5eb;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            .type {
              width: 242px;
              height: 26px;
              background-image: url('../../assets/images/Titlebar/Plan/ItemBackground.png');
              background-size: 242px 26px;
              background-repeat: no-repeat;
              position: relative;
              span:nth-child(1) {
                display: inline-block;
                margin-left: 16px;
                margin-top: 5px;
              }
              span:nth-child(2) {
                display: inline-block;
                width: 140px;
                height: 20px;
                line-height: 18px;
                overflow: hidden;
                position: absolute;
                top: 5px;
                right: 15px;
                text-align: right;
              }
            }
            .describe {
              width: 470px;
              height: 26px;
              font-size: 13px;
              line-height: 26px;
              // margin-top: 20px;
              opacity: 0.8;
              span {
                margin-left: 5px;
              }
            }
          }
        }
      }
    }
    .pagination-box {
      width: 575px;
      height: 30px;
      margin-left: 22px;
      margin-top: 10px;
      .pagination {
        display: flex;
        justify-content: center;
        position: relative;
        div {
          width: 25px;
          height: 25px;
          position: relative;
          bottom: -5px;
          margin-right: 4px;
        }
        div:hover {
          background-color: #064f54;
        }
        div:nth-child(1) img,
        div:nth-child(5) img {
          width: 14px;
          height: 14px;
          position: absolute;
          left: 5px;
          top: 8px;
        }
        div:nth-child(2) img,
        div:nth-child(4) img {
          width: 8px;
          height: 14px;
          position: absolute;
          left: 8px;
          top: 8px;
        }

        p:nth-child(3) {
          position: relative;
          span {
            display: inline-block;
            margin: 10px 3px 0 3px;
          }
          input {
            height: 22px;
            width: 40px;
            border-radius: 3px;
            border: none;
            background-color: #066465;
            position: relative;
            bottom: 0px;
            color: white;
            padding-left: 3px;
          }
        }
        p:nth-child(6) {
          margin-top: 12px;
          font-size: 13px;
        }
      }
    }
  }
}
</style>
