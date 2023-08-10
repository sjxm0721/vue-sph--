import request from '@/utils/request'

export const reqGetBlackList=()=>{
    return request({url:'/getBlackList.php',method:'get'});
}

export const reqSetWhiteList=(userId)=>{
    return request({url:'/setWhiteList.php',method:'get',params:{userId}});
}

export const reqSearchBlackList=(inputContent)=>{
    return request({url:'/searchBlackList.php',method:'get',params:{inputContent}});
}