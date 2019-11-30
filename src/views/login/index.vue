<template>
  <div class="login">
    <!-- 导航栏 -->
    <van-nav-bar title="登录" />
    <!-- 导航栏 -->

    <!-- 表单 -->
    <van-cell-group>
      <van-field
        label="手机号"
        placeholder="请输入手机号"
        v-model="user.mobile"
        required
        clearable
      />

      <van-field
        label="验证码"
        placeholder="请输入验证码"
        v-model="user.code"
        required
        clearable
      />
    </van-cell-group>
    <!-- /表单 -->

    <!-- 登录按钮 -->
    <div class="login-btn-box">
      <van-button type="info" @click='onLogin'>登录</van-button>
    </div>
    <!-- /登录按钮 -->
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  name: 'LoginPage',
  components: {},
  prop: {},
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      }
    }
  },
  computed: {},
  watch: {},
  created () {},
  methods: {
    async onLogin () {
      try {
        const res = await request({
          method: 'POST',
          url: '/app/v1_0/authorizations',
          data: this.user
        })
        console.log(res, '登陆成功')
      } catch (err) {
        console.log(err, '登陆失败')
      }
    }
  }
}
</script>

<style lang='less' scoped>
.login {
    .login-btn-box {
        padding: 20px;
        .van-button {
            width: 100%;
        }
    }
}
</style>
