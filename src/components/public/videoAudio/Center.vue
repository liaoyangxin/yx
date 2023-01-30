<template>
  <div :loading="loadingPage">
    <div class="count">
      <div v-if="fatherPageType ==='editeAudio' || fatherPageType ==='previewAudio'" class="borderBox">
        <el-row style="height:100%">
          <el-col :span="6" class="centerShow pointer" @click="showAudioList" v-if="fatherPageType ==='editeAudio'">
            <span class="nameSpan" v-if="centerData.mainVideoUrl">{{centerData.auditInfo.name}}</span>
            <img v-else src="@/assets/img/allAdd.png" class="pointer audioAddImg"  />
          </el-col>
          <el-col :span="6" class="centerShow" v-else>
            <img :src="centerData.imageUrl?centerData.imageUrl:require('@/assets/position/audioListImage.png')" class="showImg"  />
          </el-col>
          <el-col :span="8" class="centerCol">
            <div class="centerDiv">
              <p>【歌词】</p>
              <el-input v-if="fatherPageType ==='editeAudio'" type="textarea" @blur="blurLyrics" v-model="centerData.auditInfo.lyrics" :rows="12" resize="none" />
              <div v-else class="lyricsFont">{{centerData.auditInfo.lyrics}}</div>
            </div>
          </el-col>
          <el-col :span="10" class="centerShow">
            <audio :controls="true" v-if="showAudio" v-show="fatherPageType ==='editeAudio'" autoplay id="music" @timeupdate="timeupdate">
              <source :src="centerData.mainVideoUrl" type="audio/ogg" />
              <source :src="centerData.mainVideoUrl" type="audio/mpeg" />
              您的浏览器不支持 audio 元素。
            </audio>
            <el-progress v-show="fatherPageType ==='previewAudio'" type="circle" class="balckCircle" :width="280" color="#9a9aa1" :percentage="nowMusicTime" :duration="1">
              <img src="@/assets/img/audio/audioAddVolume.png" title="音量+" class="pointer audioControls addVolumeImg" @click="addMusicVolume"/>
              <div class="playBox" title="播放/暂停" @click="playMusic">
                <img src="@/assets/img/audio/audioPlay.png" v-show="!musicPlay" class="pointer " />
                <img src="@/assets/img/audio/audioPause.png" v-show="musicPlay" class="pointer " />
              </div>
              <img src="@/assets/img/audio/audioDelVolume.png" title="音量-" class="pointer audioControls delVolumeImg" @click="delMusicVolume"/>
            </el-progress>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="selectBox" v-if="fatherPageType !=='previewAudio' && fatherPageType !== 'preview'">
      <div class="fontDiv">
        <el-popover placement="left" width="auto" trigger="hover" content="作者">
          <template #reference>
            <img class="selectBox_icon" src="@/assets/img/search/author.png" />
          </template>
        </el-popover>
        <el-select
          v-model="centerData.authorId"
          @change="saveVideo()"
          :default="authorId"
          placeholder="请选择"
          :disabled="disabled"
        >
          <el-option
            v-for="item in authorOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>

      <div class="fontDiv">
        <el-popover placement="left" width="auto" trigger="hover" content="类别">
          <template #reference>
            <img class="selectBox_icon" src="@/assets/img/search/type.png" />
          </template>
        </el-popover>

        <el-select
          v-model="centerData.categoryId"
          @change="saveVideo()"
          placeholder="请选择"
          :disabled="disabled"
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
        <el-popover placement="left" width="auto" trigger="hover" content="主题">
          <template #reference>
            <img class="selectBox_icon" src="@/assets/img/search/theme.png" />
          </template>
        </el-popover>
        <el-select
          multiple
          collapse-tags
          style="font-size: 1.4vh"
          v-model="centerData.subjectIds"
          @change="saveVideo()"
          placeholder="请选择"
          :disabled="disabled"
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
      <div class="fontDiv" :disabled="disabled">
        <el-popover placement="left" width="auto" trigger="hover" content="关键词">
          <template #reference>
            <img class="selectBox_icon" src="@/assets/img/search/keywords.png" />
          </template>
        </el-popover>
        <span
          class="chooseFont"
          v-for="(item, index) in choosedKeyWords"
          :key="`k${index}`"
          @click="changeKeyWorld('del', index)"
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
              placeholder="敲击回车新增"
              @change="changeInput"
              @keydown.enter="
                (e) => {
                  addKeyWorld(e.target.value);
                }
              "
              @focus="showPopover = true"
              v-model="inputVal"
            ></el-input>
          </template>
          <ul v-if="keywordOptions.length > 0" class="addOrEdite_popover_gjz_ul">
            <li
              v-for="(item, index) in keywordOptions"
              :key="item.id"
              class="optionsWorld"
              @click="changeKeyWorld('selected', index)"
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
        <VideoImageList
          :paramObj="paramObj"
          :showTitleIcon="showTitleIcon"
          @chooseAccount="chooseAccount"
          @centerVideoUrl="centerVideoUrl"
          @pobjAction="pobjAction"
        ></VideoImageList>
      </div>
    </el-drawer>
    
  </div>
