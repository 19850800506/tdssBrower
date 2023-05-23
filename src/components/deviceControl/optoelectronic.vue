<template>
  <div id="optoelectronic" v-if="electronicObj">
    <div class="optoelectronic">
      <div class="electr-title">
        <span class="device-title">
          <img src="../../assets/icon/icon_decorate.png" alt="" />
          <span>{{ electronicObj.name }}</span>
        </span>
        <img
          style="width: 100%; display: block"
          src="@/assets/icon/deviceOper/line.png"
          alt=""
        />
      </div>
      <div
        class="device-name"
        v-for="(item, index) in electronicObj.data"
        :key="index"
      >
        <div class="icondown"></div>
        <span class="name" @click="flyTo(item)">{{ item.name }}</span>
        <div class="device-expel" @click="expelChange(item)">
          <el-tooltip
            class="item"
            effect="dark"
            content="驱离"
            placement="top"
            :enterable="false"
          >
            <img :src="item.expelStatus ? onExpel : offExpel" alt="" />
          </el-tooltip>
        </div>
        <div class="device-forced" @click="forcedChange(item)">
          <el-tooltip
            class="item"
            effect="dark"
            content="迫降"
            placement="top"
            :enterable="false"
          >
            <img :src="item.forcedStatus ? onForced : offForced" alt="" />
          </el-tooltip>
        </div>
        <img
          style="width: 100%"
          src="@/assets/icon/deviceOper/line.png"
          alt=""
        />
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  expelElectronic,
  forcedElectronic,
  stopElectronic,
} from '../../api/operation/operation'
import { parseTime } from '@/utils/index.js'

const onExpel = require('../../assets/icon/deviceOper/omni/expel-open.png')
const offExpel = require('../../assets/icon/deviceOper/omni/expel-close.png')
const onForced = require('../../assets/icon/deviceOper/omni/forced-open.png')
const offForced = require('../../assets/icon/deviceOper/omni/forced-close.png')

