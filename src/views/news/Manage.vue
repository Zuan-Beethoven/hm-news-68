<template>
<div class="manage">
 <hm-header>栏目管理</hm-header>
  <div class="active">
     <h3>点击删除以下频道(至少保留四项)</h3>
  <div class="list">
      <div class="item" v-for="item in  activeList" :key="item.id" @click="delTab(item.id)">{{item.name}}</div>
    </div>
 </div>
    <div class="deactive">
      <h3>点击添加以下频道</h3>
    <div class="list">
      <div class="item" v-for="item in  dactiveList" :key="item.id" @click="addTab(item.id)">{{item.name}}</div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      // 存激活栏目
      activeList: [],
      // 存未激活栏目
      dactiveList: []
    }
  },
  async created() {
    const activeList = JSON.parse(localStorage.getItem('activeList'))
    const dactiveList = JSON.parse(localStorage.getItem('dactiveList'))
    if (activeList) {
      this.activeList = activeList
      this.dactiveList = dactiveList
      return
    }
    const res = await this.$axios.get('/category')
    // console.log(res)
    const { statusCode, data } = res.data
    if (statusCode === 200) {
      this.activeList = data
      console.log(this.activeList)
    }
  },
  methods: {
    delTab(id) {
      if (this.activeList.length <= 4) return
      const index = this.activeList.findIndex(item => item.id === id)
      // 往激活的栏目中添加
      this.dactiveList.push(this.activeList[index])
      // 删除激活中的这个栏目
      this.activeList.splice(index, 1)
    },
    addTab(id) {
      const index = this.dactiveList.findIndex(item => item.id === id)
      // 往激活的栏目中添加
      this.activeList.push(this.dactiveList[index])
      // 删除激活中的这个栏目
      this.dactiveList.splice(index, 1)
    }
  },
  watch: {
    activeList: {
      deep: true,
      handler(value) {
        localStorage.setItem('activeList', JSON.stringify(this.activeList))
        localStorage.setItem('dactiveList', JSON.stringify(this.dactiveList))
      }
    }
  }
}
</script>

<style lang="less" scoped>
.active,
.deactive{
  padding: 10px;
  h3{
    font-size: 14px;
    font-weight: 400;
    margin: 10px 0;
  }
  .list{
   overflow: hidden;
   .item{
     width: 60px;
     height: 30px;
     border: 1px solid #ccc;
     background-color: #eee;
     text-align: center;
     line-height: 30px;
     font-size: 16px;
     float: left;
     margin: 5px;
   }
  }
}
</style>
