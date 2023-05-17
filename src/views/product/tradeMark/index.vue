<template>
  <div>
    <!-- 按钮组件 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0px"
      @click="showDialog"
      >添加</el-button
    >
    <!-- 表格组件
            data:表格组件将来需要展示的数据 --- 数组类型
            border:给表格添加边框
            column属性
            label:显示标题
            width:对应列的宽度
            prop:对应列内容的字段名
            align:标题的对齐方式
      -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column
        type="index"
        label="序号"
        width="80px"
        align="center"
      ></el-table-column>
      <el-table-column prop="tmName" label="品牌名称"></el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updataTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器
           当前第几页、数据总条数、每一页展示条数、每一页展示条数（可选）、连续页码数（默认5）
           @size-change="handleSizeChange"
           @current-change="handleCurrentChange"
      -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[3, 5, 10]"
      @current-change="getPageList"
      @size-change="handleSizeChange"
      layout="prev,pager,next,jumper,->,sizes,total"
    >
    </el-pagination>
    <!-- 对话框
         ：visible.sync  控制对话框的显示与隐藏
         Form组件提供了表单验证的功能，只需要通过rules属性传入约定的验证规则，并将Form-item的prop属性设置为需要检验的字段名即可
    -->
    <el-dialog
      :title="tradeMarkForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        style="width: 80%"
        :model="tradeMarkForm"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input
            autocomplete="off"
            v-model="tradeMarkForm.tmName"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="tradeMarkForm.logoUrl"
              :src="tradeMarkForm.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    //自定义校验规则
    var validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error("品牌名称为2~10位"));
      } else {
        callback();
      }
    };
    return {
      //当前页数
      page: 1,
      //每页展示的条数
      limit: 3,
      //总共数据条数
      total: 0,
      //列表显示的数据
      list: [],
      //对话框显示与隐藏控制的属性
      dialogFormVisible: false,
      // 上传图片的属性
      //收集品牌信息
      tradeMarkForm: {
        tmName: "",
        logoUrl: "",
      },
      //表单验证的规则
      rules: {
        //品牌名称的验证规则
        //required:必须要校验的字段（前面的五角星） message 提示信息   trigger:用户行为设置（事件的设置：blur、change）
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          //min:文本最小长度  max:文本最大长度
          //{ min: 2, max: 10, message: "长度为2到10个字符", trigger: "change" },
          //自定义校验规则
          { validator: validateTmName, trigger: "change" },
        ],
        //品牌logo的验证规则
        logoUrl: [{ required: true, message: "请选择品牌图片" }],
      },
    };
  },
  //组件挂载完毕发请求
  mounted() {
    //获取列表数据方法
    this.getPageList();
  },
  methods: {
    //获取品牌列表的数据
    async getPageList(pager = 1) {
      //结构出参数
      this.page = pager;
      const { page, limit } = this;
      //获取品牌列表的接口
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
    //添加某一个品牌
    showDialog() {
      this.dialogFormVisible = true;
      this.tradeMarkForm = { tmName: "", logoUrl: "" };
    },
    //修改某一个品牌
    updataTradeMark(row) {
      //显示对话框
      this.dialogFormVisible = true;
      //将已有的品牌信息赋值给tradeMarkForm进行展示（不完全深拷贝）
      this.tradeMarkForm = { ...row };
    },
    //上传图片相关的回调
    handleAvatarSuccess(res, file) {
      //图片上传成功
      this.tradeMarkForm.logoUrl = res.data;
    },
    beforeAvatarUpload(file) {
      //图片上传之前
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //添加或修改品牌
    addOrUpdateTradeMark() {
      this.$refs.ruleForm.validate(async (success) => {
        //如果全部字段符合条件
        if (success) {
          this.dialogFormVisible = false;
          //发请求
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(
            this.tradeMarkForm
          );
          if (result.code == 200) {
            this.$message({
              message: this.tradeMarkForm.id ? "修改品牌成功" : "添加品牌成功",
              type: "success",
            });
            //添加品牌，回到第一页；修改品牌，留在当前页
            this.getPageList(this.tradeMarkForm.id ? this.page : 1);
          }
        } else {
          alert("error submit!");
          return false;
        }
      });
    },
    deleteTradeMark(row) {
      //弹框
      this.$confirm(`正在删除${row.tmName}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          //用户点击确定按钮触发
          //向服务器发请求
          let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getPageList(this.list.length>1?this.page:this.page-1);
          }
        })
        .catch(() => {
          //用户点击取消按钮触发
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
