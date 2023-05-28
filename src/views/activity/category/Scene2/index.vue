<template>
  <div>
    <div v-show="scene == 0">
      <el-button
        type="primary"
        icon="el-icon-plus"
        style="margin-bottom: 10px"
        @click="addActivity"
        >添加活动</el-button
      >
      <el-table style="width: 100%" border :data="activityData">
        <el-table-column
          label="id"
          prop="activityId"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column
          label="活动名"
          prop="activityName"
          width="width"
        ></el-table-column>
        <el-table-column
          label="活动开始时间"
          prop="startTime"
          width="width"
        ></el-table-column>
        <el-table-column
          label="活动地点"
          prop="location"
          width="width"
        ></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="{ row, $index }">
            <el-button
              type="success"
              icon="el-icon-share"
              size="mini"
              title="查看网页"
              @click="toUrl(row.url)"
            ></el-button>
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              title="编辑活动"
              @click="editActivity(row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              title="删除活动"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          @current-change="getActivityList"
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
    <div v-show="scene == 1">
      <el-form ref="form" label-width="120px" :model="activity">
        <el-form-item label="活动名称">
          <el-input
            placeholder="请输入活动名称"
            v-model="activity.activityName"
          ></el-input>
        </el-form-item>
        <el-form-item label="活动开始时间">
          <el-date-picker
            v-model="activity.startTime"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动地点">
          <el-input
            v-model="activity.location"
            placeholder="请输入活动地点"
          ></el-input>
        </el-form-item>
        <el-form-item label="活动url">
          <el-input
            v-model="activity.url"
            placeholder="请输入url"
            type="textarea"
            rows="4"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="添加属性">
          <el-select
            :placeholder="`还有${unSelectFatherAttr.length}项未选择`"
            v-model="attrValue"
          >
            <el-option
              :label="unselect.fieldValue"
              :value="`${unselect.fieldId}:${unselect.fieldValue}`"
              v-for="(unselect, index) in unSelectFatherAttr"
              :key="unselect.fieldValue"
            ></el-option>
          </el-select>
          <el-button
            type="primary"
            icon="el-icon-plus"
            style="margin-left: 10px"
            @click="addFatherAttr"
            >添加父属性</el-button
          >
          <el-table width="100%" border :data="activity.fatherAttrList">
            <el-table-column
              label="序号"
              type="index"
              align="center"
              width="80"
            ></el-table-column>
            <el-table-column
              label="父属性名"
              prop="fieldValue"
              width="width"
            ></el-table-column>
            <el-table-column label="子属性名" width="width">
              <template slot-scope="{ row, $index }">
                <el-select v-model="row.childrenAttrValue" clearable placeholder="请选择">
                  <el-option
                    v-for="(childrenAttr,index) in row.childrenAttrData"
                    :key="childrenAttr.id"
                    :label="childrenAttr.value"
                    :value="childrenAttr.id"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="width">
              <template slot-scope="{ row, $index }">
                <el-button icon="el-icon-delete" type="danger" @click="activity.fatherAttrList.splice($index,1)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
        <el-button type="primary" @click="addOrUpdateAttr">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Scene2",
  data() {
    return {
      activityData: [],
      activity: {
        activityName: "",
        startTime: "",
        location: "",
        url:"",
        fatherAttrList: [], //父属性列表
      },
      scene: 0,
      attrValue: "", //收集未选择的属性
      page:1,//当前页数,
      total:3,//总数据条数,
      limit:3,//每页展示数据条数
      fatherAttrId:"",//父属性id
      childrenAttrId:""//子属性id
    };
  },
  props: [
    "fatherAttrData",
    "levelAttrData",
    "organizationAttrData",
    "categoryAttrData",
  ],
  computed: {
    
    unSelectFatherAttr() {
      let result = this.fatherAttrData.filter((item) => {
        return this.activity.fatherAttrList.every((item1) => {
          return item.fieldValue != item1.fieldValue;
        });
      });
      return result;
    },
    
  },
  methods: {
    //获取活动数据
    async getActivityList(page=1){
      this.page = page;
      const { limit,fatherAttrId,childrenAttrId} = this;
      const result=await this.$API.specific.reqActivityList(fatherAttrId,childrenAttrId,page,limit);
      if(result.code==200){
        this.activityData=result.data.activityList;
        this.total=parseInt(result.data.totalNum);
      }
    },
    //改变每页展示数据条数的回调
    handleSizeChange(limit){
      //修改参数
      this.limit = limit;
      //再发请求
      this.getActivityList();
    },
    toUrl(url) {
      window.location.href = url;
    },
    //添加活动按钮回调
    addActivity() {
      this.scene = 1;
      this.$bus.$emit('changeCsShow',false);
    },
    //编辑活动按钮回调
    editActivity(row) {
      this.activity.activityName=row.activityName;
      this.activity.location=row.location;
      this.activity.startTime=row.startTime;
      this.activity.url=row.url;
      if(row.id){
        this.activity.fatherAttrList.push({fieldId:"1",fieldValue:"organizationForm",childrenAttrValue:row.id,childrenAttrData:this.organizationAttrData['childrenValue']});
      }
      if(row.id1){
        this.activity.fatherAttrList.push({fieldId:"2",fieldValue:"level",childrenAttrValue:row.id,childrenAttrData:this.levelAttrData['childrenValue']});
      }
      if(row.id2){
        this.activity.fatherAttrList.push({fieldId:"3",fieldValue:"category",childrenAttrValue:row.id,childrenAttrData:this.categoryAttrData['childrenValue']});
      }
      this.scene = 1;
      this.$bus.$emit('changeCsShow',false);
    },
    addFatherAttr() {
      //分割收集到的父属性数据
      const [fieldId, fieldValue] = this.attrValue.split(":");
      let childrenAttrData=[];
      if(fieldId==0){
        childrenAttrData=this.organizationAttrData['childrenValue'];
      }
      else if(fieldId==1){
        childrenAttrData=this.levelAttrData['childrenValue'];
      }
      else{
        childrenAttrData=this.categoryAttrData['childrenValue'];
      }
      let newFatherAttr = { fieldId, fieldValue,childrenAttrData,childrenAttrValue: "" };
      //添加新的销售属性
      this.activity.fatherAttrList.push(newFatherAttr);
      //清空数据
      this.attrValue = "";
    },
    //保存按钮的回调
    addOrUpdateAttr(){
      this.scene=0;
      this.$bus.$emit('changeCsShow',true);
    },
    //取消按钮的回调
    cancel(){
      this.scene=0;
      this.$bus.$emit('changeCsShow',true);
      //清除数据
      let activity = {
        activityName: "",
        startTime: "",
        location: "",
        url:"",
        fatherAttrList: [], //父属性列表
      };
      this.activity=activity;
    }
  },
  mounted(){
        this.getActivityList();
        this.$bus.$on("getAttrInfo",(data1,data2)=>{
          this.fatherAttrId=data1;
          this.childrenAttrId=data2;
        });
      },
  beforeDestroy(){
        this.$bus.$off("getAttrInfo");
 },
 watch:{
  childrenAttrId(newValue,oldValue){
    this.getActivityList();
  },
 }
};
</script>

<style scoped></style>
