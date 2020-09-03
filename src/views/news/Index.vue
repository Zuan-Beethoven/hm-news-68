<template>
<div class="index">
  <div class="header">
    <div class="logo" @click="lister">
      <span class="iconfont iconnew"></span>
    </div>
    <div class="search">
      <div class="search-box" >
        <span class="iconfont iconsearch" ></span>
        <span>新闻搜索</span>
      </div>
    </div>
    <div class="user">
      <router-link to="/login"><span class="iconfont iconwode"></span></router-link>
    </div>
  </div>
  <van-tabs v-model="active" sticky animated swipeable>
  <van-tab :title="tab.name" v-for="tab in tabList" :key="tab.id">
    <hm-post :post="item" v-for="item in newsList" :key="item.id"></hm-post>
    <!-- <p>内容1</p> -->
  </van-tab>
</van-tabs>
</div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      tabList: [],
      newsList: [],
      pageIdex: 1,
      pageSize: 20
    }
  },
  created() {
    this.getTabList()
  },
  methods: {
    lister() {
      this.active = 0
      // this.getNewsList(this.tabList[0].id)
      this.getTabList()
    },
    async getTabList() {
      const res = await this.$axios.get('/category')
      console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.tabList = data
        // console.log(this.tabList)
        // 获取tab 1栏数据
        this.getNewsList(this.tabList[1].id)
      }
    },
    async getNewsList(id) {
      const res = await this.$axios.get('/post', {
        params: {
          category: id,
          pageIdex: this.pageIdex,
          pageSize: this.pageSize
        }
      })
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.newsList = data
        console.log(this.newsList)
      }
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
      color: #fff;
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

</style>
