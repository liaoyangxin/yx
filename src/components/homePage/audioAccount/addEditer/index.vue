<template>
  <div v-loading="pageLoading">
    <el-row>
      <el-col :span="5">
        <Left
          v-if="!pageLoading"
          :fatherPorps="toLeftPageObj"
          :iconArr="leftIconArr"
          @setIsDisabled="setIsDisabled"
          @saveLeft="saveLeft"
        ></Left>
      </el-col>
      <el-col :span="12">
        <Center
          v-if="!pageLoading"
          :fatherPorps="toCenterPageObj"
          fatherPageType="editeAudio"
          @saveCenter="saveCenter"
        ></Center>
      </el-col>
      <el-col :span="7">
        <Right
          v-if="!pageLoading"
          :rightCards="infoFlow"
          fatherPageType="editeAudio"
          @saveRight="saveRight"
        ></Right>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import router from "@/routes/index";
import Left from "@/components/public/videoAudio/Left.vue";
import Center from "@/components/public/videoAudio/Center.vue";
import Right from "@/components/public/videoAudio/Right";
import { reactive, toRefs } from "@vue/reactivity";
import { ElMessage } from "element-plus";
import * as addOrEditeFns from "@/components/homePage/account/addOrEdite/addOrEdite.js";
import { timeToSeconds } from "@/api/public/index";
import $store from "@/store/index.js";
export default {
  components: { Left, Center, Right },
  setup() {
    const data = reactive({
      toLeftPageObj: {
        type: "editeAudio", //
        titleFont: "音频",
        title: "",
        titlePlaceholder: "请输入音频名称",
        imgUrl: "",
        excerpt: "",
        canToDo: false, // 在新增和编辑的时候控制 输入框和选封面图片
      },
      toCenterPageObj: {
        authorId: null,
        categoryId: null,
        subjectIds: null, // 主题 专题
        tags: null,
        mainVideoUrl: null,
        mainVideoSource: null,
        mainVideoId: null,
        duration: null,
        auditInfo: {
          lyrics: null, // 歌词
          lyricsId: null, // 歌词文件id
          meta: null, // 音频元信息
          name: null, // 音频名称
          volume: 0.5, // 音量
        },
      },
      infoFlow: [], // 右边的信息流
      pageLoading: false,
    });
    let pageObj = reactive({
      authorId: null, // 作者
      categoryId: null, // 类型
      subjectIds: [], // 主题
      tags: "", // 关键词
      duration: null, // 视频时长 单位：秒
      id: null, // 修改的时候才有值 当调用了 iwpostSave 返回的data 就是这个id
      mainVideoId: null,
      mainVideoUrl: null, // 视频地址/主要资源地址
      imageId: null, // 封面图id
      imageUrl: "", // 最左边封面图片
      mainVideoSource: null,
      title: "", // 标题
      isDisabled: false, // 最左边 禁用启用
      excerpt: "", // 音频简介
      mimeType: "POST_AUDIO",
    });

    init();
    function init() {
      if (Object.keys(router.currentRoute.value.query).length > 0) {
        if (router.currentRoute.value.query.id) {
          data.pageLoading = true;
          // 详情有关
          addOrEditeFns
            .details({ id: router.currentRoute.value.query.id })
            .then((res) => {
              pageObj = Object.assign(pageObj, res);
              data.toLeftPageObj.title = pageObj.title;
              data.toLeftPageObj.imgUrl = pageObj.imageUrl;
              data.toLeftPageObj.excerpt = pageObj.excerpt;
              data.toLeftPageObj.mainVideoUrl = pageObj.mainVideoUrl;
              data.toLeftPageObj.canToDo = pageObj.mainVideoUrl ? true : false;
              data.toCenterPageObj.authorId = pageObj.authorId;
              data.toCenterPageObj.categoryId = pageObj.categoryId;
              data.toCenterPageObj.subjectIds = pageObj.subjectIds;
              data.toCenterPageObj.tags = pageObj.tags;
              data.toCenterPageObj.mainVideoUrl = pageObj.mainVideoUrl;
              data.toCenterPageObj.mainVideoSource = pageObj.mainVideoSource;
              data.toCenterPageObj.mainVideoId = pageObj.mainVideoId;
              data.toCenterPageObj.duration = pageObj.duration;
              data.toCenterPageObj.auditInfo = Object.assign({}, pageObj.auditInfo);
              data.infoFlow = pageObj.infoFlow.reverse();
              const pObj = {
                centerObjVideo: {
                  accessPath: pageObj.mainVideoUrl,
                  authorId: pageObj.authorId,
                  choosed: true,
                  docId: null,
                  duration: pageObj.duration,
                  id: pageObj.id,
                  mainVideoSource: pageObj.mainVideoSource,
                  showVideoPath: pageObj.mainVideoUrl,
                  videoId: pageObj.mainVideoId,
                },
              };
              $store.dispatch("setVuexRightPObj", pObj);
              data.pageLoading = false;
            });
          // } else if (router.currentRoute.value.query.author) {
          //   data.centerObj.infoObj.author = parseInt(
          //     router.currentRoute.value.query.author
          //   );
          // } else if (router.currentRoute.value.query.type) {
          //   data.centerObj.infoObj.type = parseInt(router.currentRoute.value.query.type);
          // } else if (router.currentRoute.value.query.theme) {
          //   data.centerObj.infoObj.theme = [
          //     parseInt(router.currentRoute.value.query.theme),
          //   ];
        }
      }
    }

    return {
      ...toRefs(data),
      pageObj,
    };
  },
  computed: {
    leftIconArr() {
      return this.pageObj.isDisabled
        ? [
            {
              title: "删除",
              iconUrl: require("@/assets/img/search/del.png"),
              placement: "left",
              type: "del",
            },
            {
              title: "启用",
              iconUrl: require("@/assets/img/search/used.png"),
              placement: "left",
              type: "used",
            },
            {
              title: "返回",
              iconUrl: require("@/assets/img/preview/balck8.png"),
              placement: "left",
              type: "black",
            },
          ]
        : [
            {
              title: "删除",
              iconUrl: require("@/assets/img/search/del.png"),
              placement: "left",
              type: "del",
            },
            {
              title: "禁用",
              iconUrl: require("@/assets/img/search/disable.png"),
              placement: "left",
              type: "disable",
            },
            {
              title: "返回",
              iconUrl: require("@/assets/img/preview/balck8.png"),
              placement: "left",
              type: "black",
            },
          ];
    },
  },
  methods: {
    savePage() {
      let attr = { ...this.pageObj };
      if (attr.mainVideoUrl) {
        this.toLeftPageObj.canToDo = true;
        if (!attr.title) {
          attr.title = "音频标题";
        }
        addOrEditeFns.iwpostSave(attr).then((res) => {
          if (res.code === 200) {
            this.pageObj.id = res.data;
            const pObj = {
              centerObjVideo: {
                accessPath: this.pageObj.mainVideoUrl,
                authorId: this.pageObj.authorId,
                choosed: true,
                docId: null,
                duration: this.pageObj.duration,
                id: this.pageObj.id,
                mainVideoSource: this.pageObj.mainVideoSource,
                showVideoPath: this.pageObj.mainVideoUrl,
                videoId: this.pageObj.mainVideoId,
              },
            };
            $store.dispatch("setVuexRightPObj", pObj);
          }
        });
      } else {
        ElMessage.warning({
          message: "请先选择音频",
          type: "warning",
        });
      }
    },
    saveLeft(obj) {
      this.pageObj = Object.assign(this.pageObj, obj);
      this.savePage();
    },
    setIsDisabled(val) {
      this.pageObj.isDisabled = val;
      this.toCenterPageObj.isDisabled = val
      this.savePage();
    },
    saveCenter(obj) {
      this.pageObj = Object.assign(this.pageObj, obj);
      this.savePage();
    },
    saveRight(obj) {
      if (this.pageObj.id) {
        const attr = {
          showTime:
            typeof obj.showTime === "string" ? timeToSeconds(obj.showTime) : obj.showTime,
          iwpostId: this.pageObj.id,
          imageId: obj.imageId,
          imageUrl: obj.imageUrl,
          id: obj.id,
          isDelete: obj.isDelete,
          state: obj.state,
          title: obj.title,
        };

        addOrEditeFns.infoFlowSave(attr).then((res) => {
          if (res.code === 200) {
            if (!obj.id) {
              obj.id = res.data;
              this.infoFlow.unshift(obj);
              this.infoFlow.map((item, index) => {
                item.index = index + 1 + " / " + this.infoFlow.length;
              });
            }
          }
        });
      } else {
        ElMessage.warning({
          message: "请先选择音频",
          type: "warning",
        });
      }
    },
  },
};
</script>
<style lang="less" scoped>
</style>
