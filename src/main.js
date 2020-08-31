import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入通用样式
import './style/bess.less'
import './style/iconfont.css'
// 全局导入'vant'
import Vant, { Toast } from 'vant'
import 'vant/lib/index.css'
// 导入rem库
import 'amfe-flexible'
import axios from 'axios'
// 全局注册组件
import HmHeader from './components/HmHeader.vue'
import HmLogo from './components/HmLogo.vue'
import HmNavItem from './components/HmNavtem.vue'
import moment from 'moment'

// 把axios挂到vue原型上
Vue.prototype.$axios = axios
// 给axios配置默认baseURL  基本地址
axios.defaults.baseURL = 'http://localhost:3000'
// 配置拦截器
// 请求拦截器
axios.interceptors.request.use(function(config) {
  // console.log('拦截到了', config)
  const token = localStorage.getItem('token')
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

Vue.filter('time', input => {
  return moment(input).format('YYYY-MM-DD')
})
Vue.component('hm-header', HmHeader)
Vue.component('hm-logo', HmLogo)
Vue.component('hm-navitem', HmNavItem)

Vue.use(Vant)
Vue.config.productionTip = false

window.vm = new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
