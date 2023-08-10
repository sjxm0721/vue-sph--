//类管理 api
import request from '@/utils/request'

//获取全部父属性
export const reqGetFatherAttr=()=>{
    return request({url:'/select_field.php',method:'get'});
}

//获取子属性列表
export const reqGetChildrenAttr=(fatherAttrId)=>{
    return request({url:'/getChildrenAttr.php',method:'get',params:{fatherAttrId}});
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

export const reqGetLevelList=()=>{
    return request({url:'/select_level.php',method:'get'});
}

export const reqGetOrganizationList=()=>{
    return request({url:'/select_of.php',method:'get'});
}

export const reqGetCategoryList=()=>{
    return request({url:'/select_category.php',method:'get'});
}


//删除子属性
export const reqDeleteChildrenAttr=(fatherAttrId,childrenAttrId)=>{
    return request({url:'/del.php',params:{fatherAttrId,childrenAttrId},method:'get'});
}