/**
 * 防区 阵地 设备 无人机
 */
const sector = {
  state: {
    sectorArr: [], // 防区
    positionArr: [], // 阵地集合
    positionId: [], // 阵地id集合
    deviceArr: [], // 当前阵地设备集合
    positionDetail: null, // 当前阵地详情
    currentPositionId: '', // 当前阵地id
    deviceType: [], // 统计设备类型
  },

  mutations: {
    SET_SECTORARR: (state, sectorArr) => {
      state.sectorArr = sectorArr
    },
    SET_POSITIONARR: (state, positionArr) => {
      state.positionArr = positionArr
    },
    SET_POSITIONID: (state, positionId) => {
      state.positionId = positionId
    },
    SET_DEVICEARR: (state, deviceArr) => {
      state.deviceArr = deviceArr
    },
    SET_POSITIONDETAIL: (state, positionDetail) => {
      state.positionDetail = positionDetail
    },
    SET_CHECKPOSITIONID: (state, checkPositionId) => {
      state.currentPositionId = checkPositionId
    },
    SET_DEVICETYPE: (state, deviceType) => {
      state.deviceType = deviceType
    },
  },
}

export default sector
