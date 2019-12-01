<template>
  <div>
      <van-nav-bar title='首页' />

      <van-tabs v-model='active'>
        <van-tab title='标签1'>
            <van-pull-refresh
            v-model='isLoading'
            @refresh='onRefresh'>
                <van-list
                v-model='loading'
                :finished="finished"
                finished-text="没有更多了"
                @load='onLoad'>
                    <van-cell
                    v-for="item in list"
                    :key='item'
                    :title='item'/>
                </van-list>
            </van-pull-refresh>
        </van-tab>
        <van-tab title='标签2'>内容2</van-tab>
        <van-tab title='标签3'>内容3</van-tab>
        <van-tab title='标签4'>内容4</van-tab>
        <van-tab title='标签5'>内容5</van-tab>
        <van-tab title='标签6'>内容6</van-tab>
      </van-tabs>
  </div>
</template>

<script>
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
      isLoading: false
    }
  },
  computed: {},
  watch: {
  },
  created () {},
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
    }
  }
}
</script>

<style scoped></style>
