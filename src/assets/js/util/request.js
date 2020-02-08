import axios from 'axios'
import router from '@/router'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 从localStorage中获取token
function getAccessToken() {
  const accessToken = window.localStorage.getItem('accessToken')
  return accessToken
}
function getRefreshToken() {
  const refreshToken = window.localStorage.getItem('refreshToken')
  return refreshToken
}


// 创建一个axios实例
const instance = axios.create({
  baseURL: 'http://192.168.75.131:8333/api',
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': getAccessToken(), // headers塞token
    'refresh_token': getRefreshToken()
  }
})

instance.setToken = (accessToken, refreshToken) => {
  instance.defaults.headers['authorization'] = accessToken
  window.localStorage.setItem('accessToken', accessToken)
  instance.defaults.headers['refresh_token'] = refreshToken
  window.localStorage.setItem('refreshToken', refreshToken)
}

instance.setAccessToken = (accessToken) => {
  instance.defaults.headers['authorization'] = accessToken
  window.localStorage.setItem('accessToken', accessToken)
}

instance.removeToken = (accessToken, refreshToken) => {
  window.localStorage.removeItem('accessToken')
  window.localStorage.removeItem('refreshToken')
}

function frefreshToken() {
  // instance是当前request.js中已创建的axios实例
  return instance.get('/user/token').then(res => res.data)
}

// 是否正在刷新的标记
let isRefreshing = false
// 重试队列，每一项将是一个待执行的函数形式
const requests = []


instance.interceptors.request.use(config => {
  NProgress.start()
  // console.log(config)
  // NProgress.start()
  config.headers['Authorization'] = window.localStorage.getItem('accessToken')
  // 在最后必须 return config
  return config
})




instance.interceptors.response.use(response => {
  NProgress.done()

  // console.log(response);

  const { code } = response.data
  if (code === 0) {
    return response;
  }
  if (code === 4010002) {
    const config = response.config
    // console.log('接收到刷新token信息');

    if (!isRefreshing) {
      isRefreshing = true
      return frefreshToken().then(res => {
        // console.log('开始刷新token');
        // console.log(res);
        if (res.code === 0) {
          // console.log('开始修改token');
          const accessToken = res.data
          // console.log(accessToken);

          instance.setAccessToken(accessToken)
          config.headers['Authorization'] = accessToken
          config.baseURL = ''
          // 已经刷新了token，将所有队列中的请求进行重试
          requests.forEach(cb => cb(accessToken))
          return instance(config)
        }
        else if (res.code === 4010001) {
          // console.log('接收到4010001 /login');
          router.push('/login')
        }
        else return response
      }).catch(res => {
        // console.error('refreshtoken error =>', res)
        // window.location.href = '/login'
      }).finally(() => {
        isRefreshing = false
      })
    } else {
      // 正在刷新token，将返回一个未执行resolve的promise
      return new Promise((resolve) => {
        // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
        requests.push((accessToken) => {
          config.baseURL = ''
          config.headers['Authorization'] = accessToken
          resolve(instance(config))
        })
      })
    }
  }
  return response
}, error => {
  return Promise.reject(error)
})

export default instance