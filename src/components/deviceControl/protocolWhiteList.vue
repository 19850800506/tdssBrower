<template>
  <div id="protocolWhiteList">
    <div class="whiteList">
      <div class="header dialog_header">
        <img
          class="whiteicon"
          src="../../assets/images/control/whiteicon.png"
          alt=""
        />
        <div>白名单</div>
      </div>
      <img
        @click="closeBtn"
        class="closeicon"
        src="../../assets/images/control/close.png"
        alt=""
      />
      <div class="whiteList-table">
        <ul class="table-header">
          <li>标识</li>
          <li>型号</li>
          <li>频点</li>
          <li>操作</li>
        </ul>
        <div class="whiteList-content">
          <ul
            class="table-content"
            v-for="(item, index) in this.whiteListData.data"
            :key="index"
          >
            <li>{{ item.id }}</li>
            <li>{{ item.dronetype }}</li>
            <li>5.8</li>
            <li @click="removeBtn(item)">移除</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { removeWhiteList } from '../../api/operation/protocol.js'

export default {
  props: ['whiteListData'],
  data() {
    return {
      queryParams: {
        deviceId: '',
        droneId: '',
      },
    }
  },
  computed: {},
  watch: {},
  methods: {
    closeBtn() {
      // 关闭白名单弹窗
      this.$store.commit('SET_WHITEPOPUP', false)
    },
    // 删除白名单数据
    removeBtn(item) {
      removeWhiteList({
        deviceId: this.whiteListData.device_id,
        droneId: item.id,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('删除成功')
          const index = this.whiteListData.data.findIndex(
            (el) => el.id === item.id
          )
          this.whiteListData.data.splice(index, 1)
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
#protocolWhiteList {
  pointer-events: auto;
  position: fixed;
  top: 300px;
  left: 400px;
  .whiteList {
    width: 410px;
    height: 347px;
    background-image: url('../../assets/images/control/whiteListBg.png');
    background-size: cover;
    overflow: hidden;
    .header {
      width: 395px;
      height: 37px;
      margin-left: 7px;
      margin-top: 6px;
      display: flex;
      align-items: center;
      .whiteicon {
        width: 12px;
        height: 12px;
        margin-left: 17px;
      }
      div {
        font-size: 14px;
        font-weight: 700;
        color: #18fefe;
        margin-left: 4px;
      }
    }
    .closeicon {
      cursor: pointer;
      width: 18px;
      height: 18px;
      position: absolute;
      top: 18px;
      right: 18px;
    }
    .whiteList-table {
      width: 395px;
      margin-left: 7px;
      border-top: 1px solid;
      border-bottom: 1px solid;
      border-image: linear-gradient(
          to right,
          rgba(24, 254, 254, 0),
          rgba(24, 254, 254, 1),
          rgba(24, 254, 254, 0)
        )
        1;
      .table-header {
        width: 100%;
        display: flex;
        background: rgba(255, 255, 255, 0.1);
        li {
          height: 32px;
          font-size: 12.5px;
          line-height: 32px;
          transform: scale(0.8);
          color: #cefcff;
          font-weight: 700;
        }
        li:nth-child(1) {
          width: 164px;
        }
        li:nth-child(2) {
          width: 100px;
        }
        li:nth-child(3) {
          width: 77px;
        }
        li:nth-child(4) {
          width: 77px;
        }
        li::before {
          content: '';
          width: 1px;
          height: 17px;
          margin-left: -17px;
          margin-right: 6px;
          border-left: 1px solid rgba(255, 255, 255, 0.2);
        }
      }
      .whiteList-content {
        width: 100%;
        height: 250px;
        overflow-x: hidden;
        overflow-y: auto;
        &::-webkit-scrollbar {
          width: 4px;
        }
        &::-webkit-scrollbar-thumb {
          /*滚动条里面小方块*/
          background: #4fe7cb;
        }
        .table-content {
          width: 100%;
          display: flex;
          li {
            height: 32px;
            font-size: 12.5px;
            line-height: 32px;
            transform: scale(0.8);
            color: #cefcff;
            margin-left: -7px;
          }
          li:nth-child(1) {
            width: 164px;
          }
          li:nth-child(2) {
            width: 100px;
          }
          li:nth-child(3) {
            width: 77px;
          }
          li:nth-child(4) {
            width: 77px;
            cursor: pointer;
            color: #e74f4f;
          }
        }
      }
    }
  }
}
</style>
