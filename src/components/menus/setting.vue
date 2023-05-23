<template>
  <div id="setting">
    <div class="case-store">
      <div class="case-Bg dialog_header">
        <div class="settingimg"></div>
        <span>系统设置</span>
      </div>
      <img
        src="../../assets/images/Component/Horizon/Close.png"
        class="linkimg"
        @click="settingclose"
      />
      <div class="set-content">
        <div class="strikemode">
          <div class="title">打击方式</div>
          <div class="mode_content" v-for="(item, i) in attackMode" :key="i">
            <div class="content_txt">
              <div>{{ item.title }}</div>
            </div>
            <div class="content_img" @click="contentClick(item)">
              <img :src="item.state ? checkBoxOnImg : checkBoxOffImg" />
            </div>
          </div>
        </div>
        <div class="threedscene">
          <div class="title">三维场景配置</div>
          <div class="mode_content" v-for="(item, i) in threeMode" :key="i">
            <div class="content_txt">
              <div>{{ item.title }}</div>
            </div>
            <div class="content_img" @click="contentClick(item)">
              <img :src="item.state ? checkBoxOnImg : checkBoxOffImg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  autoStrike,
  intervalStrike,
  fenceStrike,
} from '@/api/operation/operation'
import { loadDeviceSpecial, addDevicePoi } from '../../views/mars3d/device'
import { loadLayconfig } from '../../views/mars3d/model'
import { attackMode, threeMode } from '../../../public/config/constant'

const checkBoxOnImg = require('../../assets/images/Titlebar/Setting/CheckBoxOn.png')
const checkBoxOffImg = require('../../assets/images/Titlebar/Setting/CheckBoxOff.png')

