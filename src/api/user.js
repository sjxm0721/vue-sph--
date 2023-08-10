//引入axios axios进行了二次封装

//用户登录使用的api仓库  后续根据后端用户登录接口修改
import request from '@/utils/request'

//对外暴露登录接口函数
export function login(data) {
  return request({
    url: '/login.php',
    method: 'post',
    data
  })
}

export function register(data){
  return request({
    url:'/register.php',
    method:'post',
    data
  })
}

//对外暴露获取用户信息的函数
export function getInfo(token) {
  return request({
    url: '/info2.php',
    method: 'get',
    params: { token }
  })
}

//修改用户名和头像  
export function updateUserInfo(data){
  return request({
    url:'/updateUserInfo.php',
    method:'post',
    data
  })
}

export const reqSelectCollection=(userId)=>{
  return request({
    url:'/selectCollection.php',
    method:'get',
    params:{userId}
  })
}

export const reqDeleteCollection=(userId,activityId)=>{
  return request({
    url:'/deleteCollection.php',
    method:'get',
    params:{userId,activityId}
  })
}

//对外暴露退出登录的函数
// export function logout() {
//   return request({
//     url: '/admin/acl/index/logout',
//     method: 'post'
//   })
// }
