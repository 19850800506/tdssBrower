<template>
  <div id="notification">
    <div class="specific" v-if="specificshow">
      <ul class="table_header">
        <li>内容</li>
        <li>时间</li>
        <li>类型</li>
      </ul>
      <div class="body_container">
        <ul
          class="table_content"
          v-for="(item, index) in notification"
          :key="index"
        >
          <el-tooltip
            placement="top"
            :disabled="isShowTooltip"
            :enterable="false"
          >
            <div slot="content">
              {{ item.posName + item.name + item.content }} &nbsp;&nbsp;
              {{ item.time }}
            </div>
            <li>
              <div
                class="yuan"
                :style="{ background: item.code == 0 ? '#4A90E2' : '#fc7e31' }"
              ></div>
              <div @mouseover="onMouseOver(index)" class="content">
                <span :ref="'refName' + index">
                  {{ item.posName + item.name + item.content }}
                </span>
              </div>
            </li>
          </el-tooltip>
          <li>{{ item.time.split(' ')[1] }}</li>
          <li>{{ item.type }}</li>
        </ul>
      </div>
    </div>
    <div
      class="simple"
      v-if="latestNotice"
      @click="specificshow = !specificshow"
    >
      <div
        class="yuan"
        :style="{
          background: notification[0].code == 0 ? '#4A90E2' : '#fc7e31',
        }"
      ></div>
      <div class="content">
        {{
          notification[0].posName +
          notification[0].name +
          notification[0].content
        }}
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils/index.js'

export default {
  mounted() {},
  data() {
    return {
      specificshow: false,
      latestNotice: false,
      notification: [],
      isShowTooltip: false,
    }
  },
  computed: {
    ...mapGetters([
      'isLogin',
      'currentPositionId',
      'heatBeatList',
      'deviceArr',
      'notificationList',
      'positionDetail',
    ]),
    serverdata() {
      return this.$store.state.websocket.serverdata
    },
  },
  watch: {
    notificationList(val) {
      if (val.length) {
        this.specificshow = true
        this.latestNotice = true
      } else {
        this.specificshow = false
        this.latestNotice = false
      }

      this.notification = val
    },
    deviceArr(newVal) {
      this.notification = []
      newVal.forEach((el) => {
        const obj = {
          device_id: el.id,
          posName: el.posName,
          name: el.name,
          code: el.code,
          content: el.code === 0 ? '在线' : '离线',
          time: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
          type: '通知',
        }
        this.notification.unshift(obj)
      })
      this.$store.commit('SET_NOTIFICATION', this.notification)
    },
    serverdata(newVal) {
      if (newVal.data.command == 'OperateResult') {
        const objResult = {
          posName: this.positionDetail.name,
          name: newVal.data.data.command,
          code: newVal.data.data.success ? 0 : 1,
          content: newVal.data.data.success ? '成功' : '失败',
          time: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
          type: '操作',
        }
        this.$store.state.websocket.notificationList.unshift(objResult)
      }
    },
    // serverdata(newVal) {
    //   if (newVal.command === 'heartbeat') {
    //     console.log(newVal, 'newVal')
    //     const arr = {
    //       positionName: '池州阵地',
    //       name: this.deviceArr.find(()),
    //     }
    //   }
    // },
  },
  methods: {
    onMouseOver(index) {
      const ref = eval(`this.$refs.refName${index}`)[0]
      const parentWidth = ref.parentNode.offsetWidth
      const contentWidth = ref.offsetWidth
      if (contentWidth > parentWidth) {
        this.isShowTooltip = false
      } else {
        this.isShowTooltip = true
      }
    },
  },
}
</script>
<style lang="scss" scoped>
#notification {
  pointer-events: auto;
  position: absolute;
  left: 20px;
  bottom: 210px;
  .simple {
    width: 306px;
    height: 22px;
    background: linear-gradient(90deg, #021519 0%, #032829 100%);
    opacity: 0.8;
    backdrop-filter: blur(6px);
    display: flex;
    .yuan {
      width: 6px;
      height: 6px;
      background: #fc7e31;
      border-radius: 100%;
      line-height: 22px;
      margin: 8px;
      margin-left: 12px;
    }
    .content {
      font-size: 12px;
      line-height: 22px;
      color: #ffffff;
      transform: scale(0.9) translateX(-12px);
    }
  }
  .specific {
    width: 306px;
    height: 189px;
    left: 0px;
    background: linear-gradient(
      90deg,
      rgba(2, 21, 25, 0.7) 0%,
      rgba(3, 40, 41, 0.7) 100%
    );
    backdrop-filter: blur(6px);
    margin-bottom: 2px;
    .table_header {
      width: 100%;
      background: linear-gradient(
        132.84deg,
        rgba(3, 59, 61, 0.8) 13.17%,
        rgba(2, 41, 49, 0.8) 86.88%
      );
      display: flex;
      li {
        /* 内容 */
        height: 26px;
        font-family: 'Microsoft YaHei';
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 26px;
        transform: scale(0.9);
        color: #ffffff;
      }
      li:nth-child(1) {
        width: 60%;
        transform: translateX(22px);
      }
      li:nth-child(2) {
        width: 26%;
      }
      li:nth-child(3) {
        width: 14%;
      }
    }
    .body_container {
      width: 100%;
      height: 163px;
      overflow-x: hidden;
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 4px;
      }
      &::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        background: #4fe7cb;
      }
      .table_content {
        width: 100%;
        background: linear-gradient(
          90deg,
          rgba(2, 21, 25, 0.7) 0%,
          rgba(3, 40, 41, 0.7) 100%
        );
        display: flex;
        li {
          /* 内容 */
          height: 26px;
          font-family: 'Microsoft YaHei';
          font-style: normal;
          font-weight: 400;
          font-size: 12px;
          line-height: 26px;
          transform: scale(0.9);
          display: flex;
          .yuan {
            width: 6px;
            height: 6px;
            border-radius: 100%;
            margin: 8px;
            margin-right: 4px;
            margin-top: 11px;
          }
          .content {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        li:nth-child(1) {
          width: 60%;
          color: #ffffff;
        }
        li:nth-child(2) {
          width: 26%;
          color: #cefcff;
        }
        li:nth-child(3) {
          width: 14%;
          color: #cefcff;
          padding-left: 5px;
        }
      }
    }
  }
}
</style>