export default {
  data() {
    return {
      checkBoxOnImg,
      checkBoxOffImg,
      // 打击方式
      attackMode,
      // 三维场景配置
      threeMode,
    }
  },
  computed: {
    ...mapGetters(['deviceArr', 'currentPositionId', 'serverdata']),
  },
  mounted() {
    this.changeBuilding(true)
  },
  watch: {
    serverdata(val) {
      if (val.data.command === 'workmode' && val.data.data) {
        val.data.data.forEach((el) => {
          if (el) {
            // 自动打击开关
            if (el.command === 'autoJammin') {
              if (el.state === 'unAutoJammin') {
                this.attackMode[0].state = false
              } else {
                this.attackMode[0].state = true
              }
            } else if (el.command === 'GPSOpen') {
              if (el.state === 'unGPSOpen') {
                this.attackMode[1].state = false
                this.$store.commit('SET_ELECTRONICFENCE', false)
              } else {
                this.attackMode[1].state = true
                this.$store.commit('SET_ELECTRONICFENCE', true)
              }
            }
          }
        })
      }
    },
  },
  methods: {
    // 关闭系统设置
    settingclose() {
      this.$emit('settingclose')
    },
    // 点击开关方法
    contentClick(item) {
      if (item.type === 'autoset') {
        // 自动打击
        this.autosetclick(item)
      } else if (item.type === 'interstrike') {
        // 间断打击
        // this.intervalclick(item)
      } else if (item.type === 'electronicfence') {
        this.fenceclick(item)
        // 电子围栏
        // item.state = !item.state
        // this.$store.commit('SET_ELECTRONICFENCE', item.state)
      } else if (item.type === 'showtrack') {
        // 无人机轨迹
        item.state = !item.state
        this.$store.commit('SET_SHOWTRACK', item.state)
        this.$message.success(
          item.state ? '显示无人机轨迹已开启' : '显示无人机轨迹已关闭'
        )
      } else if (item.type === 'radarsim') {
        // 雷达仿真显隐
        item.state = !item.state
        this.$store.commit('SET_RADARSIM', item.state)
        this.changeRadarsim(item.state)
      } else if (item.type === 'equipmentmode') {
        // 设备三维模型
        item.state = !item.state
        this.$store.commit('SET_EQUIPMENTMODE', item.state)
        this.changeModel(item.state)
      } else if (item.type == 'architectmode') {
        // 建筑三维模型
        item.state = !item.state
        this.changeBuilding(item.state)
        // this.$message.success(
        //   item.state ? '建筑三维模型已开启' : '建筑三维模型已关闭'
        // )
      } else if (item.type === 'whitelist') {
        // 白名单
        item.state = !item.state
        this.$emit('whiteclick', item.state)
      } else if (item.type === 'yinxiangmap') {
        // 影像图
        this.changeMap(item)
      } else if (item.type === 'xianhuamap') {
        // 线划图
        this.changeMap(item)
      } else if (item.type === 'ersanwei') {
        // 二三维切换
        this.changeWei(item)
      } else {
        item.state = !item.state
      }
    },
    // 自动打击
    autosetclick(item) {
      if (this.$store.state.setting.doStatusShow) {
        return
      }
      if (item.loading) {
        // 防止点击多次调用接口
        this.$message.warning('正在请求，请稍等。。。')
        return
      }
      item.loading = true
      autoStrike({
        pid: this.currentPositionId,
        isOpen: !item.state,
      })
        .then((res) => {
          item.loading = false
          if (res.code === 0) {
            this.$message.success(
              !item.state ? '自动打击已开启' : '自动打击已取消'
            )

            item.state = !item.state
          }
        })
        .catch(() => {
          item.loading = false
        })
    },
    // 间断打击
    // intervalclick(item) {
    //   if (this.$store.state.setting.doStatusShow) {
    //     return
    //   }
    //   if (item.loading) {
    //     // 防止点击多次调用接口
    //     return
    //   }
    //   item.loading = true
    //   intervalStrike({
    //     pid: this.currentPositionId,
    //     isOpen: !item.state,
    //   })
    //     .then((res) => {
    //       item.loading = false
    //       if (res.code === 0) {
    //         this.$notify({
    //           title: '成功',
    //           message: '间断打击操作成功',
    //           offset: 100,
    //           showClose: false,
    //           duration: 3000,
    //           customClass: 'notifyclass',
    //           type: 'success',
    //         })

    //         item.state = !item.state
    //         this.$store.commit('SET_INTERSTRIKE', item.state)
    //       }
    //     })
    //     .catch(() => {
    //       item.loading = false
    //     })
    // },
    // 电子围栏内开启打击压制
    fenceclick(item) {
      if (item.loading) {
        this.$message.warning('正在请求，请稍等。。。')
        return
      }
      item.loading = true
      fenceStrike({
        pid: this.currentPositionId,
        isOpen: !item.state,
      })
        .then((res) => {
          item.loading = false
          if (res.code == 0) {
            this.$message.success(
              !item.state ? '电子围栏已开启' : '电子围栏已关闭'
            )
            item.state = !item.state
            this.$store.commit('SET_ELECTRONICFENCE', item.state)
          }
        })
        .catch(() => {
          item.loading = false
        })
    },

    // 雷达仿真显隐切换
    changeRadarsim(show) {
      this.deviceArr.forEach((el) => {
        if (el.detail.type === 'aoa' || el.detail.type === 'tdoa') {
          if (el.detail) {
            const deviceOption = {}
            if (el.detail.static_data.altitude) {
              deviceOption.alt = el.detail.static_data.altitude.value
            }
            if (el.detail.static_data.latitude) {
              deviceOption.lat = el.detail.static_data.latitude.value
            }
            if (el.detail.static_data.longitude) {
              deviceOption.lng = el.detail.static_data.longitude.value
            }
            deviceOption.radius = el.detail.static_data.effect
              ? el.detail.static_data.effect.value
              : 3000
            deviceOption.type = el.detail.type
            deviceOption.use = el.detail.remarks
            deviceOption.id = el.id
            // 移除上个阵地的设备
            loadDeviceSpecial(deviceOption, show)
          }
        }
      })
      this.$message.success(show ? '雷达仿真显隐已开启' : '雷达仿真显隐已关闭')
      // this.Radarsim = !this.Radarsim
      // const layer = window.CesiumSdk._map.getLayerById('radarLayer')
      // layer.show = this.Radarsim
    },
    // 设备三维模型显隐
    changeModel(show) {
      const color = [
        '#ecc34d',
        '#4bdd85',
        '#4fe7cb',
        '#99FFFF',
        '#30ACFF',
        '#0B8183',
      ]
      this.deviceArr.forEach((el) => {
        const type = el.type.toLowerCase()
        if (type === 'tdoa') {
          if (el.children && el.children.length) {
            el.children.forEach((item) => {
              const options = {
                type,
                id: `${el.id}_${item.id}`,
                lng: item.lon,
                lat: item.lat,
                alt: item.alt,
                typeName: el.type_name,
                name: el.posName + el.type_name + item.address,
                state: item.code === 0 ? '在线' : '离线',
              }
              addDevicePoi(options, show)
            })
          } else {
            addDevicePoi(
              {
                name: el.posName + el.name,
                type,
                typeName: el.type_name,
                state: el.state,
                id: el.id,
                lng: el.detail.static_data.longitude
                  ? el.detail.static_data.longitude.value
                  : 0,
                lat: el.detail.static_data.latitude
                  ? el.detail.static_data.latitude.value
                  : 0,
                alt: el.detail.static_data.altitude
                  ? el.detail.static_data.altitude.value
                  : 0,
                size: 10,
                color: color[index % 5],
              },
              show
            )
          }
        } else {
          addDevicePoi(
            {
              name: el.posName + el.name,
              type,
              typeName: el.type_name,
              state: el.state,
              id: el.id,
              lng: el.detail.static_data.longitude
                ? el.detail.static_data.longitude.value
                : 0,
              lat: el.detail.static_data.latitude
                ? el.detail.static_data.latitude.value
                : 0,
              alt: el.detail.static_data.altitude
                ? el.detail.static_data.altitude.value
                : 0,
              size: 10,
              color: color[index % 5],
            },
            show
          )
        }
      })
      this.$message.success(show ? '设备三维模型已开启' : '设备三维模型已关闭')
    },
    // 建筑三维模型
    changeBuilding(show) {
      const model_geojson = window.mapLayers.filter(
        (el) => el.type === '3dtiles'
      )
      model_geojson.forEach((el) => {
        loadLayconfig(el, show)
      })
    },
    // Whitelistclick() {
    //   this.Whitelist = !this.Whitelist
    //   this.$emit('whiteclick', this.Whitelist)
    // },

    changeMap(item) {
      if (item.type === 'yinxiangmap') {
        const layer = window.CesiumSdk._map.getLayerById('yinxiangMap')
        layer.show = item.state
        item.state = !item.state
        this.$message.success(item.state ? '影像图已开启' : '影像图已关闭')
      } else {
        const layer = window.CesiumSdk._map.getLayerById('xianhuaMap')
        layer.show = item.state
        item.state = !item.state
        this.$message.success(item.state ? '线划图已开启' : '线划图已关闭')
      }
    },
    changeWei(item) {
      item.state = !item.state
      if (!item.state) {
        console.log(window.CesiumSdk._map.scene, 'scene')
        window.CesiumSdk._map.scene.morphTo2D(0)
      } else {
        window.CesiumSdk._map.scene.morphTo3D(0)
      }
    },
  },
}
</script>

