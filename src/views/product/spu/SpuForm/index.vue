<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="请输入SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="(tm, index) in tradeMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          placeholder="请输入SPU描述"
          rows="4"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- action:图片上传的地址
             list-type:文件列表的类型
             on-preview:预览图片的回调
             on-remove:删除图片的回调
             file-list:上传后图片的文件列表 -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :file-list="spuImageList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}项未选择`" v-model="attrValue">
          <el-option :label="unselect.name" :value="`${unselect.id}:${unselect.name}`" v-for="(unselect,index) in unSelectSaleAttr" :key="unselect.id"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrValue" @click="addSaleAttr">添加销售属性</el-button>
        <!-- 展示的是当前spu属于自己的销售属性 -->
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="saleAttrName"
            label="属性名"
            width="width"
          ></el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                :key="tag.id"
                v-for="(tag,index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index,1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="prop"
            label="操作"
            width="width"
          >
          <template slot-scope="{row,$index}">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)"></el-button>            
          </template>
        </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      //存储spu信息属性
      spu: {
        //三级分类的id
        category3Id: 0,
        //描述
        description: "",
        //spu名称
        spuName: "",
        //品牌的id
        tmId: 0,
        //收集SPU图片的信息
        spuImageList: [],
        //销售属性的信息
        spuSaleAttrList: [],
        
      },
      //存储品牌的信息
      tradeMarkList: [],
      //存储spu图片的数据
      spuImageList: [],
      //销售属性的数据
      saleAttrList: [],
      //收集未选择的销售属性的id
      attrValue:"",
      
    };
  },
  computed:{
    //计算出还未选择的销售属性
    unSelectSaleAttr(){
      let result=this.saleAttrList.filter(item=>{
        return this.spu.spuSaleAttrList.every(item1=>{
          return item.name!=item1.saleAttrName;
        })
      });
      return result;
    }
  },
  methods: {
    //照片墙删除图片的回调
    handleRemove(file, fileList) {
      //收集照片墙图片的数据
      this.spuImageList=fileList;
    },
    //照片墙图片预览的回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //初始化spuForm数据
    async initSpuData(spu) {
      //获取Spu信息的数据
      let spuResult = await this.$API.spu.reqSpu(spu.id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }
      //获取品牌的信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      //获取SPU图片的数据
      let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImageResult.code == 200) {
        let listArr = spuImageResult.data;
        //给spuImageList添加name和url字段
        listArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = listArr;
      }
      //获取平台全部的销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    //照片墙图片上传成功的回调
    handleSuccess(response,file,fileList){
      //收集图片的信息
      this.spuImageList=fileList;
    },
    //添加新的销售属性
    addSaleAttr(){
      //分割收集到的销售属性数据
      const[baseSaleAttrId,saleAttrName]=this.attrValue.split(":");
      //向spu对象的spuSaleAttrList属性里面添加新的销售属性
      let newSaleAttr={baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]};
      //添加新的销售属性
      this.spu.spuSaleAttrList.push(newSaleAttr);
      //清空数据
      this.attrValue="";
    },
    //添加按钮的回调
    addSaleAttrValue(row){
      //添加inputVisible、inputValue 响应式数据
      this.$set(row,'inputVisible',true);
      this.$set(row,'inputValue','');
    },
    //el-input失去焦点事件
    handleInputConfirm(row){
      //解构出销售属性当中的数据
      const {baseSaleAttrId,inputValue}=row;
      //新增销售属性值不能为空
      if(inputValue.trim()==''){
        this.$message('属性值不能为空');
        return;
      }
      //销售属性值不能重复
      let result=row.spuSaleAttrValueList.some(item=>{
        return item.saleAttrValueName==inputValue;
      });
      if(result){
        this.$message('属性值不能重复');
        return;
      }
      let newSaleAttrValue={baseSaleAttrId,saleAttrValueName:inputValue};
      row.spuSaleAttrValueList.push(newSaleAttrValue);
      //切换button与input
      row.inputVisible=false;
    },
    //保存按钮的回调
    async addOrUpdateSpu(){
      //整理参数
      this.spu.spuImageList=this.spuImageList.map(item=>{
        return {
          imageName:item.name,
          imageUrl:item.response?item.response.data:item.url,
        }
      });
      //发请求
      let result=await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      if(result.code==200){
        //弹出保存成功的提示
        this.$message({type:'success',message:'保存成功'});
        //通知父组件回到场景0
        this.$emit('changeScene',{scene:0,flag:this.spu.id?'修改':'添加'});
      }
         //清理数据
         Object.assign(this._data,this.$options.data());
    },
      //点击添加spu按钮的时候，发请求的函数
    async addSpuData(category3Id){
      //收集三级分类的id
      this.spu.category3Id=category3Id
       //获取品牌的信息
       let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
       //获取平台全部的销售属性
       let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    //取消按钮的回调
    cancel(){
      this.$emit('changeScene',{scene:0,flag:''});

      //清理数据
      Object.assign(this._data,this.$options.data());
    }
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
