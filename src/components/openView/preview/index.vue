// 视屏预览
<template>
  <div class="openPreview">
    <div v-if="showPage === 'pc'" class="gridBox">
      <div class="leftBox">
        <div class="dian"></div>
        <div class="leftBox_authorInfo">
          <div class="leftBox_authorInfo_imgBox">
            <img :src="leftInfo.authorAvatar" v-if="leftInfo.authorAvatar" />
            <img src="@/assets/position/userHead.png" v-else />
          </div>

          <div class="leftBox_authorInfo_infoBox">
            <p :title="leftInfo.title">{{ leftInfo.title }}</p>
            <h3 class="overFlowPoint" :title="leftInfo.authorName">
              {{ leftInfo.authorName }}
            </h3>
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
                <div class="leftBox_shareIcon_iconBox" @click="showInput(item.type)">
                  <img class="pointer" :src="item.iconUrl" />
                </div>
              </template>
            </el-popover>
          </div>
          <el-popover placement="left" width="auto" trigger="hover" content="返回">
            <template #reference>
              <div class="leftBox_shareIcon_iconBoxB" @click="blackFn">
                <img class="pointer" src="@/assets/img/preview/balck8.png" />
              </div>
            </template>
          </el-popover>
        </div>
      </div>
      <div class="centerBox">
        <div class="videoBox">
          <div v-if="mainVideoSource === 'YOUTUBE'">
            <ShowYoutube
              ref="openViewYoutube"
              :fromView="true"
              style="width: 60vw; height: 70vh"
              @currentTime="currentTime"
              :muted="false"
              :youtobeId="videoUrl.split('https://youtu.be/')[1]"
            ></ShowYoutube>
          </div>
          <video
            v-else
            controls
            @timeupdate="timeChange"
            autoplay
            id="centerVideo"
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
                <img :src="item.imageUrl" v-if="item.imageUrl" />
                <img src="@/assets/position/listImage.png" v-else />
                <div class="rightBox_listBox_list_info">
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
    <div v-else-if="showPage === 'phone'">
      <PhoneView></PhoneView>
    </div>
    <el-drawer
      title=""
      :append-to-body="true"
      :modal-append-to-body="false"
      v-model="drawer.show"
      v-if="drawer.show"
      :show-close="false"
      destroy-on-close
      @close="closeFlow"
      size="50%"
      :z-index="99"
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
          height="58vh"
          :loop="false"
          :autoplay="false"
          @change="changeCarousel"
        >
          <el-carousel-item
            v-for="(choosedObj, index) in drawer.carouselArr"
            :key="index"
          >
            <div v-if="drawer.infoObj.type === 'VIDEO'">
              <video
                v-show="
                  (choosedObj.source === 'NETWORK_VIDEO' ||
                    choosedObj.source === 'LOCAL_VIDEO') &&
                  drawer.carouselObj.carouselIndex === index
                "
                v-bind:src="choosedObj.showVideoPath"
                class="avatar video-avatar collVideo"
                controls="controls"
                :muted="false"
                :autoplay="index === 0 ? true : false"
                :id="`video${index}`"
                style=""
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
                class="iframeContentCarousel"
                :src="choosedObj.showVideoPath"
                security="restricted"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation allow-downloads"
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
                  style="height: 59vh; width: 90%; margin-left: 5%"
                  :muted="false"
                  :youtobeId="choosedObj.showVideoPath.split('https://youtu.be/')[1]"
                ></ShowYoutube>
              </div>
            </div>
            <div v-else>
              <img :src="choosedObj.showVideoPath" class="collVideo" />
            </div>
          </el-carousel-item>
        </el-carousel>
        <div class="videoFontBox">
          <div class="videoTitle" v-if="drawer.infoObj.type === 'VIDEO'">
            {{ drawer.carouselObj.title }}
          </div>
          <!-- <div class="videoContent">{{ drawer.carouselObj.comment }}</div> -->
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
      <div v-if="showModelAccontObj.type === 'h5'" id="h5Fenxiang">
        <!-- @contextmenu.prevent @mouseup="h5Fenxiang"-->
        <el-popover placement="right" :width="50" trigger="click">
          <template #reference>
            <div>
              <div class="dian_h5"></div>
              <div class="rightBox_qrcodeBox_title">
                <div class="qrcodeBox_title_font" :title="leftInfo.title">
                  {{ leftInfo.title }}
                </div>
              </div>
              <div style="text-align: center">
                <img id="h5FenxiangImg" :src="infoImageUrl" class="h5img" v-if="infoImageUrl" />
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
import html2Canvas from "html2canvas";
import PhoneView from "./phoneView/index.vue";
import moment from "moment";
import router from "@/routes/index";
import * as previewFns from "./index.js";
import { getCurrentInstance, nextTick } from "vue";
import QRCode from "qrcodejs2";
import ShowYoutube from "@/components/public/youtube/showYoutube.vue";
export default {
  components: { PhoneView, ShowYoutube },
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
      showPage: "pc",
      pageWidth: null,
      leftInfo: {
        authorAvatar: "", // 作者头像
        authorName: "",
        title: "",
        shareUrl: "", // 分享的路径
        returnUrl: "", // 上一页的路径
      },
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
    function os() {
      var ua = navigator.userAgent,
        isWindowsPhone = /(?:Windows Phone)/.test(ua),
        isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
        isAndroid = /(?:Android)/.test(ua),
        isFireFox = /(?:Firefox)/.test(ua),
        // isChrome = /(?:Chrome|CriOS)/.test(ua),
        isTablet =
          /(?:iPad|PlayBook)/.test(ua) ||
          (isAndroid && !/(?:Mobile)/.test(ua)) ||
          (isFireFox && /(?:Tablet)/.test(ua)),
        isPhone = /(?:iPhone)/.test(ua) && !isTablet,
        isPc = !isPhone && !isAndroid && !isSymbian;
      return {
        isTablet: isTablet,
        isPhone: isPhone,
        isAndroid: isAndroid,
        isPc: isPc,
      };
    }
    if (os().isTablet || os().isPc) {
      data.showPage = "pc";
      previewFns
        .details({ id: router.currentRoute.value.params.id, preview: true })
        .then((res) => {
          data.leftInfo = {
            authorAvatar: res.data.authorAvatar, // 作者头像
            authorName: res.data.authorName,
            title: res.data.title,
            shareUrl: res.data.shareUrl,
            returnUrl: res.data.returnUrl
          };
          data.mainVideoSource = res.data.mainVideoSource;
          data.videoUrl = res.data.mainVideoUrl;
          res.data.infoFlow.map((item) => {
            item.showTime = previewFns.secondsToTime(item.showTime);
          });
          data.rightLlists = res.data.infoFlow;
          data.infoImageUrl = res.data.imageUrl!==''?res.data.imageUrl+"?time="+new Date().getTime():"";

          const attr = {
            iwpostId: res.data.id,
            createdAt: moment(String(new Date())).format("YYYY-MM-DDTHH:mm:ss"),
          };
          previewFns.playRecord(attr);
        });
    } else {
      data.showPage = "phone";
    }
    // 当前时间点
    function timeChange(e) {
      data.rightLlists = data.rightLlists.map((item) => {
        item.showDiv = e.target.currentTime * 1000 >= previewFns.timeToSec(item.showTime);
        return item;
      });
    }
    const listArr = computed(() => {
      return data.rightLlists.filter((v) => v.showDiv);
    });
    const instance = getCurrentInstance();
    function creatQrCode() {
      if (!document.getElementById("qrcode").title) {
        new QRCode(instance.refs.qrCodeUrl, {
          text: data.leftInfo.returnUrl, // 需要转换为二维码的内容
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
  methods: {
    toNewPage(obj) {
      if (this.mainVideoSource === "YOUTUBE") {
        this.$refs.openViewYoutube.stopVideo();
      } else {
        const centerVideo = document.getElementById("centerVideo");
        if (centerVideo) {
          centerVideo.pause();
        }
      }
      const attr = {
        infoFlowId: obj.id,
        createdAt: moment(String(new Date())).format("YYYY-MM-DDTHH:mm:ss"),
      };
      previewFns.infoFlowClick(attr);

      this.drawer.show = true;
      previewFns.infoFlowDetails({ id: obj.id }).then((res) => {
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
              if (res.data.content && res.data.content.docId) {
                previewFns.textDetails({ id: res.data.content.docId }).then((res) => {
                  this.drawer.infoObj.docContent =
                    res.data && res.data.content ? res.data.content : "";
                });
              }
              break;
          }
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
            item.fenxiangUrl = this.leftInfo.returnUrl;
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
        shareUrl += "url=" + encodeURIComponent(this.leftInfo.returnUrl);
        shareUrl += "&title=" + encodeURIComponent(this.showModelAccontObj.fenxiangUrl);
        window.open(
          shareUrl,
          "_blank",
          "height=100, width=400",
          "scrollbars=yes,resizable=1,modal=false,alwaysRaised=yes"
        );
      }
    },
    closeFlow() {
      this.drawer.show = false;
      if (this.mainVideoSource === "YOUTUBE") {
        this.$refs.openViewYoutube.playVideo();
      } else {
        const centerVideo = document.getElementById("centerVideo");
        if (centerVideo) {
          centerVideo.play();
        }
      }
    },
    blackFn() {
      // 如果没参数默认返回cd首页
      // if (sessionStorage.getItem('referer')){
      //   location.replace(sessionStorage.getItem('referer'))
      //   sessionStorage.removeItem('referer')
      // } else {
      //   location.replace("https://cd.idworlds.com/")
      // }
      // this.$router.go(-1);
      location.replace(this.leftInfo.returnUrl)
      // location.href = this.leftInfo.returnUrl
    },
    getImage(url,imgId) {
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
    h5Fenxiang() {
      this.getImage(this.infoImageUrl,"h5FenxiangImg")
      html2Canvas(document.querySelector("#h5Fenxiang"), {
        useCORS: true,
        allowTaint: true,
      }).then((canvas) => {
        let dataURL = canvas.toDataURL("image/png", 1.0);
        if (dataURL !== "") {
          var a = document.createElement("a");
          a.download = this.leftInfo.title;
          a.href = dataURL;
          a.click();
        }
      });
    },
    currentTime(times) {
      this.rightLlists = this.rightLlists.map((item) => {
        item.showDiv = times * 1000 >= previewFns.timeToSec(item.showTime);
        return item;
      });
    },
  },
};
</script>
<style lang="less" scoped>
.popoverFont:hover {
  cursor: pointer;
  color: blue;
}
.qrcodeBox_title_font {
  font-size: 1.8vh;
  font-weight: bold;
  color: #1f1f1f;
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
.openPreview {
  height: 100%;
  background-color: #1f1f1f;
}
.gridBox {
  .leftBox {
    float: left;
    // box-shadow: 0 0 2vh #b6b6b7;
    background-color: #445556;
    height: 84vh;
    padding: 2vh;
    margin: 2vh;
    position: relative;
    &_authorInfo {
      display: inline-block;
      margin-top: 3vh;
      &_imgBox {
        display: inline-block;
        img {
          width: 6vw;
          height: 12vh;
        }
      }
      &_infoBox {
        display: inline-block;
        color:#eff3f3;
        width: 6vw;
        height: 12vh;
        vertical-align: top;
        margin-left: 1vw;
        position: relative;
        p {
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        h3 {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 6vw;
        }
      }
    }
    &_shareIcon {
      position: absolute;
      left: 50%;
      bottom: 1vh;
      transform: translate(-50%, 0%);
      &_iconBox {
        width: 24px;
        height: 24px;
        // border-radius: 50%;
        // box-shadow: 0 0 1vh #b6b6b7;
        margin-bottom: 1.5vh;
        position: relative;
        img {
          height: 1.5vh;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          // background-color: #9bbbb1;
        }
      }
      &_iconBoxB {
        margin-top: 6vh;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        // box-shadow: 0 0 1vh #b6b6b7;
        position: relative;
        img {
          height: 1.4vh;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
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
      // left: 21vw;
      left: 50%;
      transform: translate(-50%, -50%);
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
    width: 35vw;
    height: calc(100vh - 8vh);
    &_listBox {
      height: 100%;
      overflow-y: auto;
      &_list {
         background-color: #445556;
        // box-shadow: #b6b6b7 0 0 1vh;
        height: 21vh;
        padding: 1vh;
        margin: 2vh 1vw;
        display: inline-grid;
        grid-template-columns: 1fr 1.5fr;
        img {
          width: 18vw;
          height: 21vh;
        }
        &_info {
          max-width: 15vw;
          text-align: right;
          color:#eff3f3;
          p {
            text-align: right;
          }
          position: relative;
          &_title {
            font-size: 2.5vh;
            font-weight: bold;
            max-width: 11vw;
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
  // box-shadow: 0 0 2vh #b6b6b7;
  width: 4.5vw;
  height: 9vh;
  cursor: pointer;
  img {
    width: 1.7vw;
    height: 3.4vh;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
.leftInfoBx {
  max-height: 13vh;
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
    overflow: hidden;
    overflow-y: auto;
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
    width: 6vw;
    height: 13vh;
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
  // box-shadow: 0 0 2vh #b6b6b7;
}
.JSVBox {
  height: 58vh;
  :deep(iframe){
    padding-left: 5%;
    width: 90%;
    height: 100%;
  }
}
.iframeContentCarousel {
  margin-left: 5%;
  width: 90%;
  height: 59vh;
  border: 0;
}
.iframeContent {
  margin-left: 5%;
  width: 90%;
  height: 100%;
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
    
// }
.preview {
  .el-drawer {
    overflow: initial;
  }
}
</style>
