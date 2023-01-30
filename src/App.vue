<template>
  <div id="app">
    <el-config-provider :locale="locale">
      <router-view />
    </el-config-provider>
    
  </div>
</template>

<script>
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

export default {
  name: 'App',
  components: {
    ElConfigProvider
  },
  setup(){
    return {
      locale: zhCn,
    }
  }
}
</script>

<style>
#app {
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100vw;
  /* min-width:720px; */
  /* overflow: hidden; */
}
body {
  margin: 0;
  padding: 0
}
</style>
