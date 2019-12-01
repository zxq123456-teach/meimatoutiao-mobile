<template>
  <div>
      <van-nav-bar title='首页' />

      <van-tabs v-model="active">
         <van-tab
         :title="channel.name"
         v-for="channel in channels"
         :key="channel.id">
         000
         </van-tab>
      </van-tabs>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
export default {
  name: 'HomePage',
  components: {},
  props: {},
  data () {
    return {
      active: 0,
      list: [],
      loading: false,
      finished: false,
      isLoading: false,
      channels: []
    }
  },
  computed: {},
  watch: {
  },
  created () {
    this.loadUserChannels()
  },
  methods: {
    onLoad () {
      // 异步更新数据
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }
        // 加载状态结束
        this.loading = false

        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true
        }
      }, 500)
    },

    onRefresh () {
      setTimeout(() => {
        this.$toast('刷新成功')
        this.isLoading = false
      }, 2000)
    },

    async loadUserChannels () {
      const res = await getUserChannels()
      this.channels = res.data.data.channels
    }
  }
}
</script>

<style scoped></style>
