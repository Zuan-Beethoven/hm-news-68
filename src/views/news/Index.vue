<template>
<div class="index">
  <div class="header">
    <div class="logo">
      <span class="iconfont iconnew"></span>
    </div>
    <div class="search">
      <div class="search-box"  @click="$router.push(`/search`)">
        <span class="iconfont iconsearch" ></span>
        <span>新闻搜索</span>
      </div>
    </div>
    <div class="user" @click="$router.push('/user')">
      <span class="iconfont iconwode"></span>
    </div>
  </div>

  <!-- tab效果 -->
  <van-sticky class="more-sticky">
     <div class="more" @click="$router.push('/manage')">
         <span class="">☢</span>
      </div>
    </van-sticky>
  <van-tabs v-model="active" sticky animated swipeable>
  <van-tab :title="tab.name" v-for="tab in tabList" :key="tab.id">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          :immediate-check="false"
          >
    <hm-post :post="item" v-for="item in newsList" :key="item.id"></hm-post>
    </van-list>
  </van-pull-refresh>
  </van-tab>
</van-tabs>
</div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      active: 0,
      tabList: [],
      newsList: [],
      pageIndex: 1,
      pageSize: 5,
      // 加载状态
      loading: false,
      // 是否加载完成
      finished: false,
      refreshing: false
    }
  },
  // 激活前触发
  activated() {
    console.log('activated')
  },
  // 缓存失活触发
  deactivated() {
    console.log('dactivated')
  },
  created() {
    this.getTabList()
  },
  methods: {
    async getTabList() {
      // 判断缓存是否存在
      const activeList = JSON.parse(localStorage.getItem('activeList'))
      if (activeList) {
        this.tabList = activeList
        this.getNewsList(this.tabList[0].id)
        return
      }
      const res = await this.$axios.get('/category')
      console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.tabList = data
        // console.log(this.tabList)
        // 获取tab 1栏数据
        this.getNewsList(this.tabList[0].id)
      }
    },
    async getNewsList(id) {
      const res = await this.$axios.get('/post', {
        params: {
          category: id,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      })
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        if (this.pageIndex === 1) {
          this.newsList = []
        }
        this.newsList = [...this.newsList, ...data]
        // 数据完成把loading改成false
        console.log(this.newsList)

        this.loading = false
        this.refreshing = false
        // 判断是否加载更多数据
        if (data.length < this.pageSize) {
          this.finished = true
        }
      }
    },
    onLoad() {
      setTimeout(() => {
        this.pageIndex++
        this.getNewsList(this.tabList[this.active].id)
      }, 1000)
    },
    onRefresh() {
      this.newsList = []
      this.pageIndex = 1
      this.finished = false
      this.loading = true
      setTimeout(() => {
        // 重新加载当前分类下的数据
        this.getNewsList(this.tabList[this.active].id)
      }, 1000)
    }
  },
  watch: {
    active(value) {
      this.newsList = []
      this.pageIndex = 1
      this.finished = false
      this.loading = true
      setTimeout(() => {
        this.getNewsList(this.tabList[value].id)
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.header{
  display: flex;
  height: 50px;
  background-color: #ff0000;
  line-height: 50px;
  text-align: center;
  color: #fff;
  .logo,
  .user{
    width: 70px;
  }
  .logo{
    span{
      font-size: 50px;
    }
  }
  .user{
    span{
      font-size: 24px;
    }
  }
  .search{
    flex: 1;
    .search-box{
      height: 34px;
      line-height: 34px;
      background: rgba(255, 255, 255, .5);
      margin-top: 8px;
      border-radius: 17px;
      font-size: 14px;
      span:first-child{
        margin-right: 5px;
      }
    }
  }
}
/deep/ .van-tabs__wrap{
width: 85%;
}
.more-sticky{
  /deep/ .van-sticky--fixed{
    z-index: 100;
  }
}
.more{
width: 16%;
height: 44px;
position: absolute;
right: 0;
z-index: 999;
background-color: #fff;
text-align: center;
line-height: 44px;
font-size: 32px;
color: red;
}
</style>
