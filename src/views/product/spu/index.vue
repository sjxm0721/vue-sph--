<template>
    <div>
      <el-card style="margin:20px 0px">
      <!-- 三级联动 已经是全局组件了，可以直接使用 -->
      <CategorySelect @getCategoryId="getCategoryId" :show="show"></CategorySelect>
      </el-card>
      <el-card>
        <div v-show="scene==0">
        <!-- 展示spu列表的结构 -->
          <el-button type="primary" icon="el-icon-plus">添加spu</el-button>
          <el-table style="width:100%;" border :data="records">
            <el-table-column type="index" label="序号" width="80" align="center">
            </el-table-column>
            <el-table-column prop="spuName" label="SPU名称" width="width">
            </el-table-column>
            <el-table-column prop="description" label="SPU描述" width="width">
            </el-table-column>
            <el-table-column prop="prop" label="操作" width="width">
              <template slot-scope="{row,$index}">
                  <el-button type="success" icon="el-icon-plus" size="mini" title="添加sku"></el-button>
                  <el-button type="warning" icon="el-icon-edit" size="mini" title="修改spu"></el-button>
                  <el-button type="info" icon="el-icon-info" size="mini" title="查看当前spu的sku列表"></el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini" title="删除spu"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @current-change="getSpuList"
            @size-change="handleSizeChange"
            style="text-align: center;"
            :current-page="page"
            :page-sizes="[3,5,10]"
            :page-size="limit"
            layout="prev,pager,next,jumper,->,sizes,total"
            :total="total">
          </el-pagination>
        </div>
        <SpuForm v-show="scene==1"></SpuForm>
        <SkuForm v-show="scene==2"></SkuForm>
      </el-card>
    </div>
  </template>
  
  <script>
  import SpuForm from './SpuForm'
  import SkuForm from './SkuForm'
  export default {
      name:'spu',
      data() {
        return {
          //分别为一、二、三级分类的id
          category1Id:"",
          category2Id:"",
          category3Id:"",
          //增加三级联动的可操作性
          show:false,
          page:1,//分页器当前第几页
          limit:3,//每一页展示多少条数据
          records:[],//spu列表的数据
          total:0,//分页器展示数据的条数
          scene:0,//0:展示SPU列表数据   1：展示添加SPU|修改SPU     2：添加SKU
        }
      },
      components:{
        SpuForm,
        SkuForm
      },
      methods:{
        //发请求获取spu列表数据的方法
        async getSpuList(page=1){
          this.page=page;
          const {limit,category3Id}=this; 
          //携带三个参数 page：当前在第几页   limit：每一页限制多少条数据   category3Id：三级分类id
          let result=await this.$API.spu.reqSpuList(page,limit,category3Id);
          if(result.code==200){
            this.total=result.data.total;
            this.records=result.data.records;
          }
        },

        //三级联动自定义事件,可以把子组件相应的id传递给父组件
        getCategoryId({categoryId,level}){
          //categoryId：获取到一、二、三级分类的id    level: 区分是几级id
          if(level==1){
            this.category1Id=categoryId;
            //清除二级、三级分类id
            this.category2Id="";
            this.category3Id="";
          }
          else if(level==2){
            this.category2Id=categoryId;
            //清除三级分类的id
            this.category3Id="";
          }
          else{
            this.category3Id=categoryId;
            //获取spu类列表数据
            this.getSpuList();
          }
        },
        //分页器展示数据条数发生改变的回调
        handleSizeChange(limit){
          //修改参数
          this.limit=limit;
          //再发请求
          this.getSpuList();
        }
      }
  }
  </script>
  
  <style>
  
  </style>