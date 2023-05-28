//引入axios axios进行了二次封装

//用户登录使用的api仓库  后续根据后端用户登录接口修改
import request from '@/utils/request'

//对外暴露登录接口函数
export function login(data) {
  return request({
    url: '/selectPeople.php',
    method: 'post',
    data
  })
}

//对外暴露获取用户信息的函数
export function getInfo(token) {
  return request({
    url: '/info.php',
    method: 'get',
    params: { token }
  })
}

//对外暴露退出登录的函数
// export function logout() {
//   return request({
//     url: '/admin/acl/index/logout',
//     method: 'post'
//   })
// }
