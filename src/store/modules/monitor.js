/**
 * 无线电监测
 */
const monitor = {
  state: {
    unusual: '', // 异常月报
    hourly: '', // 异常时报
    freq: '', // 异常频点
  },

  mutations: {
    SET_UNUSUAL: (state, unusual) => {
      state.unusual = unusual
    },
    SET_HOURLY: (state, hourly) => {
      state.hourly = hourly
    },
    SET_FREQ: (state, freq) => {
      state.freq = freq
    },
  },
}

export default monitor
