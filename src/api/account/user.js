import request from '@/utils/request'

export const reqGetTotalUser=()=>{
    return request({url:'/getTotalUser.php',method:'get'});
}

export const reqSetBlackList=(userId,userName)=>{
    return request({url:'/setBlackList.php',method:'get',params:{userId,userName}});
}


export const reqSearchAccount=(inputContent)=>{
    return request({url:'/searchAccount.php',method:'get',params:{inputContent}});
}