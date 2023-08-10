<!-- 种类选择标签的全局组件 -->
<template>
  <div>
    <!-- inline代表行内表单（一行可以放置多个表单元素） -->
    <el-form
      :inline="true"
      class="demo-form-inline"
      :model="cForm"
      size="medium"
    >
      <el-form-item label="一级分类" style="margin-right: 50px">
        <el-select
          placeholder="请选择"
          v-model="cForm.fatherAttrId"
          @change="handler1"
          :disabled="!show"
        >
          <el-option
            :label="fatherAttr.fieldValue"
            :value="fatherAttr.fieldId"
            v-for="(fatherAttr, index) in fatherAttrData"
            :key="fatherAttr.fieldId"
          ></el-option>
        </el-select> </el-form-item
      >
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.childrenAttrId"
          @change="handler2"
          :disabled="!cForm.fatherAttrId||!show"
        >
          <el-option
            :label="childrenAttr.value"
            :value="childrenAttr.id"
            v-for="(childrenAttr, index) in childrenAttrData"
            :key="childrenAttr.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: "CategorySelect",
  data() {
    return {
      cForm: {
        fatherAttrId: "",
        childrenAttrId: "",
      },
      show:true, //控制cs的显示与隐藏
    };
  },
  computed:{
    ...mapState("category",["fatherAttrData","childrenAttrData"]),
  },
  mounted() {
    this.show=true;
    this.getFatherAttr();
    this.$bus.$on("changeCsShow",(show)=>{
          this.show=show;
        });



  },
  beforeDestroy(){
        this.$bus.$off("changeCsShow");
  },
  methods: {
    getFatherAttr(){
      this.$store.dispatch('category/getFatherAttr');
    },
    getChildrenAttr(fatherAttrId){
    this.$store.dispatch('category/getChildrenAttr',fatherAttrId);
    },
    handler1() {
      //清除数据
      this.cForm.childrenAttrId = "";
      this.getChildrenAttr(this.cForm.fatherAttrId);
      //进入场景1
      this.$emit('changeScene',1);
    },
   
    //二级分类事件回调
    handler2() {
      //给Scene2提供数据
      //进入场景2
      this.$emit("changeScene", 2);
    },

  },
  watch:{
      'cForm.fatherAttrId':{
        immediate:true,
        deep:true,
        handler(newValue,oldValue){
          this.$bus.$emit("getFatherAttrId",this.cForm.fatherAttrId);
        },
    },
    'cForm.childrenAttrId':{
      deep:true,
      immediate:true,
      handler(newValue,oldValue){
      this.$bus.$emit('getAttrInfo',this.cForm.fatherAttrId,this.cForm.childrenAttrId);
      }
    }
  }
};
</script>
<style scoped></style>
