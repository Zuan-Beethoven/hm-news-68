<template>
  <div class="post-detail">
    <div class="header">
      <!-- back后退 -->
      <div class="left" @click="$router.back()">
        <span class="iconfont iconjiantou2"></span>
      </div>
      <div class="center">
        <span class="iconfont iconnew"></span>
      </div>
      <div class="right">
        <div class="followed" v-if="post.has_follow" @click="unfollow">已关注</div>
        <div class="follow" v-else @click="follow">关注</div>
      </div>
    </div>
    <div class="content">
      <div class="title">{{post.title}}</div>
      <div class="name">
        <span>{{post.user.nickname}}</span>
        <span>{{post.create_data | time}}</span>
      </div>
      <div v-if="post.type === 1" class="info" v-html="post.content">
      </div>
      <video v-else :src="getUrl(post.content)" controls></video>
      <div class="buttons">
        <div class="good" :class="{active:post.has_like}" @click="like">
          <span class="iconfont icondianzan"></span>
          <span>{{post.like_length || 0}}</span>
        </div>
        <div class="share">
          <span class="iconfont iconweixin"></span>
          <span>微信</span>
        </div>
      </div>
    </div>
    <!-- 评论 -->
    <div class="comment-list">
      <h3>精彩跟帖</h3>
      <hm-comment :comment="comment" v-for="comment in commentList" :key="comment.id" @reply="onReply"></hm-comment>
    </div>
    <!-- 底部搜索 -->
    <div class="footer-textarea"
    v-if="isShowTextarea">
      <textarea  @blur="onBlur" ref="textarea" :placeholder="'回复:'+ nickname" v-model="content"></textarea>
      <van-button type="primary" @click="publish">发送</van-button>
    </div>
    <div class="footer-input" v-else>
      <div class="search">
        <input type="text" placeholder="回帖" @focus="onFocus">
      </div>
        <span class="iconfont iconpinglun-"><i>{{commentList.length}}</i></span>
        <span class="iconfont iconshoucang" :class="{now: post.has_star}" @click="star"></span>
        <span class="iconfont iconfenxiang"></span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      post: {
        user: {}
      },
      commentList: [],
      // 是否显示框
      isShowTextarea: false,
      content: '',
      nickname: ''
    }
  },
  created() {
    this.getInfo()
    // console.log(this.getCommentList())
    // 获取文章评论列表
    this.getCommentList()
    // 给bus注册自定义事件
    // this.$bus.$on('reply', async(id, nickname) => {
    //   console.log('bus', id, nickname)
    //   // 点击显示框子
    //   this.isShowTextarea = true
    //   // 获取焦点
    //   await this.$nextTick()
    //   this.$refs.textarea.focus()
    //   // 回显
    //   this.nickname = '@' + nickname
    //   this.replyId = id
    // })
    // 第三种写法
    this.$bus.$on('reply', this.onReply)
  },
  destroyed() {
    // 移除注册事件off
    // 默认移除bus上所有事件  传值就是指定移除
    this.$bus.$off('reply', this.onReply)
  },
  methods: {
    onLogin() {
      const token = localStorage.getItem('token')
      if (!token) {
        this.$router.push({
          path: '/login',
          query: {
            back: true
          }
        })
        // 代表没登陆
        return true
      } else {
        // 代表登录
        return false
      }
    },
    async getInfo() {
      // 需要id
      const { id } = this.$route.params
      // console.log(this.$route.params)
      const res = await this.$axios.get(`/post/${id}`)
      // console.log(res.data)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.post = data
        console.log(this.post)
      }
    },
    getUrl(url) {
      const div = document.createElement('div')
      div.innerHTML = url
      return div.innerText
    },
    async follow() {
      // 关注功能
      if (this.onLogin()) return// 默认false
      // 发送请求功能
      const res = await this.$axios.get(`/user_follows/${this.post.user.id}`)
      if (res.data.statusCode === 200) {
        this.$toast.success('关注成功')
        this.getInfo()
        // console.log(this.getInfo(), '123')
      }
    },
    async unfollow() {
      // 取消关注
      const res = await this.$axios.get(`/user_unfollow/${this.post.user.id}`)
      const { statusCode } = res.data
      if (statusCode === 200) {
        this.$toast.success('取消关注')
        this.getInfo()
      }
    },
    // 点赞功能开始
    async like() {
      if (this.onLogin()) return
      // 发送点赞请求
      const res = await this.$axios.get(`/post_like/${this.post.id}`)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getInfo()
      }
    },
    async star() {
      if (this.onLogin()) return
      // 发送点赞请求
      const res = await this.$axios.get(`/post_star/${this.post.id}`)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getInfo()
      }
    },
    async getCommentList() {
      const id = this.$route.params.id
      const res = await this.$axios.get(`/post_comment/${id}`)
      // console.log(res.data)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.commentList = data
        console.log(this.commentList)
      }
    },
    async onFocus() {
      this.isShowTextarea = true
      // 等待dom更新
      await this.$nextTick()
      // 自动获取焦点
      this.$refs.textarea.focus()
    },
    async publish() {
      const res = await this.$axios.post(`/post_comment/${this.post.id}`, {
        content: this.content,
        parent_id: this.replyId
      })
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getCommentList()
        this.content = ''
        this.replyId = ''
        this.nickname = ''
        this.isShowTextarea = false
      }
    },
    async onReply(id, nickname) {
      console.log('父组件', id, nickname)
      // 点击显示框子
      this.isShowTextarea = true
      // 获取焦点
      await this.$nextTick()
      this.$refs.textarea.focus()
      // 回显
      this.nickname = '@' + nickname
      this.replyId = id
    },
    onBlur() {
      if (!this.content) {
        this.isShowTextarea = false
        this.replyId = ''
        this.nickname = ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.post-detail{
  padding-bottom: 50px;
}
.header {
  display: flex;
  padding: 0 10px;
  border-bottom: 1px solid #ccc;
  height: 50px;
  align-items: center;
  .left {
    span {
      line-height: 50px;
    }
  }
  .center {
    flex: 1;
    span {
      margin-left: 10px;
      font-size: 50px;
    }
  }
  .right {
    font-size: 14px;
    div {
      width: 60px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      border-radius: 15px;
    }
    .followed {
      border: 1px solid #ccc;

    }
    .follow {
      color: #fff;
      background-color: #f00;
    }
  }
}
.content{
  padding: 10px;
  border-bottom: 3px solid #ccc;
  .title{
    font-weight: 700;
    font-size: 18px;
  }
  .name{
    font-size: 14px;
    color:#666;
    margin: 10px 0;
    span:first-child{
      margin-right: 10px;
    }
  }
 .info{
   font-size: 14px;
   /deep/ img{
    width: 100%;
  }
 }
 video{
   width: 100%;
 }
 .buttons{
   padding: 20px 0;
   display: flex;
   justify-content: space-around;
   > div {
  width: 120px;
  height: 40px;
  line-height: 40px;
  border-radius: 20px;
  border: 1px solid #ccc;
  text-align: center;
  font-size: 15px;
  .iconfont{
    font-size:18px;
    margin-right: 10px;
   }
   .iconweixin{
     color: lime;
   }
  }
  .active{
   color: red;
  border: 1px solid red;
  }
 }
}
.comment-list{
 h3{
 font-size: 20px;
 text-align: center;
 padding: 10px 0;
 }
}
.footer-input{
 width: 100%;
 height: 50px;
 display: flex;
 background-color: #fff;
 border-top: 1px solid #ccc;
 position: fixed;
 bottom: 0;
 align-items: center;
 justify-content: space-around;
 .iconfont{
   font-size: 24px;
  }
  .now{
    color: red;
  }
 .iconpinglun-{
   position: relative;
   i{
     position: absolute;
     right: 0;
     top: 0;
     background-color: red;
     font-size: 10px;
     color: #fff;
     padding: 0 3px;
     right: -5px;
     border-radius: 5px;
     font-style: normal;
   }
 }
 .search{
   width: 180px;
   padding-right: 10px;
   input{
     height: 30px;
     background-color: #ddd;
     border-radius:15px;
     width: 100%;
     border: none;
     font-size: 14px;
     padding-left: 20px;
   }
 }
}
.footer-textarea{
  width: 100%;
  height: 100px;
  display: flex;
  position: fixed;
  z-index: 999;
  bottom: 0;
  padding: 10px;
  align-items: flex-end;
  background-color: #fff;
  border-top: 1px solid #ccc;
  justify-content: space-around;
  textarea{
    width: 260px;
    height: 80px;
    background-color: #ccc;
    border-radius: 5px;
    border: none;
    padding:10px ;
    font-size: 14px;
  }
}
</style>
