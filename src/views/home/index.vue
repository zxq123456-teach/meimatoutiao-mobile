<template>
  <div>
      <van-nav-bar title='首页' />

      <van-tabs v-model="active">
        <van-tab
            :title="channel.name"
            v-for="channel in channels"
            :key="channel.id">

            <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
              <van-list
                v-model="loading"
                :finished="channel.finished"
                finished-text="没有更多了"
                @load="onLoad">

                <p>{{ channel.name }}</p>
                <van-cell
               v-for="item in channel.articles"
                :key="item"
                :title="item"/>

              </van-list>
            </van-pull-refresh>
            <!-- /文章列表 -->
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
    // 获取当前频道
    // this.active 双向绑定了标签页组件，该数据正好对应频道的索引
      const activeChannel = this.channels[this.active]

      // 获取当前频道的文章列表
      const articles = activeChannel.articles

      // 1. 请求加载数据
      setTimeout(() => {
        // 2. 将数据添加到当前频道的文章列表中
        for (let i = 0; i < 10; i++) {
          articles.push(articles.length + 1)
        }

        // 3. 将 loading 设置为 false
        // 加载状态结束
        // 关闭本次的 loading 状态，它会判定当前数据是否够一屏，不够就继续自动 onLoad
        this.loading = false

        // 4. 判断如果没有数据了，将当前频道的结束状态 finished 设置为 true
        if (articles.length >= 40) {
        // 如果后面没有数据了，将 finished 设置为 true，之后不再触发 onLoad
          activeChannel.finished = true
        }
      }, 1000)
    },

    onRefresh () {
      setTimeout(() => {
        this.$toast('刷新成功')
        this.isLoading = false
      }, 2000)
    },

    async loadUserChannels () {
      const res = await getUserChannels()
      const channels = res.data.data.channels
      channels.forEach(channel => {
        channel.articles = [] // 频道的文章列表
        channel.finished = false // 频道的加载结束状态
      })
      this.channels = channels
    }
  }
}
</script>

<style scoped></style>
