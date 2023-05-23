<template>
  <div id="findstrike">
    <!-- 查打一体 -->
    <div class="interference-omni" v-if="findstrikeObj">
      <div class="interference-title">
        <span class="device-title">
          <img src="@/assets/icon/deviceOper/group.png" alt="" />
          <span>{{ findstrikeObj.name }}</span>
        </span>
        <div
          class="expel"
          v-show="findstrikeObj.data.length > 1"
          @click="expelChange('all')"
        >
          <el-tooltip
            v-show="!expelStatus"
            class="item"
            effect="dark"
            content="驱离"
            placement="top"
          >
            <img src="@/assets/icon/deviceOper/omni/expel-close.png" alt="" />
          </el-tooltip>
          <el-tooltip
            v-show="expelStatus"
            class="item"
            effect="dark"
            content="驱离"
            placement="top"
          >
            <img src="@/assets/icon/deviceOper/omni/expel-open.png" alt="" />
          </el-tooltip>
        </div>
        <div
          class="forced"
          v-show="findstrikeObj.data.length > 1"
          @click="forcedChange('all')"
        >
          <el-tooltip
            v-show="!forcedStatus"
            class="item"
            effect="dark"
            content="迫降"
            placement="top"
          >
            <img src="@/assets/icon/deviceOper/omni/forced-close.png" alt="" />
          </el-tooltip>
          <el-tooltip
            v-show="forcedStatus"
            class="item"
            effect="dark"
            content="迫降"
            placement="top"
          >
            <img src="@/assets/icon/deviceOper/omni/forced-open.png" alt="" />
          </el-tooltip>
        </div>
        <img
          style="width: 100%; display: block"
          src="@/assets/icon/deviceOper/line.png"
          alt=""
        />
      </div>
      <div
        class="device-name"
        v-for="(item, index) in findstrikeObj.data"
        :key="index"
      >
        <div class="icondown">
          <!-- <img
            v-show="!item.openflag"
            src="../../assets/icon/caret-down-1.png"
          />
          <img v-show="item.openflag" src="../../assets/icon/caret-down.png" /> -->
        </div>
        <span class="name" @click="flyTo(item)">{{ item.name }}</span>
        <div class="device-expel" @click="expelChange(item)">
          <el-tooltip
            v-show="!item.expelStatus"
            class="item"
            effect="dark"
            content="驱离"
            placement="top"
          >
            <img src="@/assets/icon/deviceOper/omni/expel-close.png" alt="" />
          </el-tooltip>
          <el-tooltip
            v-show="item.expelStatus"
            class="item"
            effect="dark"
            content="驱离"
            placement="top"
          >
            <img src="@/assets/icon/deviceOper/omni/expel-open.png" alt="" />
          </el-tooltip>
        </div>
        <div class="device-forced" @click="forcedChange(item)">
          <el-tooltip
            v-show="!item.forcedStatus"
            class="item"
            effect="dark"
            content="迫降"
            placement="top"
          >
            <img src="@/assets/icon/deviceOper/omni/forced-close.png" alt="" />
          </el-tooltip>
          <el-tooltip
            v-show="item.forcedStatus"
            class="item"
            effect="dark"
            content="迫降"
            placement="top"
          >
            <img src="@/assets/icon/deviceOper/omni/forced-open.png" alt="" />
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
  expelfindStrike,
  forcedfindStrike,
  stopfindStrike,
} from '@/api/operation/operation'
import { parseTime } from '@/utils/index.js'

