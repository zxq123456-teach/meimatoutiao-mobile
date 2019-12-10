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
      <van-cell
      title="昵称"
      :value="user.name"
      is-link
      @click="isNameShow = true"
       />
      <van-cell
      title="性别"
      :value="user.gender === 0 ? '男' : '女'"
      is-link
      @click="isGenerShow = true"
       />
      <van-cell
      title="生日"
      :value="user.birthday"
      is-link
      @click="isBirthdayShow = true"
       />
    </van-cell-group>

    <!-- 修改昵称 -->
    <van-dialog
      v-model="isNameShow"
      title="昵称修改"
      show-cancel-button
      @confirm="onNameConfirm"
    >
      <!--
        v-model 是
          :value="user.name"
          @input="user.name = 事件参数"
       -->
      <van-field
        :value="user.name"
        placeholder="请输入用户名"
        @input="inputName = $event"
      />
    </van-dialog>
    <!-- /修改昵称 -->

    <!-- 修改性别 -->
    <van-action-sheet
      v-model="isGenerShow"
      :actions="actions"
      @select="onGenerSelect"
      cancel-text="取消"
    />
    <!-- /修改性别 -->

    <!-- 修改生日 -->
    <van-popup
      v-model="isBirthdayShow"
      position="bottom"
      :style="{ height: '40%' }"
    >
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        @confirm="onBirthdayConfirm"
      />
    </van-popup>
    <!-- /修改生日 -->
  </div>
</template>

<script>
import { getProfile, updateUserPhoto, updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'
export default {
  name: 'UserIndex',
  data () {
    return {
      user: {
      },
      isNameShow: false,
      inputName: '',
      isGenerShow: false,
      actions: [
        { name: '男', value: 0 },
        { name: '女', value: 1 }
      ],
      isBirthdayShow: false,
      currentDate: new Date(),
      minDate: new Date(1970, 1, 1)
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
        const { name, gender, birthday } = this.user
        await updateUserProfile({
          name,
          gender,
          birthday
        })
        this.$toast.success('保存成功')
      } catch (err) {
        console.log(err)
        this.$toast.success('保存失败')
      }
    },
    onNameConfirm () {
      this.user.name = this.inputName
    },

    onGenerSelect (item) {
      // 更新数据
      this.user.gender = item.value

      // 关闭弹层
      this.isGenerShow = false
    },

    onBirthdayConfirm (value) {
      this.user.birthday = dayjs(value).format('YYYY-MM-DD')
      this.isBirthdayShow = false
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
