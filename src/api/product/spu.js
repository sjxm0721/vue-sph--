import request from '@/utils/request'

//获取SPU列表数据的接口
//url: /admin/product/{page}{limit} method:get    page limit category3Id
export const reqSpuList=(page,limit,category3Id)=>{
    return request({url:`/admin/product/${page}/${limit}`,method:'get',params:{category3Id}});
}

//获取Spu信息  
//url： /admin/product/getSpuById/{spuId}   method:get
export const reqSpu=(spuId)=>{
    return request({url:`/admin/product/getSpuById/${spuId}`,method:'get'});
}

//获取品牌的信息
// url: /admin/product/baseTrademark/getTrademarkList  method:get
export const reqTradeMarkList=()=>{
    return request({url:`/admin/product/baseTrademark/getTrademarkList`,method:'get'});
}


//获取SPU图片
// url: /admin/product/spuImageList/{spuId}  method:get
export const reqSpuImageList=(spuId)=>{
    return request({url:`/admin/product/spuImageList/${spuId}`,method:'get'});
}

//获取平台全部的销售属性
// url: /admin/product/baseSaleAttrList   method:get
export const reqBaseSaleAttrList=()=>{
    return request({url:'/admin/product/baseSaleAttrList',method:'get'});
}

//修改或添加SPU   修改需要带id 添加不用带id
// url: /admin/product/updateSpuInfo   method:post
export const reqAddOrUpdateSpu=(spuInfo)=>{
    if(spuInfo.id){
        return request({url:'/admin/product/updateSpuInfo',method:'post',data:spuInfo});
    }
    else{
        return request({url:'/admin/product/saveSpuInfo',method:'post',data:spuInfo});
    }
}


//删除spu
// url: /admin/product/deleteSpu/{spuId} method: delete

export const reqDeleteSpu=(spuId)=>{
    return request({url:`/admin/product/deleteSpu/${spuId}`,method:'delete'});
}



//获取销售属性的数据
// url: /admin/product/spuSaleAttrList/{spuId}  method:get
export const reqSpuSaleAttrList=(spuId)=>{
    return request({url:`/admin/product/spuSaleAttrList/${spuId}`,method:'get'});
}


//获取平台属性的数据
// url: /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}   method:get
export const reqAttrInfoList=(category1Id,category2Id,category3Id)=>{
    return request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'});
}


//添加sku 
// url: /admin/product/saveSkuInfo  method:post
export const reqAddSku=(skuInfo)=>{
    return request({url:'/admin/product/saveSkuInfo',method:'post',data:skuInfo});
}


//获取SKU列表数据的接口
// url: /admin/product/findBySpuId/{spuId} method: get
export const reqSkuList=(spuId)=>{
    return request({url:`/admin/product/findBySpuId/${spuId}`,method:'get'});
}