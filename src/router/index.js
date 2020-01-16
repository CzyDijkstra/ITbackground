import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import AdminHome from '../components/AdminHome.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: ' ',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/adminhome',
    name: 'adminhome',
    component: AdminHome
  }
]

const router = new VueRouter({
  routes
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //     next()  放行    next('/login')  强制跳转

  if (to.path === '/login') return next()
  if (to.path === '/register') return next()
  const accessTokenStr = window.sessionStorage.getItem('accessToken')
  const refreshTokenStr = window.sessionStorage.getItem('refreshToken')
  if (!accessTokenStr && !refreshTokenStr ) return next('/login')
  next()
})

export default router
