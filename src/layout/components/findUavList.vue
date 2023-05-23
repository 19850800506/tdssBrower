<template>
  <div id="finduavList">
    <div class="uavList_container">
      <div class="uavList" v-for="(item, index) in uavList" :key="index">
        <div class="uavtitle">
          <div @click="uavJump(item)" class="title">{{ item.posName }}</div>

          <div class="btnDiv">
            <div class="btn_abs">
              <!-- <div
            class="btnbox"
            v-if="item.deviceType.includes('AOA') || item.deviceType.includes('TDOA')" 
          >
            <div @click="expelBtn(item)">驱离</div>
            <div @click="forcedBtn(item)">迫降</div>
          </div> -->

              <div class="btnbox" v-if="item.deviceType.includes('Crack')">
                <div
                  v-if="!strikeObj[item.id] && !item.attacking"
                  @click="preciseStrikeBtn(item, true)"
                >
                  打击
                </div>
                <div
                  v-show="!item.whitelisted"
                  @click="whiteListBtn(item)"
                  v-if="!strikeObj[item.id] && !item.attacking"
                >
                  白名单
                </div>
                <div
                  v-if="item.attacking || strikeObj[item.id]"
                  @click="preciseStrikeBtn(item, false)"
                >
                  取消打击
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="typeContainer">
          <div class="time">
            <span>标识：</span>
            <span>{{ item.id }}</span>
          </div>
        </div>
        <div class="typeContainer">
          <div class="time">
            <span>时间：</span>
            <span>{{ item.dateTime }}</span>
          </div>
          <div class="type">
            <span>型号：</span>
            <span>{{ item.model }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils/index.js'
import {
  accurateStrike,
  whiteList,
  strikeOperate,
  addWhiteList,
} from '../../api/operation/protocol.js'

export default {
  data() {
    return {
      uavList: [], // 无人机列表
      uavArr: [
        {
          posName: '池州阵地入侵无人机',
          address: null,
          id: 'test121213',
          lon: 113.54674,
          lat: 32.544877,
          alt: 90,
          model: '测试型号1',
          type: null,
          freq: 0,
          is_whitelist: false,
          devid: 1090007001000669,
          position_id: 1111667986713748,
          device_id: 1090007001000669,
          rule_id: 1040007001000124,
          lng: 113.54674,
          deviceType: 'Crack',
          whitelisted: false,
          attacking: false,
        },
        {
          posName: '池州阵地入侵无人机',
          address: null,
          id: 'test121212',
          lon: 113.54674,
          lat: 32.544877,
          alt: 90,
          model: '测试型号2',
          type: null,
          freq: 0,
          is_whitelist: false,
          devid: 1090007001000669,
          position_id: 1111667986713748,
          device_id: 1090007001000669,
          rule_id: 1040007001000124,
          lng: 113.54674,
          deviceType: 'Crack',
          whitelisted: true,
          attacking: true,
        },
      ],
      strikeObj: {}, // 正在打击的无人机对象
      strikeObjTimer: {}, // 操作打击后的延时器
    }
  },
  computed: {
    ...mapGetters(['deviceArr', 'uavListArr']),
  },
  watch: {
    uavListArr(newVal) {
      this.uavList = newVal.map((item) => {
        item.origin_targets = item.origin_targets || {}
        const device = this.deviceArr.find((el) => el.id === item.device_id)

        // 发现设备类型集合
        const deviceType = this.deviceArr.filter((el) => {
          return item.origin_targets
            ? Object.keys(item.origin_targets).find((ele) => ele == el.id)
            : {}
        })
        // 获取操作打击设备id 和 对应无人机id
        const attackDevice = {}
        deviceType.forEach((el) => {
          if (attackDevice[el.type]) {
            attackDevice[el.type].push({
              ...item.origin_targets[el.id],
              deviceId: el.id,
            })
          } else if (item.origin_targets[el.id]) {
            attackDevice[el.type] = [
              { ...item.origin_targets[el.id], deviceId: el.id },
            ]
          }
        })

        // 无人机是否处于打击状态
        let { attacking } = item
        if (this.strikeObjTimer[item.id] === '精准打击') {
          attacking = true
        } else if (this.strikeObjTimer[item.id] === '取消打击') {
          attacking = false
        }

        if (device) {
          return {
            deviceId: device.id,
            posName:
              item.lat !== 0 || item.lon !== 0
                ? `${device.posName}入侵无人机`
                : '未知无人机',
            deviceType: deviceType.length
              ? deviceType.map((el) => el.type)
              : [device.type],
            attackDevice,
            dateTime: parseTime(new Date(), '{y}/{m}/{d}'),
            model: item.model,
            id: item.id,
            lat: item.lat,
            lng: item.lng,
            lon: item.lon,
            alt: item.alt,
            positionId: item.position_id,
            whitelisted: item.whitelisted,
            attacking,
            origin_id: item.origin_id,
          }
        }
      })
    },
  },
  methods: {
    // 打击
    preciseStrikeBtn(item, open) {
      // 若是融合数据
      const attack_id = item.attackDevice.Crack
      accurateStrike({
        deviceId: attack_id ? attack_id[0].deviceId : item.deviceId,
        droneId: attack_id ? attack_id[0].origin_id : item.origin_id,
        open,
      }).then((res) => {
        if (res.code === 0) {
          // this.strikeObj[item.id] = true
          this.$set(this.strikeObj, item.id, open)

          this.strikeObjTimer[item.id] = open ? '精准打击' : '取消打击'
          setTimeout(() => {
            this.strikeObjTimer[item.id] = false
          }, 5000)
          this.$message.success(open ? '已开启精准打击' : '已取消打击')
        }
      })
    },
    // 白名单
    whiteListBtn(item) {
      // 若是融合数据
      const attack_id = item.attackDevice.Crack

      addWhiteList({
        device_id: attack_id ? attack_id[0].deviceId : item.deviceId,
        drone_id: attack_id ? attack_id[0].origin_id : item.origin_id,
      }).then((res) => {
        item.whitelisted = true

        whiteList({
          deviceId: attack_id ? attack_id[0].deviceId : item.deviceId,
        }).then((res) => {
          if (res.code === 0) {
            this.$store.commit('SET_WHITEPOPUP', true)
            this.$store.commit('SET_WHITELISTDATA', res.data)
          }
        })
      })
    },
    // 驱离
    expelBtn(item) {
      const params = {
        positionId: item.positionId,
        lat: item.lat,
        lng: item.lng,
        lon: item.lon,
        type: 'expel',
        interval: false,
      }
      strikeOperate(params).then((res) => {
        if (res.code === 0) {
          this.$message.success('驱离成功')
        }
      })
    },
    // 迫降
    forcedBtn(item) {
      const params = {
        positionId: item.positionId,
        lat: item.lat,
        lng: item.lng,
        lon: item.lon,
        type: 'forced',
        interval: false,
      }
      strikeOperate(params).then((res) => {
        if (res.code === 0) {
          this.$message.success('迫降成功')
        }
      })
    },
    // 无人机视角跳转
    uavJump(item) {
      window.CesiumSdk.Camera().flyToPoint({
        lat: item.lat,
        lng: item.lng,
        alt: item.alt,
        // radius: 500,
        // heading: 12,
        // pitch: -90,
      })
    },
  },
}
</script>
<style scoped lang="scss">
#finduavList {
  pointer-events: auto;
  position: absolute;
  left: 20px;
  top: 300px;
  .uavList_container {
    width: 300px;
    height: 220px;
    overflow-x: hidden;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      background: #4fe7cb;
    }
    .uavList {
      width: 300px;
      // height: 80px;
      margin-bottom: 4px;
      padding: 0 15px;
      padding-bottom: 10px;
      background: linear-gradient(90deg, #021519 0%, #032829 100%);

      .uavtitle {
        display: flex;
        padding-top: 10px;
        justify-content: space-between;
        .title {
          font-size: 14px;
          color: #ffffff;
          max-width: 190px;
          text-overflow: ellipsis;
          /*隐藏后添加省略号*/
          white-space: nowrap;
          overflow: hidden;
          cursor: pointer;
        }
        .btnDiv {
          width: 85px;
          position: relative;
          .btn_abs {
            position: absolute;
            display: flex;
            flex-direction: column;
          }
        }
        .btnbox {
          display: flex;
          margin-left: 10px;
          font-size: 12px;
          div {
            cursor: pointer;
          }
          div:nth-child(1) {
            margin-right: 5px;
            margin-bottom: 10px;
            color: #e74f4f;
          }
          div:nth-child(2) {
            margin-left: 5px;
            color: #4fe7c3;
          }
        }
      }
      .typeContainer {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        div {
          font-size: 11px;
          color: #ffffff;
        }
        .time {
          margin-right: 10px;
        }
      }
    }
  }

  // .typeContainer {
  //   margin-top: 10px;
  //   display: flex;
  //   justify-content: space-between;
  //   div {
  //     font-size: 11px;
  //     color: #ffffff;
  //   }
  //   .time {
  //     margin-right: 10px;
  //   }
  // }
}
</style>
