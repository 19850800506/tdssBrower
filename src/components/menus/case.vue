<template>
  <div id="case">
    <div class="case-store">
      <div class="case-Bg dialog_header">
        <img src="../../assets/images/Titlebar/Menu/CaseDefult.png" alt="" />
        <span>案例库</span>
      </div>
      <img
        src="../../assets/images/Component/Horizon/Close.png"
        class="linkimg"
        @click="caseclose"
      />
      <div class="case-content">
        <div
          @click="line(index)"
          :class="{ active: currentIndex == index }"
          class="content"
          v-for="(item, index) in caseList"
          :key="index"
        >
          <div class="content-name">
            <span>名称:</span>
            <span class="span2">{{ item.Name }}</span>
          </div>
          <div class="content-box">
            <div class="type">
              <span>类型:</span>
              <span>{{ item.Type }}</span>
            </div>
            <div class="type">
              <span>时间:</span>
              <span>{{ item.Time }}</span>
            </div>
            <div class="type">
              <span>地点:</span>
              <span>{{ item.Location }}</span>
            </div>
          </div>
          <div class="case-describe">
            <span>案例描述:</span>
            <p>{{ item.Describe }}</p>
          </div>
        </div>
      </div>
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
import { listCase } from '@/api/case/caseStore'

export default {
  props: ['caseShow'],
  data() {
    return {
      params: {
        pageIndex: 1,
        pageSize: 3,
      },
      caseList: [],
      total: 0,
      currentIndex: -1,
    }
  },
  created() {},
  mounted() {},
  watch: {
    caseShow(newVal, oldVal) {
      if (newVal) {
        this.getList()
      }
    },
  },
  methods: {
    line(index) {
      this.currentIndex = index
    },
    getList() {
      listCase(this.params).then((response) => {
        this.total = response.data.total_page
        this.caseList = response.data.data
        this.currentIndex = -1
      })
    },
    caseclose() {
      this.$emit('caseclose')
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
#case {
  z-index: 101;
  .case-store {
    width: 620px;
    height: 500px;
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
        top: 3px;
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
      // overflow-x: hidden;
      .content:hover {
        background-image: url(../../assets/images/Titlebar/Setting/Input.png);
        background-size: 580px 100%;
        background-position: 0 0;
      }
      .active {
        background-image: url(../../assets/images/Titlebar/Setting/Input.png) !important;
        background-size: 580px 100%;
        background-position: 0 0;
      }
      .content {
        background-image: url(../../assets/images/Titlebar/Plan/ListBoxItemBackground.png);
        background-size: 578px 100%;
        background-position: 0 0;
        background-repeat: no-repeat;
        margin-bottom: 4px;
        .content-name {
          width: 100%;
          height: 30px;
          line-height: 30px;
          margin-left: 6px;
          .span2 {
            padding-left: 10px;
            font-size: 14px;
          }
        }
        .content-box {
          width: 575px;
          height: 58px;
          color: #b0e5eb;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          .type {
            width: 286.5px;
            height: 26px;
            background-image: url(../../assets/images/Titlebar/Plan/ItemBackground.png);
            background-size: 286px 26px;
            position: relative;
            span:nth-child(1) {
              display: inline-block;
              margin-left: 16px;
              margin-top: 5px;
            }
            span:nth-child(2) {
              display: inline-block;
              position: absolute;
              top: 5px;
              right: 15px;
            }
          }
        }
        .case-describe {
          width: 100%;
          color: #b0e5eb;
          height: 40px;
          span {
            display: inline-block;
            margin-top: 8px;
            margin-left: 5px;
          }
          p {
            width: 85%;
            height: 35px;
            margin-top: -20px;
            margin-left: 90px;
            font-size: 14px;
            overflow-x: hidden;
          }
          p::-webkit-scrollbar {
            width: 0 !important;
          }
          p {
            -ms-overflow-style: none;
          }
          p {
            overflow: -moz-scrollbars-none;
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
    // .case-content::-webkit-scrollbar {
    //   width: 0 !important;
    // }
    // .case-content {
    //   -ms-overflow-style: none;
    // }
    // .case-content {
    //   overflow: -moz-scrollbars-none;
    // }
  }
}
</style>
