<template>
    <div>
      <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 20px;"
          @click="addCategory"
          >添加父属性</el-button
        >
      <el-table style="width:100%;" border :data="fatherAttrData">
        <el-table-column label="id" prop="fieldId" width="width"></el-table-column>
        <el-table-column label="父属性名" prop="fieldValue" width="width"></el-table-column>
        <el-table-column label="操作"  width="width">
          <template slot-scope="{row,$index}">
              <el-button icon="el-icon-delete" type="danger" @click="deleteCategory" size="mini" title="删除父属性"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </template>
  
  <script>
  export default {
      name:'Scene0',
      data() {
        return {
        }
      },
      props:['fatherAttrData'],
      methods:{
        addCategory(){
          this.$message({type:'warning',message:'该功能正在开发当中'});
        },
        deleteCategory(){
          this.$message({type:'error',message:'无法操作'});
        }
      }
  }
  </script>
  
  <style scoped>
  
  </style>