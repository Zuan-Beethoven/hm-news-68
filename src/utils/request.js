/* 处理axios请求 */
import Vue from 'vue'
import axios from 'axios'
import router from '../router'
import { Toast } from 'vant'

// 把axios挂到vue原型上
Vue.prototype.$axios = axios
// 给axios配置默认baseURL  基本地址
const URL = 'http://localhost:3000'
axios.defaults.baseURL = URL
Vue.prototype.$base = URL
// 配置拦截器
// 请求拦截器
axios.interceptors.request.use(function(config) {
  // config指的是请求的配置信息
  // console.log('拦截到了', config)
  const token = localStorage.getItem(
    'token'
  )
  if (token) {
    config.headers.Authorization = token
  }
  return config
})
// 响应拦截器
axios.interceptors.response.use(function(response) {
  // console.log('拦截到了响应', response)
  const { statusCode, message } = response.data
  if (statusCode === 401 && message === '用户信息验证失败') {
    // console.log('token失效')
    // 跳转登录
    router.push('/login')
    // 去除失效token
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    Toast.fail('登录信息失效')
  }
  return response
})
Vue.prototype.$url = function(url) {
  if (url.startsWith('http')) {
    return url
  } else {
    return URL + url
  }
}
