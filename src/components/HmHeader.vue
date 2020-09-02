<template>
<div>
  <div class="placeholder"></div>
  <div class="hm-header">
  <div class="back" @click="back">
    <!-- 箭头组件 -->
    <span class="iconfont iconjiantou2"></span>
  </div>
  <div class="title"><slot></slot></div>
  <div class="extra"></div>
</div>
</div>
</template>

<script>
export default {
  methods: {
    back() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less">
.placeholder{
  width: 100%;
  height: 50px;
}
.hm-header {
  position: fixed;
  width: 100%;
  height: 50px;
  top: 0;
  z-index: 999;
  background-color: #fff;
  border: 1px solid #ccc;
  display: flex;
  line-height: 50px;
  text-align: center;
  .back,
  .extra {
    width: 50px;
  }
  .title {
    flex: 1;
    font-size: 18px;
    font-weight: 700;

  }
}
</style>
