<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 设置超时时间：30分钟
      timeOut: 30 * 60 * 1000,
      lastTimeStoreId: 'lastTime_jc',
    }
  },
  mounted() {
    // this.listenPage()
  },
  methods: {
    // 登录后 监听页面是否有操作
    listenPage() {
      const that = this
      // 每30秒 调用检查时间的方法
      this.$nextTick(function () {
        setInterval(this.checkTimeout, 30000)
      })
      // 页面监听 按下鼠标更新操作时间
      window.onload = function () {
        window.document.onmousedown = function () {
          that.setLastTime()
        }
        window.document.onkeydown = function () {
          that.setLastTime()
        }
        window.document.onmousemove = function () {
          that.setLastTime()
        }
      }
    },
    // 存储当前时间
    setLastTime() {
      localStorage.setItem(this.lastTimeStoreId, new Date().getTime())
    },
    // 获取时间
    getLastTime() {
      return localStorage.getItem(this.lastTimeStoreId)
    },
    checkTimeout() {
      // 更新当前时间
      const currentTime = new Date().getTime()
      const lastTime = this.getLastTime()
      if (currentTime - lastTime > this.timeOut) {
        // 刷新当前页面
        this.$router.go(0)
        this.setLastTime()
      }
    },
  },
}
</script>
<style lang="scss">
body {
  margin: 0;
  min-width: 1660px;
  overflow: auto;
  // overflow-y: hidden;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
