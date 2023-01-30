// 设置菜单
<template>
  <div>
    <div class="page" v-if="!showLogOut" v-loading="loading">
      <div class="showUser">
        <el-form ref="form" :rules="rules" :model="user" label-width="110px">
          <el-form-item label="用户名：">
            <el-input v-model="user.name" readonly></el-input>
          </el-form-item>
          <el-form-item label="密&nbsp;&nbsp;&nbsp;码：" style="margin-top: 30px">
            <el-input type="password" show-password v-model="user.pwd"></el-input>
          </el-form-item>
          <div v-if="showEdite">
            <el-form-item label="新密码：" style="margin-top: 30px" prop="newPwd">
              <el-input type="password" show-password v-model="user.newPwd"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码：" style="margin-top: 30px" prop="newPwd2">
              <el-input type="password" show-password v-model="user.newPwd2"></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <el-popover
        placement="bottom"
        width="auto"
        trigger="hover"
        :content="showEdite ? '确认修改密码' : '修改密码'"
      >
        <template #reference>
          <div class="roundBox pointer">
            <img src="@/assets/img/icon/edite.png" @click="editPwd" />
          </div>
        </template>
      </el-popover>
    </div>
    <div class="goOutBox" v-else>
      <div>确定要退出登录?</div>
      <el-popover placement="bottom" width="auto" trigger="hover" content="确定">
        <template #reference>
          <div class="roundBox pointer">
            <img src="@/assets/img/login/loginB.png" @click="$router.push('/')" />
          </div>
        </template>
      </el-popover>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs } from "@vue/reactivity";
import { ElMessage } from "element-plus";
import JSEncrypt from "jsencrypt";
import CryptoJS from "crypto-js";
import * as settingFns from "./index";
export default {
  setup() {
    const data = reactive({
      user: {
        name: "",
        pwd: "",
        newPwd: "",
        newPwd2: "",
      },
      showEdite: false,
      showLogOut: false,
      randomStr: "",
      getPublicKeyStr: "",
      loading: false,
    });
    getPublicKey();
    async function getPublicKey() {
      data.loading = true;
      data.randomStr = randomString(8);
      data.getPublicKeyStr = await settingFns.getPublicKey();
      let encryptor = new JSEncrypt(); // 加密
      encryptor.setPublicKey(data.getPublicKeyStr);
      const rsaPassWord = encryptor.encrypt(data.randomStr);
      await settingFns.getLoginUser({ key: rsaPassWord }).then((res) => {
        data.user.name = res.data.username;
        // data.user.pwd = decryptByDES(res.data.password, data.randomStr);
        data.loading = false;
      });
    }
    // 生成随机数
    function randomString(length) {
      var str = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      var result = "";
      for (var i = length; i > 0; --i)
        result += str[Math.floor(Math.random() * str.length)];
      return result;
    }
    // des解密
    function decryptByDES(ciphertext, key) {
      const keyHex = CryptoJS.enc.Utf8.parse(key);
      let decrypted = CryptoJS.DES.decrypt(ciphertext, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      });
      var result_value = decrypted.toString(CryptoJS.enc.Utf8);
      return result_value;
    }
    return {
      ...toRefs(data),
    };
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("新密码不能为空"));
      } else {
        if (this.user.pwd === value) {
          callback(new Error("新密码与旧密码相同"));
        } else {
          callback();
        }
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入确认密码"));
      } else {
        if (this.user.newPwd !== value) {
          callback(new Error("确认新密码与新密码不一致"));
        } else {
          callback();
        }
        callback();
      }
    };
    return {
      rules: {
        newPwd: [{ validator: validatePass, trigger: "blur" }],
        newPwd2: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  },
  methods: {
    editPwd() {
      if (!this.showEdite) {
        this.showEdite = true;
      } else {
        // 修改密码的操作
        this.$refs.form.validate((valid) => {
          if (valid) {
            let encryptor = new JSEncrypt(); // 加密
            encryptor.setPublicKey(this.getPublicKeyStr);
            const attr = {
              oldPassword: encryptor.encrypt(this.user.pwd),
              newPassword: encryptor.encrypt(this.user.newPwd),
            };
            settingFns.changPwd(attr).then((res) => {
              if (res.code === 200) {
                this.showLogOut = true;
                ElMessage.success({
                  message: "修改成功!",
                  type: "success",
                });
              }
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
  },
};
</script>
<style lang="less" scoped>
.page {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .showUser {
    width: 483px;
    box-shadow: 0 0 20px #b6b7b8;
    padding: 26px 20px;
  }
}
.goOutBox {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.roundBox {
  width: 64px;
  height: 64px;
  background-color: rgb(254, 254, 254);
  box-shadow: 0 0 10px #b6b7b8;
  border-radius: 50%;
  margin-top: 98px;
  margin-left: 50%;
  transform: translate(-50%, 0%);
  img {
    width: 33px;
    height: 33px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
