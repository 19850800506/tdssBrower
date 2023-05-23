import Cookies from 'js-cookie'
import { Message } from 'element-ui'
import { login, logout, getAccessToken } from '@/api/login'
import { setToken, removeToken } from '@/utils/auth'
import { cryptoEncryption } from '@/utils/cryptojs'

const user = {
  state: {
    userId: '',
    isLogin: false,
    isFull: false, // 全屏状态
    disabledState: false, // 操作盘禁用状态
  },
  mutations: {
    SET_USERID: (state, userId) => {
      state.userId = userId
    },
    SETISLOGIN: (state, isLogin) => {
      state.isLogin = isLogin
    },
    SET_ISFULL: (state, isFull) => {
      state.isFull = isFull
    },
    SET_DISABLEDSTATE: (state, disabledState) => {
      state.disabledState = disabledState
    },
  },
  actions: {
    // 登录
    Login({ dispatch, commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = cryptoEncryption(userInfo.password.trim())
      // const password = userInfo.password.trim()
      const { type } = userInfo
      const { vertify_code } = userInfo
      return new Promise((resolve, reject) => {
        login(username, password, type, vertify_code)
          .then((res) => {
            // 记录userid
            commit('SET_USERID', res.data.userid)
            // 存储登录的token -> 获取授权Access / 退出登录 使用
            Cookies.set('logintoken', res.data.token)
            if (
              res.data.loingLock ||
              res.data.loginLongTerm ||
              res.data.loginFaild
            ) {
              reject(res)
            } else {
              if (res.data.loginTip) {
                Message({
                  message: res.data.loginTip,
                  type: 'warning',
                })
              }
              dispatch('GetAccessToken')
                .then(() => {
                  resolve()
                })
                .catch((error) => {
                  reject(error)
                })
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 获取token
    GetAccessToken({ state, commit }) {
      // 定时刷新token 5分钟
      function refreshToken(time = 5000) {
        // 定时器调用
        setTimeout(() => {
          getAccessToken().then((res) => {
            if (res.code === 0) {
              setToken(res.data.token)

              // 后台返回 timestamp 时间戳 有问题，暂定1分钟
              const currentTime = new Date().getTime()
              let { timestamp } = res.data
              if (timestamp < currentTime) {
                timestamp *= 1000
              }

              const diff = timestamp - currentTime - 60000 // 过期前60秒更新
              refreshToken(diff)

              // if (router.currentRoute.path !== '/login') {
              //   refreshToken(diff)
              // }
            }
          })
        }, time)
      }
      const promise = new Promise((resolve, reject) => {
        getAccessToken().then((res) => {
          if (res.code === 0) {
            state.isLogin = true // 是否登录

            setToken(res.data.token)
            // 后台返回 timestamp 时间戳 有问题，暂定1分钟
            const currentTime = new Date().getTime()
            let { timestamp } = res.data
            if (timestamp < currentTime) {
              timestamp *= 1000
            }
            const diff = timestamp - currentTime - 60000 // 过期前60秒更新
            refreshToken(diff)
          }

          resolve()
        })
      })
      return promise
    },

    // 退出系统
    LogOut({ commit, state }) {
      removeToken()
      Cookies.remove('logintoken')
      state.isLogin = true // 是否登录
      return new Promise((resolve, reject) => {
        logout()
          .then((res) => {
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
  },
}

export default user
