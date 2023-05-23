import user from './user'

const websocket = {
  state: {
    serverWs: null,
    serverdata: null,
    uavListArr: [], // 发现预警无人机数据
    uavListAll: [], // 所有预警无人机数据
    notificationList: [], // 通知消息列表
    heatBeatList: [], // 设备心跳工作状态
    wsMsgStatus: {
      // 接口查询推送信息
      heartbeat: false, // 心跳
      workmode: false, // 自动打击、间隔打击状态
      findTarget: false, // 无人机报警
      locus: false, // 无人机路径
      push_orient: false, // 转台角度
      jamminResult: false, // 打击结果
      push_img: false, // 周扫图片
      carLocation: false, // 车数据
    },
  },

  mutations: {
    SET_SERVERWS: (state, data) => {
      state.serverWs = data
    },
    SET_SERVERDATA: (state, serverdata) => {
      const loginState = user.state.isLogin
      state.serverdata = loginState
        ? serverdata
        : {
            data: {},
          }
    },
    SET_UAVLISTARR: (state, data) => { 
      state.uavListArr = data
    },
    SET_UVALISTALL: (state, data) => {
      state.uavListAll = data
    },
    SET_NOTIFICATION: (state, data) => {
      state.notificationList = data
    },
    SET_HEATBEATLIST: (state, data) => {
      state.heatBeatList = data
    },
  },
}

export default websocket
