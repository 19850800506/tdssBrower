import Vue from 'vue'
import App from './App.vue'
import './permission.js'
// 适配flex
import '@/common/flexible.js'
// 分页组件

// 引入echart
import * as echarts from 'echarts'

import { CesiumSdk } from 'cesium-sdk'
import ElementUI from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'

// 引入全局css
import './assets/scss/style.scss'

import store from './store'
import router from './router'

import dialogDrag from './utils/drag'
import plugins from './plugins' // plugins
// 全局组件挂载
Vue.use(ElementUI)
Vue.use(plugins)
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false
Vue.prototype.$bus = new Vue()
window.CesiumSdk = new CesiumSdk()

// window.mars3d = mars3d
window.cesium = window.mars3d.Cesium

Vue.directive('dialogDrag', dialogDrag)
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
