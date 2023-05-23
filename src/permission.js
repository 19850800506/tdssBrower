import NProgress from 'nprogress'
import router from './router'
import store from './store'
import { getToken, removeToken } from '@/utils/auth'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
  removeToken()
  if (getToken()) {
    next()
    NProgress.done()
  } else {
    next()
  }
})
router.afterEach(() => {
  NProgress.done()
})
