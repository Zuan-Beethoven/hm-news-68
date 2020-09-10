/* 全局过滤器 */
import Vue from 'vue'
import moment from 'moment'
moment.locale('zh-CN')
// 定义全局过滤器

Vue.filter('time', (input, str = 'YYYY-MM-DD') => {
  return moment(input).format(str)
})
Vue.filter('now', input => {
  return moment(input).fromNow()
})
