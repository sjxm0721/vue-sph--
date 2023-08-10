<template>
  <div>
    <h2 style="margin: 20px">活动数据</h2>
    <el-card style="margin: 20px">
      <div slot="header">
        <!--  @tab-click="handleClick" -->
        <el-tabs class="tab" v-model="activeName">
          <el-tab-pane label="点赞数" name="likeNum"></el-tab-pane>
          <el-tab-pane label="收藏数" name="collectNum"></el-tab-pane>
        </el-tabs>
      </div>
      <div>
        <el-row :gutter="10">
          <el-col :span="18">
            <div class="charts" ref="charts"></div>
          </el-col>
          <el-col :span="6" class="rank">
            <h4>{{ activeName }}-rank</h4>
            <div class="clearfix">
              <span class="left">活动id</span>
              <span class="right">{{
                activeName == "likeNum" ? "点赞数" : "收藏数"
              }}</span>
            </div>
            <ul v-show="activeName == 'likeNum'">
              <li
                v-for="(topActivity, index) in toppestActivityByLikeNum"
                :key="topActivity.activityId"
              >
                <span class="rIndex">{{ topActivity.activityId }}</span>
                <span class="rName">{{ topActivity.activeName }}</span>
                <span class="rSale">{{ topActivity.likeNum }}</span>
              </li>
              <li
                v-for="(topActivity2, index) in topperActivityByLikeNum"
                :key="topActivity2.activityId"
              >
                <span class="rIndex2">{{ topActivity2.activityId }}</span>
                <span class="rName">{{ topActivity2.activeName }}</span>
                <span class="rSale">{{ topActivity2.likeNum }}</span>
              </li>
            </ul>
            <ul v-show="activeName == 'collectNum'">
              <li
                v-for="(topActivity3, index) in toppestActivityByCollectNum"
                :key="topActivity3.activityId"
              >
                <span class="rIndex">{{ topActivity3.activityId }}</span>
                <span class="rName">{{ topActivity3.activeName }}</span>
                <span class="rSale">{{ topActivity3.collectNum }}</span>
              </li>
              <li
                v-for="(topActivity4, index) in topperActivityByCollectNum"
                :key="topActivity4.activityId"
              >
                <span class="rIndex2">{{ topActivity4.activityId }}</span>
                <span class="rName">{{ topActivity4.activeName }}</span>
                <span class="rSale">{{ topActivity4.collectNum }}</span>
              </li>
            </ul>
          </el-col>
        </el-row>
        <el-pagination
          @current-change="handlePageChange"
          style="text-align: center"
          :current-page="page"
          layout="prev,pager,next,jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { mapState } from "vuex";
