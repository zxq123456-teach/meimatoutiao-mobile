<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar
    :title="title"
    left-arrow
    @click-left='$router.back()'
    />
    <!-- 导航栏 -->

    <!-- 文章列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="item in list"
        :key="item.art_id.toString()"
        :title="item.title"
      />
    </van-list>
    <!-- /文章列表 -->
  </div>
</template>

<script>
import { getSearch } from '@/api/search'

export default {
  name: 'SearchResult',
  components: {},
  props: {},
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1
    }
  },
  computed: {
    title () {
      return `${this.$route.params.q}的搜索结果`
    }
  },
  watch: {
  },
  created () {},
  methods: {
    async onLoad () {
      // 请求获取数据
      const res = await getSearch({
        page: this.page, // 页数
        per_page: 20, // 每页数量
        q: this.$route.params.q // 搜索关键字
      })
      // 将数据添加到数据列表中
      const results = res.data.data.results
      this.list.push(...results)

      // 将本次的 loading 设置为 false
      this.loading = false

      // 判断是否还有数据 如果没有则将 finished 设置为 true
      if (results.length) {
        this.page++
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style scoped></style>
