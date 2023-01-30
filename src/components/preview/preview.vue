// 视屏预览
<template>
  <div class="preview">
    <div class="gridBox">
      <div class="leftBox">
        <div class="dian"></div>
        <div style="color:#eff3f3;">
          <p style="font-size: 1.6vh; margin: 0 5%">主视频:</p>
          <div class="leftInfoBx" style="font-size: 2vh; margin: 0 5%">
            {{ leftInfo }}
          </div>
        </div>
        <div class="leftBox_shareIcon">
          <div v-for="(item, index) in leftRightBottomIcon" :key="index">
            <el-popover
              placement="left"
              width="auto"
              trigger="hover"
              :content="item.title"
            >
              <template #reference>
                <img
                  :src="item.iconUrl"
                  @click="showInput(item.type)"
                  style="height: 2.3vh;"
                />
              </template>
            </el-popover>
          </div>
          <el-popover placement="left" width="auto" trigger="hover" content="返回">
            <template #reference>
              <img
                src="@/assets/img/preview/balck8.png"
                style="margin-top: 3vh;"
                @click="blackFn"
              />
            </template>
          </el-popover>
        </div>
      </div>
      <div class="centerBox">
        <div class="videoBox">
          <div v-if="mainVideoSource === 'YOUTUBE'">
            <ShowYoutube
              ref="previewYoutube"
              style="width: 60vw; height: 70vh"
              :fromView="true"
              @currentTime="currentTime"
              :youtobeId="videoUrl.split('https://youtu.be/')[1]"
            ></ShowYoutube>
          </div>
          <video
            v-else
            controls
            @timeupdate="timeChange"
            autoplay
            id="centerVideo"
            muted
            style="background-color: #1f1f1f"
          >
            <source v-if="videoUrl" :src="videoUrl" />
          </video>
        </div>
      </div>
      <div class="rightBox">
        <div class="rightBox_listBox">
          <div v-for="(item, index) in rightLlists" :key="index">
            <transition name="fade">
              <div
                class="rightBox_listBox_list topToDow pointer"
                v-show="item.showDiv"
                @click="toNewPage(item)"
              >
                <div>
                  <img :src="item.imageUrl" v-if="item.imageUrl" />
                  <img src="@/assets/position/listImage.png" v-else />
                </div>
                <div class="rightBox_listBox_list_info">
                  <p style="font-size: 1.2vh">信息条目: {{ item.index }}</p>
                  <p style="font-size: 1.2vh">时间点: {{ item.showTime }}</p>
                  <p class="rightBox_listBox_list_info_title" :title="item.title">
                    {{ item.title }}
                  </p>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
    <el-drawer
      title=""
      v-model="drawer.show"
      :show-close="false"
      destroy-on-close
      @close="closeFlow"
      size="60%"
    >
      <iframe
        v-if="drawer.showType === 'iframe'"
        class="iframeContent"
        :src="drawer.iframeUrl"
        security="restricted"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation allow-downloads"
      ></iframe>
      <div v-else-if="drawer.showType === 'textArea'" class="textAreaContent">
        <article class="markDown_context" v-html="compiledMarkdown"></article>
      </div>
      <div v-else-if="drawer.showType === 'carousel'">
        <el-carousel
          trigger="click"
          indicator-position="outside"
          height="59vh"
          :loop="false"
          :autoplay="false"
          @change="changeCarousel"
        >
          <el-carousel-item
            v-for="(choosedObj, index) in drawer.carouselArr"
            :key="index"
          >
            <div v-if="drawer.infoObj.type === 'VIDEO'">
              <!-- && carouselObj.carouselIndex === index && choosedObj.action !== 'JAVASCRIPT_VIDEO' -->
              <video
                v-show="
                  (choosedObj.source === 'NETWORK_VIDEO' ||
                    choosedObj.source === 'LOCAL_VIDEO') &&
                  drawer.carouselObj.carouselIndex === index
                "
                v-bind:src="choosedObj.showVideoPath"
                class="avatar video-avatar collVideo"
                controls="controls"
                :muted="true"
                :autoplay="index === 0 ? true : false"
                :id="`video${index}`"
                style="background-color: #000"
              >
                您的浏览器不支持视频播放
              </video>
              <div
                v-if="
                  choosedObj.source === 'JAVASCRIPT_VIDEO' &&
                  drawer.carouselObj.carouselIndex === index
                "
                class="JSVBox"
                v-html="choosedObj.showVideoPath"
              ></div>
              <iframe
                v-if="
                  choosedObj.source === 'HLS_VIDEO' &&
                  drawer.carouselObj.carouselIndex === index
                "
                security="restricted"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation allow-downloads"
                class="iframeContentCarousel"
                :src="choosedObj.showVideoPath"
              ></iframe>
              <div
                v-else-if="
                  choosedObj.source === 'YOUTUBE_VIDEO' &&
                  drawer.carouselObj.carouselIndex === index
                "
              >
                <ShowYoutube
                  ref="ShowYoutubeMain"
                  divId="addOrEditePlary"
                  style="height: 58vh; width: 90%; margin-left: 5%"
                  :youtobeId="choosedObj.showVideoPath.split('https://youtu.be/')[1]"
                ></ShowYoutube>
              </div>
            </div>
            <div v-else>
              <img
                :src="choosedObj.showVideoPath"
                v-if="choosedObj.showVideoPath"
                class="collVideo"
              />
              <img src="@/assets/position/listImage.png" v-else class="collVideo" />
            </div>
          </el-carousel-item>
        </el-carousel>
        <div class="videoFontBox">
          <div class="videoTitle" v-if="drawer.infoObj.type === 'VIDEO'">
            {{ drawer.carouselObj.title }}
          </div>
          <el-input
            v-if="drawer.carouselObj.comment"
            class="videoContent"
            type="textarea"
            :rows="drawer.infoObj.type === 'VIDEO' ? 8 : 10"
            v-model="drawer.carouselObj.comment"
            resize="none"
            readonly
          />
        </div>
      </div>
    </el-drawer>
    <el-dialog
      v-model="dialogVisible"
      :width="showModelAccontObj.type === 'h5' ? '20vw' : '30%'"
      :show-close="false"
      :lock-scroll="false"
      :before-close="handleClose"
    >
      <div v-if="showModelAccontObj.type === 'h5'" id="h5Fenxiang" >
        <el-popover placement="right" :width="50" trigger="click">
        <template #reference>
          <div >
            <div class="dian_h5"></div>
            <div class="qrcodeBox_title">
              <div class="qrcodeBox_title_font" :title="leftInfo">{{ leftInfo }}</div>
            </div>
            <div style="text-align: center">
              <img :src="infoImageUrl" class="h5img" v-if="infoImageUrl" />
              <img src="@/assets/position/listImage.png" class="h5img" v-else />
            </div>
            <div style="text-align: center; margin-top: 7vh">
              <div class="qrcode" id="qrcode" ref="qrCodeUrl"></div>
            </div>
          </div>
        </template>
        <div @click="h5Fenxiang" class="popoverFont">下载</div>
      </el-popover>
      </div>
      <div v-else-if="showModelAccontObj.type === 'weibo'">
        <el-input
          v-model="showModelAccontObj.fenxiangUrl"
          :rows="4"
          resize="none"
          type="textarea"
          @blur="blurInput"
          maxlength="40"
          show-word-limit
          placeholder="请输入要分享的内容标题"
        ></el-input>
        <div style="text-align: right; margin-top: 1.2vh">
          <el-button type="primary" @click="fenxiangFn(showModelAccontObj.type)"
            >分享</el-button
          >
        </div>
      </div>
      <div v-else>
        <el-input
          style="width: 20vw; min-height: 5vh"
          v-model="showModelAccontObj.fenxiangUrl"
          readonly
        />
        <div class="fenxiangUrl_imgBox" @click="copyUrl">
          <el-popover placement="right" width="auto" trigger="hover" content="复制链接">
            <template #reference>
              <img src="@/assets/img/preview/fenxiang.png" />
            </template>
          </el-popover>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import marked from "marked";