export default {
  name: "Dashboard",
  data() {
    return {
      activeName: "likeNum",
      limit: 7, //每页展示7条数据
      page: 1,
      showData1: {
        categories: [],
        values: [],
      }, //展示在页面上的数据
      showData2: {
        categories: [],
        values: [],
      },
      chart: null,
      total: 0,
    };
  },
  computed: {
    ...mapState("specific", ["activityByLikeNum", "activityByCollectNum"]),
    toppestActivityByLikeNum() {
      let data = [];
      for (let i = 0; i < 3; i++) {
        data.push(this.activityByLikeNum[i]);
      }
      return data;
    },
    toppestActivityByCollectNum() {
      let data = [];
      for (let i = 0; i < 3; i++) {
        data.push(this.activityByCollectNum[i]);
      }
      return data;
    },
    topperActivityByLikeNum() {
      let data = [];
      for (let i = 3; i < 7; i++) {
        data.push(this.activityByLikeNum[i]);
      }
      return data;
    },
    topperActivityByCollectNum() {
      let data = [];
      for (let i = 3; i < 7; i++) {
        data.push(this.activityByCollectNum[i]);
      }
      return data;
    },
  },
  methods: {
    getActivityByLikeNum() {
      this.$store.dispatch("specific/getActivityByLikeNum");
    },
    getActivityByCollectNum() {
      this.$store.dispatch("specific/getActivityByCollectNum");
    },
    handlePageChange(page) {
      this.page = page;
    },
    updateChart(data) {
      console.log(data);
      console.log(this.chart);
        this.chart.setOption({
        xAxis: {
          data: data.categories,
        },
        series: [
          {
            name: "Bar",
            data: data.values,
          },
          {
            name: "Line",
            data: data.values,
          },
        ],
        //调试布局
        grid: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        },
        tooltip: {},
      });
      
    },
    updateLikeChart() {
      for (
        let i = (this.page - 1) * this.limit;
        i < this.page * this.limit;
        i++
      ) {
        this.showData1.categories.push(this.activityByLikeNum[i].activityId);
        this.showData1.values.push(this.activityByLikeNum[i].likeNum);
      }
      this.updateChart(this.showData1);
    },
    updateCollectChart() {
      for (
        let i = (this.page - 1) * this.limit;
        i < this.page * this.limit;
        i++
      ) {
        this.showData2.categories.push(this.activityByCollectNum[i].activityId);
        this.showData2.values.push(this.activityByCollectNum[i].collectNum);
      }
        this.updateChart(this.showData2);
    },
    initEcharts(){
 const chartContainer = this.$refs.charts;
        //创建基于ECharts的实例
        this.chart = echarts.init(chartContainer);
        //初始化图标配置
        const options = {
          xAxis: {
            //隐藏x轴
            show: false,
            type: "category",
          },
          yAxis: {
            //隐藏y轴
            show: false,
          },
          //系列
          series: [
            {
              type: "line",
              data: [],
              //线条的样式的设置
              lineStyle: {
                //颜色
                color: "purple",
              },
            },
            {
              type: "bar",
              data: [],
              color: "cyan",
            },
          ],
          //调试布局
          grid: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          },
          tooltip: {},
        };
        //更新图表数据的方法
        //初始化图表
        this.chart.setOption(options);
    }
  },
  mounted() {
      let promise1=this.getActivityByCollectNum();
      let promise2=this.getActivityByLikeNum();
    //获取图表容器的引用
    Promise.all([promise1,promise2]).then(()=>{
      setTimeout(()=>{
        this.initEcharts();
        if(this.activeName=="likeNum"){
          this.showData1 = {
          categories: [],
          values: [],
        };
          this.updateLikeChart();
        }
        else if(this.activeName=="collectNum")
        {
          this.showData2 = {
          categories: [],
          values: [],
        };
          this.updateCollectChart();
        }
      },1000);
    })
      
  },
  watch: {
    activityByLikeNum: {
      deep: true,
      handler(newValue, oldValue) {

        this.showData1 = {
          categories: [],
          values: [],
        };
        if (this.activeName == "likeNum") {
          this.total = this.activityByLikeNum.length;
          this.updateLikeChart();
        }
      },
    },
    activityByCollectNum: {
      deep: true,
      handler(newValue, oldValue) {

        this.showData2 = {
          categories: [],
          values: [],
        };
        if (this.activeName == "collectNum") {
        this.total = this.activityByCollectNum.length;
        this.updateCollectChart();
        }
      },
    },
    page(newValue, oldValue) {
      if (this.activeName == "likeNum") {
        this.showData1 = {
          categories: [],
          values: [],
        };
        for (
          let i = (this.page - 1) * this.limit;
          i < this.page * this.limit;
          i++
        ) {
          this.showData1.categories.push(this.activityByLikeNum[i].activityId);
          this.showData1.values.push(this.activityByLikeNum[i].likeNum);
        }
        this.updateChart(this.showData1);
      } else if (this.activeName == "collectNum") {
        this.showData2 = {
          categories: [],
          values: [],
        };
        for (
          let i = (this.page - 1) * this.limit;
          i < this.page * this.limit;
          i++
        ) {
          this.showData2.categories.push(
            this.activityByCollectNum[i].activityId
          );
          this.showData2.values.push(this.activityByCollectNum[i].collectNum);
        }
        this.updateChart(this.showData2);
      }
    },
    activeName(newValue, oldValue) {
      if (newValue == "likeNum") {
        this.page = 1;
        this.showData1 = {
          categories: [],
          values: [],
        };
        this.updateLikeChart();
      } else if (newValue == "collectNum") {
        this.page = 1;
        this.showData2 = {
          categories: [],
          values: [],
        };
        this.updateCollectChart();
      }
    },
  },
};
</script>

<style scoped>
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.right {
  margin-left: 120px;
}
.charts {
  width: 100%;
  height: 300px;
}
.tab {
  width: 100%;
}
.rank > h4 {
  margin: 0;
  padding: 0;
}
ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0px;
}
ul li {
  height: 8%;
  margin: 15px;
}
.rIndex {
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #000;
  color: #fff;
  text-align: center;
}
.rIndex2 {
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  text-align: center;
}
.rName {
  padding: 30px;
}
.rSale {
  float: right;
}
</style>
