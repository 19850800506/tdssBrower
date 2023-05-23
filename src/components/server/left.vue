<template>
  <div class="left">
    <img src="../../assets/images/EqStatistics/shansuo.png" class="shanSuo" />
    <div class="statistics">
      <div class="total-sts">
        <div class="total-count">{{ totalCount }}</div>
        <div class="total-name">总设备</div>
      </div>
      <img
        src="../../assets/images/EqStatistics/xiexian.png"
        class="xie-xian"
      />
      <!-- 根据不同的设备数量进行线条的布局 -->
      <!-- 设备数量为1则放置一条线段，2~4放置两条，5~6放置三条，大于6则放置4条 -->
      <div v-show="deviceInfoAll.length === 1">
        <img src="../../assets/images/EqStatistics/xian2.png" class="xian6" />
      </div>
      <div v-show="deviceInfoAll.length >= 2 && deviceInfoAll.length <= 4">
        <img src="../../assets/images/EqStatistics/xian2.png" class="xian2" />
        <img src="../../assets/images/EqStatistics/xian3.png" class="xian3" />
      </div>
      <div v-show="deviceInfoAll.length >= 5 && deviceInfoAll.length <= 6">
        <img src="../../assets/images/EqStatistics/xian1.png" class="xian5" />
        <img src="../../assets/images/EqStatistics/xian2.png" class="xian6" />
        <img src="../../assets/images/EqStatistics/xian3.png" class="xian7" />
      </div>
      <div v-show="deviceInfoAll.length >= 7">
        <img src="../../assets/images/EqStatistics/xian1.png" class="xian1" />
        <img src="../../assets/images/EqStatistics/xian2.png" class="xian2" />
        <img src="../../assets/images/EqStatistics/xian3.png" class="xian3" />
        <img src="../../assets/images/EqStatistics/xian4.png" class="xian4" />
      </div>
      <!-- 设备类别统计 -->
      <div class="device-type" ref="deviceType">
        <div class="kuang" v-for="(item, index) in deviceInfoAll" :key="index">
          <el-tooltip
            popper-class="message-alert"
            placement="top"
            effect="dark"
            :enterable="false"
          >
            <div slot="content" class="message-box">
              <div
                class="message"
                v-for="(items, i) in item.data"
                :key="i"
                :class="[i == item.data.length - 1 ? 'message_active' : '']"
              >
                <span>{{ items.posName + items.name }}</span>
                <span>{{ getOnlineCode(items) ? '在线' : '离线' }}</span>
              </div>
            </div>
            <div class="obscuration"></div>
          </el-tooltip>
          <div class="device-name">{{ item.name }}</div>
          <div class="device-count">
            <span
              v-show="item.type !== 'radio'"
              class="online-count"
              :class="[getOnlineCount(item) !== item.count ? 'offline' : '']"
              >{{ getOnlineCount(item) }}</span
            >
            <span
              v-show="item.type === 'radio'"
              class="online-count"
              :class="[!item.onlineCount ? 'offline' : '']"
              >{{ item.onlineCount }}</span
            >
            <span>/{{ item.count }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 具体设备信息 -->
    <!-- <lunbo
      v-for="(item, index) in deviceTypeAll"
      :key="index"
      :online="item"
      :deIndex="index"
      v-show="
        item.type === 'AOA' ||
        item.type === 'TDOA' ||
        item.type === 'Crack' ||
        item.type === 'Detect' ||
        item.type === 'Omni' ||
        item.type === 'Circular' ||
        item.type === 'Radar'
      "
      @deviceChange="deviceChange"
    >
      <component
        v-for="(item1, index1) in list"
        :key="index1"
        :is="item1.name"
        :device="item.data[0]"
        v-if="item.type === item1.type"
      ></component>
    </lunbo> -->
    <template v-for="(item, index) in deviceTypeAll">
      <lunbo
        :key="index"
        :online="item"
        :currentIndex.sync="item.currentIndex"
        v-if="getDeviceType(item, 'type')"
        @deviceChange="deviceChange"
      >
        <component
          :is="getDeviceType(item, 'name')"
          :device="item.data[item.currentIndex]"
          @click="flyTo(item)"
        ></component>
      </lunbo>
    </template>
    <!-- <wireless /> -->
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
// import wireless from '@/components/deviceType/wireless.vue'
import aoa from '@/components/deviceType/aoa.vue'
import scan from './scan.vue'
import quanXiang from '@/components/deviceType/quanXiang.vue'
import dingXiang from '@/components/deviceType/dingXiang.vue'
import xieYi from '@/components/deviceType/xieYi.vue'
import lunbo from '@/components/lunbo'
import radar from './radar.vue'
import induce from './induce.vue'
import guangdian from '../deviceType/guangdian.vue'
import { getRadioStatus } from '@/api/device/device'

export default {
  data() {
    return {
      currentIndex: 0,
      list: [
        {
          name: 'aoa',
          type: 'AOA',
        },
        {
          name: 'aoa',
          type: 'TDOA',
        },
        {
          name: 'dingXiang',
          type: 'Omni', // 面阵 全向暂时用定向的组件
        },
        // {
        //   name: 'quanXiang',
        //   type: 'Omni',
        // },
        {
          name: 'dingXiang',
          type: 'Detect',
        },
        {
          name: 'xieYi',
          type: 'Crack',
        },
        {
          name: 'scan',
          type: 'Circular',
        },
        {
          name: 'induce',
          type: 'Guide',
        },
        {
          name: 'guangdian',
          type: 'Photoelectricity',
        },
        // {
        //   name: 'radar',
        //   type: 'Radar',
        // },
      ],
      deviceInfoAll: [], // 左侧设备分类数据
      deviceTypeAll: [], // 设备控件展示数据
      totalCount: 0,
      deContentArr: [],
      sortLarge: [
        'Circular',
        'AOA',
        'TDOA',
        'Crack',
        'Guide',
        'Omni',
        'Photoelectricity',
      ],
    }
  },
  components: {
    lunbo,
    scan,
    radar,
    induce,
    aoa,
    quanXiang,
    dingXiang,
    xieYi,
    guangdian,
    // wireless,
  },
  computed: {
    ...mapGetters(['deviceArr', 'heatBeatList']),
  },
  watch: {
    deviceArr(val) {
      if (val) {
        const arr = JSON.parse(JSON.stringify(val))
        this.deviceInfoAll = []

        arr.forEach((el) => {
          el.animated = false
          const type = this.deviceInfoAll.find((ele) => ele.type === el.type)
          if (type) {
            if (
              el.type.toLowerCase() === 'tdoa' &&
              el.children &&
              el.children.length
            ) {
              el.children.forEach((item) => {
                type.count++
                type.data.push({
                  ...el,
                  name: el.type_name + item.address,
                  lng: item.lon,
                  lat: item.lat,
                  alt: item.alt,
                  code: item.code,
                  id: `${el.id}_${item.id}`,
                })
              })
            } else {
              type.count++

              type.data.push(el)
            }
          } else {
            const deviceType = {
              count: 0,
              name: el.type_name,
              type: el.type,
              data: [],
              currentIndex: 0,
            }

            if (
              el.type.toLowerCase() === 'tdoa' &&
              el.children &&
              el.children.length
            ) {
              el.children.forEach((item) => {
                deviceType.count++
                deviceType.data.push({
                  ...el,
                  name: el.type_name + item.address,
                  lng: item.lon,
                  lat: item.lat,
                  alt: item.alt,
                  code: item.code,
                  id: `${el.id}_${item.id}`,
                })
              })
            } else {
              deviceType.count++
              deviceType.data.push(el)
            }

            this.deviceInfoAll.push(deviceType)
          }
        })

        this.$store.commit(
          'SET_DEVICETYPE',
          JSON.parse(JSON.stringify(this.deviceInfoAll))
        )
        if (window.config.radioShow) {
          this.radioOnline() // 查询无线电监测是否在线的方法，不使用注释这里即可
        }
        this.deviceTypeAll = []
        arr.forEach((el) => {
          el.type = el.type === 'AOA' ? 'TDOA' : el.type
          const type = this.deviceTypeAll.find((ele) => ele.type === el.type)
          if (type) {
            if (
              el.type.toLowerCase() === 'tdoa' &&
              el.children &&
              el.children.length
            ) {
              el.children.forEach((item) => {
                type.count++
                type.data.push({
                  ...el,
                  name: el.type_name + item.address,
                  lng: item.lon,
                  lat: item.lat,
                  alt: item.alt,
                  code: item.code,
                  id: `${el.id}_${item.id}`,
                })
              })
            } else {
              type.count++

              type.data.push(el)
            }
          } else {
            const deviceType = {
              // onLine: el.code === 0 ? 1 : 0,
              count: 0,
              name: el.type_name,
              type: el.type,
              data: [],
              currentIndex: 0,
              sortIndex:
                this.sortLarge.findIndex((ele) => ele === el.type) !== -1
                  ? this.sortLarge.findIndex((ele) => ele === el.type)
                  : 1000,
            }

            if (
              el.type.toLowerCase() === 'tdoa' &&
              el.children &&
              el.children.length
            ) {
              el.children.forEach((item) => {
                deviceType.count++
                deviceType.data.push({
                  ...el,
                  name: el.type_name + item.address,
                  lng: item.lon,
                  lat: item.lat,
                  alt: item.alt,
                  code: item.code,
                  id: `${el.id}_${item.id}`,
                })
              })
            } else {
              deviceType.count++
              deviceType.data.push(el)
            }

            this.deviceTypeAll.push(deviceType)
          }
        })
        this.deviceTypeAll = this.deviceTypeAll.sort(this.sortDescFn)
      }
    },
    deviceInfoAll(val) {
      this.totalCount = 0
      val.map((item) => {
        this.totalCount += item.count
      }) // 统计总数量

      // 根据不同的设备数量进行类别布局
      const { deviceType } = this.$refs
      if (val.length === 1) {
        deviceType.style.marginTop = '75px'
        // deviceType.style.width = '265px'
      } else if (val.length >= 2 && val.length <= 4) {
        deviceType.style.marginTop = '55px'
        deviceType.style.height = '40%'
        // deviceType.style.width = '265px'
      } else if (val.length > 4 && val.length <= 6) {
        deviceType.style.marginTop = '38px'
        deviceType.style.height = '60%'
        // deviceType.style.width = '265px'
      } else if (val.length >= 7) {
        deviceType.style.marginTop = '18px'
        deviceType.style.height = '80%'
        // deviceType.style.width = '265px'
      }
    },
  },
  mounted() {},
  methods: {
    // 查询无线电监测是否在线
    radioOnline() {
      const radio = {
        name: '无线电监测',
        count: 1,
        onlineCount: 0,
        data: [],
        type: 'radio',
      }

      this.deviceInfoAll.push(radio)
      setInterval(() => {
        getRadioStatus().then((res) => {
          const item = this.deviceInfoAll.find((el) => el.type === 'radio')
          item.onlineCount = res.code === 1 ? 0 : 1
        })
      }, 1000)
    },
    // 查询设备是否在线
    getOnlineCount(item) {
      const arr = item.data.filter((el) => {
        const heat_device = this.heatBeatList.find(
          (ele) => el.id === ele.device_id
        )
        if (heat_device) {
          item.code = heat_device.code
          item.state = heat_device.state
        }
        return heat_device && heat_device.code === 0
      })
      return arr.length
    },
    // 查询设备是否在线
    getOnlineCode(item) {
      const heat_device = this.heatBeatList.find(
        (ele) => item.id === ele.device_id
      )
      if (heat_device) {
        item.code = heat_device.code
        item.state = heat_device.state

        const layer = window.CesiumSdk._map.getLayerById(`deviceDivLayer_Popup`)
        if (layer) {
          // console.log(item.id,'item.id');
          const graphic = layer.getGraphicById(`deviceDivPoint_${item.id}`)
          // console.log(graphic,'layerlayerlayer');
          if (graphic) {
            graphic.options.attr.state =
              heat_device.code === 0 ? '在线' : '离线'
          }
        }
      }
      return heat_device && heat_device.code === 0
    },

    // 判断设备type
    getDeviceType(item, key) {
      const obj = this.list.find((el) => el.type === item.type)
      if (obj) {
        return obj[key]
      }
      return ''
    },

    // 点击轮播图 切换设备
    deviceChange(val) {
      // if(val){
      console.log(this.deviceTypeAll)
      // }
    },
    // 排序方法
    sortDescFn(obj1, obj2) {
      const val1 = parseFloat(obj1.sortIndex)
      const val2 = parseFloat(obj2.sortIndex)
      if (val1 > val2) {
        // 如果前一项小于后一项  a<b,返回一个大于零的值，b会被排在a之前,就是降序
        return 1
      }
      if (val1 < val2) {
        return -1
      }
      return 0
    },
    // 视角跳转
    flyTo(item) {
      console.log(item, 'item2')
    },
  },
}
</script>
<style scoped lang="scss">
.left {
  width: 28%;
  position: relative;
  margin-top: 10px;
  margin-left: 18px;
  display: flex;
  .shanSuo {
    height: 159px;
  }
  .statistics {
    position: relative;
    display: flex;
    .xie-xian {
      margin-top: 10px;
      height: 146px;
    }
    .total-sts {
      position: absolute;
      left: 54px;
      top: 29px;
      width: 55px;
      height: 18px;
      display: flex;
      justify-content: space-between;
      transform: rotate(-57.64deg);
      .total-count {
        font-family: 'DIN Black';
        font-weight: 900;
        font-size: 12px;
        color: #18fefe;
      }
      .total-name {
        color: #cefcff;
        font-weight: 200;
        font-size: 12px;
        transform: scale(0.9);
      }
    }
    .xian1 {
      position: absolute;
      left: 100px;
      top: 25px;
      height: 12px;
    }
    .xian2 {
      position: absolute;
      left: 77px;
      top: 62px;
      height: 12px;
    }
    .xian3 {
      position: absolute;
      left: 52px;
      top: 99px;
      height: 12px;
    }
    .xian4 {
      position: absolute;
      left: 29px;
      top: 136px;
      height: 11.4px;
    }
    .xian5 {
      position: absolute;
      left: 88.5px;
      top: 43.5px;
      height: 14.6px;
    }
    .xian6 {
      position: absolute;
      left: 64.5px;
      top: 80.5px;
      height: 14.5px;
    }
    .xian7 {
      position: absolute;
      left: 40.5px;
      top: 117.5px;
      height: 13.6px;
    }
    .device-type {
      width: 265px;
      height: 80%;
      margin-left: 30px;
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      .kuang {
        width: 130.5px;
        height: 26px;
        line-height: 26px;
        margin-bottom: 11px;
        margin-right: 6px;
        display: flex;
        justify-content: space-around;
        background-image: url('../../assets/images/EqStatistics/kuang.png');
        background-size: 100% 100%;
        font-weight: 700;
        font-size: 11px;
        color: #ffffff;
        position: relative;
        .obscuration {
          width: 130.5px;
          height: 26px;
          position: absolute;
        }
        .device-name {
          margin-left: 10px;
          width: 50px;
          // max-width: 180px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .device-count {
          width: 20px;
          .online-count {
            color: #18fefe;
          }
          .offline {
            color: #e74f4f;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.message-alert {
  .message-box {
    .message {
      margin-bottom: 10px;
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      span:nth-child(2) {
        margin-left: 10px;
      }
    }
    .message_active {
      margin-bottom: 0px;
    }
  }
}
</style>