export default {
  props: ['electronicObj'],
  data() {
    return {
      onExpel,
      offExpel,
      onForced,
      offForced,
      photoCloseHttp: {}, // 操作设备后，暂时停止监听该设备的心跳
    }
  },
  computed: {
    ...mapGetters(['serverdata', 'heatBeatList', 'disabledState']),
  },
  watch: {
    serverdata(newVal) {
      // 监听光电设备打击按钮的状态
      if (newVal.data.command === 'heartbeat' && this.electronicObj) {
        this.electronicObj.data.map((el) => {
          const data = newVal.data.data.find((ele) => ele.device_id === el.id)
          if (data && !this.photoCloseHttp[el.id]) {
            el.code = 0
            // 在线
            if (data.code === 0) {
              const state = JSON.parse(data.state)
              if (state.direct_state === 'expel') {
                this.$set(el, 'expelStatus', true)
                this.$set(el, 'forcedStatus', false)
              } else if (state.direct_state === 'forced') {
                this.$set(el, 'expelStatus', false)
                this.$set(el, 'forcedStatus', true)
              } else {
                this.$set(el, 'expelStatus', false)
                this.$set(el, 'forcedStatus', false)
              }
            } else {
              el.code = 1
              this.$set(el, 'expelStatus', false)
              this.$set(el, 'forcedStatus', false)
            }
          }
        })
      }
    },
  },
  methods: {
    // 模拟在线
    // online() {
    //   this.$store.commit('SET_SERVERDATA', {
    //     command: 'push',
    //     data: {
    //       position_id: 1111671007658371,
    //       command: 'heartbeat',
    //       data: [
    //         // {
    //         //   device_id: 1090103001000130,
    //         //   code: 1,
    //         //   state: 'normal',
    //         //   error: null,
    //         // },
    //         {
    //           device_id: 1090016001000150,
    //           code: 0,
    //           state:
    //             '{\r\n  "camera_state": "normal",\r\n  "direct_state": "normal"\r\n}',
    //         },
    //       ],
    //       time: 1671003781491,
    //     },
    //     time: 0,
    //   })
    // },
    // 光电驱离
    expelChange(item) {
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
        console.log(item, 'item')
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
      if (!item.expelStatus) {
        if (item.loading) {
          this.$message.warning('正在请求接口，请稍等。。。')
          // 防止点击多次调用接口
          return
        }
        item.loading = true
        expelElectronic({
          deviceId: item.id,
        })
          .then((res) => {
            item.loading = false
            if (res.code === 0) {
              this.$set(item, 'expelStatus', true)
              this.$set(item, 'forcedStatus', false)
              this.$message.success('已开启驱离')
            }

            this.closePhotoHttp(item.id)
          })
          .catch(() => {
            item.loading = false
            this.$set(item, 'expelStatus', false)
          })
      } else {
        if (item.loading) {
          // 防止点击多次调用接口
          this.$message.warning('正在请求接口，请稍等。。。')
          return
        }
        item.loading = true
        stopElectronic({
          deviceId: item.id,
        })
          .then((res) => {
            item.loading = false
            if (res.code === 0) {
              this.$set(item, 'expelStatus', false)
              this.$message.success('已关闭驱离')
            }

            this.closePhotoHttp(item.id)
          })
          .catch(() => {
            item.loading = false
            this.$set(item, 'expelStatus', true)
          })
      }
    },
    forcedChange(item) {
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
        console.log(item, 'item')
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
      if (!item.forcedStatus) {
        if (item.loading) {
          this.$message.warning('正在请求接口，请稍等。。。')
          // 防止点击多次调用接口
          return
        }
        item.loading = true
        forcedElectronic({
          deviceId: item.id,
        })
          .then((res) => {
            item.loading = false
            if (res.code === 0) {
              this.$set(item, 'forcedStatus', true)
              this.$set(item, 'expelStatus', false)
              this.$message.success('已开启迫降')
            }
          })
          .catch(() => {
            item.loading = false
            this.$set(item, 'forcedStatus', false)
          })
      } else {
        if (item.loading) {
          // 防止点击多次调用接口
          this.$message.warning('正在请求接口，请稍等。。。')
          return
        }
        item.loading = true
        stopElectronic({
          deviceId: item.id,
        })
          .then((res) => {
            item.loading = false
            if (res.code === 0) {
              this.$set(item, 'forcedStatus', false)
              this.$message.success('已关闭迫降')
            }

            this.closePhotoHttp(item.id)
          })
          .catch(() => {
            item.loading = false
            this.$set(item, 'forcedStatus', true)
          })
      }
    },
    // 操作设备后停止监听设备心跳，防止按钮闪烁
    closePhotoHttp(item) {
      this.photoCloseHttp[item.id] = true
      clearTimeout(this.photoCloseHttp[`${item.id}_timer`])
      this.photoCloseHttp[`${item.id}_timer`] = null
      this.photoCloseHttp[`${item.id}_timer`] = setTimeout(() => {
        this.photoCloseHttp[item.id] = false
      }, 10000)
    },
  },
}
</script>
<style scoped lang="scss">
#optoelectronic {
  pointer-events: auto;
  .optoelectronic {
    width: 250px;
    margin-top: 10px;
    background-image: url('../../assets/icon/deviceOper/long-background.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: 0 0;
    padding-bottom: 30px;
    .electr-title {
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
          // letter-spacing: 2px;
        }
      }
    }
    .device-name {
      width: 100%;
      // height: 36px;
      position: relative;
      top: 5px;
      .icondown {
        cursor: pointer;
        display: inline-block;
        width: 12px;
        height: 12px;
        margin-left: 8px;
        position: relative;
        top: -2px;
        img {
          width: 12px;
          height: 12px;
        }
      }
      .name {
        cursor: pointer;
        display: inline-block;
        font-size: 12px;
        color: #cefcff;
        font-weight: 400;
        margin-top: 10px;
        letter-spacing: 1px;
        max-width: 110px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      div {
        width: 24px;
        height: 24px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .device-expel {
        cursor: pointer;
        position: absolute;
        top: 6px;
        right: 48px;
      }
      .device-forced {
        cursor: pointer;
        position: absolute;
        top: 6px;
        right: 17px;
      }
    }
  }
}
</style>
