import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'
// 导入字体图配
import './assets/fonts/iconfont.css'
// 全局样式表
import './assets/css/global.css'
Vue.config.productionTip = false
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8333/api/'
// axios请求拦截器
axios.interceptors.request.use(config => {
  config.headers.authorization = window.sessionStorage.getItem('accessToken')
  config.headers.refresh_token = window.sessionStorage.getItem('refreshToken')
  console.log(config)
  // console.log('token : '+token)
  return config
})

Vue.prototype.$http = axios
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
