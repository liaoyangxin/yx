// 资源库
<template>
  <div class="repository">
    <div class="tab_change">
      <p v-for="(item, index) in tabData" :key="index">
        <el-popover placement="bottom" width="auto" trigger="hover" :content="item.name">
          <template #reference>
            <img
              :src="idx == index ? item.image_act : item.image"
              style="width:1.6vw;height:1.6vw;"
              @click="clickImg(item, index)"
            />
          </template>
        </el-popover>
      </p>
    </div>
    <div class="repositorySerach">
      <!-- 滑块搜索 -->
      <Search
        v-if="idx != 2"
        :searchInfo="searchInfo1"
        @changedSearchInfo="changedSearchInfo"
      ></Search>
      
      <!-- 时间搜索 -->
      <Search :searchInfo="searchInfo2" @changedSearchInfo="changedSearchInfo"></Search>
      <Search :searchInfo="searchInfo3" @changedSearchInfo="changedSearchInfo"></Search>
      <div v-if="idx == 2"></div>
      <Search
        v-if="showSearchInfo4"
        :searchInfo="searchInfo4"
        @changedSearchInfo="changedSearchInfo"
      ></Search>
    </div>
    <div v-if="showVideoImageList">
      <VideoImageList
        v-if="showVideoImageList"
        pb130="pb130"
        :paramObj="paramObj"
        :chooseId0="true"
        :checkBox="true"
        :selectAll="searchInfo4[0].selectAll"
        :invertSelection="searchInfo4[0].invertSelection"
        @chooseAccount="chooseAccount"
        @changeName="changeName"
        :showTitleInput="false"
        :displayByIds="searchInfo4[0].disable"
        :todoDel="searchInfo4[0].todoDel"
        :editerName="true"
      ></VideoImageList>
    </div>
    <div v-else-if="showTextPage" class="textPageBox" v-infinite-scroll="scrollVideo"
      :infinite-scroll-immediate="false">
      <textPage class="textPageBox_textPage" :invertSelection="searchInfo4[0].invertSelection" :selectAll="searchInfo4[0].selectAll" :todoDel="searchInfo4[0].todoDel" :paramObj="textPageParamObj" @getTotal="getTotal" @chooseAccount="chooseAccount"></textPage>
    </div>
    <div v-else-if="showAudioPage"></div>
  </div>
