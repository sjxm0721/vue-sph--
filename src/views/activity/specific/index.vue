<template>
  <div>
    <div class="specific">
      <div class="search-time">
        <el-date-picker
          v-model="value"
          type="datetimerange"
          :picker-options="pickerOptions"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          value-format="yyyy-MM-dd"
          range-separator="-"
          @change="changeTime"
        >
        </el-date-picker>
      </div>
      <div class="search-content">
        <el-input
          placeholder="请输入内容"
          v-model="contentInput"
          class="input-with-select"
        >
          <el-select v-model="select" slot="prepend" placeholder="请选择">
            <el-option label="活动ID" value="activityId"></el-option>
            <el-option label="活动名" value="activityName"></el-option>
            <el-option label="URL" value="url"></el-option>
          </el-select>
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="changeInput"
          ></el-button>
        </el-input>
      </div>
    </div>
    <div>
      <el-card style="margin-top: 30px">
        <el-table style="width: 100%" border :data="newTotalActivity">
          <el-table-column
            label="id"
            prop="activityId"
            width="80"
            align="center"
          >
          </el-table-column>
          <el-table-column label="活动名" prop="activityName" width="width">
          </el-table-column>
          <el-table-column label="活动开始时间" prop="startTime" width="width">
          </el-table-column>
          <el-table-column label="活动地点" prop="location" width="width">
          </el-table-column>
          <el-table-column label="操作" width="240">
            <template slot-scope="{ row, $index }">
              <el-button
                size="mini"
                title="前往url"
                icon="el-icon-share"
                type="success"
                @click="toUrl(row.url)"
              ></el-button>
              <el-button
                size="mini"
                title="查看详情"
                icon="el-icon-info"
                type="info"
                @click="activityInfo(row)"
              ></el-button>
              <el-button
                size="mini"
                title="修改活动信息"
                icon="el-icon-edit"
                type="warning"
                @click="editActivity(row)"
              ></el-button>
              <el-popconfirm
                title="确定删除吗？"
                 @onConfirm="deleteActivity(row)"
                 style="padding-left:10px;"
              >
              <el-button
                size="mini"
                title="删除活动"
                icon="el-icon-delete"
                type="danger"
                slot="reference"
              ></el-button>
              </el-popconfirm>
              
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev,pager,next,jumper,->,sizes,total"
          :total="total"
        >
        </el-pagination>
      </el-card>
      <el-drawer
        title="活动详情"
        :visible.sync="drawer"
        :show-close="false"
        direction="rtl"
        :before-close="closeDrawer"
      >
      <el-row style="margin:20px;">
          <el-col :span="10">活动id:</el-col>
          <el-col :span="14">{{ activityChosed.activityId }}</el-col>
        </el-row>
        <el-row style="margin:20px;">
          <el-col :span="10">活动名称:</el-col>
          <el-col :span="14">{{ activityChosed.activityName }}</el-col>
        </el-row>
        <el-row style="margin:20px;">
          <el-col :span="10">活动地点:</el-col></el-col>
          <el-col :span="14">{{ activityChosed.location }}</el-col>
        </el-row>
        <el-row style="margin:20px;">
          <el-col :span="10">活动时间:</el-col>
          <el-col :span="14">{{ activityChosed.startTime }}</el-col>
        </el-row>
        <el-row style="margin:20px;" v-show="activityChosed.value1">
          <el-col :span="10">organizationForm:</el-col>
          <el-col :span="14">
            <el-tag
              type="success"
              style="margin-right: 10px; margin-bottom: 10px"
              >{{ activityChosed.value1 }}</el-tag
            >
          </el-col>
        </el-row>
        <el-row style="margin:20px;" v-show="activityChosed.value2">
          <el-col :span="10">level:</el-col>
          <el-col :span="14">
            <el-tag
              type="success"
              style="margin-right: 10px; margin-bottom: 10px"
              >{{ activityChosed.value2 }}</el-tag
            >
          </el-col>
        </el-row>
        <el-row style="margin:20px;" v-show="activityChosed.value3">
          <el-col :span="10">category:</el-col>
          <el-col :span="14">
            <el-tag
              type="success"
              style="margin-right: 10px; margin-bottom: 10px"
              >{{ activityChosed.value3 }}</el-tag
            >
          </el-col>
        </el-row>
        <el-row style="margin:20px;">
          <el-col :span="10">点赞数:</el-col>
          <el-col :span="14">{{ activityChosed.likeNum }}</el-col>
        </el-row>
        <el-row style="margin:20px;">
          <el-col :span="10">收藏数:</el-col>
          <el-col :span="14">{{ activityChosed.collectNum }}</el-col>
        </el-row>
      </el-drawer>
      <el-dialog title="修改活动信息" :visible.sync="dialogFormVisible" :show-close="false">
        <el-form  label-width="150px" :model="activityChosed">
        <el-form-item label="活动名称">
          <el-input
            placeholder="请输入活动名称"
            v-model="activityChosed.activityName"
          ></el-input>
        </el-form-item>
        <el-form-item label="活动开始时间">
          <el-date-picker
            v-model="activityChosed.startTime"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            range-separator="-"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动地点">
          <el-input
            v-model="activityChosed.location"
            placeholder="请输入活动地点"
          ></el-input>
        </el-form-item>
        <el-form-item label="活动url">
          <el-input
            v-model="activityChosed.url"
            placeholder="请输入url"
            type="textarea"
            rows="4"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="organizationForm">
          <el-select placeholder="请选择" clearable v-model="activityChosed.id">
            <el-option v-for="(organizationAttr,index) in organizationAttrLeft" :key="organizationAttr.id" :value="organizationAttr.id" :label="organizationAttr.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="level">
          <el-select placeholder="请选择" clearable v-model="activityChosed.id1">
            <el-option v-for="(levelAttr,index) in levelAttrLeft" :key="levelAttr.id" :value="levelAttr.id" :label="levelAttr.value"></el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="category">
          <el-select placeholder="请选择" clearable v-model="activityChosed.id2">
            <el-option v-for="(categoryAttr,index) in categoryAttrLeft" :key="categoryAttr.id" :value="categoryAttr.id" :label="categoryAttr.value"></el-option>
          </el-select>
        </el-form-item>
        </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="cancel">取 消</el-button>
    <el-button type="primary" @click="updateActivity">确 定</el-button>
  </div>
