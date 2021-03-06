import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import Tabbar from '@/views/tabbar'
import Home from '@/views/home'
import Search from '@/views/search'
import SearchResult from '@/views/search-result'
import Article from '@/views/article'
import My from '@/views/my'
import User from '@/views/user'
Vue.use(VueRouter)

// 配置路由表
const routes = [
  {
    path: '',
    redirct: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/Tabbar',
    component: Tabbar,
    children: [
      {
        path: '',
        component: Home
      },
      {
        name: 'my',
        path: '/my',
        component: My
      }
    ]
  },
  {
    path: '/search',
    component: Search
  },
  {
    path: '/search/:q',
    component: SearchResult
  },
  {
    // 给路由起个名字，必须唯一
    name: 'article',
    path: '/article/:articleId',
    component: Article,
    props: true
  },
  {
    name: 'user',
    path: '/user',
    component: User
  }
]

const router = new VueRouter({
  routes
})

export default router
