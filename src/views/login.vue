<template>
  <div id="login">
    <div class="login" v-if="loginDialog">
      <div ref="loginForm" class="login_bg">
        <div class="header_bg"></div>
        <span class="title">登录系统</span>
        <div class="username">
          <span>账号</span>
          <input v-model="loginForm.username" type="text" />
        </div>
        <div class="password">
          <span>密码</span>
          <input v-model="loginForm.password" type="password" />
        </div>
        <div class="codeBox">
          <!-- 验证码 -->
          <div class="verification" ref="verification">
            <input v-model="loginForm.vertify_code" />
            <div class="getCode" @click="getVerfiCode">
              {{ verificationText }}
            </div>
          </div>
          <div class="remember">
            <input v-model="loginForm.rememberMe" type="checkbox" id="btn1" />
            <label for="btn1">记住密码</label>
          </div>
        </div>
        <p class="abnormal" v-show="tipShow">{{ tip }}</p>
        <button ref="login" @click="handleLogin()" class="loginBtn">
          登录
        </button>
      </div>
    </div>
    <div class="showpop" v-if="screenDialog">
      <div class="pop">
        <div class="text">提示</div>
        <div class="screenfull">是否全屏显示</div>
        <button @click="cancel" class="cancel">取消</button>
        <button @click="confirm" class="confirm">确定</button>
      </div>
    </div>
  </div>
</template>
<script>
import screenfull from 'screenfull'
import Cookies from 'js-cookie'
import { mapGetters } from 'vuex'
import { encrypt, decrypt } from '../utils/jsencrypt'
import { getEmail } from '@/api/login'

