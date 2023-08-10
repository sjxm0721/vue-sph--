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
      <el-table style="width: 100%" border :data="newActivityData">
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
            <el-popconfirm
              @onConfirm="deleteActivity(row)"
              :title="`确定删除活动${row.activityId}吗？`"
              style="margin-left: 10px"
              >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除活动"
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
            value-format="yyyy-MM-dd"
            range-separator="-"
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
            :disabled="!attrValue"
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
                <el-select
                  v-model="row.childrenAttrValue"
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(childrenAttr, index) in row.childrenAttrData"
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
                <el-button
                  icon="el-icon-delete"
                  type="danger"
                  @click="activity.fatherAttrList.splice($index, 1)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addOrUpdateActivity"
            >保存</el-button
          >
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Scene2",
  data() {
    return {
      newActivityData: [],
      activity: {
        activityId: "",
        activityName: "",
        startTime: "",
        location: "",
        url: "",
        fatherAttrList: [], //父属性列表
      },
      scene: 0,
      attrValue: "", //收集未选择的属性
      page: 1, //当前页数,
      total: 3, //总数据条数,
      limit: 3, //每页展示数据条数
      fatherAttrId: "", //父属性id
      childrenAttrId: "", //子属性id
    };
  },
  computed: {
    ...mapState("specific", ["activityData"]),
    ...mapState("category", [
      "fatherAttrData",
      "organizationAttrData",
      "levelAttrData",
      "categoryAttrData",
    ]),
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
    getActivityList(fatherAttrId, childrenAttrId, page) {
      let data = {
        fatherAttrId: fatherAttrId,
        childrenAttrId: childrenAttrId,
      };
      this.$store.dispatch("specific/getActivityList", data);
      this.page = page;
    },
    handlePageChange(page) {
      this.page = page;
    },
    //改变每页展示数据条数的回调
    handleSizeChange(limit) {
      //修改参数
      this.limit = limit;
    },
    toUrl(url) {
      window.location.href = url;
    },
    //添加活动按钮回调
    addActivity() {
      this.scene = 1;
      this.$bus.$emit("changeCsShow", false);
    },
    //编辑活动按钮回调
    editActivity(row) {
      this.activity.activityId = row.activityId;
      this.activity.activityName = row.activityName;
      this.activity.location = row.location;
      this.activity.startTime = row.startTime;
      this.activity.url = row.url;
      if (row.id != "0") {
        this.activity.fatherAttrList.push({
          fieldId: "1",
          fieldValue: "organizationForm",
          childrenAttrValue: row.id,
          childrenAttrData: this.organizationAttrData,
        });
      }
      if (row.id1 != "0") {
        this.activity.fatherAttrList.push({
          fieldId: "2",
          fieldValue: "level",
          childrenAttrValue: row.id1,
          childrenAttrData: this.levelAttrData,
        });
      }
      if (row.id2 != "0") {
        this.activity.fatherAttrList.push({
          fieldId: "3",
          fieldValue: "category",
          childrenAttrValue: row.id2,
          childrenAttrData: this.categoryAttrData,
        });
      }
      this.scene = 1;
      this.$bus.$emit("changeCsShow", false);
    },
    addFatherAttr() {
      //分割收集到的父属性数据
      const [fieldId, fieldValue] = this.attrValue.split(":");
      let childrenAttrData = [];
      if (fieldId == 1) {
        childrenAttrData = this.organizationAttrData;
      } else if (fieldId == 2) {
        childrenAttrData = this.levelAttrData;
      } else {
        childrenAttrData = this.categoryAttrData;
      }
      let newFatherAttr = {
        fieldId,
        fieldValue,
        childrenAttrData,
        childrenAttrValue: "",
      };
      //添加新的销售属性
      this.activity.fatherAttrList.push(newFatherAttr);
      //清空数据
      this.attrValue = "";
    },
    //保存按钮的回调
    addOrUpdateActivity() {
      let result = this.$store.dispatch(
        "specific/addOrUpdateActivity",
        this.activity
      );
      result
        .then(() => {
          this.$message({
            message: this.activity.activityId ? "修改活动成功" : "添加活动成功",
            type: "success",
          });
          if (this.activity.activityId) {
            this.getActivityList(
              this.fatherAttrId,
              this.childrenAttrId,
              this.page
            );
          } else {
            this.getActivityList(this.fatherAttrId, this.childrenAttrId, 1);
          }
          //清除数据
          let activity = {
            activityName: "",
            startTime: "",
            location: "",
            url: "",
            fatherAttrList: [], //父属性列表
          };
          this.activity = activity;
        })
        .catch(() => {
          this.$message({
            message: this.activity.activityId ? "修改活动失败" : "添加活动失败",
            type: "error",
          });
        });
      this.scene = 0;
      this.$bus.$emit("changeCsShow", true);
    },
    //取消按钮的回调
    cancel() {
      this.scene = 0;
      this.$bus.$emit("changeCsShow", true);
      //清除数据
      let activity = {
        activityName: "",
        startTime: "",
        location: "",
        url: "",
        fatherAttrList: [], //父属性列表
      };
      this.activity = activity;
    },
    //删除活动按钮的回调
    deleteActivity(activity) {
      let result=this.$store.dispatch('specific/deleteActivity',activity.activityId);
      result.then(()=>{
        this.$message({type:'success',message:'删除成功'});
        if(this.newActivityData.length==1){
          this.getActivityList(this.fatherAttrId,this.childrenAttrId,this.page-1);
        }
        else{
          this.getActivityList(this.fatherAttrId,this.childrenAttrId,this.page);
        }
      }).catch(()=>{
        this.$message({type:'success',message:'删除失败'});
      })
    },
  },
  mounted() {
    this.scene = 0;
    this.$store.dispatch("category/getLevelAttrData");
    this.$store.dispatch("category/getCategoryAttrData");
    this.$store.dispatch("category/getOrganizationAttrData");
    this.$bus.$on("getAttrInfo", (data1, data2) => {
      this.fatherAttrId = data1;
      this.childrenAttrId = data2;
    });
  },
  beforeDestroy() {
    this.$bus.$off("getAttrInfo");
  },
  watch: {
    childrenAttrId(newValue, oldValue) {
      this.getActivityList(this.fatherAttrId, this.childrenAttrId, 1);
    },
    activityData: {
      deep: true,
      handler(newValue, oldValue) {
        this.total = newValue.length;
        this.newActivityData = this.activityData.slice(
          this.limit * (this.page - 1),
          this.limit * (this.page - 1) + this.limit
        );
      },
    },
    page(newValue, oldValue) {
      this.newActivityData = this.activityData.slice(
        this.limit * (this.page - 1),
        this.limit * (this.page - 1) + this.limit
      );
    },
    limit(newValue, oldValue) {
      if (this.page == 1) {
        this.newActivityData = this.activityData.slice(
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

<style scoped></style>