import { ElMessage } from "element-plus";
import { computed, reactive, toRefs } from "@vue/reactivity";
import * as publicFns from "@/api/public/index.js";
import * as addOrEditeFns from "@/components/homePage/account/addOrEdite/addOrEdite";
import * as rightInfoFns from "@/components/homePage/account/addOrEdite/rightinfo";
import html2Canvas from "html2canvas";
import router from "@/routes/index";
import * as previewFns from "./preview";
import { getCurrentInstance, nextTick } from "vue";
import QRCode from "qrcodejs2";
import ShowYoutube from "@/components/public/youtube/showYoutube.vue";
import DDConfig from "@/api/public/dingding";
export default {
  components: { ShowYoutube },
  data() {
    return {
      drawer: {
        show: false,
        infoObj: {},
        showType: "iframe",
        iframeUrl: "",
        carouselArr: [],
        carouselObj: {},
      },
      dialogVisible: false,
      showModelAccontObj: "",
    };
  },
  setup() {
    const data = reactive({
      leftInfo: "",
      leftShareUrl: "",
      returnUrl: '', // 上一页的路径
      rightLlists: [],
      videoUrl: "",
      infoImageUrl: "",
      leftRightBottomIcon: [
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
      mainVideoSource: "",
    });
    (async () => {
      await previewFns
        .details({ id: router.currentRoute.value.params.id, preview: true })
        .then((res) => {
          data.mainVideoSource = res.data.mainVideoSource;
          data.leftInfo = res.data.title;
          data.leftShareUrl = res.data.shareUrl;
          data.returnUrl = res.data.returnUrl
          data.videoUrl = res.data.mainVideoUrl;
          res.data.infoFlow.map((item) => {
            item.showTime = publicFns.secondsToTime(item.showTime);
          });
          data.rightLlists = res.data.infoFlow;
          data.infoImageUrl = res.data.imageUrl;
        });
    })();
    // 当前时间点
    function timeChange(e) {
      data.rightLlists = data.rightLlists.map((item) => {
        item.showDiv = e.target.currentTime * 1000 >= publicFns.timeToSec(item.showTime);
        return item;
      });
    }
    const listArr = computed(() => {
      return data.rightLlists.filter((v) => v.showDiv);
    });
    const instance = getCurrentInstance();
    function creatQrCode() {
      // const url =
      //   "http://192.168.10.6:8088/openView/preview/iwpost_1513581425975685122";
      if (!document.getElementById("qrcode").title) {
        new QRCode(instance.refs.qrCodeUrl, {
          text: data.returnUrl, // 需要转换为二维码的内容
          // text: url,
          width: 120,
          height: 120,
          colorDark: "#000000",
          // colorDark: 'green',
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H,
        });
      }
    }
    return {
      ...toRefs(data),
      timeChange,
      listArr,
      creatQrCode,
    };
  },
  computed: {
    compiledMarkdown() {
      return this.drawer.infoObj.docContent
        ? marked(this.drawer.infoObj.docContent, { sanitize: false })
        : "";
    },
  },
  mounted() {
    DDConfig.ddShowMenu(
      "钉钉分享",
      "@/assets/icon/heightPrecision/weibo_0.png",
      this.showModelAccontObj.fenxiangUrl
    );
  },
  methods: {
    toNewPage(obj) {
      if (this.mainVideoSource === "YOUTUBE") {
        this.$refs.previewYoutube.stopVideo();
      } else {
        const centerVideo = document.getElementById("centerVideo");
        if (centerVideo) {
          centerVideo.pause();
        }
      }
      this.drawer.show = true;
      addOrEditeFns.infoFlowDetails({ id: obj.id }).then((res) => {
        this.drawer.infoObj = res.data;
        if (this.drawer.infoObj.type) {
          switch (this.drawer.infoObj.type) {
            case "INTERNET_SITE":
              this.drawer.showType = "iframe";
              this.drawer.iframeUrl = res.data.content.internetSite;
              break;
            case "E_COMMERCE":
              this.drawer.showType = "iframe";
              this.drawer.iframeUrl = res.data.content.mallUrl;
              break;
            case "IMAGE":
              this.drawer.showType = "carousel";
              this.drawer.carouselArr = res.data.content.imagePage
                ? res.data.content.imagePage
                : [];
              this.drawer.carouselObj =
                this.drawer.carouselArr.length > 0
                  ? this.drawer.carouselArr[0]
                  : { comment: "" };
              break;
            case "VIDEO":
              this.drawer.showType = "carousel";
              this.drawer.carouselArr = res.data.content.videoPage
                ? res.data.content.videoPage
                : [];

              this.drawer.carouselObj =
                this.drawer.carouselArr.length > 0
                  ? this.drawer.carouselArr[0]
                  : { comment: "" };
              this.drawer.carouselObj.carouselIndex =
                this.drawer.carouselArr.length > 0 ? 0 : -1;
              break;
            case "SELF_BUILT_CONTENT":
              this.drawer.showType = "textArea";
              if (res.data.content && res.data.content.docId)
                rightInfoFns.textDetails({ id: res.data.content.docId }).then((res2) => {
                  this.drawer.infoObj.docContent =
                    res2.data && res2.data.content ? res2.data.content : "";
                });
              break;
          }
        } else {
          this.drawer.showType = "iframe";
          this.drawer.iframeUrl = "";
        }
      });
    },
    changeCarousel(i, oldi) {
      const oldVideo = document.getElementById(`video${oldi}`);
      if (oldVideo) {
        oldVideo.pause();
      }
      this.drawer.carouselObj = this.drawer.carouselArr[i];
      this.drawer.carouselObj.carouselIndex = i;
      this.drawer.carouselObj.comment = this.drawer.carouselObj.comment
        ? this.drawer.carouselObj.comment
        : "";
      this.$nextTick(() => {
        const newVideo = document.getElementById(`video${i}`);
        if (newVideo) {
          newVideo.play();
        }
      });
    },
    // 显示分享
    showInput(type) {
      this.showModelAccontObj = {};
      this.dialogVisible = true;
      this.leftRightBottomIcon.map((item) => {
        if (item.type === type) {
          item.iconUrl = require(`@/assets/icon/heightPrecision/${type}_1.png`);
          if (item.type !== "weibo") {
            item.fenxiangUrl = this.returnUrl;
          }
          this.showModelAccontObj = item;
        } else {
          item.iconUrl = require(`@/assets/icon/heightPrecision/${item.type}_0.png`);
          item.fenxiangUrl = "";
        }
      });
      if (type === "h5") {
        this.showQrcode();
      }
    },
    handleClose() {
      this.dialogVisible = false;
      this.leftRightBottomIcon.map((item) => {
        item.iconUrl = require(`@/assets/icon/heightPrecision/${item.type}_0.png`);
      });
    },
    copyUrl() {
      this.$copyText(this.showModelAccontObj.fenxiangUrl).then(() => {
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
    showQrcode() {
      nextTick(() => {
        this.creatQrCode();
      });
    },
    fenxiangFn(type) {
      if (type === "weibo") {
        let shareUrl = "https://service.weibo.com/share/share.php?";
        shareUrl += "url=" + encodeURIComponent(this.returnUrl);
        shareUrl += "&title=" + encodeURIComponent(this.showModelAccontObj.fenxiangUrl);
        window.open(
          shareUrl,
          "_blank",
          "height=100, width=400",
          "scrollbars=yes,resizable=1,modal=false,alwaysRaised=yes"
        );
      }
    },
    h5Fenxiang() {
      // html2Canvas(document.querySelector("#h5Fenxiang"),{useCORS: true}).then(canvas => {
      html2Canvas(document.getElementById("h5Fenxiang"), {
        useCORS: true,
        allowTaint: true,
      }).then((canvas) => {
        let dataURL = canvas.toDataURL("image/png", 1.0);
        if (dataURL !== "") {
          var a = document.createElement("a");
          a.download = this.leftInfo;
          a.href = dataURL;
          a.click();
        }
      });
    },
    currentTime(times) {
      this.rightLlists = this.rightLlists.map((item) => {
        item.showDiv = times * 1000 >= publicFns.timeToSec(item.showTime);
        return item;
      });
    },
    closeFlow() {
      this.drawer.show = false;
      if (this.mainVideoSource === "YOUTUBE") {
        this.$refs.previewYoutube.playVideo();
      } else {
        const centerVideo = document.getElementById("centerVideo");
        if (centerVideo) {
          centerVideo.play();
        }
      }
    },
    blackFn() {
      this.$router.push(sessionStorage.getItem("lasterRouter"));
    },
  },
};
</script>
<style lang="less" scoped>
.popoverFont:hover{
  cursor: pointer;
  color: blue;
}
.preview {
  height: 100%;
  background-color:#1f1f1f;
}
.qrcodeBox_title_font {
  font-size: 1.8vh;
  font-weight: bold;
  color: #000;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.h5img {
  margin-top: 3vh;
  width: 18vw;
  height: 21vh;
}
.gridBox {
  background-color: #EFF3F3;
  .leftBox {
    float: left;
    width: 20vw;
    display: inline-grid;
    grid-template-rows: 8vh 26vh 20vh;
    background-color: #445556;
    // box-shadow: 0 0 2vh #b6b6b7;
    height: calc(100vh - 8vh);
    margin: 2vh;
    position: relative;
    &_shareIcon {
      position: absolute;
      right: 1vw;
      bottom: 2vh;
      img {
        cursor: pointer;
      }
    }
    .dian {
      background-color: #1f1f1f;
      width: 1vw;
      height: 2vh;
      position: relative;
      top: 2vh;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
    }
  }
  .centerBox {
    .videoBox {
      position: absolute;
      top: 50%;
      left: 22vw;
      transform: translate(0, -50%);
      z-index: 2;
      width: 60vw;
      height: 70vh;
      // box-shadow: 0 0 2vh #b6b6b7;
      video {
        width: 100%;
        height: 100%;
        source {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .rightBox {
    float: right;
    // background-color: #F4F8F8;
    width: 35vw;
    height: calc(100vh - 8vh);
    &_listBox {
      height: 100%;
      overflow-y: auto;
      &_list {
        // box-shadow: #b6b6b7 0 0 1vh;
        background-color: #445556;
        height: 21vh;
        padding: 1vh;
        margin: 2vh;
        display: inline-grid;
        grid-template-columns: 1fr 1.5fr 0.1fr;
        img {
          width: 18vw;
          height: 21vh;
        }
        &_info {
           color:#eff3f3;
          margin-left: 1.6vh;
          max-width: 15vw;
          text-align: right;
          position: relative;
          &_title {
            font-size: 2.5vh;
            font-weight: bold;
            // max-width: 11vw;
            text-align: left;
            position: absolute;
            right: 0;
            bottom: 0;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 4;
            line-clamp: 4;
            -webkit-box-orient: vertical;
          }
        }
      }
    }
    position: relative;
    &_qrcodeBox {
      background-color: #fff;
      opacity: 1;
      width: 23vw;
      height: 71vh;
      position: absolute;
      top: 50%;
      left: 30%;
      transform: translate(-50%, -50%);
      z-index: 3;
      padding: 2vh 0 8vh 0;
      &_title {
        height: 14vh;
        position: relative;
        &_font {
          width: 13vw;
          font-size: 1.8vh;
          font-weight: bold;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .title {
        font-size: 3.4vh;
        font-weight: bold;
      }
      img {
        height: 30vh;
        width: 100%;
      }
    }
  }
}
.fenxiangUrl_imgBox {
  position: absolute;
  top: 55%;
  right: 0;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  box-shadow: 0 0 2vh #b6b6b7;
  width: 4.5vw;
  height: 9vh;
  cursor: pointer;
  img {
    width: 1.5vw;
    height: 3vh;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
.leftInfoBx {
  max-height: 10vh;
  overflow-y: auto;
}
.videoFontBox {
  box-sizing: border-box;
  margin-left: 5%;
  width: 90%;
  padding: 0.5vh;
  margin-top: 3vh;
  height: 23vh;
  background-color: #718c8d;
  overflow: hidden;
  overflow-y: auto;
  .videoTitle {
    font-size: 2.2vh;
    font-weight: bold;
  }
  .videoContent {
    font-size: 1.4vh;
    overflow-x: hidden;
    word-break: break-all;
  }
}
.collVideo {
  width: 90%;
  height: 100%;
  position: absolute;
  top: 50%;
  left: 5%;
  transform: translate(0, -50%);
}
.qrcode {
  display: inline-block;
  img {
    width: 16.6vw;
    height: 13.2vh;
    background-color: #fff;
    padding: 0.6vh;
    box-sizing: border-box;
  }
}
.dian_h5 {
  background-color: rgb(220, 220, 220);
  width: 1vw;
  height: 2vh;
  position: relative;
  top: -3vh;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
}
.leftTitle {
  max-width: 15vw;
  position: absolute;
  left: 0%;
  top: 15%;
  transform: translate(-90%, -50%);
  z-index: inherit;
  background-color: #fff;
  font-size: 5vh;
  font-weight: bold;
  padding: 2vh 3vw;
  box-shadow: 0 0 2vh #b6b6b7;
}
.JSVBox {
  height: 58vh;
  :deep(iframe){
    padding-left: 5%;
    width: 90%;
    height: 100%;
  }
}
.iframeContent {
  // width: 100%;
  margin-left: 5%;
  width: 90%;
  height: 100%;
  border: 0;
}
.iframeContentCarousel {
  margin-left: 5%;
  width: 90%;
  height: 59vh;
  border: 0;
}
.textAreaContent {
  margin-left: 5%;
  width: 90%;
  height: 90vh;
  overflow: hidden;
  overflow-y: auto;
  border: 0;
}
</style>
<style lang="less">
.preview {
  .el-drawer {
    overflow: initial;
  }
  // .el-drawer__header{
  //   padding: 0;
  //   margin: 0;
  // }
  .el-drawer{
    background-color: #445556;
    color:#EFF3F3
  }
  .videoFontBox{
    .el-textarea__inner{
    background-color: #718c8d;
    border-color:#718c8d;
    color: #EFF3F3;
    &:hover{
      border-color:#718c8d;
    }
  }
  }
  
}
</style>
