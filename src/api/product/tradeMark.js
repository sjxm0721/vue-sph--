//品牌管理数据模块

import request from '@/utils/request'

//获取品牌列表接口
//url: admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList=(page,limit)=>{
    return request({url:`admin/product/baseTrademark/${page}/${limit}`,method:'get'});
}


//处理添加品牌的操作
//url: /admin/product/baseTrademark/save   method:post  携带品牌名称与品牌logo
//对于新增的品牌，给服务器传递数据，不需要传递ID，ID是由服务器生成的

//处理修改品牌的操作
//url: /admin/product/baseTrademark/update   put   携带三个参数：id、品牌名称、品牌logo
//请求携带的参数需要包含id，来判断修改的是哪个品牌

export const reqAddOrUpdateTradeMark=(tradeMark)=>{
    if(tradeMark.id){
        //修改
        return request({url:'/admin/product/baseTrademark/update',method:'put',data:tradeMark});
    }
    else{
        //添加
        return request({url:'/admin/product/baseTrademark/save',method:'post',data:tradeMark});
    }
}


//删除品牌
//url: admin/product/baseTrademark/remove/{id}  delete

export const reqDeleteTradeMark=(id)=>{
    return request({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'});
}