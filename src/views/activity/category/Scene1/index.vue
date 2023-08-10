<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin-bottom: 10px"
      @click="showDialog"
      >添加子属性</el-button
    >
    <el-table style="width: 100%" border :data="childrenAttrData">
      <el-table-column label="id" prop="id" width="width"></el-table-column>
      <el-table-column
        label="子属性名"
        prop="value"
        width="width"
      ></el-table-column>
      <el-table-column label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            icon="el-icon-edit"
            type="warning"
            size="mini"
            title="编辑子属性"
            @click="updateChildrenAttr(row)"
          ></el-button>
          <el-popconfirm
            :title="`确定删除${row.value}吗？`"
            style="margin-left: 10px"
            @onConfirm="deleteCategory(row)"
          >
            <el-button
              icon="el-icon-delete"
              type="danger"
              size="mini"
              title="删除子属性"
              slot="reference"
            ></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="childrenAttrForm.id ? '修改子属性' : '添加子属性'"
      :visible.sync="dialogFormVisible"
    >
      <el-form style="width: 60%" :model="childrenAttrForm">
        <el-form-item label="子属性id" label-width="100px" prop="id">
          {{ childrenAttrForm.id }}
        </el-form-item>
        <el-form-item label="子属性名" label-width="100px" prop="value">
          <el-input
            autocomplete="off"
            v-model="childrenAttrForm.value"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateChildrenAttr"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {
  name: "Scene1",
  data() {
    return {
      fatherAttrId: "",
      dialogFormVisible: false,
      childrenAttrForm: {
        id: "",
        value: "",
      },
    };
  },
  computed:{
    ...mapState('category',['childrenAttrData']),
  },
  methods: {
    getChildrenAttr(fatherAttrId) {
      this.$store.dispatch("category/getChildrenAttr",fatherAttrId);
    },
    //添加按钮的回调
    showDialog() {
      this.dialogFormVisible = true;
      this.childrenAttrForm = {
        id: "",
        value: "",
      };
    },
    //编辑按钮的回调
    updateChildrenAttr(row) {
      //显示对话框
      this.dialogFormVisible = true;
      //将已有的品牌信息赋值给tradeMarkForm进行展示（不完全深拷贝）
      this.childrenAttrForm = { ...row };
    },
    deleteCategory(row) {
      let data = {
        fatherAttrId: this.fatherAttrId,
        id: row.id,
      };
      let result = this.$store.dispatch("category/deleteChildrenAttr", data);
      result
        .then(() => {
          this.$message({ type: "success", message: "删除成功" });
          this.getChildrenAttr(this.fatherAttrId);
        })
        .catch((error) => {
          this.$message({ type: "error", message: "删除失败" });
        });
    },
    //添加或修改子属性
    addOrUpdateChildrenAttr() {
      this.dialogFormVisible = false;
      let children = {
        childrenAttrForm: this.childrenAttrForm,
        fatherAttrId: this.fatherAttrId,
      };
      let result = this.$store.dispatch(
        "category/addOrUpdateChildrenAttr",
        children
      );
      result.then(() => {
          this.$message({
            message: this.childrenAttrForm.id
              ? "修改子属性成功"
              : "添加子属性成功",
            type: "success",
          });
          this.getChildrenAttr(this.fatherAttrId);
        })
        .catch((error) => {
          this.$message({
            type: "error",
            message: this.childrenAttrForm.id
              ? "修改子属性失败"
              : "添加子属性失败",
          });
        });
    },
  },
  mounted() {
      this.$bus.$on("getFatherAttrId",(data1)=>{
        this.fatherAttrId=data1;
      });
    },
    beforeDestroy() {
      this.$bus.$off("getFatherAttrId");
    },
   
    watch:{
      fatherAttrId:{
        handler(newValue,oldValue){
          this.getChildrenAttr(newValue);
        }
      }
    }
};
</script>

<style scoped></style>
