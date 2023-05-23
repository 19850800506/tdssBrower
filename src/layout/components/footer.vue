<template>
  <div>
    <server />
    <div class="operation">
      <!-- 指挥车 -->
      <carState :carObj="carObj"></carState>
      <!-- GPS诱导 -->
      <gpsInduce :guideObj="guideObj"></gpsInduce>
      <!-- 全向干扰 -->
      <OmniDevice :omniObj="omniObj"></OmniDevice>
      <!-- 定向干扰 -->
      <OmniInterference :detectObj="detectObj"></OmniInterference>
      <!-- 协议破解 -->
      <protocolCrack :crackObj="crackObj"></protocolCrack>
      <!-- 光电 -->
      <Optoelectronic :electronicObj="electronicObj"></Optoelectronic>
      <findStrike :findstrikeObj="findstrikeObj"></findStrike>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import server from '@/components/server.vue'
import gpsInduce from '../../components/deviceControl/gpsInduce.vue'
import protocolCrack from '../../components/deviceControl/protocolCrack.vue'
import OmniInterference from '../../components/deviceControl/omniInterference.vue'
import Optoelectronic from '../../components/deviceControl/optoelectronic.vue'
import OmniDevice from '../../components/deviceControl/omniDevice.vue'
import findStrike from '../../components/deviceControl/findStrike.vue'
import carState from '../../components/deviceControl/carState.vue'

export default {
  components: {
    server,
    gpsInduce,
    protocolCrack,
    OmniInterference,
    Optoelectronic,
    OmniDevice,
    findStrike,
    carState,
  },
  computed: {
    ...mapGetters(['deviceType']),
  },
  watch: {
    deviceType(val) {
      console.log(val, 'deviceType')
      this.omniObj = val.find((el) => el.type === 'Omni')
      this.detectObj = val.find((el) => el.type === 'Detect')
      // this.detectObj.data = this.detectObj.data.filter((ele) => ele.code === 0)
      // console.log(this.detectObj, 'this.detectObj')

      // GPS诱导
      this.guideObj = val.find((el) => el.type === 'Guide')
      // 协议破解
      this.crackObj = val.find((el) => el.type === 'Crack')
      // 光电
      this.electronicObj = val.find((el) => el.type === 'Photoelectricity')
      // 查打一体
      this.findstrikeObj = val.find((el) => el.type === 'DectetJammin')
      // 指挥车
      this.carObj = val.find((el) => el.type === 'Car')
      console.log(this.carObj, 'carObj')
    },
  },
  data() {
    return {
      omniObj: null,
      detectObj: null,
      guideObj: null,
      crackObj: null,
      electronicObj: null,
      findstrikeObj: null,
      carObj: null,
    }
  },
  mounted() {},
  methods: {},
}
</script>
<style scoped lang="scss">
.operation {
  position: absolute;
  pointer-events: auto;
  right: 20px;
  bottom: 220px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  max-height: 720px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
  }
  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    background: #4fe7cb;
  }
}
</style>
