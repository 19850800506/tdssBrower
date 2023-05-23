import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('../views/index.vue'),
  },
  {
    path: '/place',
    name: 'index',
    component: () => import('../views/placeTree/index.vue'),
  },
  {
    path: '/dataManage',
    name: 'index',
    component: () => import('../views/dataManage/index.vue'),
  },
]
const router = new VueRouter({
  mode: 'hash', // 去掉url中的#
  routes,
})

export default router
