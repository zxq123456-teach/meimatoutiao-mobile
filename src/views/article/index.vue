<template>
    <div class="article-container">
        <!-- 导航栏 -->
        <van-nav-bar
        fixed
        left-arrow
        @click-left="$router.back()"
        title="文章详情"
        ></van-nav-bar>
        <!-- /导航栏 -->

        <!-- 加载中 loading -->
        <van-loading class="article-loading" v-if="loading" />
        <!-- /加载中 loading -->

        <!-- 文章详情 -->
        <div class="detail" v-else-if="article.title">
            <h3 class="title">{{ article.title }}</h3>
            <div class="author">
                <van-image
                round
                width="2rem"
                height="2rem"
                fit="fill"
                :src="article.aut_photo"/>
                <div class="text">
                    <p class="name">{{ article.aut_name }}</p>
                    <p class="time">{{ article.pubdate | relativeTime }}</p>
                </div>
                <van-button
                round
                size="small"
                type="info"
                @click="onFollow"
                >{{ article.is_followed ? '+ 关注' : '取消关注' }}</van-button>
            </div>
            <div class="content" v-html="article.content"></div>
            <div class="zan">
                <van-button
                round
                size="small"
                hairline
                type="primary"
                plain
                icon="good-job-o"
                @click="onLike"
                >{{ article.attitude === -1 ? '点赞' : '取消点赞' }}</van-button>&nbsp;&nbsp;&nbsp;&nbsp;
                <van-button
                round
                size="small"
                hairline
                type="danger"
                plain
                icon="delete"
                @click="onDislike"
                >{{ article.attitude === 0 ? '取消不喜欢' : '不喜欢' }}</van-button>
            </div>
        </div>
        <!-- /文章详情 -->

        <!-- 加载失败的消息提示 -->
        <div class="error" v-else>
            <p>网络超时，点击
                <a href="#" @click.prevent="loadArticle">刷新</a>
                试一试
            </p>
        </div>
        <!-- /加载失败的消息提示 -->

        <!-- 文章评论 -->
        <article-comment />
        <!-- /文章评论 -->
    </div>
</template>

<script>
import { getArticle,
  addLike,
  deleteLike,
  addDislike,
  deleteDislike
} from '@/api/article'
import { followUser, unFollowUser } from '@/api/user'
import ArticleComment from './components/article-comment'

export default {
  name: 'ArticleIndex',
  props: {
    articleId: {

      required: true
    }
  },
  components: {
    ArticleComment
  },
  data () {
    return {
      loading: true, // 控制加载中的 loading 状态
      article: {} // 文章详情
    }
  },
  created () {
    this.loadArticle()
  },
  methods: {
    async loadArticle () {
      this.loading = true
      try {
        const { data } = await getArticle(this.$route.params.articleId)
        this.article = data.data
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    async onFollow () {
      const userId = this.article.aut_id

      // 如果没有关注，则关注
      if (this.article.is_followed) {
        await followUser(userId)
        // this.article.is_followed = false
      } else {
        // 如果已关注，则取消关注
        await unFollowUser(userId)
        // this.article.is_followed = true
      }

      // 更新视图
      this.article.is_followed = !this.article.is_followed
    },
    async onLike () {
      // 如果已点赞，则取消点赞
      if (this.article.attitude === 1) {
        await deleteLike(this.articleId)
        this.article.attitude = -1
      } else {
        // 如果没有点赞，则点赞
        await addLike(this.articleId)
        this.article.attitude = 1
      }
    },
    async onDislike () {
      // 如果已喜欢 则取消喜欢
      if (this.article.attitude === 0) {
        await deleteDislike(this.articleId)
        this.article.attitude = -1
      } else {
        // 如果没有喜欢 则喜欢
        await addDislike(this.articleId)
        this.article.attitude = 0
      }
    }
  }
}
</script>

<style lang='less' scoped>
.article-container{
    position:absolute;
    left: 0;
    top:0;
    overflow-y: scroll;
    width: 100%;
    height: 100%;
}
.aricle-loading{
    padding-top:100px;
    text-align: center;
}
.error{
    padding-top: 100px;
    text-align: center;
}
.detail{
    padding: 50px 10px;
    .title{
        font-size: 16px;
    }
    .zan{
        text-align: center;
    }
    .author{
        padding: 10px 0;
        display: flex;
        .text{
            flex:1;
            padding-left: 10px;
            line-height: 1.3;
            .name{
                font-size: 14px;
                margin: 0;
            }
            .time{
                margin: 0;
                font-size: 12px;
                color:#999;
            }
        }
    }
    .content{
        overflow: hidden;
        white-space: pre-wrap;
        word-break: break-all;
        /deep/ img{
            max-width: 100%;
            background: #f9f9f9;
        }
    }
}
</style>
