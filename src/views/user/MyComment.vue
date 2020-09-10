<template>
<div class="my-comment">
<hm-header>我的评论</hm-header>
<div class=" list">
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
  <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :immediate-check="false"
      offset="10"
      @load="onLoad">
  <!-- <van-cell v-for="item in list" :key="item" :title="item" /> -->
  <div class="item" v-for="item in  CommentList" :key="item.id">
    <div class="time">{{item.create_date | time("YYYY-MM-DD HH:mm")}}</div>
    <div class="comment" v-if="item.parent">
      <div class="name">回复:{{item.parent.user.nickname}}</div>
      <div class="comment_content">{{item.parent.content}}</div>
    </div>
    <div class="content">{{item.content}}</div>
    <div class="origin">
      <span class="one-txt-cut" @click="$router.push(`/post-detail/${item.post.id}`)">原文: {{item.post.title}}</span>
      <span class="iconfont iconjiantou1"></span>
    </div>
  </div>
  </van-list>
  </van-pull-refresh>
</div>
</div>
</template>

<script>
export default {
  data() {
    return {
      CommentList: [],
      pageIndex: 1,
      pageSize: 6,
      loading: false,
      finished: false,
      refreshing: false
    }
  },
  created() {
    this.getCommentList()
  },
  methods: {
    async getCommentList() {
      const res = await this.$axios.get('/user_comments', {
        params: {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      })
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.CommentList = [...this.CommentList, ...data]
        console.log(this.CommentList)

        this.loading = false
        if (data.length < this.pageSize) {
          this.finished = true
        }
        // 结束下拉刷新
        this.refreshing = false
      }
    },
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        this.pageIndex++
        this.getCommentList()
      }, 1000)
    },
    onRefresh() {
      setTimeout(() => {
        this.pageIndex = 1
        this.loading = true
        this.finished = false
        this.CommentList = []
        this.getCommentList()
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.item{
  border-bottom: 1px solid #ccc;
  padding: 10px 20px;
   .time{
     color: #666;
     padding: 10px 0;
  }
  .comment{
    background-color: #ddd;
    padding: 10px;
    .name{
      color: #666;
      font-size: 14px;
    }
    .comment_content{
     color: #999;
     line-height: 30px;
     margin-top: 10px 0;
    }
  }
  .content{
     margin: 10px 0;
  }
  .origin{
font-size: 14px;
color: #999;
display:flex ;
justify-content: space-between;
  }
}
</style>
