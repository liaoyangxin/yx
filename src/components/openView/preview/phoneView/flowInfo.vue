<template>
  <div style="height: 100%;background-color: #445556;color:eff3f3">
    <div v-if="pageType === 'carousel'" class="phoneCarouselBox">
      <el-carousel
        trigger="click"
        :loop="false"
        :autoplay="false"
        indicator-position="outside"
        @change="changeCarousel"
      >
        <el-carousel-item v-for="(item, index) in carouselArr" :key="`carousel${index}`">
          <div v-if="infoType === 'IMAGE'" class="phoneCarouselBox_imgBox">
            <img :src="item.showVideoPath" v-if="item.showVideoPath" />
            <img src="@/assets/position/listImage.png" v-else />
          </div>
          <div v-else-if="infoType === 'VIDEO'" class="phoneCarouselBox_imgBox">
              <video
                v-if="item.showVideoPath && item.source === 'LOCAL_VIDEO' && carouselObj.index === index"
                v-bind:src="item.showVideoPath"
                class="avatar video-avatar collVideo"
                controls="controls"
                webkit-playsinline="true"
                playsinline="true"
                :id="`video${index}`"
              >
                您的浏览器不支持视频播放
              </video>
              <div v-else-if="item.source === 'JAVASCRIPT_VIDEO' && carouselObj.index === index" v-html="item.showVideoPath" class="JSVBox"></div>
              <iframe
                v-else-if="
                  (item.source === 'NETWORK_VIDEO' ||
                  item.source === 'YOUTUBE_VIDEO' ||
                  item.source === 'HLS_VIDEO') && carouselObj.index === index
                "
                class="iframeContentCarousel collVideo"
                :src="item.showVideoPath"
                security="restricted"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
              ></iframe>
              <img src="@/assets/position/listVideo.png" class="collVideo" v-else />
          </div>
          <div></div>
        </el-carousel-item>
      </el-carousel>
      <div class="remarkBox">
        <div v-if="infoType === 'VIDEO'" class="remarkBox_title">
          {{ carouselObj.title }}
        </div>
        <div v-if="carouselObj.comment">
          {{carouselObj.comment}}
        </div>
      </div>
    </div>
    <div v-if="pageType === 'iframe'" style="height: 100%">
      <iframe
        referrerpolicy="no-referrer"
        frameborder="0"
        class="iframBox"
        :src="iframeUrl"
        id="child_html"
        security="restricted"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
      ></iframe>
    </div>
    <div v-else-if="pageType === 'textArea'" class="markDownBox">
      <article class="markDown_context" v-html="compiledMarkdown"></article>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs } from "@vue/reactivity";
import marked from "marked";
import * as allFns from "./flowInfo";
import "./jweixin-1.6.0";
export default {
  props: {
    flowInfoId: {
      type: Number,
      default: -1,
    },
  },
  setup(props) {
    const data = reactive({
      pageType: "",
      infoType: "",
      carouselArr: [],
      iframeUrl: "",
      carouselObj: {},
      docContent: "",
    });
    init();
    function init() {
      allFns.infoFlowDetails({ id: props.flowInfoId }).then((res) => {
        if (res.code === 200) {
          data.pageType = "";
          data.carouselArr = [];
          data.infoType = res.data.type;
          switch (data.infoType) {
            case "IMAGE":
              data.pageType = "carousel";
              data.carouselArr = res.data.content.imagePage;
              break;
            case "VIDEO":
              data.pageType = "carousel";
              data.carouselArr = res.data.content.videoPage;
              break;
            case "INTERNET_SITE": // 网络地址
              data.pageType = "iframe";
              data.iframeUrl = res.data.content.internetSite;
              break;
            case "E_COMMERCE": // 电商
              data.pageType = "iframe";
              data.iframeUrl = res.data.content.mallUrl;
              break;
            case "SELF_BUILT_CONTENT": // markdown
              data.pageType = "textArea";
              if (res.data.content && res.data.content.docId) {
                allFns.textDetails({ id: res.data.content.docId }).then((res2) => {
                  data.docContent =
                    res2.data && res2.data.content ? res2.data.content : "";
                });
              }
              break;
          }
          if (data.carouselArr.length > 0) {
            data.carouselObj = data.carouselArr[0];
            data.carouselObj.index = 0
          } else {
            data.carouselObj.index = -1
          }
        }
      });
    }

    return {
      ...toRefs(data),
    };
  },
  computed: {
    compiledMarkdown() {
      return this.docContent ? marked(this.docContent, { sanitize: false }) : "";
    },
  },
  mounted() {
    const _this = this;
    window.addEventListener("message", function (msg) {
      _this.wxPay(msg);
    });
  },
  methods: {
    changeCarousel(carouselIndex) {
      this.carouselObj = this.carouselArr[carouselIndex];
      this.carouselObj.index = carouselIndex
    },
    wxPay(msg) {
      window.jsApiCall = function () {
        WeixinJSBridge.invoke("getBrandWCPayRequest", msg.data.data, function (res) {
          if (res.err_msg === "get_brand_wcpay_request:ok") {
            document.getElementById("child_html").contentWindow.location.href =
              msg.data.return_href;
          } else {
            if (res.err_desc) {
              alert(res.err_desc);
            }
            document.getElementById("child_html").contentWindow.location.href =
              msg.data.href;
          }
        });
      };
      if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
          document.addEventListener("WeixinJSBridgeReady", jsApiCall, false);
        } else if (document.attachEvent) {
          document.attachEvent("WeixinJSBridgeReady", jsApiCall);
          document.attachEvent("onWeixinJSBridgeReady", jsApiCall);
        }
      } else {
        jsApiCall();
      }
    },
  },
};
</script>
<style lang="less">
.phoneCarouselBox {
  .el-carousel__container {
    height: 14rem !important;
  }
}
</style>
<style lang="less" scoped>
.videoContent {
    font-size: 0.75rem;
    overflow-x: hidden;
    word-break: break-all;
  }
.markDownBox {
  padding: 0 0.5rem;
  width: calc(100%-1rem);
  overflow: hidden;
  background-color: #718c8d;
  color: #EFF3F3;
}
.iframBox {
  width: 100%;
  height: 100%;
}
.phoneCarouselBox {
  &_imgBox {
    text-align: center;
    img {
      // width: calc(100vw-1rem);
      // margin:0rem 0.5rem;
      width: 100vw;
      height: 14rem;
      object-fit: cover;
    }
    video,
    .collVideo{
      width: 100%;
      // margin:0 .5rem;
      height: 14rem;
      background-color: #000;
    }
  }
}
.remarkBox {
  margin: 0.5rem .3rem .3rem .3rem;
  padding: 0.5rem 0.5rem;
  height: 50vh;
  overflow: hidden;
  overflow-y: auto;
  margin-bottom: 4rem;
  background-color: #718c8d;
  color: #EFF3F3;
  &_title {
    font-size: 1rem;
    font-weight: bold;
  }
  &_span {
    font-size: 0.75rem;
  }
}
.JSVBox {
  height: 14rem;
  :deep(iframe){
    // padding-left: 5%;
    width: 100%;
    height: 100%;
  }
}
</style>
