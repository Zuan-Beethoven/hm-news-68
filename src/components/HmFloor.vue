<template>
<div>
   <!-- @reply="replyFn" -->
<hm-floor :count="count-1" :comment="comment.parent" v-if="comment.parent"></hm-floor>
<div class="hm-floor" :class="{bt: !comment.parent}">
<div class="title">
  <div class="left">{{count}}.{{comment.user.nickname}}</div>
  <div class="center">{{comment.create_date | now}}</div>
  <div class="right" @click="reply">回复</div>
</div>
<div class="content">{{comment.content}}</div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    comment: Object,
    count: Number
  },
  methods: {
    reply() {
      this.$bus.$emit('reply', this.comment.id, this.comment.user.nickname)
      // this.$emit('reply', this.comment.id, this.comment.user.nickname)
      // console.log(this.$emit('reply', this.comment.id, this.comment.user.nickname))
    // },
    // replyFn(id, nickname) {
    //   this.$emit('reply', id, nickname)
    // }
    }
  }
}
</script>

<style lang="less" scoped>
.hm-floor.bt{
   border-top: 1px solid red;
 }
.hm-floor{
 border: 1px solid red;
 border-top: none;
 padding: 10px;
 .title{
 display: flex;
 font-size: 14px;
 .center{
   flex: 1;
   font-size: 12px;
   color: #666;
   padding-left: 10px;
  }
 }
 .content{
   font-size: 14px;
   margin-top: 10px;
   color: red;
 }
}

</style>
