<template>
  <div>
      <div class="specific">
          <div class="search-time">
          <el-date-picker
            v-model="value"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
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
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </div>
      <div>
        <el-card style="margin-top: 30px;">
          <el-table style="width: 100%;" border :data="activityData">
            <el-table-column label="id" prop="activityId" width="80" align="center">
            </el-table-column>
            <el-table-column label="活动名" prop="activityName" width="width">
            </el-table-column>
            <el-table-column label="活动开始时间" prop="startTime" width="width">
            </el-table-column>
            <el-table-column label="活动地点" prop="location" width="width">
            </el-table-column>
            <el-table-column label="操作" width="width">
              <template slot-scope="{row,$index}">
                  <el-button size="mini" title="前往url" icon="el-icon-share" type="success" @click="toUrl(row.url)"></el-button>                
                  <el-button size="mini" title="查看详情" icon="el-icon-info" type="info"></el-button>                
                  <el-button size="mini" title="修改活动信息" icon="el-icon-edit" type="warning"></el-button>                
                  <el-button size="mini" title="删除活动" icon="el-icon-delete" type="danger"></el-button>                
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>

  </div>
</template>

<script>
export default {
  name: "specific",
  data() {
    return {
      activityData:[{
        activityId:'1',
        activityName:'sjxm',
        startTime:'2023-05-28',
        location:'浙江工商大学',
        url:'http://www.bilibili.com'
      }],
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
      value: "", //时间数组
      contentInput: "", //用户查询输入内容
      select:"",//用户的选择
    };
  },
  methods:{
    toUrl(url){
      window.location.href=url;
    }
  }
};
</script>

<style scoped>
.specific{
  margin:20px;
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
