import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/user/Login.vue'
import Register from '../views/user/Register.vue'
import User from '../views/user/User.vue'
import UserEdit from '../views/user/UserEdit.vue'
import MyFollow from '../views/user/MyFollow.vue'
import MyComment from '../views/user/MyComment.vue'
import MyStar from '../views/user/MyStar.vue'
import Index from '../views/news/Index.vue'
import Manage from '../views/news/Manage.vue'
import PostDetail from '../views/news/PostDetail.vue'
import Search from '../views/news/Search.vue'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  { path: '/login', component: Login, name: 'login' },
  { path: '/register', component: Register, name: 'register' },
  { path: '/user', component: User, name: 'user' },
  { path: '/user-edit', component: UserEdit, name: 'user-edit' },
  { path: '/my-follow', component: MyFollow, name: 'my-follow' },
  { path: '/my-comment', component: MyComment, name: 'my-comment' },
  { path: '/my-star', component: MyStar, name: 'my-star' },
  { path: '/', component: Index, name: 'index' },
  { path: '/manage', component: Manage, name: 'manage' },
  {
    path: '/post-detail/:id',
    component: PostDetail,
    name: 'post-detail'
  },
  {
    path: '/search',
    component: Search,
    name: 'search'
  }

]
const router = new VueRouter({
  routes
})
// 前后置守卫
// to 到哪去
// from 从哪儿来
// next 函数  是否放行
router.beforeEach(function(to, form, next) {
  // if (to.name === 'user') {
  //   const token = localStorage.getItem('token')
  //   if (token) {
  //     next()
  //   } else {
  //     router.push('/login')
  //   }
  // } else {
  //   next()
  // }
  const token = localStorage.getItem('token')
  const authUrls = [
    '/user',
    '/user-edit',
    '/my-follow',
    '/my-comment',
    '/my-star'
  ]
  if (!authUrls.includes(to.path) || token) {
    next()
  } else {
    router.push('/login')
  }
})
// router.afterEach()
export default router
