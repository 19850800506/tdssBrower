const setting = {
  state: {
    autoset: false, // 自动打击
    interstrike: false, // 间断打击
    electronicfence: true, // 电子围栏
    showtrack: true, // 无人机轨迹
    radarsim: true, // 雷达仿真显隐
    equipmentmode: true, // 设备三维模型 显隐
    whitePopup: false, // 白名单弹窗显隐
    whiteListData: [], // 白名单列表
    doStatusShow: false, // 自动打击、间断打击按钮状态
    dateViewShow: true, // dateview展示
    expelAnimate: false, // 驱离动画
    forcedAnimate: false, // 迫降动画
  },

  mutations: {
    SET_AUTOSET: (state, data) => {
      state.autoset = data
    },
    SET_INTERSTRIKE: (state, data) => {
      state.interstrike = data
    },
    SET_ELECTRONICFENCE: (state, data) => {
      state.electronicfence = data
    },
    SET_SHOWTRACK: (state, data) => {
      state.showtrack = data
    },
    SET_RADARSIM: (state, data) => {
      state.radarsim = data
    },
    SET_EQUIPMENTMODE: (state, data) => {
      state.equipmentmode = data
    },
    SET_WHITEPOPUP: (state, whitePopup) => {
      state.whitePopup = whitePopup
    },
    SET_WHITELISTDATA: (state, whiteListData) => {
      state.whiteListData = whiteListData
    },
    SET_DOSTATUSSHOW: (state, data) => {
      state.doStatusShow = data
    },
    SET_DATEVIEWSHOW: (state, data) => {
      state.dateViewShow = data
    },
    SET_EXPELANIMATE: (state, data) => {
      state.expelAnimate = data
    },
    SET_FORCEDANIMATE: (state, data) => {
      state.forcedAnimate = data
    },
  },
}

export default setting
