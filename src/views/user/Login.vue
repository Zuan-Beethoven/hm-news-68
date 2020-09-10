<template>
  <div>
  <hm-header>登录</hm-header>
  <hm-logo></hm-logo>
  <van-form @submit="login">
  <van-field
    v-model="username"
    name="用户名"
    label="账号"
    placeholder="请输入账号"
    :rules="rules.username"
  />
  <van-field
    v-model="password"
    type="password"
    name="密码"
    label="密码"
    placeholder="请输入密码"
    autocomplete
   :rules="rules.password"
  />
  <div style="margin: 16px;">
    <van-button round block type="info" native-type="submit">
      登录
    </van-button>
  </div>
  <p class="tips">没有账号？去<router-link to="/register">注册</router-link></p>
</van-form>
  </div>
</template>

<script>
// import axios from 'axios'
export default {
  created() {
    const { username, password } = this.$route.params
    this.username = username
    this.password = password
  },
  methods: {
    async login() {
      const res = await this.$axios.post('/login', {
        username: this.username,
        password: this.password
      })

      const { statusCode, message, data } = res.data
      if (statusCode === 200) {
        // 在组件中必须  this.$toast才能使用
        this.$toast.success(message)
        // 保存token
        // 跳转到个人中心
        // 保存token
        localStorage.setItem('token', data.token)
        localStorage.setItem('userId', data.user.id)
        // this.$router.push('/user')
        // this.$router.push({
        //   path: '/user'
        // })
        if (this.$route.query.back) {
          this.$router.back()
        } else {
          this.$router.push('/user')
        }
      } else {
        this.$toast.fail('登录失败')
      }
    }
  },
  data() {
    return {
      username: '',
      password: '',
      rules: {
        username: [
          { required: true, message: '请填写用户名', trigger: 'onChange' },
          { pattern: /^\d{5,11}$/, message: '用户名请输入5-11位数字', trigger: 'onChange' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'onChange' },
          { pattern: /^\d{3,9}$/, message: '密码请输入3-9位密码', trigger: 'onChange' }
        ]
      }
    }
  }
}
</script>

<style lang="less" scoped>
.tips {
  padding: 15px;
  font-size: 16px;
  text-align: right;
  a {
    color: orange;
  }
}
</style>
