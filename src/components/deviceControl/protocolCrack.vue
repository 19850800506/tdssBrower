<template>
  <div id="protocol" v-if="crackObj">
    <div class="protocol">
      <div class="protocol-title">
        <span class="device-title">
          <img src="../../assets/icon/icon_decorate.png" alt="" />
          <span>{{ crackObj.name }}</span>
        </span>
      </div>

      <!-- 下拉框 -->
      <div
        class="dropdown-container"
        v-for="(item, index) in crackObj.data"
        :key="index"
      >
        <div class="container">
          <div class="icondown" @click="dropdownShow(item, index)">
            <img
              v-show="!item.openflag"
              src="../../assets/icon/caret-down-1.png"
            />
            <img
              v-show="item.openflag"
              src="../../assets/icon/caret-down.png"
            />
          </div>
          <div class="title" @click="flyTo(item)">{{ item.name }}</div>
          <div class="operationBtn">
            <div class="whiteList" @click="whiteListBtn(item, index)">
              <el-tooltip
                class="item"
                effect="dark"
                content="白名单"
                placement="top"
                :enterable="false"
              >
                <img src="../../assets/images/control/autoStrike.png" alt="" />
              </el-tooltip>
            </div>
            <!-- <div class="autoStrike" @click="autoStrikeBtn(item, index)">
              <el-tooltip
                v-show="!item.autoStrike"
                class="item"
                effect="dark"
                content="自动打击"
                placement="top"
              >
                <img
                  src="../../assets/icon/deviceOper/GPSGuide/defense-close.png"
                  alt=""
                />
              </el-tooltip>
              <el-tooltip
                v-show="item.autoStrike"
                class="item"
                effect="dark"
                content="自动打击"
                placement="top"
              >
                <img
                  src="../../assets/icon/deviceOper/GPSGuide/defense-open.png"
                  alt=""
                />
              </el-tooltip>
            </div> -->
          </div>
        </div>
        <div class="strike-box" v-show="item.openflag">
          <div class="broad-strike">
            <div class="title">宽带打击</div>
            <div class="strikeBtn">
              <div @click="frequencyBtn(item, index, '0.9')">
                <img
                  v-show="!item.frequencyOpn"
                  src="../../assets/images/control/frequency_1.png"
                  alt=""
                />
                <img
                  v-show="item.frequencyOpn"
                  src="../../assets/images/control/frequency_1-open.png"
                  alt=""
                />
              </div>
              <div @click="frequencyBtn(item, index, '1.5')">
                <img
                  v-show="!item.frequencyOpf"
                  src="../../assets/images/control/frequency_2.png"
                  alt=""
                />
                <img
                  v-show="item.frequencyOpf"
                  src="../../assets/images/control/frequency_2-open.png"
                  alt=""
                />
              </div>
              <div @click="frequencyBtn(item, index, '2.4')">
                <img
                  v-show="!item.frequencyTpf"
                  src="../../assets/images/control/frequency_3.png"
                  alt=""
                />
                <img
                  v-show="item.frequencyTpf"
                  src="../../assets/images/control/frequency_3-open.png"
                  alt=""
                />
              </div>
              <div @click="frequencyBtn(item, index, '5.8')">
                <img
                  v-show="!item.frequencyEpf"
                  src="../../assets/images/control/frequency_4.png"
                  alt=""
                />
                <img
                  v-show="item.frequencyEpf"
                  src="../../assets/images/control/frequency_4-open.png"
                  alt=""
                />
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
import {
  autoStrikeOperate,
  broadbandStrike,
  accurateStrike,
  whiteList,
  addWhiteList,
} from '../../api/operation/protocol.js'
import { parseTime } from '@/utils/index.js'

