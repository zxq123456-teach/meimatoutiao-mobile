<template>
  <div>
    <van-nav-bar
      title="个人信息"
      left-arrow
      @click-left="$router.push( '/my' )"
      right-text="保存"
      @click-right="onSave"
    />
    <van-cell-group>
      <van-cell
      title="头像"
      is-link
      @click="onShowFile"
      >
        <van-image
          round
          width="30"
          height="30"
          :src="user.photo"
        />
      </van-cell>
      <!--表单元素的 hidden 表示隐藏这个表单元素-->
      <input type="file" hidden ref="file" @change="onFileChange">
      <van-cell title="昵称" :value="user.name" is-link />
      <van-cell title="性别" :value="user.gender === 0 ? '男' : '女'" is-link />
      <van-cell title="生日" :value="user.birthday" is-link />
    </van-cell-group>

  </div>
</template>

<script>
import { getProfile, updateUserPhoto } from '@/api/user'
export default {
  name: 'UserIndex',
  data () {
    return {
      user: {}
    }
  },
  computed: {
    file () {
      return this.$refs.file
    }
  },
  created () {
    this.loadUserProfile()
  },

  methods: {
    async loadUserProfile () {
      const res = await getProfile()
      this.user = res.data.data
      this.currentDate = new Date(this.user.birthday)
    },

    onShowFile () {
      this.file.click()
    },

    onFileChange () {
      this.user.photo = URL.createObjectURL(this.file.files[0])
    },

    async onSave () {
      this.$toast.loading({
        duration: 0, // 持续时间，0表示持续展示不停止
        forbidClick: true, // 是否禁止背景点击
        message: '保存中...' // 提示消息
      })
      try {
        // 保存头像
        const fileObj = this.file.files[0]
        // 如果用户选了新的头像才更新头像
        if (fileObj) {
          const fd = new FormData()
          fd.append('photo', fileObj)
          await updateUserPhoto(fd)
        }
        this.$toast.success('保存成功')
      } catch (err) {
        console.log(err)
        this.$toast.success('保存失败')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.van-nav-bar__text {
    color: #fff;
}
.van-nav-bar .van-icon{
    color: #fff;
}
</style>
