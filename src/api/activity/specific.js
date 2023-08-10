//具体每个活动的api
import request from '@/utils/request'


export const reqActivityList=(fatherAttrId,childrenAttrId)=>{
    return request({url:`/select_activity.php`,params:{fatherAttrId,childrenAttrId},method:'get'});
}


export const reqAddOrUpdateActivity=(activity)=>{
    return request({url:'/addOrUpdateActivity.php',data:activity,method:'post'});
}


export const reqDeleteActivity=(activityId)=>{
    return request({url:'/deleteActivity.php',params:{activityId},method:'get'});
}

export const reqGetTotalActivity=()=>{
    return request({url:'/getTotalActivity.php',method:'get'});
}

export const reqChooseTotalActivity=(chooseContent)=>{
    return request({url:'/chooseTotalActivity.php',method:'post',data:chooseContent});
}

export const reqGetActivityByLikeNum=()=>{
    return request({url:'/getActivityByLikeNum.php',method:'get'});
}

export const reqGetActivityByCollectNum=()=>{
    return request({url:'/getActivityByCollectNum.php',method:'get'});
}