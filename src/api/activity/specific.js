//具体每个活动的api
import request from '@/utils/request'


export const reqActivityList=(fatherAttrId,childrenAttrId,page,limit)=>{
    return request({url:`/select_activity.php`,params:{fatherAttrId,childrenAttrId,page,limit},method:'get'});
}


export const reqAddOrUpdateChildrenAttr=(children)=>{
    if(children.childrenAttrForm.id){
        //修改
        return request({url:'/change.php',method:'put',data:children});
    }
    else{
        //添加
        return request({url:'/add1.php',method:'post',data:children});
    }
}