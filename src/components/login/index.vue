<template>
  <div class="login" @keyup.enter="loginFn">
    <div class="loginImg">
      <img src="../../assets/img/login/banner.jpg" class="maxImg"/>
      <!-- <img src="@/assets/img/login/logo.png" class="logoImg" /> -->
      <div class="loginBBox" @click="loginFn">
        <img src="@/assets/img/login/button.png"/>
      </div>
    </div>
    <div class="userInfoBox">
			<div class="centerFont">
				<div>用户名</div>
				<el-input v-model="userName" class="loginInput"></el-input>
			</div >
			<div class="centerFont" style="margin-top:2vh">
				<div>密码</div>
				<el-input type="password" show-password v-model="userPwd" class="loginInput"></el-input>
			</div>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs  } from "vue";
import { ElMessage } from 'element-plus'
import md5 from 'js-md5'
import * as loginFns from "@/api/login/index.js"
export default {
  setup() {
    const data = reactive({
      userName: "",
      userPwd: "",
      newPwd: "",
      okNewPwd: "",
      pageType: "login",
    });
    return {
      ...toRefs(data),
    };
  },
  methods: {
    loginFn() {
      if (!this.userName) {
         ElMessage.warning({
            message: '用户名不能为空',
            type: 'warning',
          })
          return
      } else if (!this.userPwd) {
        ElMessage.warning({
            message: '密码不能为空',
            type: 'warning',
          })
          return
      }
      const attr = {
        username: this.userName,
        password: md5("id" + md5("id" + this.userPwd + "sj") + "sj")
      }
      loginFns.login(attr).then(res => {
        if (res.code === 200) {
          sessionStorage.setItem('token', res.data)
          this.$router.push("/homePage/main");
        } else {
          sessionStorage.removeItem('token')
          ElMessage.warning({
            message: res.message,
            type: 'warning',
          })
        }
      })
      
    }
  }
};
</script>
<style lang="less" scoped>
.login {
  height: 100%;
}
.mb24 {
  margin-bottom: 24px;
}
.loginImg {
  width: 100vw;
  height: 60vh;
  // background-image: url("../../assets/img/login/login.png");
  text-align: center;
  // background-repeat: no-repeat;
  // position: relative;
  .maxImg{
    width: 100vw;
    height: 100%;
    object-fit:fill;
  }
  .logoImg {
    width: 100vw;
    height: 16vh;
    margin-top: 104px;
    object-fit:contain;
    position: absolute;
    top: 5vh;
    left: 50%;
    transform: translate(-50%, 0);
    z-index: 2;
  }
  .loginBBox {
    cursor: pointer;
    position: relative;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    img{
      width: 12vw;
    }
    // margin-left: -126px; /*要居中的div的宽度的一半*/
    // margin-bottom: 263px; /*要居中的div的宽度的一半*/
  }
}


.userInfoBox {
  margin-top: 14vh;
}
.centerFont {
	text-align: center;
  font-size: 2vh;
  .loginInput{
    width: 15vw;
    input{
      height: 4vh;
      line-height: 4vh;
    }
  }
}
</style>
