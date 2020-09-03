<template>
  <div class="user-edit">
    <hm-header>编辑资料</hm-header>
    <!-- 头像 -->
    <div class="avatar">
      <img :src="$axios.defaults.baseURL + user.head_img" alt="">
      <van-uploader :after-read="afterRead" />
    </div>
    <!-- 导航 -->
    <hm-navitem @click="showNickname">
      <template>昵称</template>
      <template #content>{{user.nickname}}</template>
    </hm-navitem>
    <hm-navitem  @click="showPassword">
      <template>密码</template>
      <template #content>******</template>
    </hm-navitem>
    <hm-navitem @click="showGender">
      <template>性别</template>
      <template #content>{{user.gender === 1? '男':'女'}}</template>
    </hm-navitem>
    <van-dialog v-model="isShownickname" title="标题" show-cancel-button @confirm="updateNickname">
    <van-field v-model="nickname" ref="nickname" placeholder="请输入用户名" />
    </van-dialog>

    <van-dialog v-model="isShowPassword" title="修改密码" show-cancel-button  @confirm="updatePassword">
    <van-field v-model="password" ref="password" placeholder="请输入密码" />
    </van-dialog>

<!-- <van-dialog v-model="isShowGender" title="修改性别" show-cancel-button @confirm="updateUser({gender:gender})"> -->
<van-dialog v-model="isShowGender" title="修改性别" show-cancel-button @confirm="updateGender">
<van-radio-group v-model="gender">
  <van-cell-group>
    <van-cell title="男" clickable @click="gender = 1">
      <template #right-icon>
        <van-radio :name="1" />
      </template>
    </van-cell>
    <van-cell title="女" clickable @click="gender = 0">
      <template #right-icon>
        <van-radio :name="0" />
      </template>
    </van-cell>
  </van-cell-group>
</van-radio-group>
</van-dialog>
<template>
 <div class="mask" v-show="isShowMask">
   <van-button type="primary" class="crop" @click="crop">裁剪</van-button>
   <van-button type="danger" class="cancel" @click="isShowMask = false">取消</van-button>
  <VueCropper
  ref="aa"
  :img="img"
  autoCrop
  autoCropWidth="100"
  autoCropHeight="100"
  fixed
  ></VueCropper>
 </div>
 </template>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'

export default {
  components: {
    VueCropper
  },
  data() {
    return {
      user: '',
      isShownickname: false,
      nickname: '',
      isShowPassword: false,
      password: '',
      isShowGender: false,
      gender: 0,
      // 裁剪框
      isShowMask: false,
      img: ''
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    async getUserInfo() {
      const userId = localStorage.getItem('userId')
      const res = await this.$axios.get(`/user/${userId}`)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.user = data
      }
    },
    async showNickname() {
      this.isShownickname = true
      this.nickname = this.user.nickname
      // console.log(123)
      await this.$nextTick()
      this.$refs.nickname.focus()
    },
    // 封装
    async updateUser(data) {
      // console.log('123')
      const userId = localStorage.getItem('userId')
      const res = await this.$axios.post(`/user_update/${userId}`, data)
      // console.log(res.data)
      if (res.data.statusCode === 200) {
      // 重新渲染
        this.getUserInfo()
        this.$toast.success('修改成功')
      }
    },
    // 使用1
    async updateNickname() {
    // console.log('123')
      // const userId = localStorage.getItem('userId')
      // const res = await this.$axios.post(`/user_update/${userId}`, {
      //   nickname: this.nickname
      // })
      // // console.log(res.data)
      // if (res.data.statusCode === 200) {
      // // 重新渲染
      //   this.getUserInfo()
      //   this.$toast.success('修改成功')
      // }
      this.updateUser({
        nickname: this.nickname
      })
    },
    async showPassword() {
      this.isShowPassword = true
      this.password = this.user.password
      await this.$nextTick()
      this.$refs.password.focus()
    },
    // 使用2
    async updatePassword() {
      this.updateUser({
        password: this.password
      })
    },
    showGender() {
      this.isShowGender = true
      this.gender = this.user.gender
    },
    // 使用3
    updateGender() {
      this.updateUser({
        gender: this.gender
      })
    },
    // 限制大小
    isImg(name) {
      if (name.endsWith('.gif') || name.endsWith('jpg') || name.endsWith('png') || name.endsWith('.jpeg')) {
        return true
      } else {
        return false
      }
    },
    // 上传
    afterRead(file) {
      console.log(file.file)
      if (!this.isImg(file.file.name)) {
        return this.$toast.fail('请上传图片')
      }
      if (file.file.size >= 340 * 1024) {
        return this.$toast.fail('上传图片太大')
      }
      // 显示裁剪
      this.isShowMask = true
      // 设置裁剪图片
      this.img = file.content
    },
    crop() {
      this.$refs.aa.getCropBlob(async blob => {
        const fd = new FormData()
        fd.append('file', blob)
        const res = await this.$axios.post('/upload', fd)
        const { statusCode, data } = res.data
        if (statusCode === 200) {
          console.log(data.url)
          this.updateUser({
            head_img: data.url
          })
        }
        // 隐藏裁剪
        this.isShowMask = false
      })
    }
  }
}

</script>
<style lang="less" scoped>
.avatar {
  padding: 40px 0;
  text-align: center;
  position: relative;
  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
   .van-uploader {
    position: absolute;
    left: 50%;
    top: 40px;
    transform: translate(-50%);
    width: 100px;
    height: 100px;
    opacity: 0;
  }
}
// >>>  css写法
//：：v-deep  scss写法
// /deep/深度作用选择器 less写法
/deep/ .van-dialog__content{
  padding:15px;
  .van-field{
    border: 1px solid #ccc;
  }
}
.mask{
  width: 100%;
  height: 100%;
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  .crop,
  .cancel{
    position: fixed;
    top: 0;
    z-index: 1;
  }
  .cancel{
    right: 0;
  }
}
.vue-cropper{
  background-image: none;
  background-color:pink;
}
</style>
