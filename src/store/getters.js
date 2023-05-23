const getters = {
  userId: (state) => state.user.userId,
  isLogin: (state) => state.user.isLogin,
  isFull: (state) => state.user.isFull,
  disabledState: (state) => state.user.disabledState,

  serverWs: (state) => state.websocket.serverWs, // server webscocket对象
  serverdata: (state) => state.websocket.serverdata, // server webscocket 推送数据
  uavListArr: (state) => state.websocket.uavListArr, // 发现无人机预警数据
  uavListAll: (state) => state.websocket.uavListAll, // 所有无人机预警数据
  notificationList: (state) => state.websocket.notificationList, // 通知消息列表
  heatBeatList: (state) => state.websocket.heatBeatList, // 设备心跳工作状态
  wsMsgStatus: (state) => state.websocket.wsMsgStatus, // 推送信息是否堵塞

  sectorArr: (state) => state.sector.sectorArr,
  positionId: (state) => state.sector.positionId,
  positionArr: (state) => state.sector.positionArr,
  deviceArr: (state) => state.sector.deviceArr,
  positionDetail: (state) => state.sector.positionDetail, // 当前阵地详情
  currentPositionId: (state) => state.sector.currentPositionId,
  deviceType: (state) => state.sector.deviceType,

  autoset: (state) => state.setting.autoset, // 自动打击
  interstrike: (state) => state.setting.interstrike, // 间断打击
  electronicfence: (state) => state.setting.electronicfence, // 电子围栏
  showtrack: (state) => state.setting.showtrack, // 无人机轨迹
  radarsim: (state) => state.setting.radarsim, // 雷达仿真显隐
  equipmentmode: (state) => state.setting.equipmentmode, // 雷达仿真显隐

  whitePopup: (state) => state.setting.whitePopup, // 白名单弹窗显隐
  whiteListData: (state) => state.setting.whiteListData, // 白名单列表
  doStatusShow: (state) => state.setting.doStatusShow,
  dateViewShow: (state) => state.setting.dateViewShow,
  expelAnimate: (state) => state.setting.expelAnimate, // 驱离动画
  forcedAnimate: (state) => state.setting.forcedAnimate, // 迫降动画

  unusual: (state) => state.monitor.unusual, // 异常月报base64
  hourly: (state) => state.monitor.hourly, // 异常时报base64
  freq: (state) => state.monitor.freq, // 异常频点base64
}
export default getters
