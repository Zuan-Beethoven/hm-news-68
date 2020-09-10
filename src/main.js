import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入通用样式
import './style/bess.less'
import './style/iconfont.css'
// 导入通用rem库
import 'amfe-flexible'
// 全局注册组件
import './utils/global'
// 全局axios请求
import './utils/request'
// 全局过滤器
import './utils/filters'
// 全局导入vant
import './utils/vant'

// 去除没必要警告
Vue.config.productionTip = false
// 创建一个bus
const bus = new Vue()
// 挂载原型上
Vue.prototype.$bus = bus
// bus.$on('reply', function() {

// })

window.vm = new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
