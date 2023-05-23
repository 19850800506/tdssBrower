/**
 * 登录相关接口
 */
import Cookies from 'js-cookie'
import request from '@/utils/request'
// 登录方法
export function login(username, password, type) {
  const data = {
    username,
    password,
    type, // 登录的系统
  }

  return request({
    url: '/Token/Login',
    method: 'post',
    headers: {
      isToken: false,
    },
    data,
  })
}
// 获取token
export function getAccessToken() {
  return request({
    url: '/Token/Access',
    headers: {
      isToken: false,
      Authorization: `Bearer ${Cookies.get('logintoken')}`,
    },
    method: 'post',
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/Token/Logout',
    method: 'post',
    headers: {
      isToken: false,
      Authorization: `Bearer ${Cookies.get('logintoken')}`,
    },
  })
}
// 获取验证码
export function getEmail(query) {
  return request({
    url: '/User/email',
    method: 'get',
    params: query,
    request_base: 'authority',
  })
}
