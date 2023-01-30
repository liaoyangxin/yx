<template>
  <div class="leftMenu">
    <div class="imgBox">
      <img src="@/assets/img/homePage/leftMenu.jpg" class="img" />
    </div>
    <div class="menuLabel">
      <div
        v-for="(item, index) in menuList"
        :key="index"
        class="mb64"
        @click="chooseMenu(item)"
      >
        <span :class="item.choosed?'chooseMenuFont':''" >{{ item.name }}</span> 
      </div>
    </div>
    <el-dialog
      v-model="dialogVisible"
      title="退出"
      width="25%"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <span>是否确认退出?</span>
      <div class="dialogFooter">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="$router.push('/')"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs } from "@vue/reactivity";
import router from '@/routes/index'
import * as indexFns from "./index";
export default {
  setup() {
    const data = reactive({
      menuList: [],
      dialogVisible: false
    });
    (async () => {
      data.menuList = await indexFns.init()
      if(data.menuList.length > 0) {
        if (sessionStorage.getItem('chooseMenu')) {
          const menuObj = JSON.parse(sessionStorage.getItem('chooseMenu'))
          data.menuList.map(item => {
            item.choosed = item.id === menuObj.id
          })
          router.push(menuObj.url)
        } else {
          data.menuList[0].choosed = true
        }
      }
    })();
    return {
      ...toRefs(data),
    };
  },
  methods: {
    chooseMenu(obj){
      this.menuList.map(item=>{
        if(item.choosed){
          sessionStorage.setItem('oldChooseMenu',JSON.stringify(item)) 
        }
      })
      if (obj.url === '/'){
        this.dialogVisible = true
      } else {
        this.menuList.map(item => {
        item.choosed = item.url === obj.url
        if (item.choosed) {
          sessionStorage.setItem('chooseMenu', JSON.stringify(item))
        }
      })
      this.$router.push(obj.url)
      }
      
    }
  },
  mounted(){
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL);
      window.onpopstate = () => {
        const obj = {
          url: this.$route.path
        }
        this.chooseMenu(obj)
      }
    }
  }
};
</script>
<style lang="less" scoped>
.leftMenu {
  width: 100%;
  margin-top: 4vh;
  text-align: center;
  .imgBox {
    // background-color: rgb(247, 247, 247);
    width: 12vw;
    height: 24vh;
    top: 1vh;
    margin: auto;
    // border: 1px rgb(136, 136, 136) dashed;
    .img {
      margin-top: 5vh;
      width: 12vw;
      height: 15vh;
      // border: 1px rgb(136, 136, 136) dashed;
    }
  }
  .menuLabel {
    // float: left;
    margin-top: 4vh;
    height: 62vh;
    overflow-y: auto;
    .mb64 {
      margin-bottom: 5.4vh;
      cursor: pointer;
    }
  }
}
.dialogFooter{
  padding-top: 30px;
  text-align: center;
}
</style>
