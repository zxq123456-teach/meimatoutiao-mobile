<template>
  <div class="article-comments">
      <!-- 评论列表 -->
      <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      >
          <van-cell
          v-for="item in list"
          :key="item.com_id.toString()"
          >
              <van-image
              slot="icon"
              round
              width="30"
              height="30"
              style="margin-right: 10px;"
              src="item.aut_photo"
               />
              <span style="color: #466b9d;" slot="title">{{ item.aut_name }}</span>
              <div slot="label">
                  <p style="color: #363636;">{{ item.content }}</p>
                  <p>
                      <span style="margin-right: 10px;">{{ item.pubdate | relativeTime }}</span>
                      <van-button
                      size="mini"
                      type="default"
                      @click="onReplyShow(item)"
                      >回复</van-button>
                  </p>
              </div>
              <van-icon
              slot="right-icon"
              :name="item.is_liking ? 'like' : 'like-o'"
              @click="onCommentLike(item)"
              color="red"
               />
          </van-cell>
      </van-list>
      <!-- /评论列表 -->

      <!-- 发布评论 -->
      <van-cell-group class="publish-wrap">
          <van-field
          clearable
          placeholder="请输入评论内容"
          v-model="inputComment"
          >
              <van-button
              slot="button"
              size="mini"
              type="info"
              @click="onAddComment"
              >发布</van-button>
          </van-field>
      </van-cell-group>
      <!-- /发布评论 -->

    <!-- 评论回复 -->
    <van-popup
      v-model="isReplyShow"
      get-container="body"
      round
      position="bottom"
      :style="{ height: '90%' }"
    >
      <!-- 回复列表 -->
      <comment-reply
        :comment="currentComment"
        v-if="isReplyShow"
        @close-reply="isReplyShow = false"
      />
      <!-- /回复列表 -->
    </van-popup>
    <!-- 评论回复 -->
  </div>
</template>

<script>
import { getComments, addComment, addCommentLike, deleteCommentLike } from '@/api/comment'
import CommentReply from './comment-reply'

export default {
  name: 'ArticleComment',
  props: {},
  data () {
    return {
      list: [], // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束
      offset: null, // 获取下一页评论数据的页码
      inputComment: '',
      isReplyShow: false,
      currentComment: {} // 存储当前点击回复的评论对象
    }
  },
  components: {
    CommentReply
  },
  methods: {
    async onLoad () {
      //   请求获取数据
      const res = await getComments({
        type: 'a', // a-对文章(article)的评论  c-对评论(comment)的回复
        source: this.$route.params.articleId, // 源id  文章id或评论id
        offset: this.offset // 获取评论数据的偏移量
        // 值为评论id 表示从此id的数据向后取 不传表示从第一页开始读取数据

      })
      // 将数据添加到列表中
      this.list.push(...res.data.data.results)

      // 结束加载
      this.loading = false

      // 如果没有数据 将finished 设置为 true
      const lastId = res.data.data.last_id
      if (lastId) {
        // 更新获取下一个数据的页码(偏移量)
        this.offset = lastId
      } else {
        this.finished = true
      }
    },
    async onAddComment () {
      const inputComment = this.inputComment.trim()

      // 非空校验
      if (!inputComment.length) {
        return
      }

      // 请求添加
      const res = await addComment({
        target: this.$route.params.articleId, // 评论的目标id
        cotent: inputComment // 评论内容
      })

      // 将发布的最新评论展示到列表顶部
      this.list.unshift(res.data.data.new_obj)

      // 清空文本框
      this.inputComment = ''
    },
    async onCommentLike (comment) {
      // 如果已经点赞了则取消点赞
      if (comment.is_liking) {
        await deleteCommentLike(comment.com_id)
      } else {
        // 如果没有点赞则点赞
        await addCommentLike(comment.com_id)
      }

      // 更新视图状态
      comment.is_liking = !comment.is_liking
      this.$toast('操作成功')
    },
    async onReplyShow (comment) {
      this.currentComment = comment
      // 限时回复的弹层
      this.isReplyShow = true
    }
  }
}
</script>

<style lang='less' scoped>
.publish-wrap {
    position:fixed;
    left:0;
    bottom:0;
    width:100%;
}

.van-list {
    margin-bottom: 45px;
}
</style>
