<template>
  <div class="my-follow">
  <hm-header>我的关注</hm-header>
  <div class="list">
    <div class="item" v-for="item in list" :key="item.id">
      <div class="left">
          <img :src="$base + item.head_img" alt="">
      </div>
      <div class="center">
        <p>{{item.nickname}}</p>
        <p>{{item.center_data | time}}</p>
      </div>
      <div class="right">
        <van-button round  size="small" type="primary" @click="unfllow(item.id)">取消关注</van-button>
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
  created() {
    this.getFollowList()
  },
  methods: {
    async getFollowList() {
      const res = await this.$axios.get('/user_follows')
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.list = data
      }
    },
    async unfllow(id) {
      try {
        await this.$dialog.confirm({
          title: '温馨提示',
          message: '确定要取消该用户么？'
        })
      } catch {
        return this.$toast('取消操作')
      }
      // 取消关注
      const res = await this.$axios.get(`/user_unfollow/${id}`)
      if (res.data.statusCode === 200) {
        this.$toast.success('取消关注成功')
        this.getFollowList()
      }
    }
  }
}
</script>

<style lang="less" scoped>
 .item{
   display: flex;
   height: 100px;
   border-bottom: 1px solid #ccc;
   align-items: center;
   padding: 0 20px;
   .left{
     img{
       width: 50px;
       height: 50px;
       border-radius: 50%;
     }
   }
   .center{
       flex: 1;
       padding-left: 10px;
       font-size: 16px;
     }
 }
</style>