</template>
<script>
import { reactive, toRefs } from "@vue/reactivity";
import { ElMessage } from "element-plus";
import VideoImageList from "@/components/public/videoImageList/index/index.vue";
import { nextTick } from '@vue/runtime-core';
import * as centerJs from "./center";
import eventBus from "@/eventBus"
export default {
  components: { VideoImageList },
  props:{
    fatherPageType: {
      type: String,
      default: ''
    },
    fatherPorps: {
      type: Object,
      default: () => {}
    }
  },
  setup(props) {
    const parmasData = reactive({
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
        pageType: "audio",
        funFormName: "audioPage",
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
      showTitleIcon: false,
    })
    const data = reactive({
      loadingPage: false,
      typeOptions: [],
      authorOptions: [],
      themeOptions: [],
      keywordOptionsAll: [],
      inputVal: "",
      showPopover: false,
      drawer: false,
      showAudio: false,
      musicPlay: true,
      nowMusicTime: 0,
      centerData: JSON.parse(JSON.stringify(props.fatherPorps)),
    });
    init();
    if (data.centerData.mainVideoUrl) {
      setParams(data.centerData.auditInfo);
    } else {
      setParams()
    }
    function init() {
      data.loadingPage = true;
      Promise.all([
        centerJs.dropDownList({ state: 0 }),
        centerJs.authorDropDownList({ state: 0 }),
        centerJs.subjectDropDownList({ state: 0 }),
        centerJs.tagDropDownList({ state: 0 }),
      ]).then((res) => {
        data.typeOptions = res[0];
        data.authorOptions = res[1];
        data.themeOptions = res[2];
        data.keywordOptionsAll = res[3];
        if (!data.centerData.categoryId || data.centerData.categoryId.length < 1) {
          data.centerData.categoryId =
          data.typeOptions.length > 0 ? data.typeOptions[0].id : null;
        }
        if (!data.centerData.authorId || data.centerData.authorId.length < 1) {
          data.centerData.authorId =
          data.authorOptions.length > 0 ? data.authorOptions[0].id : null;
        }
        if (!data.centerData.subjectIds || data.centerData.subjectIds.length < 1) {
          data.centerData.subjectIds =
          data.themeOptions.length > 0 ? [data.themeOptions[0].id] : null;
        }
        data.loadingPage = false;
      });
    }
    function setParams(obj){
      switch (props.fatherPageType) {
        case 'editeAudio': 
          parmasData.paramObj.pageType = "audio"
          parmasData.paramObj.funFormName = "audioPage"
          parmasData.paramObj.titleInputType = "search"
          parmasData.showTitleIcon = true
          parmasData.paramObj.titleIcons = [
          {
            iconUrl: require("@/assets/icon/heightPrecision/resource_1_high.png"),
            choosedIcon: require("@/assets/icon/heightPrecision/resource_1_high.png"),
            notChooseIcon: require("@/assets/icon/heightPrecision/resource_0_high.png"),
            action: "LIBRARY",
            title: "本地音频",
            choosed: true,
            titleInputVal: "", // 表示输入的查询、url、脚本
            titleInputType: "search",
          },
          {
            iconUrl: require("@/assets/icon/heightPrecision/net_file_0_high.png"),
            choosedIcon: require("@/assets/icon/heightPrecision/net_file_1_high.png"),
            notChooseIcon: require("@/assets/icon/heightPrecision/net_file_0_high.png"),
            action: "WEB_VIDEO",
            title: "网络音频",
            choosed: false,
            titleInputVal: "", // 表示输入的查询、url、脚本
            titleInputType: "url",
          },
          {
            iconUrl: require("@/assets/icon/heightPrecision/YouTube_0_high.png"),
            choosedIcon: require("@/assets/icon/heightPrecision/YouTube_1_high.png"),
            notChooseIcon: require("@/assets/icon/heightPrecision/YouTube_0_high.png"),
            action: "YOUTUBE",
            title: "youTube音频",
            choosed: false,
            titleInputVal: "", // 表示输入的查询、url、脚本
            titleInputType: "url",
          },
          {
            iconUrl: require("@/assets/icon/heightPrecision/file_0_high.png"),
            choosedIcon: require("@/assets/icon/heightPrecision/file_1_high.png"),
            notChooseIcon: require("@/assets/icon/heightPrecision/file_0_high.png"),
            action: "HLS_RMTP",
            title: "HLS/RMTP音频",
            choosed: false,
            titleInputVal: "", // 表示输入的查询、url、脚本
            titleInputType: "url",
          },
          ]
          if(obj){
            data.showAudio = false
            data.centerData.auditInfo = {
              "lyrics": obj.lyrics, // 歌词
              "lyricsId": obj.lyricsId,// 歌词文件id
              "meta": obj.meta, // 音频元信息
              "name": obj.name, // 音频名称
              "volume": obj.volume || obj.volume === 0 ? obj.volume : 0.5 // 音量
            }
            nextTick(()=>{
              data.showAudio = true
            })
          }
          break;
          case 'previewAudio':
          if(props.fatherPorps){
            const obj = props.fatherPorps.auditInfo
            data.showAudio = false
            data.centerData.auditInfo = obj
            nextTick(()=>{
              data.showAudio = true
            })
            
          }
          break;
      }
    }
    
    return {
      ...toRefs(data),
      ...toRefs(parmasData),
      setParams,
    };
  },
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
    // 音乐总时间
    musicDuration() {
      let times = 0
      const audio = document.getElementById("music")
      if (this.centerData.mainVideoUrl && audio) {
        times = audio.duration
      }
      return times
    },
    disabled(){
      return this.fatherPorps.isDisabled
    }
  },
  updated() {
    let audio = document.getElementById("music")
    if (audio) {
      audio.volume = this.centerData.auditInfo.volume
    }
  },
  methods: {
    saveVideo() {
      this.centerData.tags = this.keywordOptionsAll
        .filter((v) => v.choosed)
        .map((item) => item.id);
      this.$emit("saveCenter", this.centerData);
    },
    changeKeyWorld(str, index) {
      if (str === "selected") {
        this.showPopover = false;
        const obj = this.keywordOptions[index];
        this.keywordOptionsAll.map((item) => {
          item.choosed = item.id === obj.id ? true : item.choosed;
        });
      } else if (str === "del") {
        const obj = this.choosedKeyWords[index];
        this.keywordOptionsAll.map((item) => {
          item.choosed = item.id === obj.id ? false : item.choosed;
        });
      }
      this.saveVideo();
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
        centerJs.addKeyWorld(attr).then((res) => {
          res.data.choosed = true;
          this.keywordOptionsAll.push(res.data);
          this.inputVal = "";
          this.saveVideo();
          this.showPopover = false;
        });
      }
    },
    showAudioList(){
      this.paramObj.chooseIds = [this.centerData.mainVideoId]
      this.drawer = true
    },
    chooseAccount(obj){
      this.centerData.mainVideoUrl = obj.accessPath
      this.centerData.mainVideoSource = obj.mainVideoSource
      this.centerData.mainVideoId = obj.id
      this.centerData.duration = obj.duration
      this.setParams(obj)
      this.$emit("saveCenter", this.centerData);
    },
    blurLyrics(){
      this.$emit("saveCenter", this.centerData)
    },
    playMusic(){
      const audio = document.getElementById("music");
      if(audio.paused) {
        this.musicPlay = true                
        audio.play();//audio.play();// 这个就是播放  
      }else{
        this.musicPlay = false
        audio.pause();// 这个就是暂停
      }
    },
    addMusicVolume(){
      let audio = document.getElementById("music")
      if (audio && audio.volume < 0.9) {
        audio.volume += 0.1
        this.centerData.auditInfo.volume = audio.volume
        this.$emit("saveCenter", this.centerData)
      }
    },
    delMusicVolume(){
      let audio = document.getElementById("music")
      if (audio && audio.volume.toFixed(1) > 0) {
        audio.volume = audio.volume.toFixed(1) - 0.1
        this.centerData.auditInfo.volume = audio.volume
        this.$emit("saveCenter", this.centerData)
      }
    },
    timeupdate(e){
      eventBus.emit('centerTime', {time: e.target.currentTime})
      this.nowMusicTime = e.target.currentTime
    }
  },
};
</script>
<style lang="less" scoped>
.count{
  margin-top: 10%;
  .borderBox{
    height: 50vh;
    background-color: #fff;
    box-shadow: 0 0 3vh #9a9aa1;
    .audioAddImg{
      width: 10vw;
      height: 10vw;
    }
    .showImg{
      width: 13vw;
      height: 15vw;
    }
    .centerShow{
      display: flex;
      align-items: center;
      justify-content: center;
      .nameSpan{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-left: 2vw;
        text-align: center;
      }
      
    }
    .centerCol{
      position: relative;
      .centerDiv{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        .lyricsFont{
          height: 30vh;
          overflow-y: auto;
        }
      }
    }
  }
  .balckCircle{
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .playBox{
      width: 4.5vw;
      height: 4.5vw;
      border-radius: 50%;
      box-shadow: 0 0 3vh #9a9aa1;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      img{
        position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      }
    }
    .audioControls{
      width: 11vw;
      height: 7vw;
      // background-color: red;
    }
    .addVolumeImg{
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, 6%);
    }
    .delVolumeImg{
      margin-top: 46%
    }
    
  }
}
.selectBox {
  margin-left: 0.5vw;
  .fontDiv {
      margin-top: 2vh;
      .selectBox_icon{
        margin-right: .5vw;
      }
    }
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
