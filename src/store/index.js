import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import sector from './modules/sector'
import websocket from './modules/websocket'
import setting from './modules/setting'
import monitor from './modules/monitor'

import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    user,
    websocket,
    sector,
    setting,
    monitor,
  },
  getters,
})
