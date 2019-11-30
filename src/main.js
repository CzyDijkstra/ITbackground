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
// 配置请求的根路径,这里使用暂时的mock数据,搭建于linux上的rap2
axios.defaults.baseURL = 'http://192.168.75.130:38080/app/mock/16/'
Vue.prototype.$http = axios
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
