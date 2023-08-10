<template>
  <div>
    
    <el-card style="margin: 20px">
      <center>
        <CategorySelect
          @changeScene="changeScene"
        ></CategorySelect>
      </center>
    </el-card>
    <el-card style="margin: 20px">
      <Scene0 v-show="scene == 0" ></Scene0>
      <Scene1 v-show="scene == 1" @changeScene="changeScene"></Scene1>
      <Scene2 v-show="scene == 2" ></Scene2>
    </el-card>
  </div>
</template>

<script>
import Scene0 from "@/views/activity/category/Scene0";
import Scene1 from "@/views/activity/category/Scene1";
import Scene2 from "@/views/activity/category/Scene2";
export default {
  name: "category",
  data() {
    return {
      scene: 0,
    };
  },
  components: {
    Scene0,
    Scene1,
    Scene2,
  },
  methods: {
    //切换场景
    changeScene(scene){
      this.scene=scene;
    }
    
  },
};
</script>

<style scoped></style>
