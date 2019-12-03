<template>
  <div class='home'>
    <van-nav-bar title='首页' fixed/>

    <van-tabs v-model="active">
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
      >
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="channel.finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-cell
              v-for="article in channel.articles"
              :key="article.art_id.toString()"
              :title="article.title"
            >
              <div slot="label">
                <van-grid :border="false" :column-num="3">
                  <van-grid-item v-for="(img, index) in article.cover.images" :key="index">
                    <van-image height="80" :src="img" lazy-load />
                  </van-grid-item>
                </van-grid>
                <div class="article-info">
                  <span>{{ article.aut_name }}</span>
                  <span>{{ article.comm_count }}评论</span>
                  <span>{{ article.pubdate | relativeTime}}</span>
                </div>
              </div>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
      <div
      class="wap-nav"
      slot="nav-right"
      @click="isChannelShow = true">
        <van-icon name="wap-nav" />
      </div>
    </van-tabs>
    <van-popup
    v-model="isChannelShow"
    round
    position='bottom'
    closeable
    close-icon-position='top-left'
    :style="{ height: '95%' }">

    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import { getArticles } from '@/api/article'
export default {
  name: 'HomePage',
  components: {},
  props: {},
  data () {
    return {
      active: 0, // 控制激活的标签页
      loading: false, // 加载更多的转圈圈
      isLoading: false, // 下拉刷新的转圈圈
      channels: [], // 频道列表
      isChannelShow: true
    }
  },
  computed: {},
  watch: {
  },
  created () {
    this.loadUserChannels()
  },
  methods: {
    async onLoad () {
      // 当前频道
      const activeChannel = this.channels[this.active]

      // 当前频道的的文章列表
      const articles = activeChannel.articles

      // 1. 请求获取数据
      const res = await getArticles({
        channel_id: activeChannel.id, // 频道 id
        timestamp: activeChannel.timestamp || Date.now(), // 获取下一页数据的时间戳，Date.now() 表示获取当前最新数据
        with_top: 1
      })

      // 2. 将数据添加到当前频道的文章列表中
      // ...数组，数组的展开操作符，它会把数组元素一个一个的拿出来，传递给使用的位置
      articles.push(...res.data.data.results)

      // 3. 将 loading 设置为 false
      this.loading = false

      // 4. 判断还有下一页数据，则更新获取下一个数据的时间戳
      //    如果没有了，则将 finished 设置为 true，不再加载更多了
      const preTimestamp = res.data.data.pre_timestamp
      if (preTimestamp) {
        // 更新获取下一页数据的时间戳
        activeChannel.timestamp = preTimestamp
      } else {
        activeChannel.finished = true
      }
    },

    async onRefresh () {
      const activeChannel = this.channels[this.active]

      // 1. 请求获取最新数据
      const res = await getArticles({
        channel_id: activeChannel.id,
        timestamp: Date.now(), // 获取最新数据传递当前最新时间戳即可
        with_top: 1
      })

      // 2. 把数据放到列表的顶部
      const articles = res.data.data.results
      activeChannel.articles.unshift(...articles)

      // 3. 停止下拉刷新的转圈圈
      this.isLoading = false

      // 4. 提示用户刷新成功
      const message = articles.length
        ? `更新了${articles.length}条数据`
        : '暂无数据更新'
      this.$toast(message)
    },

    async loadUserChannels () {
      const res = await getUserChannels()
      const channels = res.data.data.channels
      channels.forEach(channel => {
        channel.articles = [] // 频道的文章列表
        channel.finished = false // 频道的加载结束状态
        channel.timestamp = null // 用于获取频道下一页数据的时间戳
      })
      this.channels = channels
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  .article-info span {
    margin-right: 10px;
  }
  .van-tabs {
    // 频道列表
    /deep/ .van-tabs__wrap {
      position: fixed;
      top: 46px;
      z-index: 2;
      right: 0;
      left: 0;
    }
    // 频道内容
    /deep/ .van-tabs__content {
      margin-top: 90px;
    }
  }
  .wap-nav {
    position: sticky;
    right: 0;
    display: flex;
    align-items: center;
    background-color: #fff;
    opacity: .8;
  }
  .channel-container {
    padding-top: 30px;
  }

  /deep/ .van-grid-item__icon-wrapper {
    position: absolute;
    top: -12px;
    right: -7px;
  }
}
</style>
