<template>
<!-- <button class="add-button">Add to home screen</button> -->
  <div>
    <div v-if="weiXinPage" class="weiXinImageBox">
      <img src="@/assets/phone/notWeiXin.png" class="weiXinImage"/>
    </div>
    <div class="phoneView" v-else>
      <div class="headImgBox">
        <img src="@/assets/phone/headImg.png" v-if="showInfo !== 'infoFlow'" />
      </div>
      
      <div class="accountBox">
        <div class="topBox" v-show="showInfo !== 'infoFlow'">
          <div v-if="mainVideoSource === 'YOUTUBE'">
            <div style="width: 100vw; min-height: 25vh; background-color:  rgb(51, 44, 43)">
              <!-- <div class="youTubeFont">
              暂不支持该类型视频
            </div> -->
              <ShowYoutube
                ref="previewYoutube"
                style="width: 100vw; min-height: 25vh"
                :fromView="true"
                @currentTime="currentTime"
                :youtobeId="mainVideoUrl.split('https://youtu.be/')[1]"
              ></ShowYoutube>
            </div>
          </div>
          <video
            v-else
            :src="mainVideoUrl"
            class="avatar video-avatar videoBox"
            controls="controls"
            webkit-playsinline="true"
            playsinline="true"
            x5-video-player-type="h5"
            x5-video-orientation="portraint"
            preload="true"
            @timeupdate="timeChange"
            id="video1"
            style="background-color:  rgb(51, 44, 43)"
          >
            您的浏览器不支持视频播放
          </video>
          <div class="iconBox">
            <img
              v-for="(item, index) in iconArr"
              :key="index"
              :src="item.iconUrl"
              class="centerIcon"
              @click="fenXiang(item)"
            />
          </div>
        </div>
        <div
          v-if="showInfo === 'infoFlow'"
          class="accountBox_null"
          style="background-color:  rgb(51, 44, 43); height: 100vh"
        ></div>
        <template v-if="infoFlow.findIndex((v) => v.showDiv) > -1">
          <div class="infoAccount">
            <div
              v-for="(item, index) in infoFlow"
              :key="`infoFlow${index}`"
              @click="toInfoPage(item)"
            >
              <transition name="fade">
                <div class="infoFlowBox topToDow" v-if="item.showDiv">
                  <div>
                    <img :src="item.imageUrl" v-if="item.imageUrl" />
                    <img src="@/assets/position/listImage.png" v-else />
                  </div>
                  <div class="infoFlowTitle overFlowPoint">
                    <img src="@/assets/phone/flowInfo.png" class="toInfoImg" />
                    <h4 class="overFlowPoint">{{ item.title }}</h4>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </template>
      </div>
      <div class="alertBox" v-if="showInfo">
        <div v-if="showInfo === 'infoFlow'">
          <div class="account">
            <el-button type="primary" class="topBlack" @click="closeAlertBox">返回</el-button>
            <FlowInfo
              class="account_FlowInfoBox"
              v-if="infoObj.id"
              :flowInfoId="infoObj.id"
            ></FlowInfo>
          </div>
        </div>
        <div v-else-if="showInfo === 'fenXiang'">
          <div class="fenXiangBox" @click="closeAlertBox"></div>
          <div
            v-if="fenXiangObj.type === 'h5'"
            @touchstart="touchstart"
            @touchend="touchend"
            @touchmove="touchmove"
          >
            <div class="h5Box" id="h5Box">
              <div class="dian"></div>
              <div class="h5Box_title">
                <div class="h5Box_title_font" :title="h5Title">{{ h5Title }}</div>
              </div>
              <img :src="h5ImgUrl" id="h5FenxiangImg" class="h5img" v-if="h5ImgUrl" />
              <img src="@/assets/position/listImage.png" class="h5img" v-else />
              <div class="qrcodeBox">
                <div class="qrcode" id="qrcode" ref="qrCodeUrl"></div>
                <div>长按保存</div>
              </div>
            </div>
          </div>
          <div v-else class="noH5Box">
            <el-input v-model="fenXiangObj.fenxiangUrl" readonly></el-input>
            <div class="noH5BoxCopy">
              <img src="@/assets/img/preview/fenxiang.png" @click="copyUrl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getCurrentInstance, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { reactive, toRefs } from "@vue/reactivity";