<style scoped lang="scss">
#setting {
  z-index: 101;
  .case-store {
    width: 440px;
    // height: 416px;
    height: auto;
    position: absolute;
    top: 90px;
    left: 1400px;
    margin: auto;
    background-image: url('../../assets/images/Component/Horizon/Background.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    .case-Bg {
      width: 95%;
      margin: 0 auto;
      margin-top: 17px;
      height: 22px;
      // border: 1px solid red;
      background-image: url('../../assets/images/Component/Horizon/Top.png');
      background-size: cover;
      position: relative;
      .settingimg {
        width: 22px;
        height: 22px;
        position: relative;
        top: -1px;
        background-image: url('../../assets/images/Component/Horizon/setting.png');
        background-size: 104% 104%;
      }
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
      cursor: pointer;
      position: absolute;
      right: 23px;
      top: 21px;
      width: 14px;
      height: 14px;
    }
    .set-content {
      width: 94%;
      margin: 0 auto;
      .strikemode,
      .threedscene {
        width: 100%;
        margin-top: 10px;
        // height: 70px;
        height: auto;
        background-image: url('../../assets/images/Component/Horizon/strikemodeBg.png');
        background-size: 100% 100%;
        position: relative;
        .title {
          font-size: 12px;
          color: #267272;
          position: relative;
          top: -7px;
          left: 12px;
        }
        .mode_content {
          display: flex;
          width: 100%;
          height: 22px;
          margin-bottom: 5px;
          .content_txt {
            width: 88%;
            height: 100%;
            background-image: url('../../assets/images/Titlebar/Setting/BackgroundImg.png');
            background-size: 100% 100%;
            position: relative;
            margin-left: 6px;
            top: -3px;
            div {
              color: #8ddadd;
              font-size: 14px;
              height: 100%;
              margin-left: 5px;
              line-height: 24px;
            }
          }
          .content_img {
            cursor: pointer;
            position: relative;
            top: -3px;
          }
        }
      }
      .threedscene {
        width: 100%;
        margin-top: 14px;
        // height: 258px;
        height: auto;
        margin-bottom: 20px;
        background-image: url('../../assets/images/Titlebar/Setting/Scene.png');
        background-size: 100% 100%;
        position: relative;
      }
    }
  }
}
</style>
