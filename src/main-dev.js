import Vue from 'vue'
import App from './App.vue'
import router from './router'
import SlideVerify from 'vue-monoplasty-slide-verify';
// element-ui
import './plugins/element.js'
// axios工具类
import instance from './assets/js/util/request.js'
// 导入字体图配
import './assets/fonts/iconfont.css'
// 全局样式表
import './assets/css/global.css'


Vue.use(SlideVerify);
Vue.config.productionTip = false

Vue.prototype.$http = instance
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

// 日期格式化
Vue.prototype.formatDate = function (date) {
  const dateTime = new Date(date)
  const YY = dateTime.getFullYear()
  const MM =
    dateTime.getMonth() + 1 < 10
      ? '0' + (dateTime.getMonth() + 1)
      : dateTime.getMonth() + 1
  const D =
    dateTime.getDate() < 10 ? '0' + dateTime.getDate() : dateTime.getDate()
  const hh =
    dateTime.getHours() < 10
      ? '0' + dateTime.getHours()
      : dateTime.getHours()
  const mm =
    dateTime.getMinutes() < 10
      ? '0' + dateTime.getMinutes()
      : dateTime.getMinutes()
  const ss =
    dateTime.getSeconds() < 10
      ? '0' + dateTime.getSeconds()
      : dateTime.getSeconds()
  return `${YY}-${MM}-${D} ${hh}:${mm}`
}
