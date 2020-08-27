import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入通用样式
import './style/bess.less'
import './style/iconfont.css'
// 全局导入'vant'
// import Vant from 'vant'
// import 'vant/lib/index.css'
// Vue.use(Vant)
// 自动按需加载
import { Button } from 'vant'
// import Button from 'vant/lib/button'
// import 'vant/lib/button/style'
Vue.use(Button)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
