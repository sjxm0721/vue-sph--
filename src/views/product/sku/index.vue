<template>
    <div>
      <!-- 表格 -->
      <el-table style="width: 100%; border" :data="records">
        <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
        <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
        <el-table-column prop="skuDesc" label="描述" width="width"></el-table-column>
        <el-table-column label="默认图片" width="110">
          <template slot-scope="{row,$index}">
              <img :src="row.skuDefaultImg" style="width: 80;height:80px;">
          </template>
        </el-table-column>
        <el-table-column prop="weight" label="重量" width="80"></el-table-column>
        <el-table-column prop="price" label="价格" width="80"></el-table-column>
        <el-table-column label="操作" width="width">
          <template slot-scope="{row,$index}">
              <el-button type="success" icon="el-icon-bottom" size="mini" v-if="row.isSale==0" @click="cancelSale(row)"></el-button>
              <el-button type="info" icon="el-icon-top" size="mini" v-else @click="sale(row)"></el-button>
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit"></el-button>
              <el-button type="info" icon="el-icon-info" size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="getSkuList"
        style="text-align:center;"
        :current-page="page"
        :page-sizes="[3,5,10]"
        :page-size="limit"
        :total="total"
        layout="prev,pager,next,jumper,->,sizes,total"
      >

      </el-pagination>
    </div>
  </template>
  
  <script>
  export default {
      name:'sku',
      data() {
        return {
          page:1,//代表当前第几页
          limit:10,//代表当前页面有几条数据
          records:[],//存储sku列表的数据
          total:0,//存储数据总数
        }
      },
      //组件挂载完毕
      mounted(){
        //获取sku列表的数据
        this.getSkuList();
      },
      methods:{
        //获取sku列表数据的方法
        async getSkuList(pages=1){
          this.page=pages;
          //解构出默认参数
          const {page,limit}=this;
          let result=await this.$API.sku.reqSkuList(page,limit);
          if(result.code==200){
            this.total=result.data.total;
            this.records=result.data.records;
          }
        },
        //改变每一页展示数量
        handleSizeChange(limit){
          this.limit=limit;
          this.getSkuList();
        },
        //上架
        async sale(row){
          let result=await this.$API.sku.reqSale(row.id);
          console.log(result);
          if(result.code==200){
            row.isSale=0;
            this.$message({type:'success',message:'上架成功'});
          }
        },
        //下架
        async cancelSale(row){
          let result=await this.$API.sku.reqCancelSale(row.id);
          console.log(result);
          if(result.code==200){
            row.isSale=1;
            this.$message({type:'info',message:'下架成功'});
          }
        },
        edit(){
          this.$message('正在开发中');
        }
      }
  }
  </script>
  
  <style>
  
  </style>