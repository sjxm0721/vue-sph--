<template>
  <div>
    <!-- inline代表行内表单（一行可以放置多个表单元素） -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select placeholder="请选择" v-model="cForm.category1Id" @change="handler1" :disabled="show">
          <el-option :label="category1.name" :value="category1.id" v-for="(category1,index) in list1" :key="category1.id"></el-option>
        </el-select> </el-form-item
      ><el-form-item label="二级分类">
        <el-select placeholder="请选择" v-model="cForm.category2Id" @change="handler2" :disabled="show">
          <el-option :label="category2.name" :value="category2.id" v-for="(category2,index) in list2" :key="category2.id"></el-option>
        </el-select> </el-form-item
      ><el-form-item label="三级分类">
        <el-select placeholder="请选择" v-model="cForm.category3Id" @change="handler3" :disabled="show">
          <el-option :label="category3.name" :value="category3.id" v-for="(category3,index) in list3" :key="category3.id" ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  data() {
    return {
      //一级分类的数据
      list1:[],
      //二级分类的数据
      list2:[],
      //三级分类的数据
      list3:[],
      //选择的一级、二级、三级分类的id
      cForm:{
        category1Id:'',
        category2Id:'',
        category3Id:'',
      }
    }
  },
  mounted(){
    //获取一级分类的方法
    this.getCategory1List();
  },
  props:['show'],
  methods: {
    async getCategory1List(){
      //获取一级分类的请求
      let result=await this.$API.attr.reqCategory1List();
      if(result.code==200){
        this.list1=result.data;
      }
    },
    //一级分类事件回调
    async handler1(){
      //清除数据
      this.list2=[];
      this.list3=[];
      this.cForm.category2Id='';
      this.cForm.category3Id='';
      //当一级分类的内容发生变化时获取相应二级分类的数据
      //解构出一级分类的Id
      const {category1Id}=this.cForm;
      this.$emit('getCategoryId',{categoryId:category1Id,level:1});
     let result = await this.$API.attr.reqCategory2List(category1Id);
     if(result.code==200){
      this.list2=result.data;
     }
    },
    //二级分类事件回调
    async handler2(){
      //清除数据
      this.list3=[];
      this.cForm.category3Id='';
      //当二级分类的内容发生变化时获取相应三级分类的数据
      //解构出二级分类的Id
      const {category2Id}=this.cForm;
      this.$emit('getCategoryId',{categoryId:category2Id,level:2});
     let result = await this.$API.attr.reqCategory3List(category2Id);
     if(result.code==200){
      this.list3=result.data;
     }
    },
    handler3(){
      const {category3Id}=this.cForm;
      this.$emit('getCategoryId',{categoryId:category3Id,level:3});

    }
  },
};
</script>
<style></style>
