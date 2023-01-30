<template>
  <div class="preview" v-loading="loadingPage">
    <div class="accountBox">
      <div class="leftBox">
        <div class="dian"></div>
        <div style="margin-left: 5%">
          <p style="font-size: 1.6vh">主视频:</p>
          <el-input
            v-model="centerObj.infoObj.title"
            style="font-size: 2vh; width: 95%"
            resize="none"
            :rows="3"
            @blur="saveVideo(centerObj)"
            type="textarea"
            placeholder="请输入主视频标题/描述"
          />
        </div>
        <div class="leftBox_centerImgBox">
          <img
            v-if="isDisabled"
            src="@/assets/img/uploader/disable303.png"
            class="pointer leftBox_centerImgBox_disableImage"
            @click="leftImageClick"
          />
          <img
            v-if="left.imageUrl"
            class="leftBox_addImg"
            :src="left.imageUrl"
            @click="leftImageClick"
          />
          <img
            v-else
            class="leftBox_addImg"
            src="@/assets/img/preview/addh.png"
            @click="leftImageClick"
          />
        </div>
        <div class="leftBox_shareIcon">
          <el-popover
            placement="left"
            width="auto"
            trigger="hover"
            content="删除"
          >
            <template #reference>
              <img src="@/assets/img/search/del.png" @click="leftIcon('del')" />
            </template> </el-popover
          ><br />
          <el-popover
            placement="left"
            width="auto"
            trigger="hover"
            :content="!isDisabled ? '禁用' : '启用'"
          >
            <template #reference>
              <img
                v-if="!isDisabled"
                style="margin: 3vh 0"
                src="@/assets/img/search/disable.png"
                @click="leftIcon('disable')"
              />
              <img
                v-else
                style="margin: 3vh 0"
                src="@/assets/img/search/used.png"
                @click="leftIcon('used')"
              />
            </template> </el-popover
          ><br />
          <el-popover
            placement="left"
            width="auto"
            trigger="hover"
            content="返回"
          >
            <template #reference>
              <img src="@/assets/img/preview/balck8.png" @click="blackFn" />
            </template>
          </el-popover>
        </div>
      </div>
      <div class="center_box">
        <div class="center_box_imgBox">
          <img
            v-if="!centerObj.videoInfo.showVideoPath"
            class="center_box_imgBox_add pointer"
            @click="showChoose"
            src="@/assets/img/account_addoredite_center_add.png"
          />
          <div
            v-else-if="
              pObj.centerObjVideo.mainVideoSource === 'YOUTUBE' &&
              centerObj.videoInfo.showVideoPath
            "
          >
            <div v-if="showYoutubeBox">
              <ShowYoutube
                ref="ShowYoutubeMain"
                divId="addOrEditePlary"
                style="height: 50vh; width: 100%"
                :youtobeId="
                  centerObj.videoInfo.showVideoPath.split(
                    'https://youtu.be/'
                  )[1]
                "
                :toPlay="toPlay"
                @youtobePlay="youtobePlay"
                @youtobeStop="youtobeStop"
              ></ShowYoutube>
            </div>
          </div>
          <video
            v-else
            @click="showChooseVideoPage"
            id="centerVideo"
            v-bind:src="centerObj.videoInfo.showVideoPath"
            class="avatar video-avatar center_box_imgBox_videoBox"
            controls
            muted
            @timeupdate="timeChange"
            style="background-color: #000"
          >
            您的浏览器不支持视频播放
          </video>
          <div class="center_box_imgBox_selectBox fontDiv">
            <el-popover
              placement="left"
              width="auto"
              trigger="hover"
              content="作者"
            >
              <template #reference>
                <img
                  class="center_box_imgBox_icon"
                  src="@/assets/img/search/author.png"
                />
              </template>
            </el-popover>
            <el-select
              v-model="centerObj.infoObj.author"
              @change="saveVideo(centerObj)"
              :default="centerObj.infoObj.author"
              placeholder="请选择"
              :disabled="!centerObj.videoInfo.showVideoPath"
            >
              <el-option
                v-for="item in authorOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
            <el-popover
              placement="bottom"
              width="auto"
              trigger="hover"
              content="添加/修改主视频"
            >
              <template #reference>
                <img
                  class="addVideoImg pointer"
                  src="@/assets/img/allAdd.png"
                  @click="showChooseVideoPage"
                />
              </template>
            </el-popover>
          </div>
          <div class="fontDiv">
            <el-popover
              placement="left"
              width="auto"
              trigger="hover"
              content="类别"
            >
              <template #reference>
                <img
                  class="center_box_imgBox_icon"
                  src="@/assets/img/search/type.png"
                />
              </template>
            </el-popover>

            <el-select
              v-model="centerObj.infoObj.type"
              @change="saveVideo(centerObj)"
              placeholder="请选择"
              :disabled="!centerObj.videoInfo.showVideoPath"
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
          <div class="fontDiv">
            <el-popover
              placement="left"
              width="auto"
              trigger="hover"
              content="主题"
            >
              <template #reference>
                <img
                  class="center_box_imgBox_icon"
                  src="@/assets/img/search/theme.png"
                />
              </template>
            </el-popover>
            <el-select
              multiple
              collapse-tags
              style="font-size: 1.4vh"
              v-model="centerObj.infoObj.theme"
              @change="saveVideo(centerObj)"
              placeholder="请选择"
              :disabled="!centerObj.videoInfo.showVideoPath"
            >
              <el-option
                v-for="item in themeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
          <div class="fontDiv">
            <el-popover
              placement="left"
              width="auto"
              trigger="hover"
              content="关键词"
            >
              <template #reference>
                <img
                  class="center_box_imgBox_icon"
                  src="@/assets/img/search/keywords.png"
                />
              </template>
            </el-popover>
            <span
              class="chooseFont"
              v-for="(item, index) in choosedKeyWords"
              :key="`k${index}`"
              @click="chooseKeyWorld('del', index)"
            >
              {{ item.name }}
              <el-icon color="#fff" class="no-inherit">
                <circle-close-filled />
              </el-icon>
            </span>
            <el-popover
              placement="right"
              :width="200"
              trigger="focus"
              v-model:visible="showPopover"
              class="addOrEdite_popover_gjz"
            >
              <template #reference>
                <el-input
                  style="font-size: 1.4vh; width: 9vw"
                  @input="changeInputVal"
                  placeholder="敲击回车新增"
                  @keydown.enter="
                    (e) => {
                      addKeyWorld(e.target.value);
                    }
                  "
                  @focus="showPopover = true"
                  v-model="inputVal"
                ></el-input>
              </template>
              <ul
                v-if="keywordOptions.length > 0"
                class="addOrEdite_popover_gjz_ul"
              >
                <li
                  v-for="(item, index) in keywordOptions"
                  :key="item.id"
                  class="optionsWorld"
                  @click="chooseKeyWorld('add', index)"
                >
                  {{ item.name }}
                </li>
              </ul>
              <ul v-else>
                <li>暂无数据</li>
              </ul>
            </el-popover>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="right_add">
          <img
            src="@/assets/img/allAdd.png"
            class="pointer"
            @click="addRightAcount"
          />
        </div>
        <div class="right_listBox">
          <div v-for="(item, index) in rightCountArr" :key="index">
            <transition name="fade">
              <div class="right_listBox_list">
                <div class="right_listBox_list_imgBox">
                  <img
                    v-if="item.state == -1"
                    src="@/assets/img/uploader/disable303.png"
                    class="pointer right_listBox_list_imgBox_disableImage"
                    @click="clickRightAdd(index)"
                  />
                  <img
                    v-if="item.imageUrl"
                    :src="item.imageUrl"
                    class="pointer"
                    @click="clickRightAdd(index)"
                  />
                  <img
                    v-else
                    @click="clickRightAdd(index)"
                    class="pointer"
                    src="@/assets/img/account_addoredite_right_add_add.png"
                  />
                </div>
                <div class="right_listBox_list_info">
                  <p style="font-size: 1.2vh">信息条目: {{ item.index }}</p>
                  <p style="font-size: 1.2vh">
                    时间点:
                    {{
                      item.showTime > 0
                        ? secondsToTime(item.showTime)
                        : "00:00:00"
                    }}
                  </p>
                  <div class="right_listBox_list_info_conver">
                    <el-popover
                      placement="left"
                      width="auto"
                      trigger="hover"
                      content="点击率统计"
                    >
                      <template #reference>
                        <img src="@/assets/img/search/clickRate.png" />
                      </template>
                    </el-popover>

                    <span
                      style="
                        font-size: 1.2vh;
                        line-height: 1.2vh;
                        color: rgb(206, 204, 204);
                      "
                      >{{ item.conversionRate }}</span
                    >
                  </div>
                  <el-input
                    style="margin: 1vh 0 0 1vh; width: 96%"
                    v-model="item.title"
                    @focus="focusFlawInfoTitle(item)"
                    @blur="blurFlawInfoTitle(index)"
                    placeholder="请输入信息流标题"
                  ></el-input>
                  <div
                    style="margin-top: 1vh; text-align: right; align-items: end"
                  >
                    <el-popover
                      placement="bottom"
                      width="auto"
                      trigger="hover"
                      content="删除"
                    >
                      <template #reference>
                        <img
                          class="right_contentBox_rightInfo_icon"
                          src="@/assets/img/search/del.png"
                          @click="delFlawInfo(index)"
                        />
                      </template>
                    </el-popover>
                    <el-popover
                      placement="bottom"
                      width="auto"
                      trigger="hover"
                      :content="
                        item.state == 1 || !item.state ? '禁用' : '启用'
                      "
                    >
                      <template #reference>
                        <img
                          v-if="item.state == -1"
                          src="@/assets/img/search/used.png"
                          class="right_contentBox_rightInfo_icon"
                          style="margin: 0 1vw"
                          @click="clickFlawInfoUse(index)"
                        />
                        <img
                          v-else
                          src="@/assets/img/search/disable.png"
                          class="right_contentBox_rightInfo_icon"
                          style="margin: 0 1vw"
                          @click="clickFlawInfoDisable(index)"
                        />
                      </template>
                    </el-popover>

                    <el-popover
                      placement="bottom"
                      width="auto"
                      trigger="hover"
                      content="详情"
                    >
                      <template #reference>
                        <img
                          src="@/assets/img/search/info.png"
                          class="right_contentBox_rightInfo_icon"
                          @click="flawInfo(index)"
                        />
                      </template>
                    </el-popover>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
    <div class="rightDrawer">
      <el-drawer
        v-model="drawer"
        :destroy-on-close="true"
        direction="rtl"
        size="65%;"
        :with-header="false"
        :show-close="false"
        :before-close="drawerClose"
      >
        <div class="drawerContentBox">
          <template v-if="pObj.fromEvent === 'rightInfo'">
            <rightInfo
              v-if="drawer"
              :pObj="pObj"
              @centerVideoUrl="centerVideoUrl"
              @choosedVideo="choosedVideo"
              @choosedImage="choosedImage"
            ></rightInfo>
          </template>
          <VideoImageList
            v-else
            :paramObj="paramObj"
            :chooseId0="chooseId0"
            :showTitleIcon="showTitleIcon"
            @chooseAccount="chooseAccount"
            @centerVideoUrl="centerVideoUrl"
            @pobjAction="pobjAction"
          ></VideoImageList>
        </div>
      </el-drawer>
    </div>
  </div>