import FlowInfo from "./flowInfo.vue";
import moment from "moment";
import html2Canvas from "html2canvas";
import * as allFns from "./index";
import router from "@/routes/index";
import QRCode from "qrcodejs2";
import ShowYoutube from "@/components/public/youtube/showYoutube.vue";
import DDConfig from "@/api/public/dingding";
export default {
  components: { FlowInfo, ShowYoutube },
  setup() {
    const data = reactive({
      mainVideoUrl: "",
      iconArr: [
        {
          title: "Instagram",
          iconUrl: require("@/assets/icon/heightPrecision/instagram_0.png"),
          type: "instagram",
          fenxiangUrl: "",
        },
        {
          title: "Twitter",
          iconUrl: require("@/assets/icon/heightPrecision/twitter_0.png"),
          type: "twitter",
          fenxiangUrl: "",
        },
        {
          title: "Facebook",
          iconUrl: require("@/assets/icon/heightPrecision/facebook_0.png"),
          type: "facebook",
          fenxiangUrl: "",
        },
        {
          title: "QQ",
          iconUrl: require("@/assets/icon/heightPrecision/qq_0.png"),
          type: "qq",
          fenxiangUrl: "",
        },
        {
          title: "微博",
          iconUrl: require("@/assets/icon/heightPrecision/weibo_0.png"),
          type: "weibo",
          fenxiangUrl: "",
        },
        {
          title: "微信",
          iconUrl: require("@/assets/icon/heightPrecision/weixin_0.png"),
          type: "weixin",
          fenxiangUrl: "",
        },
        {
          title: "H5海报",
          iconUrl: require("@/assets/icon/heightPrecision/h5_0.png"),
          type: "h5",
          fenxiangUrl: "",
        },
      ],
      infoFlow: [],
      infoObj: {},
      showInfo: null,
      fenXiangObj: {},
      h5Title: "",
      h5ImgUrl: "",
      leftShareUrl: "",
      returnUrl: "", // 上一页的路径
      mainVideoSource: "",
      setIntervalName: null,
      weiXinPage: false,
    });
    // 判断是不是在微信中打开
    var ua = navigator.userAgent.toLowerCase();
    var isWeixin = ua.indexOf("micromessenger") != -1;
    if (isWeixin) {
      // return true;
      data.weiXinPage = true;
    } else {
      init();
    }
    function init() {
      allFns
        .details({ id: router.currentRoute.value.params.id, preview: true })
        .then((res) => {
          data.mainVideoSource = res.data.mainVideoSource;
          data.mainVideoUrl = res.data.mainVideoUrl;
          data.infoFlow = res.data.infoFlow;
          data.h5Title = res.data.title;
          data.h5ImgUrl = res.data.imageUrl!==''?res.data.imageUrl+"?time="+new Date().getTime():"";
          data.leftShareUrl = res.data.shareUrl;
          data.returnUrl = res.data.returnUrl
          const attr = {
            iwpostId: res.data.id,
            createdAt: moment(String(new Date())).format("YYYY-MM-DDTHH:mm:ss"),
          };
          allFns.playRecord(attr);
        });
    }
    function timeChange(e) {
      data.infoFlow = data.infoFlow.map((item) => {
        item.showDiv = e.target.currentTime * 1000 >= item.showTime * 1000;
        return item;
      });
    }
    const instance = getCurrentInstance();
    function creatQrCode() {
      // const url =
      //   "http://192.168.110.230:8088/openView/preview/iwpost_1468855472355938306";
      if (!document.getElementById("qrcode").title) {
        new QRCode(instance.refs.qrCodeUrl, {
          text: data.returnUrl, // 需要转换为二维码的内容
          // text: url,
          width: 120,
          height: 120,
          colorDark: " rgb(51, 44, 43)000",
          // colorDark: 'green',
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H,
        });
      }
    }
    return {
      ...toRefs(data),
      timeChange,
      creatQrCode,
    };
  },
  mounted() {
    DDConfig.ddShowMenu(
      "钉钉分享",
      "@/assets/icon/heightPrecision/weibo_0.png",
      this.fenXiangObj.fenxiangUrl
    );
 

    // if ('serviceWorker' in navigator) {
    //   navigator.serviceWorker.register('/sw.js')
    //   .then(() => { console.log('Service Worker Registered'); });
    // }
    // let deferredPrompt;
    // const addBtn = document.querySelector('.add-button');
    // addBtn.style.display = 'none';

    // window.addEventListener('beforeinstallprompt', (e) => {
    //     // Prevent Chrome 67 and earlier from automatically showing the prompt
    //     e.preventDefault();
    //     // Stash the event so it can be triggered later.
    //     deferredPrompt = e;
      // addBtn.style.display = 'block';
    // addBtn.addEventListener('click', () => {
        //  addBtn.style.display = 'none';
    //     // Show the prompt
    //     deferredPrompt.prompt();
    //     // Wait for the user to respond to the prompt
    //     deferredPrompt.userChoice.then((choiceResult) => {
    //           if (choiceResult.outcome === 'accepted') {
    //           console.log('User accepted the A2HS prompt');
    //           } else {
    //           console.log('User dismissed the A2HS prompt');
    //           }
    //           deferredPrompt = null;
    //     });
    //    });
    // });


  },
  methods: {
  getImage(url,imgId) {
    // console.log(url,imgId)
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    // 设置请求头（这一步得设置不然oss图片还是跨域）
    xhr.setRequestHeader ( "Cache-Control","no-cache");
    xhr.responseType = 'blob';
    xhr.onload = function () {
      if (this.status == 200) {
        document.getElementById(imgId).src = URL.createObjectURL(this.response)
      }
    }
    xhr.send();
  },
    // 手指按下
    touchstart() {
      this.getImage(this.h5ImgUrl,"h5FenxiangImg")
      this.setIntervalName = setInterval(() => {
        html2Canvas(document.querySelector("#h5Box"), {
          useCORS: true,
          allowTaint: true,
        }).then((canvas) => {
          let dataURL = canvas.toDataURL("image/png", 1.0);
          if (dataURL !== "") {
            var a = document.createElement("a");
            a.download = this.h5Title;
            a.href = dataURL;
            a.click();
            this.showInfo = null;
          }
        });
      }, 1000);
    },
    // 手指抬开
    touchend() {
      clearInterval(this.setIntervalName);
    },
    // 手指滑动
    touchmove() {
      clearInterval(this.setIntervalName);
    },
    toInfoPage(obj) {
      const centerVideo = document.getElementById("video1");
      centerVideo.pause();
      this.infoObj = obj;
      const attr = {
        infoFlowId: obj.id,
        createdAt: moment(String(new Date())).format("YYYY-MM-DDTHH:mm:ss"),
      };
      allFns.infoFlowClick(attr);
      this.showInfo = "infoFlow";
    },
    closeAlertBox() {
      this.showInfo = null;
      const centerVideo = document.getElementById("video1");
      centerVideo.play();
    },
    fenXiang(obj) {
      this.showInfo = "fenXiang";
      this.fenXiangObj = obj;
      this.fenXiangObj.fenxiangUrl = this.returnUrl;
      if (this.fenXiangObj.type === "h5") {
        this.showQrcode();
      }
    },
    showQrcode() {
      nextTick(() => {
        this.creatQrCode();
      });
    },
    copyUrl() {
      // DDConfig.ddShowMenu('钉钉分享','@/assets/icon/heightPrecision/weibo_0.png',this.showModelAccontObj.fenxiangUrl,)
      this.$copyText(this.fenXiangObj.fenxiangUrl).then(() => {
        ElMessage.success({
          message: "链接已复制",
          type: "success",
        });
      }),
        (error) => {
          console.log("error", error);
          ElMessage.success({
            message: "复制失败",
            type: "success",
          });
        };
    },
    currentTime(times) {
      this.infoFlow = this.infoFlow.map((item) => {
        item.showDiv = times * 1000 >= allFns.timeToSec(item.showTime);
        return item;
      });
    },
  },
};
</script>
<style scoped src="./videojs/video-js-cdn.css"></style>
<style lang="less" scoped>
.topBlack{
  margin: 0.2rem 0;
  width: 100%;
}
.weiXinImage{
  width: 100vw;
}
.youTubeFont {
  color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.phoneView {
  width: 100vw;
  height: 100vh;
  .headImgBox{
    background: #35574d;
    text-align: center;
    .headImg{
    height: 2rem;
    
  }
  }
  .accountBox {
    padding-bottom: 0.5rem;
    .topBox {
      margin: 0;
      padding: 0;
      .videoBox {
        width: 100vw;
        max-height: calc(38vh - 2rem);
      }
      .iconBox {
        text-align: right;
        background-color: #35574d;
        margin-top: -0.5rem;
        .centerIcon {
          margin: 0.5rem;
          width: 2rem;
          height: 2rem;
        }
      }
    }
    .infoAccount {
      overflow-y: auto;
      background-color: rgb(51, 44, 43);
      margin-top: -.5rem;
      height: 62vh;
      color:#e6e6e6;
      .infoFlowBox {
        display: grid;
        grid-template-columns: 45vw 55vw;
        grid-template-rows: 15vh;
        margin-top: 0.5rem;
        background-color: #445556;
        margin-bottom: 1rem;
        img {
          height: 100%;
          width: 100%;
        }
        .infoFlowTitle {
          position: relative;
          h4 {
            max-width: 10rem;
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translate(-50%, 0);
          }
          .toInfoImg {
            width: 4rem;
            height: 4rem;
            position: absolute;
            top: 50%;
            right: 0;
            transform: translate(-50%, -50%);
          }
        }
      }
    }
  }
  .alertBox {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 55;
    height: 100vh;
    .fenXiangBox {
      width: 100%;
      height: 100%;
      background-color: #b6b6b7;
      opacity: 0.5;
      position: fixed;
      top: 0;
      left: 0;
    }
    .noH5Box {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      .noH5BoxCopy {
        margin-top: 0.5rem;
        width: 3.5rem;
        height: 3.5rem;
        border-radius: 50%;
        background-color: #fff;
        box-shadow: 0 0 0.5rem #b6b6b7;
        position: relative;
        left: 50%;
        transform: translate(-50%, 0);
        img {
          position: relative;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
    .h5Box {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 45;
      width: 70vw;
      height: 65vh;
      background-color: #fff;
      .dian {
        background-color: rgb(220, 220, 220);
        width: 1rem;
        height: 1rem;
        position: relative;
        top: 1rem;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
      }
      &_title {
        margin-top: 1rem;
        &_font {
          width: calc(100%-1rem);
          padding: 0rem 0.5rem;
          font-size: 0.8rem;
          font-weight: bold;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
      .h5img {
        margin-top: 3vh;
        width: 100%;
        height: 8rem;
      }
      .qrcodeBox {
        text-align: center;
        margin-top: 2rem;
        .qrcode {
          img {
            width: 5rem;
            height: 13.2vh;
            background-color: #fff;
            padding: 0.6vh;
            box-sizing: border-box;
          }
        }
      }
    }
    .account {
      .el-button--primary {
          --el-button-font-color: #ffffff;
          --el-button-background-color: #35574d;
          --el-button-border-color: #35574d;
          --el-button-hover-color: #35574d;
          --el-button-active-font-color: #e6e6e6;
          --el-button-active-background-color: #35574d;
          --el-button-active-border-color: #35574d;
      }
      background-color: #35574d;
      width: 100%;
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      z-index: 8;
      &_title {
        position: relative;
        top: 0%;
        left: 1.875rem;
        transform: translate(0, -50%);
        width: 30%;
        padding: 0.5rem 1rem;
        background-color: #fff;
        box-shadow: #b6b6b7 0 0 0.3rem;
        font-size: 1.25rem;
        font-weight: bold;
        z-index: 999;
      }
      &_FlowInfoBox {
        height: 100%;
        width: 100vw;
        overflow-y: auto;
      }
    }
  }
}
</style>
