<template>
  <div>
    <el-card style="margin: 20px 0px">
      <!-- 三级联动 已经是全局组件了，可以直接使用 -->
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="scene != 0"
      ></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="scene == 0">
        <!-- 展示spu列表的结构 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu的sku列表"
                @click="getSkuList(row)"
              ></el-button>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row)"
                style="padding-left: 10px"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                  slot="reference"
                  @click="deleteSpu(row)"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="getSpuList"
          @size-change="handleSizeChange"
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev,pager,next,jumper,->,sizes,total"
          :total="total"
        >
        </el-pagination>
      </div>
      <SpuForm
        v-show="scene == 1"
        @changeScene="changeScene"
        ref="spu"
      ></SpuForm>
      <SkuForm
        v-show="scene == 2"
        ref="sku"
        @changeScenes="changeScenes"
      ></SkuForm>
    </el-card>
    <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="close">
      <el-table :data="skuList" style="width: 100%;" border v-loading="loading">
        <el-table-column prop="skuName" label="名称"></el-table-column>
        <el-table-column prop="price" label="价格"></el-table-column>
        <el-table-column prop="weight" label="重量"></el-table-column>
        <el-table-column label="默认图片">
          <template slot-scope="{row,$index}">
            <img :src="row.skuDefaultImg" style="width: 100px; height: 100px;">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
import { reqDeleteSpu } from "@/api/product/spu";
export default {
  name: "spu",
  data() {
    return {
      //分别为一、二、三级分类的id
      category1Id: "",
      category2Id: "",
      category3Id: "",
      page: 1, //分页器当前第几页
      limit: 3, //每一页展示多少条数据
      records: [], //spu列表的数据
      total: 0, //分页器展示数据的条数
      scene: 0, //0:展示SPU列表数据   1：展示添加SPU|修改SPU     2：添加SKU
      dialogTableVisible:false, //控制sku列表的显示与隐藏
      spu:{},
      skuList:[],//sku列表的数据
      loading:true,//sku列表加载效果
    };
  },
  components: {
    SpuForm,
    SkuForm,
  },
  methods: {
    //发请求获取spu列表数据的方法
    async getSpuList(page = 1) {
      this.page = page;
      const { limit, category3Id } = this;
      //携带三个参数 page：当前在第几页   limit：每一页限制多少条数据   category3Id：三级分类id
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },

    //三级联动自定义事件,可以把子组件相应的id传递给父组件
    getCategoryId({ categoryId, level }) {
      //categoryId：获取到一、二、三级分类的id    level: 区分是几级id
      if (level == 1) {
        this.category1Id = categoryId;
        //清除二级、三级分类id
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        //清除三级分类的id
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        //获取spu类列表数据
        this.getSpuList();
      }
    },
    //分页器展示数据条数发生改变的回调
    handleSizeChange(limit) {
      //修改参数
      this.limit = limit;
      //再发请求
      this.getSpuList();
    },
    //添加spu按钮的回调
    addSpu() {
      this.scene = 1;
      //通知子组件spuForm发请求
      this.$refs.spu.addSpuData(this.category3Id);
    },
    //修改spu按钮的回调
    updateSpu(row) {
      this.scene = 1;
      //获取子组件spuForm
      this.$refs.spu.initSpuData(row);
    },
    //spuForm自定义事件的回调
    changeScene({ scene, flag }) {
      //切换结构（场景）
      //flag区分保存按钮为添加还是修改
      this.scene = scene;
      //重新获取spu列表数据
      if (flag == "修改") {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
    },
    //删除Spu按钮的回调
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "删除成功" });
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
      }
    },
    //添加sku按钮的回调
    addSku(row) {
      //切换场景为2
      this.scene = 2;
      //父组件调用子组件的方法，让子组件发请求
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },
    //skuForm自定义事件的回调
    changeScenes(scene) {
      this.scene = scene;
    },
    //查看sku按钮的回调
    async getSkuList(spu){
      //设置sku列表可见
      this.dialogTableVisible=true;
      //保存spu信息
      this.spu=spu;
      //获取sku列表的数据并展示
      let result=await this.$API.spu.reqSkuList(spu.id);
      console.log(result);
      if(result.code==200){
        this.skuList=result.data;
       this.loading=false;
      }
    },
    //关闭对话框的回调
    close(done){
      this.loading=true;
      this.skuList=[];
      done();
    }
  },
};
</script>

<style></style>