</template>
<script>
import { ElMessage } from "element-plus";
import Search from "@/components/public/search";
import { nextTick, reactive, toRefs } from "vue";
import VideoImageList from "@/components/public/videoImageList/index/index.vue";
import textPage from "./textPage/index.vue";
import * as allFns from './repository'
import * as addOrEdite from '@/components/homePage/account/addOrEdite/addOrEdite'
export default {
  components: {
    Search,
    VideoImageList,
    textPage
  },
  setup() {
    const videoSearch = reactive({
      videoInfo1: [
        {
          // 滑动输入
          type: "slider",
          imgUrl: require("@/assets/img/search/resouce_capacity.png"),
          imgTitle: "容量",
          code: "capacity",
          value: [0, 0],
          max: 100,
          marks: {},
        },
        {
          // 滑动输入
          type: "slider",
          imgUrl: require("@/assets/img/search/langTime.png"),
          imgTitle: "时长",
          code: "timeLength",
          value: [0, 0],
          max: 100,
          marks: {},
        },
      ],
      videoInfo2: [
        {
          // 时间段
          type: "rangePicker",
          imgUrl: require("@/assets/img/search/date.png"),
          imgTitle: "上传时间",
          code: "uploadTime",
          value: [],
        },
      ],
    });
    const imgSearch = reactive({
      imgInfo1: [
        {
          // 滑动输入
          type: "slider",
          imgUrl: require("@/assets/img/search/resouce_capacity.png"),
          imgTitle: "容量",
          code: "capacity",
          value: [0, 0],
          max: 100,
          marks: {},
        },
      ],
    });
    const textSearch = reactive({
      textInfo2: [
        {
          type: "textButton",
          imgUrl: require("@/assets/img/search/author.png"),
          imgTitle: "作者",
          code: "author",
          buttonArr: [],
        },
        {
          // 时间段
          type: "rangePicker",
          imgUrl: require("@/assets/img/search/date.png"),
          imgTitle: "创建时间",
          code: "bigenTime",
          value: [],
        },
        {
          // 时间段
          type: "rangePicker",
          imgUrl: require("@/assets/img/search/update.png"),
          imgTitle: "修改时间",
          code: "periodTime",
          value: [],
        },
      ],
    });
    const addParmas = reactive({
      drawer: false,
      showInput: false,
      paramObj: {
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
      showTitleIcon: false, //不显示头部图标
      checkBox: false, //不支持多选
    });
    const repositoryData = reactive({
      searchInfo1: [
        {
          // 滑动输入
          type: "slider",
          imgUrl: require("@/assets/img/search/resouce_capacity.png"),
          imgTitle: "容量",
          code: "capacity",
          value: [0, 0],
          max: 100,
          marks: {},
        },
        {
          // 滑动输入
          type: "slider",
          imgUrl: require("@/assets/img/search/langTime.png"),
          imgTitle: "时长",
          code: "timeLength",
          value: [0, 0],
          max: 100,
          marks: {},
        },
      ],
      searchInfo2: [
        {
          // 时间段
          type: "rangePicker",
          imgUrl: require("@/assets/img/search/date.png"),
          imgTitle: "上传时间",
          code: "uploadTime",
          value: [],
        },
      ],
      searchInfo4: [
        {
          type: "fontSearch",
          value: "",
          selectAll: false,
          disable: false,
          code: "fontSearch",
          showInvertSelection: true,
          showNotDisable: true,
          invertSelection: false,
          todoDel: {
            fnName: '',
            attr: {}
          }
        },
      ],
      fileName: "",
      idx: 0,
      tabData: [
        {
          image: require("@/assets/img/uploader/resouce_video.png"),
          image_act: require("@/assets/img/uploader/resouce_video_a.png"),
          name: "视频",
          code: "video",
        },
        {
          image: require("@/assets/img/uploader/resouce_img.png"),
          image_act: require("@/assets/img/uploader/resouce_img_a.png"),
          name: "图片",
          code: "image",
        },
        {
          image: require("@/assets/img/uploader/resouce_text.png"),
          image_act: require("@/assets/img/uploader/resouce_text_a.png"),
          name: "文档",
          code: "textarea",
        },
        {
          image: require("@/assets/img/uploader/resouce_audio.png"),
          image_act: require("@/assets/img/uploader/resouce_audio_a.png"),
          name: "音频",
          code: "audio",
        },
      ],
      chooseVideoIds: [],
      chooseImageIds: [],
      textPageIds:[],
      accountIds: [],
      showVideoImageList: true,
      showSearchInfo4: true,
      showTextPage: false,
      showAudioPage: false,
      textPageTotal: 0, // 文档数据总条数
      textPageParamObj: {
        pageType: 'textPage',
        fnName: 'textPage',
        chooseIds: [],
        fnAttr:{
          idDesc: true,
          authorIds: [],
          geCreateAt: '', //创建时间 开始
          geUpdatedAt: '', // 修改时间 开始
          kw: '', // 关键字
          leCreateAt: '', // 创建时间 结束
          leUpdatedAt: '', // 修改时间 结束
          pn: 1,
          ps: 12 // 页大小
        }
      }
    });
    init()
    // 查询条件的初始化
    function init() {
      if (repositoryData.idx === 0 || repositoryData.idx === 1 || repositoryData.idx === 3) {
        let fnName = ''
        if (addParmas.paramObj.pageType === 'video') {
          fnName = 'videoQueryLimit'
        } else if (addParmas.paramObj.pageType === 'image') {
          fnName = 'imageQueryLimit'
        } else if (addParmas.paramObj.pageType === 'audio') {
          fnName = 'audioQueryLimit'
        }
        allFns[fnName]().then(res => {
          repositoryData.searchInfo1[0].value = [0, res.data.maxSize]
          repositoryData.searchInfo1[0].max = res.data.maxSize
          if (addParmas.paramObj.pageType === 'video' || addParmas.paramObj.pageType === 'audio') {
            repositoryData.searchInfo1[1].value = [0, res.data.maxDuration]
            repositoryData.searchInfo1[1].max = res.data.maxDuration
          }
        })
      } else if (repositoryData.idx === 2) {
        addOrEdite.authorDropDownList().then(res => {
          textSearch.textInfo2[0].buttonArr = res
        })
      }
    }
    //激活样式
    function clickImg(item, index) {
      videoSearch.videoInfo2[0].value = []
      repositoryData.idx = index;
      repositoryData.showVideoImageList = false;
      const obj = {
        idDesc: true,
        duration: null,
        geCreateAt: "",
        leCreateAt: "",
        kw: "",
        pn: 1,
        ps: 11,
        size: null,
      }
      this.paramObj.funFormAttr = obj
      const obj2 = {
          idDesc: true,
          authorIds: [],
          geCreateAt: '', //创建时间 开始
          geUpdatedAt: '', // 修改时间 开始
          kw: '', // 关键字
          leCreateAt: '', // 创建时间 结束
          leUpdatedAt: '', // 修改时间 结束
          pn: 1,
          ps: 12 // 页大小
        }
        repositoryData.textPageParamObj.fnAttr = obj2
        repositoryData.searchInfo4[0].value = ''
      if (item.code == "video") {
        addParmas.paramObj.pageType = "video";
        addParmas.paramObj.funFormName = "videoPage";
        repositoryData.searchInfo1 = videoSearch.videoInfo1;
        repositoryData.searchInfo2 = videoSearch.videoInfo2;
        repositoryData.searchInfo4[0].selectAll = false;
        addParmas.paramObj.chooseIds = repositoryData.chooseVideoIds;
        init()
        nextTick(() => {
          repositoryData.showVideoImageList = true;
          repositoryData.showSearchInfo4 = true
        });
      } else if (item.code == "image") {
        addParmas.paramObj.pageType = "image";
        addParmas.paramObj.funFormName = "imagePage";
        repositoryData.searchInfo1 = imgSearch.imgInfo1;
        repositoryData.searchInfo2 = videoSearch.videoInfo2;
        addParmas.paramObj.chooseIds = repositoryData.chooseImageIds;
        repositoryData.searchInfo4[0].selectAll = false;
        repositoryData.showSearchInfo4 = false;
        init()
        nextTick(() => {
          repositoryData.showVideoImageList = true;
          repositoryData.showSearchInfo4 = true;
        });
      } else if (item.code == "textarea") {
        repositoryData.textPageParamObj.pageType= 'textPage'
        repositoryData.showTextPage = true
        repositoryData.showSearchInfo4 = true
        repositoryData.searchInfo2 = textSearch.textInfo2;
        init()
      } else if (item.code == "audio") {
        addParmas.paramObj.pageType = "audio";
        addParmas.paramObj.funFormName = "audioPage";
        repositoryData.searchInfo1 = videoSearch.videoInfo1;
        repositoryData.searchInfo2 = videoSearch.videoInfo2;
        repositoryData.searchInfo4[0].selectAll = false;
        addParmas.paramObj.chooseIds = repositoryData.chooseVideoIds;
        init()
        nextTick(() => {
          repositoryData.showVideoImageList = true;
          repositoryData.showSearchInfo4 = true
        });
      }
      
    }

    return {
      ...toRefs(repositoryData),
      ...toRefs(textSearch),
      ...toRefs(imgSearch),
      ...toRefs(videoSearch),
      ...toRefs(addParmas),
      init,
      clickImg,
    };
  },
  methods: {
    changedSearchInfo(pitchOn, type, arr) {
      this.textPageParamObj.fnAttr.pn = 1
      this.paramObj.funFormAttr.pn = 1
      if (type !== 'fontSearch_del'){
        this.showTextPage = false
        this.showVideoImageList = false;
      }
      if (this.idx === 0 || this.idx === 3) {
        switch (type) {
          case "capacity":
            if (pitchOn) {
              this.searchInfo1[0].value = [pitchOn[0], pitchOn[1]];
              this.paramObj.funFormAttr.sizeGe = pitchOn[0];
              this.paramObj.funFormAttr.sizeLe = pitchOn[1];
            } else {
              this.searchInfo1[0].value = [];
              this.paramObj.funFormAttr.sizeGe = null;
              this.paramObj.funFormAttr.sizeLe = null;
            }
            break;
          case "timeLength":
            if (pitchOn) {
              this.searchInfo1[1].value = [pitchOn[0], pitchOn[1]];
              this.paramObj.funFormAttr.durationGe = pitchOn[0];
              this.paramObj.funFormAttr.durationLe = pitchOn[1];
            } else {
              this.searchInfo1[1].value = [];
              this.paramObj.funFormAttr.durationGe = null;
              this.paramObj.funFormAttr.durationLe = null;
            }
            break;
          case "uploadTime":
            if (pitchOn) {
              this.videoInfo2[0].value = [pitchOn[0], pitchOn[1]];
              this.paramObj.funFormAttr.geCreateAt = pitchOn[0];
              this.paramObj.funFormAttr.leCreateAt = pitchOn[1];
            } else {
              this.videoInfo2[0].value = [];
              this.paramObj.funFormAttr.geCreateAt = null;
              this.paramObj.funFormAttr.leCreateAt = null;
            }
            break;
        }
      } else if (this.idx === 1) {
        switch (type) {
          case "capacity":
            if (pitchOn) {
              this.searchInfo1[0].value = [pitchOn[0], pitchOn[1]];
              this.paramObj.funFormAttr.sizeGe = pitchOn[0];
              this.paramObj.funFormAttr.sizeLe = pitchOn[1];
            } else {
              this.searchInfo1[0].value = [];
              this.paramObj.funFormAttr.sizeGe = null;
              this.paramObj.funFormAttr.sizeLe = null;
            }
            break;
            case "uploadTime":
            if (pitchOn) {
              this.videoInfo2[0].value = [pitchOn[0], pitchOn[1]];
              this.paramObj.funFormAttr.geCreateAt = pitchOn[0];
              this.paramObj.funFormAttr.leCreateAt = pitchOn[1];
            } else {
              this.videoInfo2[0].value = [];
              this.paramObj.funFormAttr.geCreateAt = null;
              this.paramObj.funFormAttr.leCreateAt = null;
            }
            break;
        }
      } else if (this.idx === 2) {
        switch (type) {
          case 'author':
            this.textPageParamObj.fnAttr.authorIds = []
            arr.map(item => {
              item.clicked = item.id === pitchOn.id ? !item.clicked : item.clicked
              if (item.clicked) {
                this.textPageParamObj.fnAttr.authorIds.push(item.id)
              }
            })
            break;
            case 'bigenTime':
              if (pitchOn) {
              this.textPageParamObj.fnAttr.geCreateAt = pitchOn[0];
              this.textPageParamObj.fnAttr.leCreateAt = pitchOn[1];
            } else {
              this.textPageParamObj.fnAttr.geCreateAt  = null;
              this.textPageParamObj.fnAttr.leCreateAt = null;
            }
              break;
            case 'periodTime':
              if (pitchOn) {
              this.textPageParamObj.fnAttr.geUpdatedAt = pitchOn[0];
              this.textPageParamObj.fnAttr.leUpdatedAt = pitchOn[1];
            } else {
              this.textPageParamObj.fnAttr.geUpdatedAt  = null;
              this.textPageParamObj.fnAttr.leUpdatedAt = null;
            }
            break;
        }
      }
      switch (type) {
        case "fontSearch":
            if (this.idx === 0 || this.idx === 1 || this.idx === 3) {
               this.paramObj.funFormAttr.kw = pitchOn
            } else if (this.idx === 2) {
              this.textPageParamObj.fnAttr.kw = pitchOn
            }
          break;
        case "fontSearch_selectAll":
          this.searchInfo4[0].selectAll = pitchOn;
          break;
        case "fontSearch_selectInvertSelection":
          this.searchInfo4[0].invertSelection = pitchOn;
          break;
        // case "fontSearch_disable":
        //   if (this.accountIds.length < 1) {
        //     ElMessage.warning({
        //       message: "请先选择内容再操作",
        //       type: "warning",
        //     });
        //   } else {
        //     this.searchInfo4[0].disable = true;
        //   }
        //   break;
        // case "fontSearch_use":
        //   if (this.accountIds.length < 1) {
        //     ElMessage.warning({
        //       message: "请先选择内容再操作",
        //       type: "warning",
        //     });
        //   } else {
        //     this.searchInfo4[0].disable = false;
        //   }
        //   break;
        case "fontSearch_del":
          if (this.accountIds.length < 1) {
            ElMessage.warning({
              message: "请先选择内容再操作",
              type: "warning",
            });
          } else {
            if (this.idx === 0 || this.idx === 1 || this.idx === 3) {
              if (this.paramObj.pageType === 'video') {
                this.searchInfo4[0].todoDel.fnName = 'videoBatchDelete'
                this.searchInfo4[0].todoDel.attr = {ids: this.accountIds}
              } else if (this.paramObj.pageType === 'image') {
                this.searchInfo4[0].todoDel.fnName = 'imageBatchDelete'
                this.searchInfo4[0].todoDel.attr = {ids: this.accountIds}
              } else if (this.paramObj.pageType === 'audio') {
                this.searchInfo4[0].todoDel.fnName = 'audioBatchDelete'
                this.searchInfo4[0].todoDel.attr = {ids: this.accountIds}
              }
            } else if (this.idx === 2) { 
              this.searchInfo4[0].todoDel.fnName = 'textBatchDelete'
              this.searchInfo4[0].todoDel.attr = {ids: this.accountIds}
            }
          }
          break;
      }
      if (type !== 'fontSearch_del'){
        nextTick(() => {
          if (this.idx === 0 || this.idx === 1 || this.idx === 3) {
            this.showVideoImageList = true;
          } else if(this.idx === 2) {
            this.showTextPage = true
          }
        });
      }
    },
    chooseAccount(arr) {
      let ids = [];
      if (arr.length > 0) {
        arr.forEach(v => {
          if (v.choosed) {
            ids.push(v.id)
          }
        })
      }
      if (this.idx === 0 || this.idx === 1) {
        if (this.paramObj.pageType === "video") {
          this.chooseVideoIds = ids;
        } else if (this.paramObj.pageType === "image") {
          this.chooseImageIds = ids;
        }
      } else if(this.idx === 2) {
        this.textPageIds = ids
      }
      this.accountIds = ids;
    },
    scrollVideo(){
      if (this.textPageTotal > (this.textPageParamObj.fnAttr.pn * this.textPageParamObj.fnAttr.ps)){
        this.textPageParamObj.fnAttr.pn += 1
      }
    },
    getTotal(n) {
      this.textPageTotal = n
    },
    changeName(attr) {
      if(this.paramObj.pageType === 'video') {
        allFns.videoModify(attr)
      } else if(this.paramObj.pageType === 'image') {
        allFns.imageModify(attr)
      } else if (this.paramObj.pageType === 'audio') {
        allFns.audioModify(attr)
      }
    }
  },
};
</script>
<style lang="less" scoped>
.textPageBox{
  margin-top: 3vh;
  height: 68vh;
  overflow-y: auto;
  &_textPage{
    padding-bottom: 13vh;
  }
}
.repository {
  height: 96vh;
  overflow: hidden;
  position: relative;
  .tab_change {
    width: 10vw;
    height: 3vh;
    display: flex;
    margin: 2vh 0;
    justify-content: space-between;
    position: absolute;
  }
  .repositorySerach {
    display: grid;
    // grid-template-rows: 23vh;
    grid-template-columns: repeat(4, minmax(20vw, 1fr));
    .searchPage:nth-child(1) {
      margin: 8vh 0 0 0;
    }
    .searchPage:nth-child(2) {
      margin-top: 9vh;
      :deep(.imgStyle) {
        position: absolute;
        top: 5%;
        left: -4%;
      }
    }
    .searchPage:nth-child(3) {
      margin-top: 2vh;
    }
  }
}
</style>
