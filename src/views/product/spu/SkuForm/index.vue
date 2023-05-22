<template>
  <el-form ref="form" label-width="120px">
    <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>
    <el-form-item label="SKU名称">
      <el-input placeholder="请输入SKU名称" v-model="skuInfo.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格（元）">
      <el-input placeholder="价格（元）" type="number" v-model="skuInfo.price"></el-input>
    </el-form-item>
    <el-form-item label="重量（千克）">
      <el-input placeholder="重量（千克）" type="number" v-model="skuInfo.weight"></el-input>
    </el-form-item>
    <el-form-item label="规格描述">
      <el-input type="textarea" placeholder="请输入规格描述" rows="4" v-model="skuInfo.skuDesc"></el-input>
    </el-form-item>
    <el-form-item label="平台属性" >
      <el-form :inline="true" ref="form" label-width="80px">
        <el-form-item :label="attr.attrName" v-for="(attr,index) in attrInfoList" :key="attr.id">
          <el-select  placeholder="请选择" v-model="attr.attrIdAndValueId">
            <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" v-for="(attrValue,index) in attr.attrValueList" :key="attrValue.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性" >
      <el-form :inline="true" ref="form" label-width="80px">
        <el-form-item :label="saleAttr.saleAttrName" v-for="(saleAttr,index) in spuSaleAttrList" :key="saleAttr.id">
          <el-select  placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
            <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" v-for="(saleAttrValue,index) in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片列表">
      <el-table style="width:100%;" border :data="spuImageList" @selection-change="handleSelectionChange">
        <el-table-column width="80" type="selection" prop="prop"></el-table-column>
        <el-table-column label="图片">
          <template slot-scope="{row,$index}">
            <img :src="row.imgUrl" style="width: 100px; height: 100px;">
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row,$index}">
              <el-button type="primary" v-if="row.isDefault==0" @click="changeDefault(row)">设置默认</el-button>
              <el-button v-else type="success">默认</el-button> 
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
    name:'SkuForm',
    data() {
      return {
        //存储图片的信息
        spuImageList:[],
        //存储销售属性的数据
        spuSaleAttrList:[],
        //存储平台属性的数据
        attrInfoList:[],
        //收集sku数据的字段
        skuInfo:{
          category3Id:"",
          spuId:"",
          tmId:"",
          
          skuName:"",
          price:0,
          weight:0,
          skuDesc:"",

          //收集图片的字段
          skuImageList:[],
          //默认图片
          skuDefaultImg:"",
          //销售属性列表数据
          skuSaleAttrValueList:[],
          //平台属性
          skuAttrValueList:[
          ],
        },
        spu:{},
        //收集图片的数据字段
        imageList:[],
      }
    },
    methods:{
      //获取SKU列表数据
      async getData(category1Id,category2Id,spu){
        //收集来自父组件的数据
        this.skuInfo.category3Id=spu.category3Id;
        this.skuInfo.spuId=spu.id;
        this.skuInfo.tmId=spu.tmId;
        this.spu=spu;
        //获取图片的数据
        let result=await this.$API.spu.reqSpuImageList(spu.id);
        if(result.code==200){
          let list=result.data;
          list.forEach(item=>{
            item.isDefault=0;
          });
          this.spuImageList=list;
        }
        //获取销售属性的数据
        let result1=await this.$API.spu.reqSpuSaleAttrList(spu.id);
        if(result1.code==200){
          this.spuSaleAttrList=result1.data;
        }
        //获取平台属性的数据
        let result2=await this.$API.spu.reqAttrInfoList(category1Id,category2Id,spu.category3Id);
        if(result2.code==200){
          this.attrInfoList=result2.data;
        }
      },
      //table表格复选框按钮的事件
      handleSelectionChange(selection){
        this.imageList=selection;
      },
      //设为默认按钮的排他操作
      changeDefault(row){
        this.spuImageList.forEach(item=>{
          item.isDefault=0;
        });
        row.isDefault=1;
        //收集默认图片的信息
        this.skuInfo.skuDefaultImg=row.imgUrl;
      },
      //取消按钮的点击事件
      cancel(){
        //自定义事件 让父组件切换场景
        this.$emit('changeScenes',0);
        //清除数据
        Object.assign(this._data,this.$options.data());
      },
      //保存按钮的点击事件
      async save(){
        //整理参数
        //1.整理平台属性
        const {attrInfoList,skuInfo,spuSaleAttrList,imageList}=this;
        //方法一
        // let arr=[];
        // attrInfoList.forEach(item=>{
        //   //当前平台属性已经选择
        //   if(item.attrIdAndValueId)
        //   {
        //     const [attrId,valueId]=item.attrIdAndValueId.split(":");
        //     let obj={attrId,valueId};
        //     arr.push(obj);
        //   }
        // });
        // this.skuInfo.skuAttrValueList=arr;

        //方法二
        skuInfo.skuAttrValueList=attrInfoList.reduce((prev,item)=>{
          if(item.attrIdAndValueId){
            const [attrId,valueId]=item.attrIdAndValueId.split(":");
            prev.push({attrId,valueId});
          }
          return prev;
        },[]);

        //整理销售属性
        skuInfo.skuSaleAttrValueList=spuSaleAttrList.reduce((prev,item)=>{
          if(item.attrIdAndValueId){
            const [saleAttrId,saleAttrValueId]=item.attrIdAndValueId.split(":");
            prev.push({saleAttrId,saleAttrValueId});
          }
          return prev;
        },[]);

        //整理图片的数据(使用映射)
        skuInfo.skuImageList=imageList.map(item=>{
          return {
            imagName:item.imgName,
            imgUrl:item.imgUrl,
            isDefault:item.isDefault,
            spuImgId:item.id,
          }
        });
        //发请求
        let result= await this.$API.spu.reqAddSku(skuInfo);
        console.log(result);
        if(result.code==200){
          this.$message({type:'success',message:'添加SKU成功'});
          this.$emit('changeScenes',0);
        }
        else{
          this.$message({type:'warning',message:'添加SKU失败'});
        }
      }
    }
}
</script>

<style scoped>

</style>