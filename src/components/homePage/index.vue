<template>
  <div class="homePage">
    <el-container >
      <!-- :style="`height:${wh}`" -->
      <el-aside width="15vw" class="leftBox">
        <leftMenu></leftMenu>
      </el-aside>
      <el-main class="rightBox">
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import leftMenu from "./leftMenu/leftMenu.vue";
export default {
  components: { leftMenu },
};
</script>
<style lang="less">
.homePage {
  height: 100%;
  .leftBox {
    box-shadow: 10px 0px 20px #b6b6b7;
    z-index: 2;
  }
  .rightBox {
    background-color: #F1F3F5;
  }
}
.el-container{
  height:100%;
}
</style>
