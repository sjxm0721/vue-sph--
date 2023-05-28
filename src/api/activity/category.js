//类管理 api
import request from '@/utils/request'

//获取全部父属性
export const reqGetFatherAttr=()=>{
    return request({url:'/select_field.php',method:'get'});
}

//获取level属性列表
export const reqGetLevelAttr=()=>{
    return request({url:'/select_level.php',method:'get'});
}

//获取category属性列表
export const reqGetCategoryAttr=()=>{
    return request({url:'/select_category.php',method:'get'});
}

//获取organization属性列表
export const reqGetOfAttr=()=>{
    return request({url:'/select_of.php',method:'get'});
}


//删除子属性
export const reqDeleteChildrenAttr=(fatherAttrId,childrenAttrId)=>{
    return request({url:'/del.php',params:{fatherAttrId,childrenAttrId},method:'get'});
}