export default {
  props: ['crackObj'],
  data() {
    return {
      crackCloseHttp: {}, // 操作设备后，暂时停止监听该设备的心跳
    }
  },
  computed: {
    ...mapGetters(['notificationList', 'serverdata', 'disabledState']),
  },
  watch: {
    serverdata(newVal) {
      if (newVal.data.command === 'heartbeat' && this.crackObj) {
        this.crackObj.data.map((el) => {
          const data = newVal.data.data.find((ele) => ele.device_id === el.id)
          if (data && !this.crackCloseHttp[el.id]) {
            // 在线
            if (data.code === 0) {
              el.code = 0
              if (data.state) {
                const state = JSON.parse(data.state)
                if (state.WideAttack9 === 2) {
                  this.$set(el, 'frequencyOpn', true)
                } else {
                  this.$set(el, 'frequencyOpn', false)
                }

                if (state.WideAttack15 === 2) {
                  this.$set(el, 'frequencyOpf', true)
                } else {
                  this.$set(el, 'frequencyOpf', false)
                }
                if (state.WideAttack24 === 2) {
                  this.$set(el, 'frequencyTpf', true)
                } else {
                  this.$set(el, 'frequencyTpf', false)
                }
                if (state.WideAttack58 === 2) {
                  this.$set(el, 'frequencyEpf', true)
                } else {
                  this.$set(el, 'frequencyEpf', false)
                }
              } else {
                this.$set(el, 'frequencyOpn', false)
                this.$set(el, 'frequencyOpf', false)
                this.$set(el, 'frequencyTpf', false)
                this.$set(el, 'frequencyEpf', false)
              }
            } else {
              // 离线
              el.code = 1
              this.$set(el, 'autoStrike', false)

              this.$set(el, 'frequencyOpn', false)
              this.$set(el, 'frequencyOpf', false)
              this.$set(el, 'frequencyTpf', false)
              this.$set(el, 'frequencyEpf', false)
            }
          }
        })
      }
    },
  },
  mounted() {},
  methods: {
    // 自动打击
    autoStrikeBtn(item, index) {
      // 用户没有权限
      if (this.disabledState) {
        this.$message.warning('该用户没有权限')
        return
      }
      // 操作被更高级别用户占用
      if (this.$store.state.setting.doStatusShow) {
        return
      }
      if (item.code == 1) {
        this.$message.error('设备已离线')
        return
      }
      if (item.loading) {
        // 防止点击多次调用接口
        this.$message.warning('正在请求接口，请稍等。。。')
        return
      }

      const params = {
        deviceId: this.crackObj.data[index].id,
        open: !item.autoStrike,
      }
      item.loading = true
      // if (!item.autoStrike) {
      //   params.open = true // 开启自动打击
      autoStrikeOperate(params)
        .then((res) => {
          item.loading = false
          if (res.code === 0) {
            this.$set(item, 'autoStrike', params.open)

            this.$message.success(
              params.open ? '自动打击已开启' : '自动打击已关闭'
            )

            this.closeCrackHttp(item)
          }
        })
        .catch(() => {
          item.loading = false
        })
      // } else {
      //   params.open = false // 关闭自动打击
      //   autoStrikeOperate(params).then((res) => {
      //     if (res.code === 0) {
      //       this.$set(item, 'autoStrike', false)

      //       const obj = {
      //         device_id: item.id,
      //         posName: item.posName,
      //         name: item.name,
      //         code: 1, // 关闭
      //         content: '自动打击关闭',
      //         time: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
      //         type: '操作',
      //       }
      //       this.$store.state.websocket.notificationList.unshift(obj)

      //       this.$message.success('自动打击已关闭')
      //     }
      //   })
      // }
    },
    // 下拉图标
    dropdownShow(item, index) {
      // 操作被更高级别用户占用
      if (this.$store.state.setting.doStatusShow) {
        return
      }
      if (!item.openflag) {
        this.$set(item, 'openflag', true)
      } else {
        this.$set(item, 'openflag', false)
      }
      this.crackObj.data.forEach((el, i) => {
        if (i !== index) {
          this.$set(el, 'openflag', false)
        }
      })
    },
    // 宽带打击
    frequencyBtn(item, index, value) {
      // 用户没有权限
      if (this.disabledState) {
        this.$message.warning('该用户没有权限')
        return
      }
      if (item.code == 1) {
        this.$message.error('设备已离线')
        const obj = {
          device_id: item.id,
          posName: item.posName,
          name: item.name,
          code: 1, // 离线
          content: `设备已离线`,
          time: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
          type: '操作',
        }
        this.$store.state.websocket.notificationList.unshift(obj)
        return
      }

      const params = {
        deviceId: item.id,
        band: '',
        open: false,
      }

      if (value === '0.9') {
        params.band = 'band9'
        params.open = !item.frequencyOpn
        if (item.loadingOpn) {
          // 防止点击多次调用接口
          this.$message.warning('正在请求接口，请稍等。。。')
          return
        }
        item.loadingOpn = true
      } else if (value === '1.5') {
        params.band = 'band15'
        params.open = !item.frequencyOpf
        if (item.loadingOpf) {
          // 防止点击多次调用接口
          this.$message.warning('正在请求接口，请稍等。。。')
          return
        }
        item.loadingOpf = true
      } else if (value === '2.4') {
        params.band = 'band24'
        params.open = !item.frequencyTpf
        if (item.loadingTpf) {
          // 防止点击多次调用接口
          this.$message.warning('正在请求接口，请稍等。。。')
          return
        }
        item.loadingTpf = true
      } else if (value === '5.8') {
        params.band = 'band58'
        params.open = !item.frequencyEpf
        if (item.loadingEpf) {
          // 防止点击多次调用接口
          this.$message.warning('正在请求接口，请稍等。。。')
          return
        }
        item.loadingEpf = true
      }

      // 宽带打击
      broadbandStrike(params)
        .then((res) => {
          if (res.code === 0) {
            // 频段按钮是否高亮
            if (value === '0.9') {
              item.loadingOpn = false
              this.$set(item, 'frequencyOpn', params.open)
            } else if (value === '1.5') {
              item.loadingOpf = false
              this.$set(item, 'frequencyOpf', params.open)
            } else if (value === '2.4') {
              item.loadingTpf = false
              this.$set(item, 'frequencyTpf', params.open)
            } else if (value === '5.8') {
              item.loadingEpf = false
              this.$set(item, 'frequencyEpf', params.open)
            }

            this.$message.success(
              params.open ? '宽带打击已开启' : '宽带打击已关闭'
            )

            this.closeCrackHttp(item)
          } else {
            this.$message.error(res.msg)
            item.loadingOpn = false
            item.loadingOpf = false
            item.loadingTpf = false
            item.loadingEpf = false
          }
        })
        .catch(() => {
          item.loadingOpn = false
          item.loadingOpf = false
          item.loadingTpf = false
          item.loadingEpf = false
        })

      // if (value === '0.9') {
      //   if (!item.frequencyOpn) {
      //     this.$set(item, 'frequencyOpn', true)
      //   } else {
      //     this.$set(item, 'frequencyOpn', false)
      //   }
      //   this.$set(item, 'frequencyOpf', false)
      //   this.$set(item, 'frequencyTpf', false)
      //   this.$set(item, 'frequencyEpf', false)
      //   params.band = 'band9'
      // } else if (value === '1.5') {
      //   if (!item.frequencyOpf) {
      //     this.$set(item, 'frequencyOpf', true)
      //   } else {
      //     this.$set(item, 'frequencyOpf', false)
      //   }
      //   this.$set(item, 'frequencyTpf', false)
      //   this.$set(item, 'frequencyEpf', false)
      //   this.$set(item, 'frequencyOpn', false)
      //   params.band = 'band15'
      // } else if (value === '2.4') {
      //   if (!item.frequencyTpf) {
      //     this.$set(item, 'frequencyTpf', true)
      //   } else {
      //     this.$set(item, 'frequencyTpf', false)
      //   }
      //   this.$set(item, 'frequencyOpn', false)
      //   this.$set(item, 'frequencyOpf', false)
      //   this.$set(item, 'frequencyEpf', false)
      //   params.band = 'band24'
      // } else if (value === '5.8') {
      //   if (!item.frequencyEpf) {
      //     this.$set(item, 'frequencyEpf', true)
      //   } else {
      //     this.$set(item, 'frequencyEpf', false)
      //   }
      //   this.$set(item, 'frequencyOpn', false)
      //   this.$set(item, 'frequencyOpf', false)
      //   this.$set(item, 'frequencyTpf', false)
      //   params.band = 'band58'
      // }
      // if (
      //   item.frequencyOpn ||
      //   item.frequencyOpf ||
      //   item.frequencyTpf ||
      //   item.frequencyEpf
      // ) {
      //   params.open = true
      //   broadbandStrike(params).then((res) => {
      //     if (res.code === 0) {
      //       const obj = {
      //         device_id: item.id,
      //         posName: item.posName,
      //         name: item.name,
      //         code: 0, // 开启
      //         content: '宽带打击开启',
      //         time: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
      //         type: '操作',
      //       }
      //       this.$store.state.websocket.notificationList.unshift(obj)
      //       this.$message.success('宽带打击已开启')
      //     }
      //   })
      // } else {
      //   params.open = false
      //   broadbandStrike(params).then((res) => {
      //     if (res.code === 0) {
      //       const obj = {
      //         device_id: item.id,
      //         posName: item.posName,
      //         name: item.name,
      //         code: 1, // 关闭
      //         content: '宽带打击关闭',
      //         time: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
      //         type: '操作',
      //       }
      //       this.$store.state.websocket.notificationList.unshift(obj)

      //       this.$message.success('宽带打击已关闭')
      //     }
      //   })
      // }
    },
    // 白名单
    whiteListBtn(item) {
      // 用户没有权限
      if (this.disabledState) {
        this.$message.warning('该用户没有权限')
        return
      }
      // 操作被更高级别用户占用
      if (this.$store.state.setting.doStatusShow) {
        return
      }
      this.$store.commit('SET_WHITEPOPUP', false)
      if (item.code == 1) {
        this.$message.error('设备已离线')
        const obj = {
          device_id: item.id,
          posName: item.posName,
          name: item.name,
          code: 1, // 在线
          content: `设备已离线`,
          time: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
          type: '操作',
        }
        this.$store.state.websocket.notificationList.unshift(obj)
        return
      }
      if (item.loading) {
        // 防止点击多次调用接口
        this.$message.warning('正在请求接口，请稍等。。。')
        return
      }

      item.loading = true
      // 获取白名单数据
      whiteList({
        deviceId: item.id,
      })
        .then((res) => {
          if (res.code === 0) {
            item.loading = false
            this.$store.commit('SET_WHITEPOPUP', true)
            this.$store.commit('SET_WHITELISTDATA', res.data)
          }
        })
        .catch(() => {
          item.loading = false
        })
    },
    // 操作设备后停止监听设备心跳，防止按钮闪烁
    closeCrackHttp(item) {
      this.crackCloseHttp[item.id] = true
      clearTimeout(this.crackCloseHttp[`${item.id}_timer`])
      this.crackCloseHttp[`${item.id}_timer`] = null
      this.crackCloseHttp[`${item.id}_timer`] = setTimeout(() => {
        this.crackCloseHttp[item.id] = false
      }, 10000)
    },
    // 视角跳转
    flyTo(item) {
      // 操作被更高级别用户占用
      if (this.$store.state.setting.doStatusShow) {
        return
      }
      if (item.detail.static_data.latitude) {
        window.CesiumSdk.Camera().flyToPoint({
          lat: item.detail.static_data.latitude.value,
          lng: item.detail.static_data.longitude.value,
          alt: 0,
          radius: 15000,
          heading: 0,
          pitch: -60,
        })
      }
    },
  },
}
</script>
<style scoped lang="scss">
#protocol {
  pointer-events: auto;
  .protocol {
    width: 250px;
    margin-top: 10px;
    background-image: url('../../assets/images/control/xieyi.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: 0 0;
    padding-bottom: 30px;
    .protocol-title {
      width: 100%;
      height: 40px;
      line-height: 40px;
      position: relative;
      .device-title {
        display: inline-block;
        position: relative;
        img {
          width: 16px;
          height: 16px;
          position: relative;
          top: 7px;
          left: 7px;
        }
        span {
          font-size: 14px;
          color: #cefcff;
          font-weight: 700;
          position: relative;
          top: 5px;
          left: 10px;
          letter-spacing: 2px;
        }
      }
    }
    .dropdown-container {
      width: 100%;
      .disabledBtn {
        pointer-events: none;
      }
      .container {
        width: 100%;
        height: 36px;
        display: flex;
        align-items: center;
        // background-image: url('../../assets/images/control/Rectangle.png');
        // background-size: cover;
        border-top: 1px solid;
        border-bottom: 1px solid;
        border-image: linear-gradient(
            to right,
            rgba(24, 254, 254, 0),
            rgba(24, 254, 254, 1),
            rgba(24, 254, 254, 0)
          )
          1;
        .icondown {
          cursor: pointer;
          width: 12px;
          height: 12px;
          margin-left: 8px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .title {
          cursor: pointer;
          width: 100%;
          height: 100%;
          margin-left: 2px;
          line-height: 36px;
          color: #cefcff;
        }
        .operationBtn {
          display: flex;
          justify-content: center;
          margin-right: 17px;
          .whiteList,
          .autoStrike {
            cursor: pointer;
            width: 24px;
            height: 24px;
            margin-left: 7px;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .strike-box {
        width: 100%;
        height: 100%;
        .broad-strike {
          width: 100%;
          height: 36px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid;
          border-image: linear-gradient(
              to right,
              rgba(24, 254, 254, 0),
              rgba(24, 254, 254, 1),
              rgba(24, 254, 254, 0)
            )
            1;
          .title {
            width: 100%;
            height: 100%;
            margin-left: 24px;
            line-height: 36px;
            color: #cefcff;
          }
          .strikeBtn {
            display: flex;
            justify-content: center;
            margin-right: 17px;
            div {
              cursor: pointer;
              width: 24px;
              height: 24px;
              margin-left: 7px;
              img {
                width: 100%;
                height: 100%;
              }
            }
          }
        }
        .precise-strike {
          .title {
            height: 30px;
            line-height: 30px;
            color: #cefcff;
            margin-left: 24px;
          }
          .strike-table {
            width: 275px;
            height: 100%;
            margin-left: 10px;
            .table-header,
            .table-content {
              width: 100%;
              display: flex;
              border-bottom: 1px solid rgba(255, 255, 255, 0.2);
              li {
                height: 32px;
                font-size: 12px;
                line-height: 32px;
                transform: scale(0.8);
                color: #cefcff;
              }
              li:nth-child(1) {
                width: 84px;
              }
              li:nth-child(2) {
                width: 70px;
              }
              li:nth-child(3) {
                width: 42px;
              }
              li:nth-child(4) {
                width: 79px;
              }
            }
            .table-header {
              background: #2c4849;
              li {
                font-weight: 700;
              }
              li::before {
                content: '';
                width: 1px;
                height: 17px;
                margin-left: -5px;
                margin-right: 6px;
                border-left: 1px solid rgba(255, 255, 255, 0.2);
              }
            }
            .table-content {
              li {
                margin-left: 3px;
              }
              li:nth-child(4) {
                display: flex;
                align-items: center;
                span:nth-child(1) {
                  cursor: pointer;
                  color: #e74f4f;
                }
                span:nth-child(2) {
                  display: inline-block;
                  width: 1px;
                  height: 14px;
                  margin: 0 6px;
                  border: 1px solid rgba(255, 255, 255, 0.2);
                }
                span:nth-child(3) {
                  cursor: pointer;
                  color: #4fe7c3;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
