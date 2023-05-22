import request from'@/utils/request'


//sku列表的接口
// url: /admin/product/list/{page}/{limit}  method: get
export const reqSkuList=(page,limit)=>{
    return request({url:`/admin/product/list/${page}/${limit}`,method:'get'});
}

//上架
// url: /admin/product/onSale/{skuId}
export const reqSale=(skuId)=>{
    return request({url:`/admin/product/onSale/${skuId}`,method:'get'});
}


//下架
// url: /admin/product/cancelSale/{skuId}
export const reqCancelSale=(skuId)=>{
    return request({url:`/admin/product/cancelSale/${skuId}`,method:'get'});
}