export default {
  name: 'Login',
  data() {
    return {
      // 登录参数
      loginForm: {
        username: '',
        password: '',
        type: 'test',
        rememberMe: false,
      },
      loginloading: false, // 阻止多次点击按钮
      tip: '账号或密码错误，请重新输入!', // 提示文字
      tipShow: false, // 提示显隐

      loginDialog: false, // 登录弹窗
      screenDialog: true, // 全屏弹窗
      verificationText: '获取验证码',
      loginEamil: '', // 验证邮箱
      islogin: false, // 是否登录
    }
  },
  computed: {
    ...mapGetters(['isFull', 'isLogin']),
  },
  watch: {
    isFull(val) {
      if (val) {
        // this.cancel()
        this.screenDialog = false
      }
    },
    isLogin(val) {
      if (!val) {
        this.loginDialog = true
      } else {
        const user = window.config.disUser.findIndex(
          (el) => el === this.loginForm.username
        )
        if (user !== -1) {
          this.$store.commit('SET_DISABLEDSTATE', true)
        } else {
          this.$store.commit('SET_DISABLEDSTATE', false)
        }
      }
    },
  },
  mounted() {
    if (window.location.search) {
      const loginStr = window.location.search.substring(1)
      let user
      let pwd
      const loginArr = loginStr.split('&')
      loginArr.forEach((el) => {
        const paramsArr = el.split('=')
        if (paramsArr[0] === 'user') {
          user = paramsArr[1]
        }

        if (paramsArr[0] === 'pwd') {
          pwd = paramsArr[1]
        }
      })

      console.log(user, pwd, 'pwd')
      if (user && pwd) {
        this.loginForm.username = user
        this.loginForm.password = pwd
        this.loginForm.rememberMe = true
        this.handleLogin()

        return
      }
    }

    this.getCookie()
  },
  methods: {
    // 获取验证码
    getVerfiCode() {
      if (this.verificationText === '获取验证码') {
        let time = 11
        const myTimer = setInterval(() => {
          time <= 0 ? clearInterval(myTimer) : time--
          this.verificationText = time <= 0 ? '获取验证码' : `${time}s`
        }, 1000)
        getEmail({
          userName: this.loginForm.username,
          password: this.loginForm.password,
          email: this.loginEamil,
        }).then((res) => {
          console.log(res, 'res22')
        })
      }
    },
    // 关闭全屏弹窗
    cancel() {
      this.screenDialog = false
      if (Cookies.get('username') && Cookies.get('password')) {
        this.handleLogin()
      }
      if (!this.islogin) {
        this.loginDialog = true
      }
    },
    // 开启全屏
    confirm() {
      this.cancel()
      if (!screenfull.isEnabled) {
        this.$message({ message: '你的浏览器不支持全屏', type: 'warning' })
        return
      }
      screenfull.toggle()
    },
    // 获取cookie中记录的账号密码
    getCookie() {
      const username = Cookies.get('username') || ''
      const password = Cookies.get('password') || ''
      const rememberMe = Cookies.get('rememberMe')

      this.loginForm.username = username
      this.loginForm.password = password ? decrypt(password) : ''
      this.loginForm.rememberMe = Boolean(rememberMe)
    },
    // 登录
    handleLogin() {
      // 防止多次点击
      if (this.loginloading) {
        return
      }
      if (!this.loginForm.username || !this.loginForm.password) {
        this.tipShow = true
        this.tip = '账号或密码错误，请重新输入!'
      } else {
        this.tipShow = false
        // 保存账号密码至cookie中
        if (this.loginForm.rememberMe) {
          Cookies.set('username', this.loginForm.username, { expires: 30 })
          Cookies.set('password', encrypt(this.loginForm.password), {
            expires: 30,
          })
          Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 })
        } else {
          Cookies.remove('username')
          Cookies.remove('password')
          Cookies.remove('rememberMe')
        }

        this.loginloading = true
        this.$store
          .dispatch('Login', this.loginForm)
          .then(() => {
            this.loginloading = false
            this.loginDialog = false
            this.islogin = true
          })
          .catch((req) => {
            this.tipShow = true
            this.loginloading = false
            if (req.data.loingLock) {
              this.$refs.login.style.opacity = 0.3
              this.$refs.login.style.pointerEvents = 'none'
              this.tip = req.data.loingLock
            } else if (req.data.loginLongTerm) {
              console.log(this.$refs.verification.style, 'verification')
              this.$refs.verification.style.visibility = 'visible'
              this.loginEamil = req.data.loginEamil
              this.tip = req.data.loginLongTerm
            } else if (req.data.data) {
              if (req.data.data.loginFaild) {
                this.tip = req.data.data.loginFaild
              }
            }
          })
      }
    },
  },
}
</script>
<style scoped lang="scss">
#login {
  .login {
    z-index: 999;
    position: absolute;
    width: 100%;
    min-height: 1080px;
    .login_bg {
      width: 625px;
      height: 392px;
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      background-image: url('../assets/images/Login/Background.png');
      background-size: cover;
      .header_bg {
        width: 592px;
        height: 20px;
        position: absolute;
        top: 19px;
        left: 17px;
        background-image: url('../assets/images/Login/TitleBackground.png');
        background-size: cover;
      }
      .title {
        display: inline-block;
        position: absolute;
        top: 100px;
        left: 260px;
        font-size: 25px;
        color: #89b6bb;
      }
      .codeBox {
        display: flex;
        justify-content: space-between;
        width: 480px;
        // margin: 0 auto;
        // margin-top: 20px;
        position: absolute;
        left: 66px;
        bottom: 97px;
        .verification {
          width: 155px;
          height: 27px;
          background-image: url('../assets/images/loginPage/Rectangle.png');
          background-size: 100% 100%;
          background-position: 0 0;
          visibility: hidden;
          position: relative;
          input {
            width: 300px;
            height: 26px;
            border: none;
            outline: none;
            font-size: 14px;
            margin-left: 10px;
            padding-top: 3px;
            background-color: rgba(0, 0, 0, 0);
            color: #fff;
          }
          .getCode {
            color: #fff;
            position: absolute;
            right: 12px;
            top: 5px;
            cursor: pointer;
          }
        }
      }
      .username {
        position: absolute;
        left: 103px;
        top: 150px;
        width: 419px;
        height: 39px;
        background-image: url('../assets/images/Login/TextBackground.png');
        background-size: 419px 39px;
        background-position: 0 0;
        span {
          display: inline-block;
          margin-top: 12px;
          margin-left: 15px;
          font-size: 14px;
          color: black;
        }
        input {
          width: 329px;
          height: 30px;
          margin-left: 35px;
          border: none;
          background-color: #296061;
          color: #97c7cc;
        }
      }
      .password {
        position: absolute;
        left: 103px;
        top: 210px;
        width: 419px;
        height: 39px;
        background-image: url('../assets/images/Login/TextBackground.png');
        background-size: 419px 39px;
        background-position: 0 0;
        span {
          display: inline-block;
          margin-top: 12px;
          margin-left: 15px;
          font-size: 14px;
          color: black;
        }
        input {
          width: 329px;
          height: 30px;
          margin-left: 35px;
          border: none;
          background-color: #296061;
          color: #97c7cc;
        }
      }
      .remember {
        width: 100px;
        height: 30px;
        // position: absolute;
        // right: 100px;
        // bottom: 97px;
        p {
        }
        input[type='checkbox'] {
          width: 14px;
          height: 14px;
          position: relative;
          top: -3px;
          left: 0;
          display: inline-block;
          text-align: center;
          vertical-align: middle;
          line-height: 14px;
        }
        input[type='checkbox']::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          background: #073639;
          width: 100%;
          height: 100%;
          border: 1px solid #7eaaae;
        }
        input[type='checkbox']:checked::before {
          content: '\2713';
          background-color: #a1d1d6;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          border: 1px solid #a1d1d6;
        }
        label {
          font-size: 14px;
          margin-left: 6px;
          color: #91c2c6;
        }
      }
      .abnormal {
        position: absolute;
        left: 50%;
        bottom: 112px;
        transform: translate(-50%, 0);
        color: #c7b052;
        font-size: 13px;
      }
      .loginBtn {
        width: 92px;
        height: 38px;
        position: absolute;
        bottom: 59px;
        left: 266px;
        background-color: rgba(0, 0, 0, 0);
        border: none;
        background-image: url('../assets/images/Login/LoginDefult.png');
        background-size: 92px 38px;
        background-position: 0 0;
      }
      .loginBtn:hover {
        background-image: url('../assets/images/Login/LoginHighlight.png');
        background-size: 92px 38px;
        background-position: 0 0;
      }
    }
  }
  .showpop {
    z-index: 999;
    position: absolute;
    width: 100%;
    min-height: 1080px;
    .pop {
      width: 500px;
      height: 200px;
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      background-image: url('../assets/images/Component/Horizon/Background.png');
      background-size: 500px 200px;
      background-position: 0 0;

      .text {
        font-size: 16px;
        color: #b0e5eb;
        width: 470px;
        height: 30px;
        line-height: 30px;
        padding-left: 5px;
        background-image: url('../assets/images/Titlebar/Plan/TopBackground.png');
        background-size: cover;
        position: relative;
        top: 13px;
        left: 15px;
      }
      .screenfull {
        width: 470px;
        height: 90px;
        text-align: center;
        line-height: 90px;
        position: relative;
        top: 20px;
        left: 15px;
        font-size: 20px;
        color: #b0e5eb;
      }
      button {
        width: 60px;
        height: 30px;
        background-color: #296061;
        color: #b0e5eb;
        border: none;
      }
      button:hover {
        cursor: pointer;
      }
      .cancel {
        position: absolute;
        bottom: 10px;
        right: 90px;
      }
      .confirm {
        position: absolute;
        bottom: 10px;
        right: 20px;
      }
    }
  }
}
</style>
