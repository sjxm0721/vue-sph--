<template>
  <div>
    <el-card style="margin: 30px">
      <el-input
        placeholder="请输入账号"
        v-model="inputContent"
        class="input-with-select"
        style="width: 450px; margin-bottom: 20px"
      >
        <el-button slot="append" icon="el-icon-search" @click="searchAccount"></el-button>
      </el-input>
      <el-table style="width: 100%" border :data="userInWhiteList">
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
        <el-table-column
          label="密码"
          width="width"
          prop="userPassword"
        ></el-table-column>
        <el-table-column label="操作" width="width">
          <template slot-scope="{row,$index}">
              <el-button icon="el-icon-edit" type="danger" size="mini" @click="setBlackList(row)">加入黑名单</el-button>
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
import { mapState } from 'vuex';
export default {
  name: "user",
  data() {
    return {
      page: 1,
      limit: 3,
      total: 0,
      inputContent:"",
      newUserList:[],
    };
  },
  computed:{
    ...mapState('userAccount',['totalUserMsg']),
    userInWhiteList(){
      return this.totalUserMsg.filter(item=>item.inBlackList!=1)
    }
  },
  mounted(){
    this.getTotalUser();
  },
  methods: {
    getTotalUser(){
       this.$store.dispatch('userAccount/getTotalUser');
    },
    handlePageChange(page) {
      this.page=page;
    },
    handleSizeChange(limit) {
      this.limit=limit;
    },
    setBlackList(row){
      let tmp={
        userId:row.userId,
        userName:row.userName
      };
      let result=this.$store.dispatch('userAccount/setBlackList',tmp);
      result.then(()=>{
        this.$message({type:'success',message:'加入黑名单成功'});
        if(this.inputContent!=""){
          this.handlerSearch();
        }
        else{
          this.getTotalUser();
        }
      }).catch(()=>{
        this.$message({type:'error',message:'加入黑名单失败'});
      })
    },
    handlerSearch(){
      this.$store.dispatch('userAccount/searchAccount',this.inputContent);
    },
    searchAccount(){
      if(this.inputContent!="")
      {
        this.handlerSearch();
      }
      else{
        this.getTotalUser();
      }
    }
  },
  watch:{
    userInWhiteList:{
      deep:true,
      handler(newValue,oldValue){
        this.total = newValue.length;
        this.newUserList = newValue.slice(
          this.limit * (this.page - 1),
          this.limit * (this.page - 1) + this.limit
        );
      }
    },
    page(newValue, oldValue) {
      this.newUserList = this.userInWhiteList.slice(
        this.limit * (this.page - 1),
        this.limit * (this.page - 1) + this.limit
      );
    },
    limit(newValue, oldValue) {
      if (this.page == 1) {
        this.newUserList = this.userInWhiteList.slice(
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
