/**
 * 封装 axios 请求模块
 */
import axios from 'axios'
import jsonBig from 'json-bigint'
import store from '@/store'

// axios.create 方法：复制一个 axios
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/' // 基础路径
})

/**
 * 配置处理后端返回数据中超出 js 安全整数范围问题
 */
request.defaults.transformResponse = [function (data) {
  try {
    return jsonBig.parse(data)
  } catch (err) {
    return {}
  }
}]

// 请求拦截器
request.interceptors.request.use(
  function (config) {
    const user = store.state.user
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    return Promise.reject(error)
  }
)

export default request
