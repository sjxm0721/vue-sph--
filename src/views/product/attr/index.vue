<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="150"
          ></el-table-column>
          <el-table-column label="属性值列表">
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0 10px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
                >修改</el-button
              >
              <el-button type="danger" icon="el-icon-delete" size="mini"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性或修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form inline ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >请添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table
          border
          style="width: 100%; margin: 20px 0"
          :data="attrInfo.attrValueList"
        >
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="80"
          ></el-table-column>
          <el-table-column label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 此处结构需要用到span与input来回切换 -->
              <el-input
                placeholder="请输入属性值名称"
                v-model="row.valueName"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                :ref="$index"
              ></el-input>
              <span v-else @click="toEdit(row, $index)">{{
                row.valueName
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-popconfirm :title="`确定删除${row.valueName}？`" @onConfirm="deleteAttrValue($index)">
              <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"
                >删除</el-button
              >
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length<1">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
//按需引入lodash当中的深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "attr",
  data() {
    return {
      flag: true,
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //接收平台属性的字段
      attrList: [],
      //控制table表格的显示与隐藏
      isShowTable: true,
      //收集新增属性||修改属性使用
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [], //属性值可以有多个，所以使用数组,属性值为对象，需要attrId，valueName
        categoryId: 0, //3级分类的id
        categoryLevel: 3, //服务器区分几级ID
      },
    };
  },
  methods: {
    //自定义事件的回调
    getCategoryId({ categoryId, level }) {
      //区分分类id 父组件存储
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        //发请求获取品牌属性
        this.getAttrList();
      }
    },
    async getAttrList() {
      //获取平台属性的数据
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    //添加属性按钮的回调
    addAttr() {
      //切换table的显示与隐藏
      this.isShowTable = false;
      //清除数据
      this.attrInfo = {
        attrName: "", //属性名
        attrValueList: [], //属性值可以有多个，所以使用数组,属性值为对象，需要attrId，valueName
        categoryId: this.category3Id, //3级分类的id
        categoryLevel: 3, //服务器区分几级ID
      };
    },
    //添加属性值的回调
    addAttrValue() {
      //向属性值数组里添加元素
      //attrId: 是你相应的属性的id，目前而言我们是添加属性的操作，还没有相应属性的id，目前而言带给服务器的id为undefined
      //valueName 相应的属性值名称
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: "",
        //控制自己的查看模式与编辑模式
        flag: true,
      });
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    //修改属性的回调
    updateAttr(row) {
      //isShowTable变为false
      this.isShowTable = false;
      //将选中的属性值赋给attrInfo(完全深拷贝)
      this.attrInfo = cloneDeep(row);
      //在修改某一个属性的时候，将相应的属性值元素添加上flag这个标记
      this.attrInfo.attrValueList.forEach((item) => {
        //Vue无法探测普通的新增属性,没办法直接添加响应式数据 必须用Vue.$set
        this.$set(item, "flag", false);
      });
    },
    toLook(row) {
      //编辑模式转为查看模式
      //属性值为空提示
      if (row.valueName.trim() == "") {
        this.$message("请您输入正常的属性值");
        return;
      }
      //属性值重复提示
      let isRepeat = this.attrInfo.attrValueList.some((item) => {
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });
      if (isRepeat) {
        this.$message("输入的属性值存在重复");
        return;
      }
      row.flag = false;
    },
    //点击span的回调 变为编辑模式
    toEdit(row, index) {
      row.flag = true;
      //获取input节点，实现自动聚焦
      //需要注意，点击span的时候，切换input为编辑模式，但是需要注意的是，对于浏览器而言，页面的重绘与重排是需要时间的
      //点击span的时候，无法第一时间获取到input
      //需要使用$nextTick，当节点渲染完毕，会执行一次
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    //气泡确认框确定按钮的回调
    deleteAttrValue(index){
      //此操作不发请求
      this.attrInfo.attrValueList.splice(index,1);
    },
    //添加或保存属性
    async addOrUpdateAttr(){
      //整理参数 1.空属性值不应该提交给服务器   2.提交给服务器数据时不应该包含flag字段
      this.attrInfo.attrValueList=this.attrInfo.attrValueList.filter(item=>{
        //筛选出不为空的属性值
        if(item.valueName!=""){
          //去掉flag
          delete item.flag;
          return true;
        }
      })
      try{
        //发请求
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        this.isShowTable=true;
        this.$message({type:'success',message:'保存成功'});
        //再次发请求获取平台属性进行展示
        this.getAttrList();
      }catch(error){
        this.$message('保存失败');
      }
      
    }
  },
};
</script>

<style></style>
