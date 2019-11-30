<template>
  <div id="app">
    <!-- 根路由出口 -->
    <router-view />
    <van-button type="default">默认按钮</van-button>
    <van-button type="primary">主要按钮</van-button>
    <van-button type="info">信息按钮</van-button>
    <van-button type="warning">警告按钮</van-button>
    <van-button type="danger">危险按钮</van-button>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {},
  props: {},
  data () {
    return {}
  },
  computed: {},
  watch: {
  },
  created () {},
  methods: {}
}
</script>

<style scoped>
.box {
  width: 375px;
  height: 100px;
  background-color: #f40;
}
</style>