</template>
<script>
import router from "@/routes/index";
import VideoImageList from "@/components/public/videoImageList/index/index.vue";
import rightInfo from "./rightInfo.vue";
import ShowYoutube from "@/components/public/youtube/showYoutube.vue";
import { reactive, toRefs } from "@vue/reactivity";
import { provide } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import * as addOrEditeFns from "./addOrEdite";
import { secondsToTime, timeToSeconds } from "@/api/public/index";
import { nextTick } from "vue";
export default {
  components: { VideoImageList, rightInfo, ShowYoutube },
  setup() {
    // 传递给 addMainVideo 组件的数据
    const pObj = reactive({
      fromEvent: "mainAdd",
      centerObjVideo: {},
      imageId: null,
      rightIndex: -1,
      infoIp: "",
      infoTab: "",
      showTitleImg: true,
    });
    const data = reactive({
      loadingPage: false,
      isDisabled: false,
      chooseId0: false,
      inputVal: "",
      showPopover: false,
      // 最左边的
      left: {
        imageUrl: "",
      },
      flawInfoTitle: "",
      // 最右边的流信息
      rightCountArr: [],
      newTime: 0, // 当前时间
      rightCountObj: {
        imageUrl: "",
        index: "信息条目",
        showTime: "00:00:00",
        conversionRate: "0%",
        title: "",
        imageId: null,
        flowInfoId: null,
        isDelete: null,
        state: null,
        infoIp: "",
        infoTab: "",
      },
      drawer: false,
      typeOptions: [],
      authorOptions: [],
      themeOptions: [],
      keywordOptionsAll: [],
      centerObj: {
        videoInfo: {},
        infoObj: {
          author: null,
          type: null,
          theme: [],
          keywords: [],
          title: "",
          id: null,
          imageId: null,
        },
      },
      paramObj: {
        titleIcons: [
          {
            iconUrl: require("@/assets/icon/heightPrecision/resource_1_high.png"),
            choosedIcon: require("@/assets/icon/heightPrecision/resource_1_high.png"),
            notChooseIcon: require("@/assets/icon/heightPrecision/resource_0_high.png"),
            action: "LIBRARY",
            title: "本地视频",
            choosed: true,
            titleInputVal: "", // 表示输入的查询、url、脚本
            titleInputType: "search",
          },
          {
            iconUrl: require("@/assets/icon/heightPrecision/net_file_0_high.png"),
            choosedIcon: require("@/assets/icon/heightPrecision/net_file_1_high.png"),
            notChooseIcon: require("@/assets/icon/heightPrecision/net_file_0_high.png"),
            action: "WEB_VIDEO",
            title: "网络视频",
            choosed: false,
            titleInputVal: "", // 表示输入的查询、url、脚本
            titleInputType: "url",
          },
          {
            iconUrl: require("@/assets/icon/heightPrecision/YouTube_0_high.png"),
            choosedIcon: require("@/assets/icon/heightPrecision/YouTube_1_high.png"),
            notChooseIcon: require("@/assets/icon/heightPrecision/YouTube_0_high.png"),
            action: "YOUTUBE",
            title: "youTube视频",
            choosed: false,
            titleInputVal: "", // 表示输入的查询、url、脚本
            titleInputType: "url",
          },
          {
            iconUrl: require("@/assets/icon/heightPrecision/file_0_high.png"),
            choosedIcon: require("@/assets/icon/heightPrecision/file_1_high.png"),
            notChooseIcon: require("@/assets/icon/heightPrecision/file_0_high.png"),
            action: "HLS_RMTP",
            title: "HLS/RMTP视频",
            choosed: false,
            titleInputVal: "", // 表示输入的查询、url、脚本
            titleInputType: "url",
          },
        ],
        chooseIds: [],
        pageType: "video",
        funFormName: "videoPage",
        titleInputType: "search",
        funFormAttr: {
          idDesc: true,
          duration: null,
          geCreateAt: "",
          leCreateAt: "",
          kw: "",
          pn: 1,
          ps: 11,
          size: null,
        },
      },
      showTitleIcon: true,
      checkBox: false,
      youToBePaused: false,
      youToBeDuration: 0,
      showYoutubeBox: false,
      youToBeVideoPath: "",
      toPlay: true,
      // divId:'addOrEditePlary'
    });
    init();
    function init() {
      data.loadingPage = true;
      Promise.all([
        addOrEditeFns.dropDownList({ state: 0 }),
        addOrEditeFns.authorDropDownList({ state: 0 }),
        addOrEditeFns.subjectDropDownList({ state: 0 }),
        addOrEditeFns.tagDropDownList({ state: 0 }),
      ]).then((res) => {
        data.typeOptions = res[0];
        data.authorOptions = res[1];
        data.themeOptions = res[2];
        data.keywordOptionsAll = res[3];
        data.centerObj.infoObj.type =
          data.typeOptions.length > 0 ? data.typeOptions[0].id : null;
        data.centerObj.infoObj.author =
          data.authorOptions.length > 0 ? data.authorOptions[0].id : null;
        data.centerObj.infoObj.theme =
          data.themeOptions.length > 0 ? [data.themeOptions[0].id] : [];
        if (Object.keys(router.currentRoute.value.query).length > 0) {
          if (router.currentRoute.value.query.id) {
            // 详情有关
            addOrEditeFns
              .details({ id: router.currentRoute.value.query.id })
              .then((res) => {
                data.left.imageUrl = res.imageUrl;
                data.centerObj.infoObj.title = res.title;
                data.centerObj.infoObj.author = parseInt(res.authorId);
                data.centerObj.infoObj.type = parseInt(res.categoryId);
                data.centerObj.infoObj.theme = res.subjectIds;
                if (res.tags && res.tags.length > 0) {
                  data.keywordOptionsAll.forEach((v) => {
                    v.choosed = res.tags.find((i) => i === v.id) ? true : false;
                  });
                }
                data.centerObj.infoObj.keywords = res.tags;
                data.centerObj.infoObj.id = res.id;
                data.centerObj.infoObj.imageId = res.imageId;
                res.infoFlow.map((item) => {
                  item.flowInfoId = item.id;
                });
                data.rightCountArr = res.infoFlow;
                data.centerObj.videoInfo.showVideoPath = res.mainVideoUrl;
                data.showYoutubeBox = true;
                data.centerObj.videoInfo.accessPath = res.mainVideoUrl;
                data.centerObj.videoInfo.authorId = res.authorId;
                data.centerObj.videoInfo.choosed = true;
                data.centerObj.videoInfo.docId = null;
                data.centerObj.videoInfo.duration = res.duration;
                data.centerObj.videoInfo.id = res.mainVideoId;
                data.centerObj.videoInfo.mainVideoSource = res.mainVideoSource;
                data.centerObj.videoInfo.videoId = res.id;
                pObj.centerObjVideo.accessPath = res.mainVideoUrl;
                pObj.centerObjVideo.authorId = res.authorId;
                pObj.centerObjVideo.choosed = true;
                pObj.centerObjVideo.docId = null;
                pObj.centerObjVideo.duration = res.duration;
                pObj.centerObjVideo.id = res.mainVideoId;
                pObj.centerObjVideo.mainVideoSource = res.mainVideoSource;
                pObj.centerObjVideo.showVideoPath = res.mainVideoUrl;
                pObj.centerObjVideo.videoId = res.id;
                pObj.content =
                  res.infoFlow.length > 0 ? res.infoFlow[0].content : null;
                data.isDisabled = res.isDisabled;
              });
          } else if (router.currentRoute.value.query.author) {
            data.centerObj.infoObj.author = parseInt(
              router.currentRoute.value.query.author
            );
          } else if (router.currentRoute.value.query.type) {
            data.centerObj.infoObj.type = parseInt(
              router.currentRoute.value.query.type
            );
          } else if (router.currentRoute.value.query.theme) {
            data.centerObj.infoObj.theme = [
              parseInt(router.currentRoute.value.query.theme),
            ];
          }
        }

        data.loadingPage = false;
      });
    }
    // 点击中间的添加主视频
    const showChoose = () => {
      pObj.fromEvent = "mainAdd";
      data.showTitleIcon = true;
      data.paramObj.pageType = "video";
      data.paramObj.funFormName = "videoPage";
      provide("divStyle", "width: 100%; height:73vh; margin-top: 2.4vh");
      data.chooseId0 = true;
      data.drawer = true;
    };
    // 选中主视频
    const choosedVideo = (obj) => {
      if (data.centerObj.videoInfo.showVideoPath !== obj.showVideoPath) {
        const attrObj = {
          videoInfo: obj,
          infoObj: {
            author: null,
            type: null,
            theme: [],
            keywords: [],
            id: null,
          },
        };
        saveVideo(attrObj);
      }
    };
    // 选中
    const chooseAccount = (obj) => {
      if (
        data.paramObj.pageType === "video" ||
        data.paramObj.pageType === "video_content"
      ) {
        if (data.centerObj.videoInfo.showVideoPath !== obj.showVideoPath) {
          data.centerObj.videoInfo = obj;
          data.centerObj.videoInfo.mainVideoSource = "LIBRARY";
          saveVideo(data.centerObj);
        }
      } else {
        if (pObj.fromEvent === "rightAdd") {
          pObj.imageId = obj.id;
          data.rightCountArr[pObj.rightIndex].imageId = obj.id;
          data.rightCountArr[pObj.rightIndex].imageUrl = obj.showVideoPath;
          const attr = {
            showTime:
              typeof data.rightCountObj.showTime === "string"
                ? timeToSeconds(data.rightCountObj.showTime)
                : data.rightCountObj.showTime,
            iwpostId: pObj.centerObjVideo.videoId,
            imageId: obj.id,
            imageUrl: obj.showVideoPath,
            id: data.rightCountArr[pObj.rightIndex].flowInfoId,
            isDelete: data.rightCountArr[pObj.rightIndex].isDelete,
            state: data.rightCountArr[pObj.rightIndex].state,
            title: data.rightCountArr[pObj.rightIndex].title,
          };
          addOrEditeFns.infoFlowSave(attr).then((res) => {
            if (res.code === 200) {
              data.rightCountArr[pObj.rightIndex].flowInfoId = res.data;
            }
          });
        } else {
          data.left.imageUrl = obj.showVideoPath;
          data.centerObj.infoObj.imageId = obj.id;
          saveVideo(data.centerObj);
        }
      }
    };
    // 输入主视频地址
    const centerVideoUrl = (obj) => {
      data.youToBeVideoPath = JSON.parse(
        JSON.stringify(data.centerObj.videoInfo)
      ).showVideoPath;
      // 清空当删除网络视频后再次点击添加主视频进去有之前输入的网络视频
      data.paramObj.titleIcons.map((item) => {
        item.titleInputVal =
          item.action === obj.mainVideoSource && item.action !== "LIBRARY"
            ? obj.url
            : item.titleInputVal;
      });
      if (data.centerObj.videoInfo.showVideoPath !== obj.url) {
        data.centerObj.videoInfo = {
          showVideoPath: obj.url,
          videoUrl: true,
          mainVideoSource: obj.mainVideoSource,
        };
        const titleIconsObj = data.paramObj.titleIcons.filter(
          (v) => v.choosed
        )[0];
        if (titleIconsObj.action === "YOUTUBE" && titleIconsObj.titleInputVal) {
          data.showYoutubeBox = false;
          data.toPlay = false;
          nextTick(() => {
            data.showYoutubeBox = true;
          });
        }

        saveVideo(data.centerObj);
      }
    };
    // 选中图片
    const choosedImage = (obj) => {
      if (pObj.fromEvent === "rightAdd") {
        pObj.imageId = obj.id;
        data.rightCountArr[pObj.rightIndex].imageId = obj.id;
        data.rightCountArr[pObj.rightIndex].imageUrl = obj.showVideoPath;
        const attr = {
          showTime: timeToSeconds(data.rightCountObj.showTime),
          iwpostId: pObj.centerObjVideo.videoId,
          imageId: obj.id,
          id: data.rightCountArr[pObj.rightIndex].flowInfoId,
          isDelete: data.rightCountArr[pObj.rightIndex].isDelete,
          state: data.rightCountArr[pObj.rightIndex].state,
          title: data.rightCountArr[pObj.rightIndex].title,
        };
        addOrEditeFns.infoFlowSave(attr).then((res) => {
          if (res.code === 200) {
            data.rightCountArr[pObj.rightIndex].flowInfoId = res.data;
          }
        });
      } else {
        data.left.imageUrl = obj.showVideoPath;
        data.centerObj.infoObj.imageId = obj.id;
        saveVideo(data.centerObj);
      }
    };
    // 删除信息流
    const delFlawInfo = async (index) => {
      data.rightCountArr[index].isDelete = -1;
      const res = await changeFlawInfo(index, "infoFlowDelete");
      if (res.code === 200) {
        data.rightCountArr.splice(index, 1);
        data.rightCountArr.map((item, index) => {
          item.index = index + 1 + " / " + data.rightCountArr.length;
        });
      }
    };
    // 变更信息流的主题
    const blurFlawInfoTitle = async (index) => {
      const res = await changeFlawInfo(index);
      if (res.code === 200) {
        data.rightCountArr[index].flowInfoId = res.data;
      }
    };
    // 信息流主题获取焦点
    const focusFlawInfoTitle = (obj) => {
      data.rightCountObj = obj;
    };
    // 信息流的禁用
    const clickFlawInfoDisable = async (index) => {
      data.rightCountArr[index].state = -1;
      await changeFlawInfo(index, "infoFlowDisable");
    };
    // 信息流的启用
    const clickFlawInfoUse = async (index) => {
      data.rightCountArr[index].state = 1;
      changeFlawInfo(index, "infoFlowEnable");
    };
    // 变更信息流数据
    const changeFlawInfo = async (index, fnName) => {
      let returnRes = {};
      const obj = data.rightCountArr[index];
      if (!fnName) {
        const attr = {
          showTime:
            typeof obj.showTime === "string"
              ? timeToSeconds(obj.showTime)
              : obj.showTime,
          iwpostId: pObj.centerObjVideo.videoId,
          imageId: obj.imageId,
          imageUrl: obj.imageUrl,
          id: obj.flowInfoId,
          isDelete: obj.isDelete,
          state: obj.state,
          title: obj.title,
        };
        await addOrEditeFns.infoFlowSave(attr).then((res) => {
          returnRes = res;
        });
      } else {
        await addOrEditeFns[fnName]({ ids: [obj.flowInfoId] }).then((res) => {
          returnRes = res;
        });
      }
      return returnRes;
    };
    // 视频信息的保存
    const saveVideo = async (obj) => {
      const attr = {
        authorId: obj.infoObj.author,
        categoryId: obj.infoObj.type,
        subjectIds: obj.infoObj.theme,
        duration: obj.videoInfo.duration ? obj.videoInfo.duration : null,
        id: pObj.centerObjVideo.videoId, // 修改的时候才有值 当调用了 iwpostSave 返回的data 就是这个id
        mainVideoId: obj.videoInfo.id ? obj.videoInfo.id : null,
        imageId: data.centerObj.infoObj.imageId,
        imageUrl: data.left.imageUrl,
        tags: obj.infoObj.keywords, // 关键词
        mainVideoSource: obj.videoInfo.mainVideoSource
          ? obj.videoInfo.mainVideoSource
          : null,
        title: obj.infoObj.title ? obj.infoObj.title : "视频标题",
      };
      if (
        obj.videoInfo.videoUrl ||
        obj.videoInfo.accessPath ||
        obj.videoInfo.showVideoPath
      ) {
        attr.mainVideoUrl = obj.videoInfo.showVideoPath;
        addOrEditeFns.iwpostSave(attr).then((res) => {
          if (res.code === 200) {
            data.centerObj.videoInfo = obj.videoInfo;
            data.showYoutubeBox = data.centerObj.videoInfo.showVideoPath
              ? true
              : false;
            data.centerObj.infoObj.author = parseInt(obj.infoObj.author);
            data.centerObj.infoObj.type = parseInt(obj.infoObj.type);
            data.centerObj.infoObj.theme = obj.infoObj.theme;
            data.centerObj.infoObj.keywords = obj.infoObj.keywords;
            pObj.centerObjVideo = data.centerObj.videoInfo;
            pObj.centerObjVideo.videoId = res.data;
            pObj.centerObjVideo.authorId = obj.infoObj.author;
            pObj.centerObjVideo.docId = null;
          }
        });
      }
    };

    // 视频的播放时间变化
    const timeChange = (e) => {
      data.newTime = e.target.currentTime;
    };
    // 点击左边的删除 禁用 启用
    const leftIcon = (val) => {
      if (!pObj.centerObjVideo.videoId) {
        ElMessage.warning({
          message: "没有选择主视频不允许该操作",
          type: "warning",
        });
      } else {
        const attr = {
          ids: [pObj.centerObjVideo.videoId],
        };
        let fnName = "";
        if (val === "del") {
          fnName = "batchDelete";
        } else if (val === "disable") {
          fnName = "batchDisable";
        } else if (val === "used") {
          fnName = "batchEnable";
        }
        if (val === "del") {
          ElMessageBox.confirm("是否确认删除该内容?", "删除", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            showClose: false,
            type: "warning",
            center: true,
          })
            .then(() => {
              addOrEditeFns[fnName](attr).then((res) => {
                if (res.code === 200) {
                  if (val === "del") {
                    data.isDisabled = false;
                    data.left.imageUrl = "";
                    data.rightCountArr = "";
                    data.centerObj.videoInfo = {};
                    data.centerObj.infoObj.author = null;
                    data.centerObj.infoObj.type = null;
                    data.centerObj.infoObj.theme = [];
                    data.centerObj.infoObj.keywords = [];
                    data.centerObj.infoObj.title = "";
                    data.centerObj.infoObj.id = null;
                    data.centerObj.infoObj.imageId = null;
                    pObj.fromEvent = "mainAdd";
                    pObj.centerObjVideo = {};
                    pObj.imageId = null;
                    pObj.rightIndex = -1;
                    router.push("/homePage/account");
                  } else if (val === "disable") {
                    data.isDisabled = true;
                  } else if (val === "used") {
                    data.isDisabled = false;
                  }
                }
              });
            })
            .catch(() => {});
        } else {
          addOrEditeFns[fnName](attr).then((res) => {
            if (res.code === 200) {
              if (val === "del") {
                data.isDisabled = false;
                data.left.imageUrl = "";
                data.rightCountArr = "";
                data.centerObj.videoInfo = {};
                data.centerObj.infoObj.author = null;
                data.centerObj.infoObj.type = null;
                data.centerObj.infoObj.theme = [];
                data.centerObj.infoObj.keywords = [];
                data.centerObj.infoObj.title = "";
                data.centerObj.infoObj.id = null;
                data.centerObj.infoObj.imageId = null;
                pObj.fromEvent = "mainAdd";
                pObj.centerObjVideo = {};
                pObj.imageId = null;
                pObj.rightIndex = -1;
                router.push("/homePage/account");
              } else if (val === "disable") {
                data.isDisabled = true;
              } else if (val === "used") {
                data.isDisabled = false;
              }
            }
          });
        }
      }
    };
    return {
      ...toRefs(data),
      pObj,
      init,
      choosedVideo,
      timeChange,
      showChoose,
      saveVideo,
      choosedImage,
      delFlawInfo,
      blurFlawInfoTitle,
      focusFlawInfoTitle,
      clickFlawInfoDisable,
      clickFlawInfoUse,
      leftIcon,
      centerVideoUrl,
      chooseAccount,
      secondsToTime,
      // remoteMethod,
    };
  },
  mounted() {},
  computed: {
    keywordOptions() {
      let arr = this.keywordOptionsAll.filter((v) => !v.choosed);
      if (this.inputVal) {
        arr = arr.filter((v) => v.name.indexOf(this.inputVal) > -1);
      } else {
        arr = this.keywordOptionsAll.filter((v) => !v.choosed);
      }
      return arr;
    },
    choosedKeyWords() {
      return this.keywordOptionsAll.filter((v) => v.choosed);
    },
  },
  methods: {
    changeInputVal() {
      this.showPopover = false;
      setTimeout(() => {
        this.showPopover = true;
      }, 100);
    },
    chooseKeyWorld(str, i) {
      if (str === "add") {
        const obj = this.keywordOptions[i];
        this.keywordOptionsAll.map((item) => {
          item.choosed = item.id === obj.id ? true : item.choosed;
        });
        this.showPopover = false;
      } else if (str === "del") {
        const obj = this.choosedKeyWords[i];
        this.keywordOptionsAll.map((item) => {
          item.choosed = item.id === obj.id ? false : item.choosed;
        });
      }
      this.centerObj.infoObj.keywords = this.keywordOptionsAll
        .filter((v) => v.choosed)
        .map((item) => item.id);
      this.saveVideo(this.centerObj);
    },
    addKeyWorld(val) {
      if (this.keywordOptionsAll.filter((v) => v.name === val).length > 0) {
        ElMessage.warning({
          message: "该关键词已经存在",
          type: "warning",
        });
      } else {
        const attr = {
          name: val,
        };
        addOrEditeFns.addKeyWorld(attr).then((res) => {
          res.data.choosed = true;
          this.keywordOptionsAll.push(res.data);
          this.inputVal = "";
          this.centerObj.infoObj.keywords = this.keywordOptionsAll
            .filter((v) => v.choosed)
            .map((item) => item.id);
          this.saveVideo(this.centerObj);
          this.showPopover = false;
        });
      }
    },
    pobjAction(action, arr) {
      this.pObj.centerObjVideo.mainVideoSource = action;
      this.centerObj.videoInfo.mainVideoSource = action;
      arr.map((item) => {
        if (item.choosed) {
          if (item.titleInputType === "url") {
            this.centerObj.videoInfo.showVideoPath = item.titleInputVal;
          }
        }
      });
    },
    leftImageClick() {
      if (this.centerObj.videoInfo.showVideoPath) {
        this.drawer = true;
        this.chooseId0 = false;
        this.showTitleIcon = false;
        this.paramObj.pageType = "image";
        this.paramObj.funFormName = "imagePage";
        this.pObj.fromEvent = "leftAdd";
        this.paramObj.chooseIds = [this.centerObj.infoObj.imageId];
        if (this.centerObj.videoInfo.showVideoPath) {
          if (this.centerObj.videoInfo.mainVideoSource === "YOUTUBE") {
            this.youToBeVideoPath = this.centerObj.videoInfo.showVideoPath;
            this.$refs.ShowYoutubeMain.stopVideo();
          } else {
            const centerVideo = document.getElementById("centerVideo");
            centerVideo.pause();
          }
        }
      } else {
        ElMessage.warning({
          message: "请先选择主视频",
          type: "warning",
        });
      }
    },
    // 选择信息流的图片
    clickRightAdd(index) {
      this.drawer = true;
      this.chooseId0 = false;
      this.showTitleIcon = false;
      this.pObj.fromEvent = "rightAdd";
      this.pObj.rightIndex = index;
      this.pObj.imageId = this.rightCountArr[index].imageId;
      this.rightCountObj = this.rightCountArr[index];
      this.paramObj.pageType = "image";
      this.paramObj.funFormName = "imagePage";
      this.paramObj.showTime = this.rightCountArr[index].showTime;
      this.paramObj.chooseIds = [this.rightCountArr[index].imageId];

      if (this.centerObj.videoInfo.showVideoPath) {
        if (this.centerObj.videoInfo.mainVideoSource === "YOUTUBE") {
          this.youToBeVideoPath = this.centerObj.videoInfo.showVideoPath;
          this.$refs.ShowYoutubeMain.stopVideo();
        } else {
          const centerVideo = document.getElementById("centerVideo");
          centerVideo.currentTime = this.rightCountArr[index].showTime;
          centerVideo.pause();
        }
      }
    },
    // 点击视频弹出选择视频的弹框
    showChooseVideoPage(e) {
      if (e) {
        this.drawer = true;
        this.chooseId0 = true;
        this.showTitleIcon = true;
        this.paramObj.pageType = "video";
        this.paramObj.funFormName = "videoPage";
        if (this.centerObj.videoInfo.mainVideoSource) {
          this.paramObj.titleIcons.map((item) => {
            item.choosed =
              item.action === this.centerObj.videoInfo.mainVideoSource;
            //  当不是本地视频的时候将url赋值过去 失败
            if (item.action === this.centerObj.videoInfo.mainVideoSource) {
              if (this.centerObj.videoInfo.mainVideoSource != "LIBRARY") {
                item.titleInputVal = this.centerObj.videoInfo.showVideoPath;
              } else {
                this.paramObj.chooseIds = [this.centerObj.videoInfo.id];
                item.titleInputVal = "";
              }
            }
          });
        }
        this.pObj.fromEvent = "mainAdd";
        if (this.centerObj.videoInfo.showVideoPath) {
          if (this.centerObj.videoInfo.mainVideoSource === "YOUTUBE") {
            this.youToBeVideoPath = this.centerObj.videoInfo.showVideoPath;
            this.$refs.ShowYoutubeMain.stopVideo();
          } else {
            const centerVideo = document.getElementById("centerVideo");
            centerVideo.play();
          }
        }
      }
    },
    addRightAcount() {
      let next = false;
      if (this.centerObj.videoInfo.showVideoPath) {
        if (this.pObj.centerObjVideo.mainVideoSource === "YOUTUBE") {
          if (this.youToBePaused) {
            this.$refs.ShowYoutubeMain.getNewCurrentTime();
            next = true;
          } else {
            next = false;
            ElMessage.warning({
              message: "请先将主视频暂停再添加",
              type: "warning",
            });
          }
        } else {
          const centerVideo = document.getElementById("centerVideo");
          if (centerVideo.paused) {
            next = true;
          } else {
            next = false;
            ElMessage.warning({
              message: "请先将主视频暂停再添加",
              type: "warning",
            });
          }
        }
        if (next) {
          for (let i = 0; i < this.rightCountArr.length; i++) {
            const item = this.rightCountArr[i];
            if (
              item.showTime == this.newTime ||
              (this.newTime < item.showTime &&
                item.showTime - 3 <= this.newTime) ||
              (this.newTime - 3 <= item.showTime &&
                item.showTime < this.newTime)
            ) {
              ElMessage.warning({
                message: "每个信息流的间隔不能少于3秒",
                type: "warning",
              });
              return;
            }
          }
          const attr = {
            showTime: this.newTime ? this.newTime : 0,
            iwpostId: this.$router.currentRoute.value.query
              ? this.centerObj.videoInfo.videoId
              : this.pObj.centerObjVideo.videoId,
          };
          addOrEditeFns.infoFlowSave(attr).then((res) => {
            if (res.code === 200) {
              const obj = {
                imageUrl: "",
                index: "",
                showTime: this.newTime ? this.newTime : 0,
                conversionRate: "0%",
                title: "",
                imageId: null,
                flowInfoId: res.data,
                isDelete: null,
                state: null,
                infoIp: "",
                infoTab: "",
              };
              this.rightCountObj = obj;
              this.rightCountArr.unshift(obj);
              this.rightCountArr.map((item, index) => {
                item.index = index + 1 + " / " + this.rightCountArr.length;
              });
            }
          });
        }
      } else {
        ElMessage.warning({
          message: "请先选择主视频",
          type: "warning",
        });
      }
    },
    // 信息流的详情
    flawInfo(index) {
      if (!this.rightCountArr[index].title) {
        ElMessage.warning({
          message: "请先输入信息流标题",
          type: "warning",
        });
      } else {
        addOrEditeFns
          .infoFlowDetails({ id: this.rightCountArr[index].flowInfoId })
          .then((res) => {
            res.data.flowInfoId = res.data.id;
            this.rightCountObj = res.data;
            this.pObj.content = JSON.parse(JSON.stringify(res.data)).content;
            this.pObj.infoIp = this.rightCountArr[index].infoIp;
            this.pObj.infoId = this.rightCountArr[index].flowInfoId;
            this.pObj.infoTab = res.data.type;
            this.flawInfoTitle = this.rightCountArr[index].title;
            this.drawer = true;
            this.pObj.fromEvent = "rightInfo";
            this.chooseId0 = false;
            if (this.centerObj.videoInfo.mainVideoSource === "YOUTUBE") {
              this.$refs.ShowYoutubeMain.stopVideo();
            } else {
              const centerVideo = document.getElementById("centerVideo");
              centerVideo.currentTime = this.rightCountArr[index].showTime;
              centerVideo.pause();
            }
          });
      }
    },
    // 信息流详情的关闭
    drawerClose() {
      if (this.centerObj.videoInfo.showVideoPath) {
        if (this.centerObj.videoInfo.mainVideoSource === "YOUTUBE") {
          if (!this.centerObj.videoInfo.duration && this.youToBeDuration) {
            this.centerObj.videoInfo.duration = this.youToBeDuration;
            this.saveVideo(this.centerObj);
          }
          if (this.centerObj.videoInfo.showVideoPath) {
            this.$refs.ShowYoutubeMain.playVideo();
          }
        } else {
          const centerVideo = document.getElementById("centerVideo");
          if (centerVideo) {
            centerVideo.play();
          }
          if (!this.centerObj.videoInfo.duration && centerVideo.duration) {
            this.centerObj.videoInfo.duration = centerVideo.duration;
            this.saveVideo(this.centerObj);
          }
        }
        this.drawer = false;
      } else {
        if (this.centerObj.infoObj.imageId || this.rightCountArr.length > 0) {
          ElMessage.warning({
            message: "主视频不能为空!",
            type: "warning",
          });
        } else {
          this.drawer = false;
        }
      }
    },
    youtobePlay(times) {
      if (times) {
        this.youToBeDuration = times;
      }
      this.youToBePaused = false;
    },
    youtobeStop(times) {
      this.newTime = times;
      this.youToBePaused = true;
    },
    blackFn() {
      this.$router.push(sessionStorage.getItem("lasterRouter"));
    },
  },
};
</script>
<style lang="less">
.rightDrawer .el-drawer.rtl{
  background-color:#fff !important;
}
.addOrEdite_popover_gjz {
  .el-input__inner {
    height: auto;
    line-height: 3vh;
  }
}
.addOrEdite_popover_gjz_ul {
  max-height: 95vh;
  overflow-y: auto;
  .optionsWorld {
    padding-left: 0.5vw;
    cursor: pointer;
    &:hover {
      background: #37c8f7;
      color: #fff;
    }
  }
}
.drawerContentBox {
  margin: 3vh 3vw 0 3vw;
}
</style>
<style lang="less" scoped>
.accountBox {
  display: grid;
  grid-template-columns: 20vw 45vw 35vw;
  .leftBox {
    display: inline-grid;
    grid-template-rows: 6vh 26vh 21vh;
    box-shadow: 0 0 2vh #b6b6b7;
    background-color: #fff;
    height: calc(100vh - 4vh);
    position: relative;
    margin: 2vh;
    &_addImg {
      width: 100%;
      max-height: 21vh;
      cursor: pointer;
    }
    &_centerImgBox {
      text-align: center;
      position: relative;
      &_disableImage {
        width: 100%;
        max-height: 21vh;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    &_shareIcon {
      position: absolute;
      right: 1vw;
      bottom: 2vh;
      img {
        cursor: pointer;
      }
    }
    .dian {
      background-color: rgb(220, 220, 220);
      width: 1vw;
      height: 2vh;
      position: relative;
      top: 2vh;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
    }
  }
  .center_box {
    display: inline-grid;
    margin-left: 0.5vw;
    &_imgBox {
      margin-top: 10%;
      margin-bottom: 5%;
      &_videoBox {
        width: 100%;
        height: 50vh;
      }
      .fontDiv {
        margin-top: 2vh;
      }
      &_icon {
        margin-right: 1vw;
      }
      &_add {
        background-color: #e5e5e5;
        height: 50vh;
        box-shadow: 0 0 3vh #9a9aa1;
      }
    }
  }
  .right {
    height: calc(100vh - 8.9955vh);
    padding: 3vh;
    overflow-y: auto;
    .right_contentBox_rightInfo_icon {
      width: 1.2vw;
    }
    &_listBox {
      width: 33vw;
      &_list {
        display: inline-grid;
        grid-template-columns: 1fr 1.5fr 0.1fr;
        box-shadow: #b6b6b7 0 0 1vh;
        height: 21vh;
        padding: 1vh;
        margin: 2vh;
        &_imgBox {
          display: inline-grid;
          position: relative;
          img {
            width: 18vw;
            height: 21vh;
          }
          &_disableImage {
            position: absolute;
            top: 0;
            left: 0;
          }
        }
        &_info {
          text-align: right;
          display: inline-grid;
          margin-left: 0.8vw;
          // width: 10vw;
          p {
            text-align: right;
          }
          &_conver {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }
        }
      }
    }
    &_add {
      text-align: center;
      img {
        height: 22vh;
        margin: 2vh;
        border: 1vh solid #fff;
      }
    }
  }
}
.leftTitle {
  position: absolute;
  left: 0%;
  top: 15%;
  max-width: 15vw;
  transform: translate(-90%, -50%);
  z-index: inherit;
  background-color: #fff;
  font-size: 5vh;
  font-weight: bold;
  padding: 2vh 3vw;
  box-shadow: 0 0 2vh #b6b6b7;
  // opacity: 0.5;
}
.center_box_imgBox_selectBox {
  position: relative;
}
.addVideoImg {
  height: 5vh;
  position: absolute;
  right: 0;
}
.chooseFont {
  padding: 0.2vh 0.5vw;
  border: 1px solid red;
  color: #fff;
  background: #37c8f7;
  border: none;
  border-radius: 16px;
  text-align: center;
  cursor: pointer;
  margin-right: 0.2vw;
  white-space: nowrap;
  line-height: 3vh;
}
</style>
