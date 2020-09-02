<template>
<div class="mystar">
  <hm-header>我的收藏</hm-header>
  <div class="list">
    <div class="item" v-for="item in list" :key="item.id">
      <div class="left"></div>
      <div class="info">
        <div class="title">
        {{item.title}}
        </div>
           <div class="user">
             <span>{{item.user.nickname}}</span>
             <span>{{item.comments.length}}跟帖</span>
           </div>
      </div>
      <div class="img">
        <img :src="$url(item.cover[0].url)" alt="">
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      list: []
    }
  },
  methods: {
    async getStarList() {
      const res = await this.$axios.get('/user_star')
      const { statusCode, data } = res.data
      // console.log(res)
      if (statusCode === 200) {
        this.list = data
        console.log(this.list)
      }
    }
  },
  created() {
    this.getStarList()
  }
}
</script>

<style lang="less" scoped>
.item{
 border-bottom: 1px solid #ccc;
 padding: 10px;
 display: flex;
 .info{
   flex: 1;
   font-size: 16px;
   display: flex;
   flex-direction: column;
   justify-content: space-between;
   .user{
     color: #666;
     font-size: 14px;
     span:first-child{
        margin-right: 12px;
     }
   }
 }
 .img{
     img{
         width: 120px;
         height: 74px;
         object-fit: cover;
    }
  }
}
</style>
