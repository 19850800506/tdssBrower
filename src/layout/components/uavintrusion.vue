<template>
  <div id="uavintrusion" v-show="instrusionshow">
    <audio controls ref="uavAudio" v-if="instrusionshow" v-show="false">
      <source src="../../assets/alert.mp3" />
    </audio>
    <div class="instrusionimg">
      <img src="../../assets/images/Alarmbar/InvasionShield.png" alt="" />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { updateUAV, updateLocusLayer } from '../../views/mars3d/ws'

import { findTarget, locus, carLocation } from '@/utils/mock.js'

export default {
  data() {
    return {
      instrusionshow: false,

      uavList: [], // 无人机数组
      timer: {}, // 定义延时器,判断10内秒未推送相同事件移除无人机
      lineColor: {}, // 无人机轨迹颜色
      color: ['#FF0000', '#4bdd85', '#0B8183', '#4fe7cb', '#99FFFF', '#30ACFF'],
    }
  },
  computed: {
    ...mapGetters([
      'serverdata',
      'currentPositionId',
      'uavListArr',
      'deviceArr',
      'showtrack',
      'uavListAll',
    ]),
  },
  watch: {
    instrusionshow(val) {
      // 发现无人机后音频播放三次
      if (val) {
        setTimeout(() => {
          this.playAudio()
        }, 500)
      }
    },
    currentPositionId(val) {
      // 切换阵地清空上个阵地预警
      // this.$store.commit('SET_UAVLISTARR', [])

      const storeArr = this.uavList.filter((el) => el.position_id == val)
      this.$store.commit('SET_UAVLISTARR', JSON.parse(JSON.stringify(storeArr)))

      // this.findUav()
      // setInterval(() => {
      //   this.findUav()
      // }, 60000)
    },
    serverdata(newVal) {
      if (
        newVal.data.command === 'findTarget' ||
        newVal.data.command === 'locus'
      ) {
        this.changeUavList(newVal.data)
      }
    },
    // 无人机轨迹显隐
    showtrack(val) {
      window.CesiumSdk._map.eachLayer((layer) => {
        if (layer.options && layer.options.id === 'locus_Layer') {
          layer.show = val
        }
      })
    },

    // 显示所有阵地预警的无人机 uavListAll
    uavListAll(val) {
      // 若数组中含有报警的无人机，显示报警弹窗
      if (val.length) {
        const alarmArr = val.filter((el) => el.in_alarm_region)
        if (alarmArr.length) {
          this.instrusionshow = true
        } else {
          this.instrusionshow = false
        }
      } else {
        this.instrusionshow = false
      }

      // 无人机对象
      const layer = window.CesiumSdk._map.getLayerById('uavLayer')
      if (layer) {
        layer.eachGraphic((graphic) => {
          // 移除过期的无人机
          if (
            graphic.options &&
            graphic.options.id &&
            !val.find((el) => el.id == graphic.options.id)
          ) {
            graphic.remove()
          }
        })
      }

      // 无人机弹窗
      const popLayer = window.CesiumSdk._map.getLayerById('uavPopLayer')
      if (popLayer) {
        popLayer.eachGraphic((graphic) => {
          // 移除过期的无人机弹窗
          if (
            graphic.options &&
            graphic.options.id &&
            !val.find((el) => el.id == graphic.options.id)
          ) {
            graphic.remove()
          }
        })
      }

      // 无人机轨迹
      const locusLayer = window.CesiumSdk._map.getLayerById('locus_Layer')
      if (locusLayer) {
        locusLayer.eachGraphic((graphic) => {
          // 移除过期的无人机轨迹
          if (
            graphic.options &&
            graphic.options.id &&
            !val.find((el) => el.id == graphic.options.id)
          ) {
            graphic.remove()
          }
        })
      }

      val.forEach((el, index) => {
        // 无人机
        if (el.lng && el.lat) {
          const uav = {
            ...el,
            params: {
              // 经度: el.lng,
              // 纬度: el.lat,
              原始ID: el.origin_id || '',
              高度: el.alt || '',
              频点: el.freq || '',
              距离: el.distance || '',
              方位角: el.azimuth_name || '',
              信息来源: el.device_name || '',
            },
          }
          updateUAV(uav)
        }

        // 轨迹
        if (el.locus && this.showtrack) {
          // 记录轨迹颜色
          let layerColor = this.lineColor[el.id]
          if (!layerColor) {
            const len = Object.keys(this.lineColor).length
            this.lineColor[el.id] = this.color[len % (this.color.length + 1)]
            layerColor = this.color[len % (this.color.length + 1)]
          }

          el.color = layerColor
          updateLocusLayer(el)
        }
      })
    },
  },

  methods: {
    // 发现无人机 更新无人机预警数组
    changeUavList(wsData) {
      if (wsData.data && wsData.data.length) {
        if (wsData.command === 'findTarget') {
          wsData.data.forEach((el) => {
            el.data.forEach((ele) => {
              const deviceObj = this.deviceArr.find(
                (item) => item.id == el.device_id
              )
              this.updateUavArr({
                ...ele,
                position_id: wsData.position_id,
                device_id: el.device_id,
                rule_id: el.rule_id,
                device_name: deviceObj ? deviceObj.name : '',
              })
            })
          })
        } else {
          wsData.data.forEach((el) => {
            el.data.forEach((ele) => {
              this.updateLocus({
                ...ele,
                position_id: wsData.position_id,
              })
            })
          })
        }
      }
    },
    // 更新无人机对象
    updateUavArr(uavObj) {
      const uav = {
        ...uavObj,
        lng: uavObj.lon,
      }
      // 接收无人机推送，若10秒内无相同无人机推送移除无人机，否则更新无人机
      const oldUav = this.uavList.find((el) => el.id === uav.id)
      if (oldUav) {
        this.uavList.splice(
          this.uavList.findIndex((el) => el.id === uav.id),
          1
        )
        this.uavList.unshift({ ...uav, locus: oldUav.locus })

        // 移除旧的删除延时器，重新创建10s延时器
        clearTimeout(this.timer[uav.id])
        this.timer[uav.id] = setTimeout(() => {
          this.uavList.splice(
            this.uavList.findIndex((el) => el.id === uav.id),
            1
          )
          this.updateStroeUav()
        }, 10000)
      } else {
        // 无人机列表添加一条数据
        this.uavList.unshift(uav)

        // 创建10s删除无人机延时器
        this.timer[uav.id] = setTimeout(() => {
          this.uavList.splice(
            this.uavList.findIndex((el) => el.id === uav.id),
            1
          )
          this.updateStroeUav()
        }, 10000)
      }

      this.updateStroeUav()
    },
    // 更新无人机 轨迹
    updateLocus(locausObj) {
      const uavObj = this.uavList.find((el) => el.id == locausObj.targetId)

      if (uavObj) {
        uavObj.locus = locausObj.locus
      }
      // else {
      //   this.uavList.unshift({
      //     id: locausObj.targetId,
      //     locus: locausObj.locus,
      //   })
      // }
      this.updateStroeUav()
    },
    // 更新store 中无人机数组,保留当前阵地预警的无人机
    updateStroeUav() {
      const storeArr = this.uavList.filter(
        (el) => el.position_id == this.currentPositionId
      )
      this.$store.commit('SET_UAVLISTARR', JSON.parse(JSON.stringify(storeArr)))

      // 所有阵地的无人机数据
      this.$store.commit(
        'SET_UVALISTALL',
        JSON.parse(JSON.stringify(this.uavList))
      )
    },
    // 发现无人机后音频播放三次
    playAudio() {
      const { uavAudio } = this.$refs
      let start = 0
      const times = 3 // 循环播放次数
      uavAudio.addEventListener('ended', () => {
        uavAudio.play()
        start++
        if (start === times) {
          uavAudio.pause()
        }
      })
      uavAudio.play()
    },

    // 模拟无人机预警 轨迹
    findUav() {
      let i = 1
      const timer = setInterval(() => {
        // console.log(
        //   carLocation.data.data[0].data.lon,
        //   'carLocation.data.data[0].data.lon'
        // )
        // if (carLocation.data.data[0].data.lon < 116.292652) {
        //   carLocation.data.data[0].data.lon += i / 10000
        // }

        // this.$store.commit('SET_SERVERDATA', carLocation)
        // findTarget.data.data[0].data.forEach((el) => {
        //   el.lat += i/1000
        // })
        this.$store.commit('SET_SERVERDATA', findTarget)
        setTimeout(() => {
          this.$store.commit('SET_SERVERDATA', locus)
        }, 500)
        i += 1

        // console.log(i)
        // j++
        if (i == 30) {
          clearInterval(timer)
        }
      }, 1000)
    },
  },
}
</script>
<style scoped lang="scss">
#uavintrusion {
  width: 100%;
  // height: 820px;
  height: calc(100% - 200px - 79px);
  animation: animated-shadow 2s infinite;
  position: absolute;
  z-index: 9999;
  .instrusionimg {
    position: absolute;
    bottom: 0px;
    img {
      width: 100%;
      height: 100%;
      opacity: 0;
      animation: animated-img 2s infinite;
    }
  }
  // box-shadow: 0px 0px 30px 0px #ff0000 inset;
}
@keyframes animated-shadow {
  0% {
    box-shadow: 0 0 0 0 #ff0000 inset;
  }

  85% {
    box-shadow: 0px 0px 30px 0px #ff0000 inset;
  }
}
@keyframes animated-img {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
