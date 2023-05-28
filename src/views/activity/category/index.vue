<template>
  <div>
    
    <el-card style="margin: 20px">
      <center>
        <CategorySelect
          :fatherAttrData="fatherAttrData"
          ref="categorySelect"
          @changeScene="changeScene"
        ></CategorySelect>
      </center>
    </el-card>
    <el-card style="margin: 20px">
      <Scene0 v-show="scene == 0" :fatherAttrData="fatherAttrData"></Scene0>
      <Scene1 v-show="scene == 1" @changeScene="changeScene" @getChildrenAttr2="getChildrenAttr"></Scene1>
      <Scene2 v-show="scene == 2" :fatherAttrData="fatherAttrData" :levelAttrData="levelAttrData" :categoryAttrData="categoryAttrData" :organizationAttrData="organizationAttrData"></Scene2>
    </el-card>
  </div>
</template>

<script>
import Scene0 from "@/views/activity/category/Scene0";
import Scene1 from "@/views/activity/category/Scene1";
import Scene2 from "@/views/activity/category/Scene2";
export default {
  name: "category",
  data() {
    return {
      scene: 0,
      fatherAttrData: [],
      categoryAttrData:{},
      levelAttrData:{},
      organizationAttrData:{},
    };
  },
  components: {
    Scene0,
    Scene1,
    Scene2,
  },
  mounted() {
    this.getFatherAttr();
    this.getChildrenAttr();
  },
  methods: {
    async getFatherAttr() {
      let result = await this.$API.category.reqGetFatherAttr();
      if (result.code == 200) {
        this.fatherAttrData = result.data;
        this.$nextTick(() => {
          this.$refs.categorySelect.getFatherAttr(this.fatherAttrData);
        });
      }
    },
    async getChildrenAttr(){
      const result1=await this.$API.category.reqGetLevelAttr();
      if(result1.code==200){
        this.levelAttrData=result1.data;
      }
      const result2=await this.$API.category.reqGetCategoryAttr();
      if(result2.code==200){
        this.categoryAttrData=result2.data;
      }
      const result3=await this.$API.category.reqGetOfAttr();
      if(result3.code==200){
        this.organizationAttrData=result3.data;
      }
      this.$refs.categorySelect.getChildrenAttr(this.levelAttrData,this.categoryAttrData,this.organizationAttrData);
    },
    //切换场景
    changeScene(scene){
      this.scene=scene;
    }
    
  },
};
</script>

<style scoped></style>