export default {
  props: ['findstrikeObj'],
  data() {
    return {
      expelStatus: false,
      forcedStatus: false,
      attackCloseHttp: {}, // 操作设备后，暂时停止监听该设备的心跳
    }
  },
  computed: {
    ...mapGetters([
      'serverdata',
      'currentPositionId',
      'interstrike',
      'disabledState',
    ]),
  },
  watch: {
    serverdata(newVal) {
      // 监听全向干扰设备打击按钮的状态
      if (newVal.data.command === 'heartbeat' && this.findstrikeObj) {
        this.findstrikeObj.data.map((el) => {
          const data = newVal.data.data.find((ele) => ele.device_id === el.id)
          if (data && !this.attackCloseHttp[el.id]) {
            el.code = 0
            // 在线
            if (data.code === 0) {
              const state = JSON.parse(data.state)
              if (state.jammin_state === 'expel') {
                this.$set(el, 'expelStatus', true)
                this.$set(el, 'forcedStatus', false)
              } else if (state.jammin_state === 'forced') {
                this.$set(el, 'expelStatus', false)
                this.$set(el, 'forcedStatus', true)
              } else {
                this.$set(el, 'expelStatus', false)
                this.$set(el, 'forcedStatus', false)
              }
            } else {
              // 离线
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
    // 全向驱离
    expelChange(item) {
      // 用户没有权限
      if (this.disabledState) {
        return
      }
      // 操作被更高级别用户占用
      if (this.$store.state.setting.doStatusShow) {
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
      if (item !== 'all') {
        if (!item.expelStatus) {
          if (item.loading) {
            this.$message.warning('正在请求接口，请稍等。。。')
            // 防止点击多次调用接口
            return
          }
          item.loading = true
          expelfindStrike({
            deviceId: item.id,
            interval: this.interstrike,
          })
            .then((res) => {
              item.loading = false
              if (res.code === 0) {
                this.$set(item, 'expelStatus', true)
                this.$set(item, 'forcedStatus', false)
                this.$message.success('已开启驱离')
                this.closeAttachHttp(item)
              }
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
          stopfindStrike({
            deviceId: item.id,
          })
            .then((res) => {
              item.loading = false
              if (res.code === 0) {
                this.$set(item, 'expelStatus', false)
                this.$message.success('已关闭驱离')
                this.closeAttachHttp(item)
              }
            })
            .catch(() => {
              item.loading = false
              this.$set(item, 'expelStatus', true)
            })
        }
      }
      //  else {
      //   this.expelStatus = !this.expelStatus
      //   this.forcedStatus = false
      //   if (this.expelStatus) {
      //     this.forcedDirStatus = false
      //     expelStatus({
      //       positionId: this.currentPositionId,
      //       type: 'all',
      //       interval: this.interstrike,
      //     }).then((res) => {
      //       if (res.code === 0) {
      //         this.$message.success('全向驱离成功')
      //       }
      //     })
      //   }
      // }
    },
    // 全向迫降
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
      if (item !== 'all') {
        if (!item.forcedStatus) {
          if (item.loading) {
            // 防止点击多次调用接口
            this.$message.warning('正在请求接口，请稍等。。。')
            return
          }
          item.loading = true
          forcedfindStrike({
            deviceId: item.id,
            interval: this.interstrike,
          })
            .then((res) => {
              item.loading = false
              if (res.code === 0) {
                this.$set(item, 'forcedStatus', true)
                this.$set(item, 'expelStatus', false)
                this.$message.success('已开启迫降')
                this.closeAttachHttp(item)
              }
            })
            .catch(() => {
              item.loading = false
              this.$set(item, 'forcedStatus', false)
            })
        } else {
          // this.$set(item, 'forcedStatus', false)
          if (item.loading) {
            // 防止点击多次调用接口
            this.$message.warning('正在请求接口，请稍等。。。')
            return
          }
          item.loading = true
          stopfindStrike({
            deviceId: item.id,
          })
            .then((res) => {
              item.loading = false
              if (res.code === 0) {
                this.$set(item, 'forcedStatus', false)
                this.$message.success('已关闭迫降')
                this.closeAttachHttp(item)
              }
            })
            .catch(() => {
              item.loading = false
              this.$set(item, 'forcedStatus', true)
            })
        }
      }
      // else {
      //   this.forcedStatus = !this.forcedStatus
      //   this.expelStatus = false
      //   if (this.forcedStatus) {
      //     this.expelStatus = false
      //     forcedAllDevice({
      //       positionId: this.currentPositionId,
      //       type: 'all',
      //       interval: this.interstrike,
      //     }).then((res) => {
      //       if (res.code === 0) {
      //         this.$message.success('全向迫降成功')
      //       }
      //     })
      //   }
      // }
    },
    // 跳转视角
    flyTo(item) {
      // 操作被更高级别用户占用
      if (this.$store.state.setting.doStatusShow) {
        return
      }
      window.CesiumSdk.Camera().flyToPoint({
        lat: item.detail.static_data.latitude.value,
        lng: item.detail.static_data.longitude.value,
        alt: 0,
        radius: 15000,
        heading: 0,
        pitch: -60,
      })
    },
    // 操作设备后停止监听设备心跳，防止按钮闪烁
    closeAttachHttp(item) {
      this.attackCloseHttp[item.id] = true
      clearTimeout(this.attackCloseHttp[`${item.id}_timer`])
      this.attackCloseHttp[`${item.id}_timer`] = null
      this.attackCloseHttp[`${item.id}_timer`] = setTimeout(() => {
        this.attackCloseHttp[item.id] = false
      }, 10000)
    },
  },
}
</script>
<style scoped lang="scss">
#findstrike {
  pointer-events: auto;
  .interference-omni {
    width: 250px;
    margin-top: 10px;
    background-image: url('../../assets/icon/deviceOper/long-background.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: 0 0;
    padding-bottom: 30px;
    .interference-title {
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
      div {
        cursor: pointer;
        width: 24px;
        height: 24px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .expel {
        position: absolute;
        top: 12px;
        right: 48px;
      }
      .forced {
        position: absolute;
        top: 12px;
        right: 17px;
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

      .direction {
        display: block;
        position: relative;
        height: 110px;
        width: 80%;
        margin: 0 auto;
        margin-top: 10px;
        background-image: url('../../assets/icon/deviceOper/direction-line.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: 0 0;
        div {
          cursor: pointer;
        }
        .centImg {
          position: absolute;
          width: 20px;
          height: 20px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 3;
        }
        .topImg {
          position: absolute;
          top: 38%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 2;
        }
        .rightImg {
          position: absolute;
          top: 50%;
          left: 58%;
          transform: translate(-50%, -50%);
          z-index: 2;
        }
        .bottomImg {
          position: absolute;
          top: 62.5%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 2;
        }
        .leftImg {
          position: absolute;
          top: 50%;
          left: 42%;
          transform: translate(-50%, -50%);
          z-index: 2;
        }
        .leftTopImg {
          width: 20px;
          height: 20px;
          position: absolute;
          top: 0;
          left: 0;
        }
        .leftCenterImg {
          width: 20px;
          height: 20px;
          position: absolute;
          top: 50%;
          left: 0;
          transform: translate(0%, -50%);
        }
        .leftBottomImg {
          width: 20px;
          height: 20px;
          position: absolute;
          top: 100%;
          left: 0;
          transform: translate(0%, -100%);
        }
        .centerTopImg {
          width: 20px;
          height: 20px;
          position: absolute;
          top: 0;
          left: 50%;
          transform: translate(-50%, 0%);
        }
        .centerBottomImg {
          width: 20px;
          height: 20px;
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translate(-50%, -100%);
        }
        .rightTopImg {
          width: 20px;
          height: 20px;
          position: absolute;
          top: 0;
          left: 100%;
          transform: translate(-100%, 0%);
        }
        .rightCenterImg {
          width: 20px;
          height: 20px;
          position: absolute;
          top: 50%;
          left: 100%;
          transform: translate(-100%, -50%);
        }
        .rightBottomImg {
          width: 20px;
          height: 20px;
          position: absolute;
          top: 100%;
          left: 100%;
          transform: translate(-100%, -100%);
        }
        .arrowImg {
          cursor: auto;
          position: relative;
          top: 12%;
          left: 47.5%;
          width: 10px;
          height: 44px;
          z-index: 1;
          transform-origin: center bottom;
          transform: rotate(0);
        }
      }
    }
  }
}
</style>
