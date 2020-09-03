<template>
  <div class="user">
<div class="header" @click="$router.push('/user-edit')">
  <div class="avatar">
    <img :src="bese + user.head_img" alt="">
  </div>
  <div class="info">
    <div class="name">
      <!-- <span v-if="user.gender === 1" class="iconfont iconxingbienan"></span>
      <span v-else class="iconfont iconxingbienv"></span> -->
      <span class="iconfont" :class="user.gender === 1? 'iconxingbienan': 'iconxingbienv'"></span>
      <span>{{user.nickname}}</span>
      <div class="time">
        {{user.create_date | time}}
      </div>
    </div>
  </div>
  <div class="arrow">
    <span class="iconfont iconjiantou1"></span>
  </div>

</div>
<!-- 导航条 -->
<hm-navitem to="/my-follow">
  <template>我的关注</template>
  <template #content>关注内容</template>
</hm-navitem>
<hm-navitem to="/my-comment">
  <template>我的跟帖</template>
  <template #content>跟帖回复</template>
</hm-navitem>
<hm-navitem to="/my-star">
  <template>我的收藏</template>
  <template #content>文章/视频</template>
</hm-navitem>
<hm-navitem to="/user-edit">设置</hm-navitem>
<div style="margin: 15px;">
  <van-button type="danger" block @click="logout">退出</van-button>
</div>
  </div>
</template>

<script>
export default {
  computed: {
    bese() {
      return this.$axios.defaults.baseURL
    }
  },
  data() {
    return {
      user: ''
    }
  },
  // methods: {
  //   async logout() {
  //     this.$dialog.confirm({
  //       title: '温馨提示',
  //       message: '你确定要退出本系统么？'
  //     })
  //       .then(() => {
  //         localStorage.removeItem('token')
  //         localStorage.removeItem('userId')
  //         this.$router.push('/login')
  //         this.$toast.success('退出成功')
  //       })
  //       .catch(() => {
  //         this.$toast('取消退出')
  //       })
  //   }
  // },
  // try   catch 数据捕获异常使用
  methods: {
    async logout() {
      try {
        await this.$dialog.confirm({
          title: '温馨提示',
          message: '你确定要退出本系统么？'
        })
      } catch {
        return this.$toast('取消退出')
      }
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      this.$router.push('/login')
      this.$toast.success('退出成功')
    }
  },
  async created() {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    const res = await this.$axios.get(`/user/${userId}`, {
      headers: {
        Authorization: token
      }
    })
    const { statusCode, data } = res.data
    if (statusCode === 200) {
      this.user = data
    }
  }
}
</script>

<style lang="less" scoped>
.user{
  .header{
    display: flex;
    align-items: center;
    padding: 20px 10px;
    border-bottom: 3px solid #ccc;
    .avatar{
      width: 70px;
      height: 70px;
      img{
        width: 100%;
        height: 100%;
      border-radius: 50px;
      }
    }
    .info{
      flex: 1;
      padding-left: 20px;
      font-size: 14px;
      .time{
       margin-top:10px;
       color: #666;
      }
      .iconxingbienan{
        color:skyblue;
      }
      .iconxingbienv{
        color: pink;
      }
    }
  }
}
</style>