</el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "specific",
  data() {
    return {
      //日期表数据
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      value: [], //时间数组

      //剩下的子属性
      categoryAttrLeft:[],
      levelAttrLeft:[],
      organizationAttrLeft:[],


      contentInput: "", //用户查询输入内容
      select: "activityId", //用户的选择
      page: 1, //当前页
      limit: 3, //每页数据的条数
      total: 0, //数据总条数
      newTotalActivity: [],
      drawer: false, //抽屉的显示与隐藏
      activityChosed:{},//选中的活动
      dialogFormVisible:false,//控制dialog的显示与隐藏
      form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
    };
  },
  mounted() {
    this.getTotalActivity();
    this.getTotalChildrenAttr();
    console.log(this.totalActivity);
  },
  methods: {
    getTotalChildrenAttr(){
      let promise1=this.$store.dispatch('category/getLevelAttrData');
      let promise2=this.$store.dispatch('category/getOrganizationAttrData');
      let promise3=this.$store.dispatch('category/getCategoryAttrData');
      Promise.all([promise1,promise2,promise3]).then(()=>{
        // this.$message({type:'success',message:'获取子属性列表成功'});
      }).catch(()=>{
        this.$message({type:'error',message:'获取子属性列表失败'});
      })
    },
    toUrl(url) {
      window.location.href = url;
    },
    getTotalActivity() {
      this.$store.dispatch("specific/getTotalActivity");
    },
    chooseTotalActivity() {
      let chooseContent = {};
      if (this.value != null) {
        chooseContent = {
          startTime: this.value[0],
          endTime: this.value[1],
          select: this.select,
          contentInput: this.contentInput,
        };
      } else {
        chooseContent = {
          startTime: "",
          endTime: "",
          select: this.select,
          contentInput: this.contentInput,
        };
      }
      this.$store.dispatch("specific/chooseTotalActivity", chooseContent);
      this.page=1;
    },
    //当前页数改变的回调
    handlePageChange(page) {
      this.page = page;
    },
    //当前limit改变的回调
    handleSizeChange(limit) {
      this.limit = limit;
    },
    //输入改变的回调
    changeInput() {
      this.page = 1;
      this.chooseTotalActivity();
    },
    changeTime() {
      if (this.value == []) {
        this.page = 1;
        this.chooseTotalActivity();
      }
    },
    activityInfo(row) {
      this.activityChosed=row;
      this.drawer = true;
    },
    //删除活动按钮的回调
    deleteActivity(row){
       let result = this.$store.dispatch('specific/deleteActivity',row.activityId);
       result.then(()=>{
        this.$message({type:'success',message:'删除成功'});
        if(this.newTotalActivity.length==1){
            this.getTotalActivity();
            this.page=this.page-1;
        }
        else{
            this.getTotalActivity();
        }
      }).catch(()=>{
        this.$message({type:'success',message:'删除失败'});
      })
      },
      //修改活动按钮的回调
      editActivity(row){
        this.activityChosed=row;
        this.dialogFormVisible=true;
      },
      updateActivity(){
        this.dialogFormVisible=false;
        let newActivity={
          activityId:this.activityChosed.activityId,
          activityName:this.activityChosed.activityName,
          location:this.activityChosed.location,
          startTime:this.activityChosed.startTime,
          url:this.activityChosed.url,
          fatherAttrList:[]
        };
        if(this.activityChosed.id!=1)
        {
          newActivity.fatherAttrList.push({
          fiedId:"1",
          fieldValue:'organizationForm',
          childrenAttrData:this.organizationAttrData,
          childrenAttrValue:this.activityChosed.id,
        });
        }
        if(this.activityChosed.id1!=1)
        {
          newActivity.fatherAttrList.push({
          fiedId:"2",
          fieldValue:'level',
          childrenAttrData:this.levelAttrData,
          childrenAttrValue:this.activityChosed.id1,
        });
        }
        if(this.activityChosed.id2!=1){
          newActivity.fatherAttrList.push({
          fiedId:"3",
          fieldValue:'category',
          childrenAttrData:this.categoryAttrData,
          childrenAttrValue:this.activityChosed.id2,
        });
        }
        let result = this.$store.dispatch('specific/addOrUpdateActivity',newActivity);
        result.then(()=>{
          this.$message({type:"success",message:"修改活动成功"});
          this.activityChosed={
          activityId:"",
          activityName:"",
          id:"",
          id1:"",
          id2:"",
          location:"",
          startTime:"",
          url:"",
          value1:"",
          value2:"",
          value3:""
        }
          this.getTotalActivity();
        }).catch(()=>{
          this.activityChosed={
          activityId:"",
          activityName:"",
          id:"",
          id1:"",
          id2:"",
          location:"",
          startTime:"",
          url:"",
          value1:"",
          value2:"",
          value3:""
        }
          this.$message({type:"error",message:"修改活动失败"});
        })
      },
      closeDrawer(done){
        this.activityChosed={
          activityId:"",
          activityName:"",
          id:"",
          id1:"",
          id2:"",
          location:"",
          startTime:"",
          url:"",
          value1:"",
          value2:"",
          value3:""
        }
        done();
      },
      cancel(){
        this.activityChosed={
          activityId:"",
          activityName:"",
          id:"",
          id1:"",
          id2:"",
          location:"",
          startTime:"",
          url:"",
          value1:"",
          value2:"",
          value3:""
        }
        this.dialogFormVisible = false
      }
  },
  computed: {
    ...mapState("specific", ["totalActivity"]),
    ...mapState("category",["categoryAttrData","levelAttrData","organizationAttrData"]),
  },
  watch: {
    totalActivity: {
      deep: true,
      handler(newValue, oldValue) {
        this.total = newValue.length;
        this.newTotalActivity = this.totalActivity.slice(
          this.limit * (this.page - 1),
          this.limit * (this.page - 1) + this.limit
        );
      },
    },
    'activityChosed.id':{
      deep:true,
      handler(newValue,oldValue){
        this.organizationAttrLeft=this.organizationAttrData.filter(item=>
        item.id!=newValue
      )
      }
    },
    'activityChosed.id1':{
      deep:true,
      handler(newValue,oldValue){
        this.levelAttrLeft=this.levelAttrData.filter(item=>
        item.id!=newValue
      )
      }
    },
    'activityChosed.id2':{
      deep:true,
      handler(newValue,oldValue){
        this.categoryAttrLeft=this.categoryAttrData.filter(item=>
        item.id!=newValue
      )
      }
    },
    value: {
      deep: true,
      handler(newValue, oldValue) {
        this.chooseTotalActivity();
      },
    },
    page(newValue, oldValue) {
      this.newTotalActivity = this.totalActivity.slice(
        this.limit * (this.page - 1),
        this.limit * (this.page - 1) + this.limit
      );
    },
    limit(newValue, oldValue) {
      if (this.page == 1) {
        this.newTotalActivity = this.totalActivity.slice(
          this.limit * (this.page - 1),
          this.limit * (this.page - 1) + this.limit
        );
      } else {
        this.page = 1;
      }
    },
  },
};
</script>

<style scoped>
.specific {
  margin: 20px;
  display: flex;
  justify-content: space-between;
}
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
