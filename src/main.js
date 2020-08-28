import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入通用样式
import './style/bess.less'
import './style/iconfont.css'
// 全局导入'vant'
import Vant from 'vant'
import 'vant/lib/index.css'
// 导入rem库
import 'amfe-flexible'
import axios from 'axios'
// 全局注册组件
import HmHeader from './components/HmHeader.vue'
import HmLogo from './components/HmLogo.vue'

// 把axios挂到vue原型上
Vue.prototype.$axios = axios
// 给axios配置默认baseURL  基本地址
axios.defaults.baseURL = 'http://localhost:3000'

Vue.component('hm-header', HmHeader)
Vue.component('hm-logo', HmLogo)
Vue.use(Vant)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
