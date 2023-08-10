<template>
  <div>
    <el-card style="margin: 30px">
      <el-input
        placeholder="请输入账号"
        v-model="inputContent"
        class="input-with-select"
        style="width: 450px; margin-bottom: 20px"
      >
        <el-button slot="append" icon="el-icon-search" @click="searchBlackList"></el-button>
      </el-input>
      <el-table style="width: 100%" border :data="newBlackListMsg">
        <el-table-column
          label="帐号"
          width="width"
          prop="userId"
        ></el-table-column>
        <el-table-column
          label="姓名"
          width="width"
          prop="userName"
        ></el-table-column>
        <el-table-column label="操作" width="width">
          <template slot-scope="{ row, $index }">
            <el-button icon="el-icon-edit" type="primary" size="mini" @click="setWhiteList(row)"
              >移除黑名单</el-button
            >
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
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "blackList",
  data() {
    return {
      page: 1,
      limit: 3,
      total: 0,
      newBlackListMsg:[],
      inputContent:"",
    };
  },
  computed: {
    ...mapState("blackList", ["blackListMsg"]),
  },
  methods: {
    getBlackList() {
      this.$store.dispatch("blackList/getBlackList");
    },
    handlePageChange(page) {
      this.page=page;
    },
    handleSizeChange(limit) {
      this.limit=limit;
    },
    setWhiteList(row){
      let result = this.$store.dispatch('blackList/setWhiteList',row.userId);
      result.then(()=>{
        this.$message({type:'success',message:'移除黑名单成功'});
        if(this.inputContent!="")
        {
          this.handlerSearch();
        }
        else{
          this.getBlackList();
        }
      })
      .catch(()=>{
        this.$message({type:"error",message:'移除黑名单失败'});
      })
    },
    handlerSearch(){
      this.$store.dispatch('blackList/searchBlackList',this.inputContent);
    },
    searchBlackList(){
      if(this.inputContent!="")
      {
        this.handlerSearch();
      }
      else{
        this.getBlackList();
      }
    }
  },
  mounted(){
    this.getBlackList();
  },
  watch:{
    blackListMsg:{
      deep:true,
      handler(newValue,oldValue){
        this.total = newValue.length;
        this.newBlackListMsg = newValue.slice(
          this.limit * (this.page - 1),
          this.limit * (this.page - 1) + this.limit
        );
      }
    },
    page(newValue, oldValue) {
      this.newBlackListMsg = this.blackListMsg.slice(
        this.limit * (this.page - 1),
        this.limit * (this.page - 1) + this.limit
      );
    },
    limit(newValue, oldValue) {
      if (this.page == 1) {
        this.newBlackListMsg = this.blackListMsg.slice(
          this.limit * (this.page - 1),
          this.limit * (this.page - 1) + this.limit
        );
      } else {
        this.page = 1;
      }
    },
  }
};
</script>

<style scoped></style>
