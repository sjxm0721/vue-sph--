<!-- app组件不用修改 -->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
#app {
  background-color: #f0f0f0;
  height:100%;
  min-width: 1200px;
}
</style>
