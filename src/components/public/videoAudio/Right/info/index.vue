<template>
  <div>
    <div>
      <div class="headerIconDiv iconStyle">
        <el-popover
          v-for="(item, index) in headerIcon"
          :key="index"
          placement="bottom"
          width="auto"
          trigger="hover"
          :content="item.title"
        >
          <template #reference>
            <img
              :src="item.iconUrl"
              style="width: 3vh; height: 3vh"
              @click="clickHeardIcon(item)"
            />
          </template>
        </el-popover>
      </div>
      <div class="headerInput">
        <el-input
          v-if="choosedHeaderIcon.titleInputType === 'url'"
          v-model="choosedHeaderIcon.titleInputVal"
          @blur="blurInput"
          placeholder="请输入网址"
        ></el-input>
        <el-input
          v-else-if="choosedHeaderIcon.titleInputType === 'search'"
          v-model="choosedHeaderIcon.titleInputVal"
          @keyup.enter="blurInput"
          placeholder="请输入查询字段"
        ></el-input>
        <el-input
          v-else-if="choosedHeaderIcon.titleInputType === 'DIY'"
          v-model="choosedHeaderIcon.docComment"
          resize="none"
          type="textarea"
          @blur="blurInput"
          class="diyBox"
          placeholder="请输入脚本"
        ></el-input>
        <el-input
          v-else-if="
            (choosedHeaderIcon.titleInputType === 'image_url' &&
              carouselObj.action === 'NETWORK_IMAGE') ||
            (choosedHeaderIcon.titleInputType === 'image_url' &&
              carouselObj.source === 'NETWORK_IMAGE') ||
            (choosedHeaderIcon.titleInputType === 'video_url' &&
              carouselObj.action == 'NETWORK_VIDEO') ||
            (choosedHeaderIcon.titleInputType === 'video_url' &&
              carouselObj.source == 'NETWORK_VIDEO')
          "
          v-model="carouselObj.showVideoPath"
          @blur="blurAccount('top')"
          placeholder="请输入网址"
        ></el-input>
        <el-input
          v-else-if="
            choosedHeaderIcon.titleInputType === 'video_url' &&
            carouselObj.action == 'YOUTUBE_VIDEO'
          "
          v-model="carouselObj.showVideoPath"
          @blur="blurAccount('top')"
          placeholder="请输入网址"
        ></el-input>
        <el-input
          v-else-if="
            choosedHeaderIcon.titleInputType === 'video_url' &&
            carouselObj.action == 'HLS_VIDEO'
          "
          v-model="carouselObj.showVideoPath"
          @blur="blurAccount('top')"
          placeholder="请输入网址"
        ></el-input>
        <el-input
          v-else-if="choosedHeaderIcon.titleInputType === 'video_javaScript'"
          v-model="carouselObj.showVideoPath"
          :rows="2"
          resize="none"
          type="textarea"
          @blur="blurAccount('top')"
          placeholder="请输入脚本"
        ></el-input>
        <div v-else style="height: 4vh"></div>
      </div>
      <div class="accountBox" v-if="choosedHeaderIcon.titleInputType !== 'DIY'">
        <iframe
          v-if="
            choosedHeaderIcon.action !== 'VIDEO' && choosedHeaderIcon.action !== 'IMAGE'
          "
          referrerpolicy="no-referrer"
          frameborder="0"
          :style="`width: 100%; height:73vh; margin-top: 3vh`"
          :src="choosedHeaderIcon.titleInputVal"
          security="restricted"
          sandbox="allow-scripts allow-same-origin"
        ></iframe>
        <!-- 视频和图的表现页 -->
        <div v-else>
          <div v-if="choosedHeaderIcon.action === 'IMAGE'">
            <div
              style="height: 58vh"
              class="accountBox_videoAdd"
              v-if="showAddImage === 'local' || showAddImage === 'local_add'"
            >
              <img
                class="pointer collVideo"
                src="@/assets/img/1202_657add.png"
                @click="showChooseList"
              />
            </div>
            <div
              class="accountBox_videoAdd"
              v-else-if="
                (showAddImage === 'netWork' && !carouselObj.showVideoPath) ||
                showAddImage === 'netWork_add'
              "
              style="height: 58vh"
            >
              <el-empty description="暂无数据"></el-empty>
            </div>
            <div class="carouselBox" v-else-if="showAddImage === 'carousel'">
              <el-carousel
                trigger="click"
                indicator-position="outside"
                height="58vh"
                :loop="false"
                :autoplay="false"
                :initial-index="showImageCarouselIndex"
                @change="changeCarousel"
                v-if="choosedHeaderIcon.imagePage.length > 0"
              >
                <el-carousel-item
                  v-for="(choosedObj, index) in choosedHeaderIcon.imagePage"
                  :key="index"
                >
                  <img
                    :src="choosedObj.showVideoPath"
                    v-if="choosedObj.showVideoPath"
                    @click="
                      () => {
                        choosedObj.source === 'LOCAL_IMAGE'
                          ? showChooseList(choosedObj.id)
                          : '';
                      }
                    "
                    class="collVideo pointer"
                  />
                  <img
                    src="@/assets/img/1202_657add.png"
                    v-else-if="
                      !choosedObj.showVideoPath && choosedObj.source === 'LOCAL_IMAGE'
                    "
                    @click="
                      () => {
                        showChooseList(choosedObj.id);
                      }
                    "
                    class="collVideo pointer"
                  />
                  <div
                    v-else-if="
                      !choosedObj.showVideoPath && choosedObj.source !== 'LOCAL_IMAGE'
                    "
                  >
                    <el-empty description="暂无数据"></el-empty>
                  </div>
                </el-carousel-item>
              </el-carousel>
              <img
                src="@/assets/img/1202_657add.png"
                v-else
                @click="
                  () => {
                    showChooseList();
                  }
                "
                class="collVideo pointer"
                style="height: 58vh"
              />
            </div>
          </div>
          <div v-if="choosedHeaderIcon.action === 'VIDEO'">
            <div
              style="height: 58vh"
              class="accountBox_videoAdd"
              v-if="showAddImage === 'local' || showAddImage === 'local_add'"
            >
              <img
                class="pointer"
                src="@/assets/img/1202_657add.png"
                @click="showChooseList"
              />
            </div>
            <div
              class="accountBox_videoAdd"
              v-else-if="
                (showAddImage === 'netWork' && !carouselObj.showVideoPath) ||
                (showAddImage === 'youTuBe' && !carouselObj.showVideoPath) ||
                (showAddImage === 'hls' && !carouselObj.showVideoPath) ||
                (showAddImage === 'javaScript' && !carouselObj.showVideoPath) ||
                showAddImage === 'javaScript_add' ||
                showAddImage === 'youTuBe_add' ||
                showAddImage === 'netWork_add'
              "
              style="height: 58vh"
            >
              <el-empty description="暂无数据"></el-empty>
            </div>
            <div class="carouselBox" v-else-if="showAddImage === 'carousel'">
              <!-- :initial-index="choosedHeaderIcon.videoPage.length - 1" -->
              <el-carousel
                trigger="click"
                height="58vh"
                indicator-position="outside"
                :loop="false"
                :autoplay="false"
                :initial-index="showVideoCarouselIndex"
                @change="changeCarousel"
                v-if="choosedHeaderIcon.videoPage.length > 0"
              >
                <el-carousel-item
                  v-for="(choosedObj, index) in choosedHeaderIcon.videoPage"
                  :key="index"
                  :name="`${index}`"
                >
                  <div
                    v-if="
                      choosedObj.action === 'JAVASCRIPT_VIDEO' &&
                      carouselObj.carouselIndex === index
                    "
                    class="JSVBox"
                    v-html="choosedObj.showVideoPath"
                  ></div>
                  <!-- carouselObj.action === 'YOUTUBE_VIDEO'? choosedHeaderIcon.titleInputVal.replace('https://youtu.be/','https://www.youtube.com/embed/')  -->
                  <!-- youtube iframe 路劲转换 -->
                  <iframe
                    v-if="
                      choosedObj.source === 'HLS_VIDEO' &&
                      carouselObj.carouselIndex === index
                    "
                    class="iframeContentCarousel"
                    :src="
                      carouselObj.source === 'YOUTUBE_VIDEO'
                        ? choosedObj.showVideoPath.replace(
                            'https://youtu.be/',
                            'https://www.youtube.com/embed/'
                          )
                        : choosedObj.showVideoPath
                    "
                    security="restricted"
                    sandbox="allow-scripts allow-same-origin"
                  ></iframe>
                  <div
                    v-else-if="
                      choosedObj.source === 'YOUTUBE_VIDEO' &&
                      carouselObj.carouselIndex === index
                    "
                  >
                    <ShowYoutube
                      ref="ShowYoutubeMain"
                      divId="addOrEditePlary"
                      style="height: 58vh; width: 100%"
                      :youtobeId="choosedObj.showVideoPath.split('https://youtu.be/')[1]"
                    ></ShowYoutube>
                  </div>
                  <video
                    @click="
                      () => {
                        choosedObj.source === 'LOCAL_VIDEO'
                          ? showChooseList(choosedObj.id)
                          : '';
                      }
                    "
                    v-else-if="
                      choosedObj.showVideoPath &&
                      carouselObj.carouselIndex === index &&
                      (choosedObj.source === 'NETWORK_VIDEO' ||
                        choosedObj.action === 'LOCAL_VIDEO')
                    "
                    v-bind:src="choosedObj.showVideoPath"
                    class="avatar video-avatar collVideo"
                    controls
                    muted
                    autoplay
                    :id="`video${index}`"
                    style="background-color: #000"
                  >
                    您的浏览器不支持视频播放
                  </video>
                  <img
                    src="@/assets/img/1202_657add.png"
                    v-else-if="
                      !choosedObj.showVideoPath && choosedObj.source === 'LOCAL_VIDEO'
                    "
                    @click="
                      () => {
                        showChooseList(choosedObj.id);
                      }
                    "
                    class="collVideo pointer"
                  />
                  <div
                    v-else-if="
                      !choosedObj.showVideoPath && choosedObj.source !== 'LOCAL_VIDEO'
                    "
                  >
                    <el-empty description="暂无数据"></el-empty>
                  </div>
                </el-carousel-item>
              </el-carousel>
              <img
                src="@/assets/img/1202_657add.png"
                v-else
                @click="
                  () => {
                    showChooseList();
                  }
                "
                class="collVideo pointer"
              />
            </div>
          </div>
          <div class="centerIconBox iconStyle">
            <el-popover
              v-for="(item, index) in centerIcon"
              :key="index"
              placement="bottom"
              width="auto"
              trigger="hover"
              :content="item.title"
            >
              <template #reference>
                <img
                  :src="item.iconUrl"
                  style="width: 3vh; height: 3vh"
                  @click="chooseCenterIconFn(item)"
                />
              </template>
            </el-popover>
            <div
              class="accountBox_fnBox"
              v-if="
                choosedHeaderIcon.action === 'VIDEO' &&
                choosedHeaderIcon.videoPage.length > 0
              "
            >
              <img src="@/assets/img/collDel.png" @click="delAccount('video')" />
              <img src="@/assets/img/collAdd.png" @click="addImage('videoPage')" />
            </div>
            <div
              class="accountBox_fnBox"
              v-else-if="
                choosedHeaderIcon.action === 'IMAGE' &&
                choosedHeaderIcon.imagePage.length > 0
              "
            >
              <img src="@/assets/img/collDel.png" @click="delAccount('image')" />
              <img src="@/assets/img/collAdd.png" @click="addImage('imagePage')" />
            </div>
          </div>
          <div class="footerTextarea">
            <el-input
              v-if="choosedHeaderIcon.action === 'VIDEO'"
              v-model="carouselObj.title"
              @blur="blurAccount('title')"
              placeholder="请输入视频标题"
            ></el-input>
            <el-input
              v-model="carouselObj.comment"
              @blur="blurAccount('comment')"
              :class="`remarkBox ${
                choosedHeaderIcon.action === 'VIDEO' ? 'videoRemark' : 'imgRemark'
              }`"
              resize="none"
              type="textarea"
              placeholder="请输入描述/备注"
            ></el-input>
          </div>
        </div>
      </div>
    </div>
    <!-- 组件 -->
    <el-drawer
      v-if="showAddVideo"
      v-model="showAddVideo"
      :destroy-on-close="true"
      direction="rtl"
      size="70%;"
      :with-header="false"
      :show-close="false"
      :before-close="drawerClose"
    >
      <div class="videoImageListBox">
        <VideoImageList
          :paramObj="paramObj"
          :showTitleIcon="false"
          :checkBox="false"
          :rowNumber="4"
          @chooseAccount="chooseAccount"
        ></VideoImageList>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import ShowYoutube from "@/components/public/youtube/showYoutube.vue";
import VideoImageList from "@/components/public/videoImageList/index/index.vue";
import { reactive, toRefs } from "@vue/reactivity";
import * as indexJs from "./indexjs";
import $store from "@/store/index.js";
export default {
  components: { VideoImageList, ShowYoutube },
  setup() {
    let getPObj = $store.state.vuexRightPObj;
    const data = reactive({
      // 上面的图标
      headerIcon: [
        {
          iconUrl: require("@/assets/icon/heightPrecision/webpage_1_high.png"),
          action: "INTERNET_SITE",
          title: "网址",
          choosed: true,
          titleInputVal:
            getPObj.content && getPObj.content.internetSite
              ? getPObj.content.internetSite
              : "", // 表示输入的查询、url、脚本
          titleInputType: "url",
        },
        {
          iconUrl: require("@/assets/icon/heightPrecision/E_business_0_high.png"),
          action: "E_COMMERCE",
          title: "电商",
          choosed: false,
          titleInputVal:
            getPObj.content && getPObj.content.mallUrl ? getPObj.content.mallUrl : "", // 表示输入的查询、url、脚本
          titleInputType: "url",
        },
        {
          iconUrl: require("@/assets/icon/heightPrecision/image_0_high.png"),
          action: "IMAGE",
          title: "图像",
          choosed: false,
          titleInputVal: "", // 表示输入的查询、url、脚本
          titleInputType: "",
        },
        {
          iconUrl: require("@/assets/icon/heightPrecision/video_0_high.png"),
          action: "VIDEO",
          title: "视频",
          choosed: false,
          titleInputVal: "", // 表示输入的查询、url、脚本
          titleInputType: "",
        },
        {
          iconUrl: require("@/assets/icon/heightPrecision/diy_0_high.png"),
          action: "SELF_BUILT_CONTENT",
          title: "自建内容",
          choosed: false,
          titleInputVal:
            getPObj.content && getPObj.content.mallUrl ? getPObj.content.mallUrl : "", // 表示输入的查询、url、脚本
          titleInputType: "DIY",
        },
      ],
      // 上面的图标被选中项 做操作记录
      choosedHeaderIcon: {
        iconUrl: require("@/assets/icon/heightPrecision/webpage_1_high.png"),
        action: getPObj.infoTab ? getPObj.infoTab : "INTERNET_SITE",
        title: getPObj.infoTabTitle ? getPObj.infoTabTitle : "网址",
        choosed: true,
        titleInputVal: getPObj.infoIp ? JSON.parse(JSON.stringify(getPObj)).infoIp : "", // 表示输入的查询、url、脚本
        titleInputType: getPObj.titleInputType ? getPObj.titleInputType : "url",
        videoPage: [
          // {
          //   comment: "", // 备注
          //   resource: "", // 资源id/资源url/资源脚本
          //   source: "", // 视频类型 本地还是url LOCAL_VIDEO(本地视频) NETWORK_VIDEO(网络视频)YOUTUBE_VIDEO(YouTube视频) HLS_VIDEO(HLS/RMTP视频) JAVASCRIPT_VIDEO(内嵌脚本)
          // },
        ], // 选中的是视频
        imagePage: [], // 选中的是图片
        docId: "", // 自建内容输入的文字保存后产生的id
        docComment: "", // 自建内容输入的文字
      },
      // 是否显示选择图片或视频的组件
      showAddVideo: false,
      // 视频、图片组件的参数
      paramObj: {
        chooseIds: [],
        pageType: "video",
        funFormName: "videoPage", // 在组件中获取数据的方法名称
        titleInputType: "search",
        funFormAttr: {
          duration: null,
          idDesc: true,
          geCreateAt: "",
          leCreateAt: "",
          kw: "",
          pn: 1,
          ps: 11,
          size: null,
        },
      },
      // 中间的icon集合
      centerIcon: [],
      // 当前被选中的中间icon
      centerIconObj: {},
      carouselObj: {}, // 当前的轮播展示对象
      showAddImage: "local", // local-add图片 local_add-在新增的情况下 netWork-输入url netWork_add-在新增的情况下  carousel-显示轮播
      showImageCarouselIndex: 0,
      showVideoCarouselIndex: 0,
    });

    if (
      getPObj.content &&
      getPObj.content.videoPage &&
      getPObj.content.videoPage.length > 0
    ) {
      data.showVideoCarouselIndex = 0;
      data.choosedHeaderIcon.videoPage = getPObj.content.videoPage.map((item) => {
        const arr = Object.keys(item);
        let obj = {};
        arr.forEach((v) => {
          obj[v] = item[v];
        });
        item[item.source] = obj;
      });
    }
    if (
      getPObj.content &&
      getPObj.content.imagePage &&
      getPObj.content.imagePage.length > 0
    ) {
      data.showImageCarouselIndex = 0;
      data.choosedHeaderIcon.imagePage = getPObj.content.imagePage.map((item) => {
        const arr = Object.keys(item);
        let obj = {};
        arr.forEach((v) => {
          obj[v] = item[v];
        });
        item[item.source] = obj;
      });
    }
    let obj = {
      action: getPObj.infoTab,
      choosed: true,
      iconUrl: data.headerIcon.filter((v) => v.action === getPObj.infoTab)[0].iconUrl,
      title: data.headerIcon.filter((v) => v.action === getPObj.infoTab)[0].title,
      titleInputType: data.headerIcon.filter((v) => v.action === getPObj.infoTab)[0]
        .titleInputType,
      titleInputVal: "",
      imagePage:
        getPObj.content && getPObj.content.imagePage ? getPObj.content.imagePage : [],
      videoPage:
        getPObj.content && getPObj.content.videoPage ? getPObj.content.videoPage : [],
      docId: getPObj.content && getPObj.content.docId ? getPObj.content.docId : null,
    };
    if (getPObj.infoTab) {
      switch (getPObj.infoTab) {
        case "INTERNET_SITE":
          obj.titleInputVal =
            getPObj.content && getPObj.content.internetSite
              ? getPObj.content.internetSite
              : "";
          break;
        case "E_COMMERCE":
          obj.titleInputVal =
            getPObj.content && getPObj.content.mallUrl ? getPObj.content.mallUrl : "";
          break;
        case "SELF_BUILT_CONTENT":
          if (getPObj.content && getPObj.content.docId) {
            indexJs.textDetails({ id: getPObj.content.docId }).then((res) => {
              data.choosedHeaderIcon.docComment =
                res.data && res.data.content ? res.data.content : "";
            });
          }
      }
      clickHeardIcon(obj, "init");
    }
    // 保存
    function save() {
      let attr = {
        id: getPObj.infoId,
        iwpostId: getPObj.centerObjVideo.videoId,
        type: data.choosedHeaderIcon.action,
        infoContent: {},
      };
      console.log("attr1", attr);
      switch (attr.type) {
        case "INTERNET_SITE":
          attr.infoContent.internetSite = data.choosedHeaderIcon.titleInputVal;
          break;
        case "E_COMMERCE":
          attr.infoContent.mallUrl = data.choosedHeaderIcon.titleInputVal;
          break;
        case "VIDEO":
          data.choosedHeaderIcon.videoPage.map((item) => {
            item.title = item.title ? item.title : "视频标题";
            item.id = item.action === "LOCAL_VIDEO" ? item.id : null;
          });
          attr.infoContent.videoPage = JSON.parse(
            JSON.stringify(data.choosedHeaderIcon.videoPage)
          );
          break;
        case "IMAGE":
          data.choosedHeaderIcon.imagePage.map((item) => {
            item.id = item.action === "LOCAL_IMAGE" ? item.id : null;
          });
          attr.infoContent.imagePage = JSON.parse(
            JSON.stringify(data.choosedHeaderIcon.imagePage)
          );
          break;
        case "SELF_BUILT_CONTENT":
          attr.infoContent.docId = data.choosedHeaderIcon.docId
            ? data.choosedHeaderIcon.docId
            : getPObj.centerObjVideo.docId;
          attr.infoContent.content = data.choosedHeaderIcon.docComment;
          break;
      }
      console.log("attr2", attr);
      indexJs.infoFlowSaveContent(attr);
    }
    // --------------------------------------- 组件相关
    // 关闭的选中组件的回调
    const drawerClose = () => {
      data.showAddVideo = false;
    };
    // 显示组件
    const showChooseList = (id) => {
      data.showAddVideo = true;
      switch (data.centerIconObj.action) {
        case "LOCAL_VIDEO":
          data.paramObj.pageType = "video";
          data.paramObj.funFormName = "videoPage";
          data.paramObj.titleInputType = "search";
          data.paramObj.funFormAttr.pn = 1;
          data.paramObj.chooseIds = id ? [id] : [];
          break;
        case "NETWORK_VIDEO":
          data.paramObj.titleInputType = "url";
          break;
        case "YOUTUBE_VIDEO":
          data.paramObj.titleInputType = "url";
          break;
        case "HLS_VIDEO":
          data.paramObj.titleInputType = "url";
          break;
        case "JAVASCRIPT_VIDEO":
          data.paramObj.titleInputType = "javaScript";
          break;
        case "LOCAL_IMAGE":
          data.paramObj.pageType = "image";
          data.paramObj.funFormName = "imagePage";
          data.paramObj.titleInputType = "search";
          data.paramObj.funFormAttr.pn = 1;
          data.paramObj.chooseIds = id ? [id] : [];
          break;
        case "NETWORK_IMAGE":
          data.paramObj.titleInputType = "url";
          break;
      }
    };
    // 组件中选中的项 单选情况
    const chooseAccount = (obj) => {
      obj.resource = obj.id + "";
      obj.title = data.carouselObj.title;
      obj.comment = data.carouselObj.comment;
      obj.source = data.centerIconObj.action;
      if (data.choosedHeaderIcon.action === "VIDEO") {
        if (data.carouselObj.carouselIndex === -1) {
          data.choosedHeaderIcon.videoPage[0] = data.choosedHeaderIcon.videoPage[0]
            ? data.choosedHeaderIcon.videoPage[0]
            : {};
          Object.assign(data.choosedHeaderIcon.videoPage[0], obj);
          data.carouselObj.carouselIndex = 0;
        } else {
          Object.assign(
            data.choosedHeaderIcon.videoPage[data.carouselObj.carouselIndex],
            obj
          );
        }
        data.choosedHeaderIcon.videoPage[data.carouselObj.carouselIndex].LOCAL_VIDEO = {
          source: "LOCAL_VIDEO",
          action: "LOCAL_VIDEO",
          id: obj.id,
          title: JSON.parse(
            JSON.stringify(
              data.choosedHeaderIcon.videoPage[data.carouselObj.carouselIndex]
            )
          ).title,
          comment: JSON.parse(
            JSON.stringify(
              data.choosedHeaderIcon.videoPage[data.carouselObj.carouselIndex]
            )
          ).comment,
          showVideoPath: JSON.parse(JSON.stringify(obj.accessPath)),
        };
        data.showVideoCarouselIndex = data.carouselObj.carouselIndex;
      } else if (data.choosedHeaderIcon.action === "IMAGE") {
        if (data.carouselObj.carouselIndex === -1) {
          data.choosedHeaderIcon.imagePage[0] = data.choosedHeaderIcon.imagePage[0]
            ? data.choosedHeaderIcon.imagePage[0]
            : {};
          Object.assign(data.choosedHeaderIcon.imagePage[0], obj);
          data.carouselObj.carouselIndex = 0;
        } else {
          Object.assign(
            data.choosedHeaderIcon.imagePage[data.carouselObj.carouselIndex],
            obj
          );
        }
        data.choosedHeaderIcon.imagePage[data.carouselObj.carouselIndex].LOCAL_IMAGE = {
          source: "LOCAL_IMAGE",
          action: "LOCAL_IMAGE",
          id: obj.id,
          comment: JSON.parse(
            JSON.stringify(
              data.choosedHeaderIcon.imagePage[data.carouselObj.carouselIndex].comment
            )
          ),
          showVideoPath: JSON.parse(JSON.stringify(obj.accessPath)),
        };
        data.showImageCarouselIndex = data.carouselObj.carouselIndex;
      }
      changeCarousel(data.carouselObj.carouselIndex);
      data.showAddImage = "carousel";
    };
    // --------------------------------------- 组件相关
    // 点击头部icon
    function clickHeardIcon(obj, str) {
      let videoCenterIconObj = null;
      if (data.choosedHeaderIcon.videoPage.length > 0) {
        videoCenterIconObj = data.choosedHeaderIcon.videoPage[0];
      }
      // 将切换之前的值保存下来
      data.headerIcon.map((item) => {
        if (item.choosed && item.action !== "IMAGE" && item.action !== "VIDEO") {
          item.titleInputVal = JSON.parse(
            JSON.stringify(data.choosedHeaderIcon)
          ).titleInputVal;
        }
        switch (item.action) {
          case "INTERNET_SITE":
            item.iconUrl = require("@/assets/icon/heightPrecision/webpage_0_high.png");
            item.choosed = false;
            break;
          case "E_COMMERCE":
            item.iconUrl = require("@/assets/icon/heightPrecision/E_business_0_high.png");
            item.choosed = false;
            break;
          case "VIDEO":
            item.iconUrl = require("@/assets/icon/heightPrecision/video_0_high.png");
            item.choosed = false;
            break;
          case "IMAGE":
            item.iconUrl = require("@/assets/icon/heightPrecision/image_0_high.png");
            item.choosed = false;
            break;
          case "SELF_BUILT_CONTENT":
            item.iconUrl = require("@/assets/icon/heightPrecision/diy_0_high.png");
            item.choosed = false;
            break;
        }
      });
      obj.choosed = true;
      Object.assign(data.choosedHeaderIcon, obj);
      const index = data.headerIcon.findIndex((v) => v.action === obj.action);
      switch (obj.action) {
        case "INTERNET_SITE":
          data.headerIcon[
            index
          ].iconUrl = require("@/assets/icon/heightPrecision/webpage_1_high.png");
          data.headerIcon[index].choosed = true;
          data.choosedHeaderIcon.titleInputVal = obj.titleInputVal
            ? obj.titleInputVal
            : getPObj.content && getPObj.content.internetSite
            ? getPObj.content.internetSite
            : "";
          break;
        case "E_COMMERCE":
          data.headerIcon[
            index
          ].iconUrl = require("@/assets/icon/heightPrecision/E_business_1_high.png");
          data.headerIcon[index].choosed = true;
          data.choosedHeaderIcon.titleInputVal = obj.titleInputVal
            ? obj.titleInputVal
            : getPObj.content && getPObj.content.mallUrl
            ? getPObj.content.mallUrl
            : "";
          break;
        case "VIDEO":
          data.headerIcon[
            index
          ].iconUrl = require("@/assets/icon/heightPrecision/video_1_high.png");
          data.headerIcon[index].choosed = true;
          data.centerIcon = [
            {
              iconUrl: require("@/assets/icon/heightPrecision/resource_1_high.png"),
              action: "LOCAL_VIDEO",
              title: "视频库",
              choosed: true,
            },
            {
              iconUrl: require("@/assets/icon/heightPrecision/net_file_0_high.png"),
              action: "NETWORK_VIDEO",
              title: "网络视频",
              choosed: false,
            },
            {
              iconUrl: require("@/assets/icon/heightPrecision/YouTube_0_high.png"),
              action: "YOUTUBE_VIDEO",
              title: "YouTobe视频",
              choosed: false,
            },
            {
              iconUrl: require("@/assets/icon/heightPrecision/file_0_high.png"),
              action: "HLS_VIDEO",
              title: "HLS/RMTP视频",
              choosed: false,
            },
            {
              iconUrl: require("@/assets/icon/heightPrecision/code_0_high.png"),
              action: "JAVASCRIPT_VIDEO",
              title: "内嵌代码视频",
              choosed: false,
            },
          ];
          if (videoCenterIconObj) {
            switch (videoCenterIconObj.source) {
              case "NETWORK_VIDEO":
                data.centerIcon[0].iconUrl = require("@/assets/icon/heightPrecision/resource_0_high.png");
                data.centerIcon[0].choosed = false;
                data.centerIcon[1].iconUrl = require("@/assets/icon/heightPrecision/net_file_1_high.png");
                data.centerIcon[1].choosed = true;
                break;
              case "YOUTUBE_VIDEO":
                data.centerIcon[0].iconUrl = require("@/assets/icon/heightPrecision/resource_0_high.png");
                data.centerIcon[0].choosed = false;
                data.centerIcon[2].iconUrl = require("@/assets/icon/heightPrecision/YouTube_1_high.png");
                data.centerIcon[2].choosed = true;
                break;
              case "HLS_VIDEO":
                data.centerIcon[0].iconUrl = require("@/assets/icon/heightPrecision/resource_0_high.png");
                data.centerIcon[0].choosed = false;
                data.centerIcon[3].iconUrl = require("@/assets/icon/heightPrecision/file_1_high.png");
                data.centerIcon[3].choosed = true;
                break;
              case "JAVASCRIPT_VIDEO":
                data.centerIcon[0].iconUrl = require("@/assets/icon/heightPrecision/resource_0_high.png");
                data.centerIcon[0].choosed = false;
                data.centerIcon[4].iconUrl = require("@/assets/icon/heightPrecision/code_1_high.png");
                data.centerIcon[4].choosed = true;
                break;
            }
          }

          data.centerIconObj = data.centerIcon.filter((v) => v.choosed)[0];
          data.paramObj.chooseIds = [];
          data.carouselObj = videoCenterIconObj
            ? videoCenterIconObj
            : {
                title: "",
                id: "",
                url: "",
                comment: "",
                carouselIndex: -1,
                action: "LOCAL_VIDEO",
              };
          data.showAddImage = "local";
          if (data.choosedHeaderIcon.videoPage.length > 0) {
            data.showAddImage = "carousel";
            data.choosedHeaderIcon.videoPage.forEach((item) => {
              data.paramObj.chooseIds.push(item.id);
            });
            data.carouselObj = data.choosedHeaderIcon.videoPage[0];
            data.carouselObj.action = data.choosedHeaderIcon.videoPage[0].source;
            data.carouselObj.carouselIndex = 0;
            chooseCenterIconFn(data.carouselObj, false, "init");
          }
          break;
        case "IMAGE":
          data.headerIcon[
            index
          ].iconUrl = require("@/assets/icon/heightPrecision/image_1_high.png");
          data.headerIcon[index].choosed = true;
          data.centerIcon = [
            {
              iconUrl: require("@/assets/icon/heightPrecision/resource_1_high.png"),
              action: "LOCAL_IMAGE",
              title: "图片库",
              choosed: true,
            },
            {
              iconUrl: require("@/assets/icon/heightPrecision/net_file_0_high.png"),
              action: "NETWORK_IMAGE",
              title: "网络图片",
              choosed: false,
            },
          ];
          data.centerIconObj = {
            iconUrl: require("@/assets/icon/heightPrecision/resource_1_high.png"),
            action: "LOCAL_IMAGE",
            title: "图片库",
            choosed: true,
          };
          data.paramObj.chooseIds = [];
          data.carouselObj = {
            id: "",
            url: "",
            comment: "",
            carouselIndex: -1,
            action: "LOCAL_IMAGE",
          };
          data.showAddImage = "local";
          if (data.choosedHeaderIcon.imagePage.length > 0) {
            data.showAddImage = "carousel";
            data.choosedHeaderIcon.imagePage.forEach((item) => {
              data.paramObj.chooseIds.push(item.id);
            });
            data.carouselObj = data.choosedHeaderIcon.imagePage[0];
            data.carouselObj.carouselIndex = 0;
          }
          chooseCenterIconFn(data.carouselObj, false, "init");
          break;
        case "SELF_BUILT_CONTENT":
          data.headerIcon[
            index
          ].iconUrl = require("@/assets/icon/heightPrecision/diy_1_high.png");
          data.headerIcon[index].choosed = true;
          data.centerIconObj = {};
          if (data.choosedHeaderIcon.docId || getPObj.content.docId) {
            indexJs
              .textDetails({
                id: data.choosedHeaderIcon.docId
                  ? data.choosedHeaderIcon.docId
                  : getPObj.content.docId,
              })
              .then((res) => {
                data.choosedHeaderIcon.docComment = res.data.content;
              });
          }
          break;
      }
      if (str && str === "init") {
        if (
          data.choosedHeaderIcon.videoPage.length > 0 ||
          data.choosedHeaderIcon.imagePage.length > 0
        ) {
          data.showAddImage = "carousel";
        }
      } else {
        save(); // 这里是业务需要
      }
    }
    // 头部输入框的移除
    const blurInput = () => {
      if (data.choosedHeaderIcon.action === "SELF_BUILT_CONTENT") {
        const attr = {
          authorId: getPObj.centerObjVideo.authorId, // 作者id
          content: data.choosedHeaderIcon.docComment, // 输入的内容
          id: data.choosedHeaderIcon.docId
            ? data.choosedHeaderIcon.docId
            : getPObj.centerObjVideo.docId, // 文档id 保存后返回来的
          infoId: getPObj.infoId, // 信息流的id
          name: "", // 当前编辑的文档的名称
        };
        indexJs.textSave(attr).then((res) => {
          data.choosedHeaderIcon.docId = res;
          changeCarousel(data.carouselObj.carouselIndex);
          save();
        });
      } else {
        changeCarousel(data.carouselObj.carouselIndex);
        save();
      }
    };
    // 视频图片切换的操作里面的公共方法
    function chooseCenterIconFn_fn(action, arrName, showAddImageName, str) {
      const showAddImageType = data.showAddImage ? data.showAddImage.split("_") : [];
      data.carouselObj.action = action;
      if (showAddImageType[showAddImageType.length - 1] !== "add") {
        data.showAddImage =
          data.choosedHeaderIcon[arrName].length > 0 ? "carousel" : showAddImageName;
      } else {
        data.showAddImage = `${showAddImageName}_add`;
      }
      if (data.carouselObj.carouselIndex > -1) {
        if (data.choosedHeaderIcon[arrName][data.carouselObj.carouselIndex][action]) {
          Object.assign(
            data.choosedHeaderIcon[arrName][data.carouselObj.carouselIndex],
            data.choosedHeaderIcon[arrName][data.carouselObj.carouselIndex][action]
          );
          if (action === "LOCAL_VIDEO" || action === "LOCAL_IMAGE") {
            if (data.choosedHeaderIcon[arrName][data.carouselObj.carouselIndex].id) {
              data.choosedHeaderIcon[arrName][data.carouselObj.carouselIndex].resource =
                data.choosedHeaderIcon[arrName][data.carouselObj.carouselIndex].id;
            } else {
              data.choosedHeaderIcon[arrName][
                data.carouselObj.carouselIndex
              ].resource = null;
              data.showAddImage = "carousel";
            }
            if (action === "LOCAL_VIDEO") {
              data.showVideoCarouselIndex = data.carouselObj.carouselIndex;
            } else {
              data.showImageCarouselIndex = data.carouselObj.carouselIndex;
            }
          } else {
            data.choosedHeaderIcon[arrName][
              data.carouselObj.carouselIndex
            ].resource = null;
          }
          // 如果 comment 和 title 不变这里就不要
          data.carouselObj.title =
            data.choosedHeaderIcon[arrName][data.carouselObj.carouselIndex].title;
          data.carouselObj.comment =
            data.choosedHeaderIcon[arrName][data.carouselObj.carouselIndex].comment;
        } else {
          if (action === "LOCAL_VIDEO" || action === "LOCAL_IMAGE") {
            data.showAddImage = "carousel";
            if (action === "LOCAL_VIDEO") {
              data.showVideoCarouselIndex = data.carouselObj.carouselIndex;
            } else {
              data.showImageCarouselIndex = data.carouselObj.carouselIndex;
            }
          }
          data.choosedHeaderIcon[arrName][data.carouselObj.carouselIndex].resource = null;
          data.choosedHeaderIcon[arrName][data.carouselObj.carouselIndex].showVideoPath =
            "";
          data.choosedHeaderIcon[arrName][data.carouselObj.carouselIndex].action = action;
          data.choosedHeaderIcon[arrName][data.carouselObj.carouselIndex].id =
            data.carouselObj.id;
          // 如果 comment 和 title 不变这里就不要
          data.choosedHeaderIcon[arrName][data.carouselObj.carouselIndex].title = "";
          data.choosedHeaderIcon[arrName][data.carouselObj.carouselIndex].comment = "";
        }
        data.choosedHeaderIcon[arrName][data.carouselObj.carouselIndex].source = action;
        if (!str) {
          save();
        }
      }
    }
    // 视频类型切换 中间icon的切换
    function chooseCenterIconFn(obj, toCarousel, str) {
      data.centerIconObj = obj;
      data.centerIconObj.action = data.centerIconObj.action
        ? data.centerIconObj.action
        : data.centerIconObj.source;
      data.centerIcon.map((item) => {
        item.choosed = item.action === obj.action;
        if (toCarousel) {
          item.choosed = item.action === obj.source;
        } else {
          item.choosed = item.action === obj.action;
        }
        if (item.choosed) {
          switch (item.action) {
            case "LOCAL_VIDEO":
              item.iconUrl = require("@/assets/icon/heightPrecision/resource_1_high.png");
              data.choosedHeaderIcon.titleInputType = "";
              if (!toCarousel) {
                chooseCenterIconFn_fn(item.action, "videoPage", "local", str);
              }
              break;
            case "NETWORK_VIDEO":
              item.iconUrl = require("@/assets/icon/heightPrecision/net_file_1_high.png");
              data.choosedHeaderIcon.titleInputType = "video_url";
              if (!toCarousel) {
                chooseCenterIconFn_fn(item.action, "videoPage", "netWork", str);
              }
              break;
            case "YOUTUBE_VIDEO":
              item.iconUrl = require("@/assets/icon/heightPrecision/YouTube_1_high.png");
              data.choosedHeaderIcon.titleInputType = "video_url";
              if (!toCarousel) {
                chooseCenterIconFn_fn(item.action, "videoPage", "youTuBe", str);
              }
              break;
            case "HLS_VIDEO":
              item.iconUrl = require("@/assets/icon/heightPrecision/file_1_high.png");
              data.choosedHeaderIcon.titleInputType = "video_url";
              if (!toCarousel) {
                chooseCenterIconFn_fn(item.action, "videoPage", "hls", str);
              }
              break;
            case "JAVASCRIPT_VIDEO":
              item.iconUrl = require("@/assets/icon/heightPrecision/code_1_high.png");
              data.choosedHeaderIcon.titleInputType = "video_javaScript";
              if (!toCarousel) {
                chooseCenterIconFn_fn(item.action, "videoPage", "javaScript", str);
              }
              break;
            case "LOCAL_IMAGE":
              item.iconUrl = require("@/assets/icon/heightPrecision/resource_1_high.png");
              data.choosedHeaderIcon.titleInputType = "";
              if (!toCarousel) {
                chooseCenterIconFn_fn(item.action, "imagePage", "local", str);
              }
              break;
            case "NETWORK_IMAGE":
              item.iconUrl = require("@/assets/icon/heightPrecision/net_file_1_high.png");
              data.choosedHeaderIcon.titleInputType = "image_url";
              if (!toCarousel) {
                chooseCenterIconFn_fn(item.action, "imagePage", "netWork", str);
              }
              break;
          }
        } else {
          switch (item.action) {
            case "LOCAL_VIDEO":
              item.iconUrl = require("@/assets/icon/heightPrecision/resource_0_high.png");
              break;
            case "NETWORK_VIDEO":
              item.iconUrl = require("@/assets/icon/heightPrecision/net_file_0_high.png");
              break;
            case "YOUTUBE_VIDEO":
              item.iconUrl = require("@/assets/icon/heightPrecision/YouTube_0_high.png");
              break;
            case "HLS_VIDEO":
              item.iconUrl = require("@/assets/icon/heightPrecision/file_0_high.png");
              break;
            case "JAVASCRIPT_VIDEO":
              item.iconUrl = require("@/assets/icon/heightPrecision/code_0_high.png");
              break;
            case "LOCAL_IMAGE":
              item.iconUrl = require("@/assets/icon/heightPrecision/resource_0_high.png");
              break;
            case "NETWORK_IMAGE":
              item.iconUrl = require("@/assets/icon/heightPrecision/net_file_0_high.png");
              break;
          }
        }
      });
    }
    // 图片、视频的网址和备注的变化 的公共方法
    function blurAccount_fn(location, action, arrName) {
      let index =
        data.carouselObj.carouselIndex > -1 ? data.carouselObj.carouselIndex : 0;
      if (data.carouselObj.carouselIndex > -1) {
        // data.showAddImage = ''
        if (location === "top") {
          data.choosedHeaderIcon[arrName][data.carouselObj.carouselIndex].resource =
            data.carouselObj.showVideoPath;
          data.choosedHeaderIcon[arrName][data.carouselObj.carouselIndex].showVideoPath =
            data.carouselObj.showVideoPath;
          data.choosedHeaderIcon[arrName][data.carouselObj.carouselIndex].source = action;
          data.choosedHeaderIcon[arrName][data.carouselObj.carouselIndex].id =
            data.carouselObj.id;
          if (arrName === "imagePage") {
            data.showImageCarouselIndex = data.carouselObj.carouselIndex;
          } else {
            data.showVideoCarouselIndex = data.carouselObj.carouselIndex;
          }
          changeCarousel(data.carouselObj.carouselIndex);
        } else if (location === "comment") {
          data.choosedHeaderIcon[arrName][data.carouselObj.carouselIndex].comment =
            data.carouselObj.comment;
        } else if (location === "title") {
          data.choosedHeaderIcon[arrName][data.carouselObj.carouselIndex].title =
            data.carouselObj.title;
        }
      } else {
        const imgObj = {
          title: data.carouselObj.title ? data.carouselObj.title : null,
          comment: data.carouselObj.comment,
          resource: data.carouselObj.showVideoPath,
          showVideoPath: data.carouselObj.showVideoPath,
          source: action,
          action: action,
          id: data.carouselObj.id,
        };
        data.choosedHeaderIcon[arrName].push(imgObj);
        data.carouselObj.carouselIndex = 0;
      }
      if (action !== "LOCAL_IMAGE" && action !== "LOCAL_VIDEO") {
        data.choosedHeaderIcon[arrName][index][action] = {
          source: action,
          action: action,
          title: data.choosedHeaderIcon[arrName][index].title
            ? data.choosedHeaderIcon[arrName][index].title
            : null,
          comment: JSON.parse(JSON.stringify(data.choosedHeaderIcon[arrName][index]))
            .comment,
          showVideoPath: JSON.parse(
            JSON.stringify(data.choosedHeaderIcon[arrName][index])
          ).showVideoPath,
        };
      }
      save();
    }
    // 图片、视频的网址和备注的变化
    const blurAccount = (location) => {
      if (data.carouselObj.showVideoPath) {
        data.showAddImage = "carousel";
      }
      switch (data.centerIconObj.action) {
        case "LOCAL_VIDEO":
          blurAccount_fn(location, data.centerIconObj.action, "videoPage");
          break;
        case "NETWORK_VIDEO":
          blurAccount_fn(location, data.centerIconObj.action, "videoPage");
          break;
        case "YOUTUBE_VIDEO":
          blurAccount_fn(location, data.centerIconObj.action, "videoPage");
          break;
        case "HLS_VIDEO":
          blurAccount_fn(location, data.centerIconObj.action, "videoPage");
          break;
        case "JAVASCRIPT_VIDEO":
          blurAccount_fn(location, data.centerIconObj.action, "videoPage");
          break;
        case "LOCAL_IMAGE":
          blurAccount_fn(location, data.centerIconObj.action, "imagePage");
          break;
        case "NETWORK_IMAGE":
          blurAccount_fn(location, data.centerIconObj.action, "imagePage");
          break;
      }
    };
    // 轮播的切换
    const changeCarousel = (i) => {
      if (data.choosedHeaderIcon.action === "VIDEO") {
        if (data.choosedHeaderIcon.videoPage.length > 0) {
          data.carouselObj = data.choosedHeaderIcon.videoPage[i];
          data.carouselObj.carouselIndex = i;
          data.carouselObj.title = data.carouselObj.title ? data.carouselObj.title : "";
          data.carouselObj.comment = data.carouselObj.comment
            ? data.carouselObj.comment
            : "";
          chooseCenterIconFn(data.carouselObj, true);
          save();
        }
      } else if (data.choosedHeaderIcon.action === "IMAGE") {
        if (data.choosedHeaderIcon.imagePage.length > 0) {
          data.carouselObj = data.choosedHeaderIcon.imagePage[i];
          data.carouselObj.carouselIndex = i;
          chooseCenterIconFn(data.carouselObj, true);
          save();
        }
      }
    };
    // 图片的添加
    const addImage = (paramName) => {
      if (
        data.choosedHeaderIcon[paramName][data.choosedHeaderIcon[paramName].length - 1]
          .showVideoPath
      ) {
        if (paramName === "imagePage") {
          data.carouselObj = {
            comment: "",
            resource: "",
            showVideoPath: "",
            source: "LOCAL_IMAGE",
            action: "LOCAL_IMAGE",
            id: "",
          };
          const obj = {
            action: "LOCAL_IMAGE",
            choosed: true,
            iconUrl: "/assets/img/resource_1_high.29c8dfdd.png",
            title: "图片库",
          };
          chooseCenterIconFn(obj);
        } else if (paramName === "videoPage") {
          data.carouselObj = {
            comment: "",
            resource: "",
            showVideoPath: "",
            source: "LOCAL_VIDEO",
            action: "LOCAL_VIDEO",
            id: "",
          };
          const obj = {
            action: "LOCAL_VIDEO",
            choosed: true,
            iconUrl: "/assets/img/resource_1_high.29c8dfdd.png",
            title: "视频库",
          };
          chooseCenterIconFn(obj);
        }
        data.choosedHeaderIcon[paramName].push(data.carouselObj);
        data.carouselObj.carouselIndex = data.choosedHeaderIcon[paramName].length - 1;
        switch (data.centerIconObj.action) {
          case "LOCAL_VIDEO":
            data.showAddImage = "local_add";
            break;
          case "NETWORK_VIDEO":
            data.showAddImage = "netWork_add";
            break;
          case "YOUTUBE_VIDEO":
            data.showAddImage = "youTuBe_add";
            break;
          case "HLS_VIDEO":
            data.showAddImage = "hls_add";
            break;
          case "JAVASCRIPT_VIDEO":
            data.showAddImage = "javaScript_add";
            break;
          case "LOCAL_IMAGE":
            data.showAddImage = "local_add";
            break;
          case "NETWORK_IMAGE":
            data.showAddImage = "netWork_add";
            break;
        }
      }
    };
    // 图片视频的删除
    const delAccount = (str) => {
      data.showAddImage = null;
      switch (str) {
        case "image":
          if (data.choosedHeaderIcon.imagePage.length === 1) {
            data.choosedHeaderIcon.imagePage = [];
            data.carouselObj = {
              id: "",
              url: "",
              comment: "",
              carouselIndex: -1,
              action: "LOCAL_IMAGE",
            };
            const obj = {
              action: "LOCAL_IMAGE",
              iconUrl: "/assets/img/resource_1_high.29c8dfdd.png",
              title: "图片库",
            };
            chooseCenterIconFn(obj);
          } else {
            data.choosedHeaderIcon.imagePage.splice(data.carouselObj.carouselIndex, 1);
            data.showAddImage = "carousel";
            const caIndex =
              data.carouselObj.carouselIndex < data.choosedHeaderIcon.imagePage.length - 1
                ? data.carouselObj.carouselIndex
                : data.choosedHeaderIcon.imagePage.length - 1;
            data.showImageCarouselIndex = caIndex;
            changeCarousel(caIndex);
          }
          break;
        case "video":
          if (data.choosedHeaderIcon.videoPage.length === 1) {
            data.choosedHeaderIcon.videoPage = [];
            data.carouselObj = {
              title: "",
              id: "",
              url: "",
              comment: "",
              carouselIndex: -1,
              action: "LOCAL_VIDEO",
            };
            const obj = {
              action: "LOCAL_VIDEO",
              iconUrl: "/assets/img/resource_1_high.29c8dfdd.png",
              title: "视频库",
            };
            chooseCenterIconFn(obj);
          } else {
            data.choosedHeaderIcon.videoPage.splice(data.carouselObj.carouselIndex, 1);
            data.showAddImage = "carousel";
            const caIndex =
              data.carouselObj.carouselIndex < data.choosedHeaderIcon.videoPage.length - 1
                ? data.carouselObj.carouselIndex
                : data.choosedHeaderIcon.videoPage.length - 1;
            data.showVideoCarouselIndex = caIndex;
            changeCarousel(caIndex);
          }
          break;
      }
      save();
    };

    return {
      ...toRefs(getPObj),
      ...toRefs(data),
      drawerClose,
      chooseAccount,
      clickHeardIcon,
      blurInput,
      chooseCenterIconFn,
      blurAccount,
      showChooseList,
      changeCarousel,
      addImage,
      delAccount,
    };
  },
};
</script>
<style lang="less">
.footerTextarea {
  .videoRemark {
    textarea {
      height: 9vh;
    }
  }
  .imgRemark {
    textarea {
      height: 15vh;
    }
  }
}
.diyBox {
  textarea {
    height: 85vh;
  }
}
// .carouselBox{
//   .el-carousel__button{
//     background-color: black;
//   }
// }
</style>
<style lang="less" scoped>
.videoImageListBox {
  margin: 3vh 3vw 0 3vw;
}
.iconStyle {
  margin: 1.7991vh 0;
  img {
    cursor: pointer;
    margin-right: 1vw;
  }
}
.collVideo {
  width: 100%;
  height: 100%;
}
.accountBox {
  // width:90%;
  .carouselBox {
    margin-top: 2vh;
  }
  &_videoAdd {
    margin-top: 2vh;
    img {
      width: 100%;
      height: 100%;
    }
  }
  &_fnBox {
    float: right;
    img {
      cursor: pointer;
      width: 5vh;
      height: 5vh;
    }
    :nth-child(2) {
      margin-right: 0;
    }
  }
}
.JSVBox {
  height: 58vh;
  :deep(iframe) {
    width: 100%;
    height: 100%;
  }
}
.iframeContentCarousel {
  width: 100%;
  height: 58vh;
  border: 0;
}
</style>
