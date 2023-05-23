import axios from 'axios'
import { Notification, MessageBox, Message, Loading } from 'element-ui'
import store from '@/store'
import { getToken, removeToken } from '@/utils/auth'

import { tansParams, hint } from '@/utils/index'

const baseURL = window.config.baseUrl

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL,
  // 超时
  timeout: 10000,
})

// request拦截器
service.interceptors.request.use(
  (config) => {
    config.baseURL = window.config[config.request_base] || baseURL

    // 是否需要设置 token
    const { isToken } = config.headers || {}

    if (getToken() && !isToken) {
      config.headers.Authorization = `Bearer ${getToken()}` // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    // console.log(config, 'request')
    // get请求映射params参数
    if (config.params) {
      let url = `${config.url}?${tansParams(config.params)}`
      url = url.slice(0, -1)
      config.params = {}
      config.url = url
    }

    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    // 未设置状态码则默认成功状态  获取错误信息
    const { code, msg } = res.data

    // console.log(res, res.headers, res.headers['Content-Disposition'], 'request')

    // 二进制数据则直接返回
    if (
      res.request.responseType === 'blob' ||
      res.request.responseType === 'arraybuffer'
    ) {
      return res.data
    }

    if (res.status === 200 || res.data.code === 0) {
      return Promise.resolve(res.data)
    }
    if (res.data.code === -2) {
      hint(res.data.data, store.state.setting.doStatusShow)
    } else {
      // Message({
      //   message: msg,
      //   type: 'error',
      // })
      return Promise.reject(res)
    }
  },
  (error) => {
    const { config, response } = error
    let { message } = error
    // console.log(config, response, message, 'error')
    if (response) {
      if (
        response.status === 401 ||
        response.status === 472 ||
        response.status === 471
      ) {
        if (config.url !== '/Token/Logout' || config.url !== '/Token/Access') {
          // let msg = response.status === 401?'未授权，请联系管理员':'登录状态已过期，您可以继续留在该页面，或者重新登录'
          MessageBox.confirm(
            '登录状态已过期，您可以继续留在该页面，或者重新登录',
            '系统提示',
            {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'warning',
            }
          )
            .then(() => {
              removeToken()
              store.dispatch('LogOut').then(() => {})
            })
            .catch(() => {})
        }
      }
    }

    if (message === 'Network Error') {
      message = '后端接口连接异常'
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时'
    }
    // Message({
    //   message,
    //   type: 'error',
    //   duration: 5 * 1000,
    // })
    return Promise.reject(error)
  }
)

export default service
