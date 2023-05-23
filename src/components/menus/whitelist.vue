<template>
  <div id="whitelist">
    <div class="case-Bg">
      <div class="whiteimg"></div>
      <span>无人机白名单</span>
    </div>
    <div class="whitecontent">
      <div class="tablehead">
        <ul>
          <li>频点</li>
          <li>型号</li>
          <li>ID</li>
          <li>类型</li>
          <li>操作</li>
        </ul>
      </div>
      <table class="tablebody">
        <tr v-for="(item, index) in parameterList" :key="index">
          <th>{{ item.frequency }}</th>
          <th>{{ item.modeType }}</th>
          <th>{{ item.eId }}</th>
          <th>{{ item.frequency }}</th>
        </tr>
      </table>
      <div class="pagination-box">
        <div class="pagination">
          <div @click="fitstBtn()">
            <img src="../../assets/images/Common/First.png" alt="" />
          </div>
          <div @click="previousBtn()">
            <img src="../../assets/images/Common/Previous.png" alt="" />
          </div>
          <p>
            <span>第</span>
            <input
              @input="value = value.replace(/[^\d.]/g)"
              v-model="params.pageIndex"
              type="number"
              @keydown.enter="handleKeyDown"
            />
            <span>页</span>
          </p>
          <div @click="nextBtn()">
            <img src="../../assets/images/Common/Next.png" alt="" />
          </div>
          <div @click="lastBtn()">
            <img src="../../assets/images/Common/Last.png" alt="" />
          </div>
          <p>共 {{ this.total }} 页</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { UAVWhitelist } from '@/api/case/caseStore'

export default {
  props: ['whitelistShow'],
  data() {
    return {
      params: {
        pageIndex: 1,
        pageSize: 5,
      },
      total: 0,
      parameterList: [],
      currentIndex: -1,
    }
  },
  watch: {
    whitelistShow(newVal, oldVal) {
      if (newVal) {
        this.params.pageIndex = 1
        this.getList()
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    line(index) {
      this.currentIndex = index
    },
    getList() {
      UAVWhitelist(this.params).then((response) => {
        console.log(response.data, 'data2')
        this.total = response.data.total_page
        this.parameterList = response.data.data
        this.currentIndex = -1
      })
    },
    fitstBtn() {
      this.params.pageIndex = 1
      this.getList()
    },
    lastBtn() {
      this.params.pageIndex = this.total
      this.getList()
    },
    previousBtn() {
      if (this.params.pageIndex > 1 && this.params.pageIndex <= this.total) {
        this.params.pageIndex = this.params.pageIndex - 1
        if (this.params.pageIndex <= 1) {
          this.params.pageIndex = 1
        }
        this.getList()
      }
    },
    nextBtn() {
      if (this.params.pageIndex >= 1 && this.params.pageIndex < this.total) {
        this.params.pageIndex = this.params.pageIndex * 1 + 1
        if (this.params.pageIndex >= this.total) {
          this.params.pageIndex = this.total
        }
        this.getList()
      }
    },
    handleKeyDown() {
      if (this.params.pageIndex >= this.total) {
        this.params.pageIndex = this.total
      } else if (this.params.pageIndex <= 1) {
        this.params.pageIndex = 1
      }
      this.getList()
    },
  },
}
</script>
<style scoped lang="scss">
#whitelist {
  width: 440px;
  height: 285px;
  position: fixed;
  top: 265px;
  right: 530px;
  margin: auto;
  background-image: url(../../assets/images/Component/Horizon/Background.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  .case-Bg {
    width: 95%;
    margin: 0 auto;
    margin-top: 17px;
    height: 22px;
    // border: 1px solid red;
    background-image: url(../../assets/images/Component/Horizon/Top.png);
    background-size: cover;
    position: relative;
    .whiteimg {
      width: 21px;
      height: 21px;
      position: relative;
      top: -1px;
      background-image: url(../../assets/images/Titlebar/WhiteList/WhiteUAV.png);
      background-size: 104% 104%;
    }
    span {
      position: absolute;
      top: 4px;
      left: 27px;
      font-size: 12px;
      color: #b0e5eb;
    }
  }
  .whitecontent {
    width: 95%;
    margin: 0 auto;
    margin-top: 10px;
    .tablehead {
      width: 100%;
      height: 30px;
      ul {
        display: flex;
        height: 100%;
        li {
          text-align: center;
          border-right: 1px solid #fff;
          line-height: 30px;
          font-size: 12px;
          color: #97e6e9;
        }
        li:nth-child(1) {
          width: 13%;
        }
        li:nth-child(2) {
          width: 23%;
        }
        li:nth-child(3) {
          width: 30%;
        }
        li:nth-child(4) {
          width: 12%;
        }
        li:nth-child(5) {
          width: 12%;
        }
      }
    }
    .tablebody {
      margin-top: 20px;
      width: 100%;
      border-collapse: collapse;
      tr {
        display: flex;
        height: 100%;
        th {
          text-align: center;
          border: 1px solid #fff;
          line-height: 30px;
          font-size: 12px;
          color: #97e6e9;
        }
        th:nth-child(1) {
          width: 13%;
        }
        th:nth-child(2) {
          width: 23%;
        }
        th:nth-child(3) {
          width: 30%;
        }
        th:nth-child(4) {
          width: 12%;
        }
        th:nth-child(5) {
          width: 12%;
        }
      }
    }
  }
  .pagination-box {
    width: 100%;
    height: 30px;
    position: absolute;
    bottom: 12px;
    .pagination {
      display: flex;
      justify-content: center;
      position: relative;
      div {
        width: 25px;
        height: 25px;
        position: relative;
        bottom: -5px;
        // border: 1px solid red;
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
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
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
</style>
