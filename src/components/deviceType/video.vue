<template>
  <div id="videoBox">
    <!-- v-if="type == 'largewindow'" -->
    <video
      height="100%"
      width="100%"
      ref="videoElement"
      muted
      autoplay
      loop
    ></video>
    <!-- <video
      v-else-if="type == 'smallwindow'"
      height="100%"
      width="100%"
      ref="videoElement"
      id="smallVideo"
      muted
      autoplay
      loop
    ></video> -->
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getStreamID } from '../../api/operation/operation'

export default {
  props: ['deviceId', 'type'],
  data() {
    return {
      streamId: '',
      flvPlayer: null,
      timer: null,
    }
  },
  computed: {
    ...mapGetters(['currentPositionId', 'serverdata']),
  },
  mounted() {},
  watch: {
    // 监听websocket ,接收streamId
    serverdata(newVal) {
      if (newVal.data.command === 'stream_id') {
        const Obj = newVal.data.data.find(
          (el) => el.device_id === this.deviceId.id
        )
        this.streamId = Obj.data
      }
    },
    // 监听streamId，若发生改变重新加载，否则不加载
    streamId(val) {
      if (val) {
        this.play()
      } else {
        // streamId为空 关闭销毁视频
        if (this.flvPlayer) {
          this.flvPlayer.pause()
          this.flvPlayer.unload()
          this.flvPlayer.detachMediaElement()
          this.flvPlayer.destroy()
          this.flvPlayer = null
        }
        const { videoElement } = this.$refs
        clearInterval(videoElement, this.timer)
      }
    },
  },
  methods: {
    play() {
      if (flvjs.isSupported()) {
        // const returnParam = {}
        // function parseUrl() {
        //   const searchHref = window
        //     .decodeURI(window.location.search)
        //     .replace('?', '')
        //   const params = searchHref.split('&')

        //   params.forEach(function (param) {
        //     const paramSplit = param.split('=')
        //     returnParam[paramSplit[0]] = paramSplit[1]
        //   })
        //   return returnParam
        // }
        // parseUrl()
        const port = 1935
        const app = 'live'
        const stream = this.streamId
        // const stream = 'quwer0b33f1b0-dc69-4097-aac7-c127be8956e9'
        const ser = 'Flvlive'
        const { videoElement } = this.$refs

        const url = `${window.config.flvLiveUrl}/${ser}?port=${port}&app=${app}&stream=${stream}`
        const playUrl = this.type === 'largewindow' ? url : `${url}min`
        this.flvPlayer = flvjs.createPlayer(
          {
            type: 'flv',
            hasAudio: false,
            url: playUrl,
          },
          {
            enableWorker: false, // 不启用分离线程
            enableStashBuffer: false, // 关闭IO隐藏缓冲区
            reuseRedirectedURL: true, // 重用301/302重定向url，用于随后的请求，如查找、重新连接等。
            autoCleanupSourceBuffer: true, // 自动清除缓存
          }
        )
        // if (this.type == 'largewindow') {
        this.flvPlayer.attachMediaElement(videoElement)
        // } else {
        //   // this.flvPlayer.attachMediaElement(smallVideo)
        // }
        this.flvPlayer.load()
        this.flvPlayer.play()

        // 断流重连监听
        this.playError()

        this.videoTimer()
      }
    },
    // 断流重连
    playError() {
      this.flvPlayer.on('ERROR', (errorType, errorDetail, errorInfo) => {
        // 视频出错后销毁重新创建
        if (this.flvPlayer) {
          this.flvPlayer.pause()
          this.flvPlayer.unload()
          this.flvPlayer.detachMediaElement()
          this.flvPlayer.destroy()
          this.flvPlayer = null
          this.play()
        }
      })
    },
    // 定时刷新视频 60s
    videoTimer(time = 60000) {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        if (this.flvPlayer) {
          this.flvPlayer.pause()
          this.flvPlayer.unload()
          this.flvPlayer.detachMediaElement()
          this.flvPlayer.destroy()
          this.flvPlayer = null
          this.play()
        }
      }, time)
    },
  },
}
</script>
<style scoped lang="scss">
#videoBox {
  width: 100%;
  height: 100%;
}
</style>
