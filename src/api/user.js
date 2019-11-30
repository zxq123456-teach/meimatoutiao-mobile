// 用户相关的请求数据
import request from '@/utils/request'

// 用户登录
export function login (data) {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data
  })
}
