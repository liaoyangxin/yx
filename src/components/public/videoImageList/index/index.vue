<!-- 视频、图片的选择列表 -->
<template>
  <div>
    <div class="titleDiv" v-if="showTitleIcon && titleIcons.length > 0">
      <el-popover
        v-for="(titleIcon, titleIconIndex) in computedTitileIcon"
        :key="titleIconIndex"
        placement="bottom"
        width="auto"
        trigger="hover"
        :content="titleIcon.title"
      >
        <template #reference>
          <img
            :src="titleIcon.iconUrl"
            class="pointer titleDiv_icon"
            @click="showAcount(titleIcon)"
          />
        </template>
      </el-popover>
    </div>
    <div v-if="choosedTitleIcon.titleInputType && showTitleInput">
      <el-input
        v-if="
          choosedTitleIcon.titleInputType === 'search' ||
          choosedTitleIcon.titleInputType === 'url'
        "
        v-model="choosedTitleIcon.titleInputVal"
         @keyup.enter="searchFn"
         @blur="searchFn"
        :placeholder="
          choosedTitleIcon.titleInputType === 'search'
            ? '请输入要查询的文字'
            : '请输入网址'
        "
      ></el-input>
      <el-input
        v-else-if="choosedTitleIcon.titleInputType === 'javaScript'"
        v-model="choosedTitleIcon.titleInputVal"
        :rows="2"
        resize="none"
        type="textarea"
        placeholder="请输入脚本"
      ></el-input>
    </div>
    <div
      v-loading="showLoading"
      class="uploadBox"
      v-infinite-scroll="scrollVideo"
      :infinite-scroll-immediate="false"
    >
      <div :class="pb130" v-if="choosedTitleIcon.titleInputType === 'search'">
        <!-- v-bind:before-upload="beforeUploadVideo" -->
        <div class="gridBox">
          <el-upload
            v-if="showAddImg"
            class="avatar-uploader"
            action
            :http-request="beforeUploadVideo"
            v-bind:show-file-list="false"
          >
            <div class="uploadBox_box">
              <img src="@/assets/img/allAdd.png" class="addImg" />
            </div>
          </el-upload>
        </div>
        <template v-if="accountForm.length > 0">
          <div v-for="(item, index) in accountForm" :key="index" class="gridBox">
            <div class="disabledBox" v-if="item.disabled">
              <img src="@/assets/img/uploader/disable303.png" class="videoBox" />
            </div>
            <div class="choosedImgBox" v-if="item.choosed">
              <img
                v-if="item.choosed"
                src="@/assets/img/choosed.png"
                class="choosedImg"
                @click="
                  () => {
                    changeAccountFn(!item.choosed, index);
                  }
                "
              />
            </div>

            <video
              @click="
                () => {
                  changeAccountFn(!item.choosed, index);
                }
              "
              v-if="
                paramObj.pageType === 'video' || paramObj.pageType === 'video_content'
              "
              v-bind:src="item.showVideoPath"
              class="avatar video-avatar videoBox"
              style="background-color: #000; border: 1px solid #000"
            >
              <!-- controls="controls" 是否显示播放控件 -->
              您的浏览器不支持视频播放
            </video>
            <img
              v-else-if="paramObj.pageType === 'image'"
              :src="item.showVideoPath"
              class="videoBox"
              @click="
                () => {
                  changeAccountFn(!item.choosed, index);
                }
              "
            />
            <img
              v-else-if="paramObj.pageType === 'audio'"
              src="@/assets/position/audioListImage.png"
              class="videoBox"
              @click="
                () => {
                  changeAccountFn(!item.choosed, index);
                }
              "
            />

            <el-row style="margin-bottom: 2.4vh">
              <el-col
                :span="24"
                style="padding: 0.5vh 0"
                v-if="paramObj.pageType === 'video' || paramObj.pageType === 'image' || paramObj.pageType === 'audio'"
              >
                <div
                  style="font-size: 1.2vh; line-height: 1.6vh"
                  :class="`overFlowPoint ${editerName ? 'nameBox' : ''}`"
                >
                  <span v-if="!item.editer">
                    <div
                      class="nameFont overFlowPoint"
                      :title="!editerName ? item.name : ''"
                    >
                      文件名：{{ item.name }}
                    </div>
                    <i
                      v-if="editerName"
                      class="el-icon-edit el-input__icon pointer editerIcon"
                      @click="handleIconClick(index)"
                    ></i>
                  </span>
                  <span v-else
                    >文件名：
                    <el-input
                      v-model="item.name"
                      class="nameInput"
                      ref="nameInput"
                      @blur="blurName(item.name, index)"
                    />
                  </span>
                </div>
                <template v-if="paramObj.pageType === 'audio'">
                  <div style="font-size: 0.8vh">
                  时长：{{ item.duration ? secondsToTime(item.duration) : " 0" }}
                </div>
                <div style="font-size: 0.8vh">
                  马率：{{ item.bitRate ? item.bitRate : " 0kps" }}
                </div>
                </template>
                <template v-else>
                  <div style="font-size: 0.8vh">
                    分辨率：{{ item.resolution ? item.resolution : " 0" }}
                  </div>
                </template>
                
                
                <div style="font-size: 0.8vh">
                  容量：{{
                    item.size
                      ? `${Math.floor((item.size / 1024 / 1024) * 100) / 100}MB`
                      : "0MB"
                  }}
                </div>
              </el-col>
              <el-col :span="21" v-else-if="paramObj.pageType === 'video_content'">
                <el-row>
                  <el-col :span="24">
                    <h3 style="font-size: 1.2vh">{{ item.title }}</h3>
                  </el-col>
                  <el-col :span="24"> 类型:{{ item.type }} </el-col>
                  <el-col :span="24"> 作者:{{ item.author }} </el-col>
                  <el-col :span="24"> 播放量:{{ item.lookNumber }} </el-col>
                  <el-col :span="24"> 观看人数:{{ item.lookPerson }} </el-col>
                  <el-col :span="12" style="font-size: 0.8vh">
                    创建时间: {{ item.creatDate }}
                  </el-col>
                  <el-col :span="14" style="font-size: 0.8vh">
                    修改时间: {{ item.editeDate }}
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
          <div class="bottom_style">
            <span v-if="accountTotal === accountForm.length">无更多数据</span>
          </div>
        </template>
      </div>
      <template v-else-if="choosedTitleIcon.titleInputType === 'url'">
        <!-- choosedTitleIcon.action === 'YOUTUBE' && choosedTitleIcon.titleInputVal -->
        <div v-if="toShowYoutube">
          <ShowYoutube
            :style="`width: 100%; height:73vh; margin-top: 2.4vh`"
            :youtobeId="choosedTitleIcon.titleInputVal.split('https://youtu.be/')[1]"
          ></ShowYoutube>
        </div>
        <iframe
          v-else
          referrerpolicy="no-referrer"
          frameborder="0"
          :style="`width: 100%; height:73vh; margin-top: 2.4vh`"
          :src="choosedTitleIcon.titleInputVal"
        ></iframe>
      </template>
    </div>
  </div>
</template>
<script>
import { computed, reactive, toRefs } from "@vue/reactivity";
import { ElMessage } from "element-plus";
import router from "@/routes/index";
import ShowYoutube from "@/components/public/youtube/showYoutube.vue";
import { uploadByPieces } from "@/api/public/shardVideo.js";
import * as allFns from "./index.js";
import { nextTick } from "@vue/runtime-core";
import { secondsToTime } from "@/api/public/index";
export default {
  components: { ShowYoutube },
  props: {
    paramObj: {
      type: Object,
      default: () => {
        // pageType: 'video_content', // 表示是图片还是视频 video-视频选择 video_content-内容页的视频展示主要是下面的文字不一样 image-图片选择 audio-音频选择
        // titleIcons:[ // 最上面的icon 是个数组
        //   {
        //     iconUrl: require("@/assets/icon/heightPrecision/resource_1_high.png"),
        // choosedIcon: require("@/assets/icon/heightPrecision/resource_1_high.png"),
        // notChooseIcon: require("@/assets/icon/heightPrecision/resource_0_high.png"),
        // action: "LIBRARY",
        // title: "本地视频",
        // choosed: true,
        // titleInputVal: '', // 表示输入的查询、url、脚本
        // titleInputType: 'search'
        //   }
        // ]
        // chooseIds: [], // 默认选中的id
        // funFormName: '',// 获取accountForm的接口名称 这个接口必须写在./index.js中
        // funFormAttr: {}
      },
    },
    showTitleIcon: {
      // 是否显示页面最上面的icon
      type: Boolean,
      default: true,
    },
    showTitleInput: {
      type: Boolean,
      default: true,
    },
    checkBox: {
      // 表示是否支持多选
      type: Boolean,
      default: false,
    },
    showAddImg: {
      // 是否显示添加图片
      type: Boolean,
      default: true,
    },
    rowNumber: {
      // 一排放几个
      type: Number,
      default: 3,
    },
    chooseId0: {
      // 表示是否可以不选（至少要选中一个）
      type: Boolean,
      default: false,
    },
    selectAll: {
      type: Boolean,
      default: false,
    },
    invertSelection: {
      // 反选
      type: Boolean,
      default: false,
    },
    displayByIds: {
      // 禁用、启用
      type: Boolean,
      default: false,
    },
    todoDel: {
      // 执行删除
      type: Object,
      default: () => {
        return {
          fnName: "",
          attr: {},
        };
      },
    },
    editerName: {
      type: Boolean,
      default: false,
    },
    pb130: {
      // 由于资源库页面显示有问题针对加的
      type: String,
      default: "",
    },
  },
  setup(props, context) {
    const data = reactive({
      routerName: router.currentRoute._value.name,
      titleIcons: props.paramObj.titleIcons
        ? JSON.parse(JSON.stringify(props.paramObj.titleIcons))
        : [],
      chooseIds: props.paramObj.chooseIds
        ? JSON.parse(JSON.stringify(props.paramObj.chooseIds))
        : [],
      funFormName: props.paramObj.funFormName,
      funFormAttr: props.paramObj.funFormAttr
        ? JSON.parse(JSON.stringify(props.paramObj.funFormAttr))
        : {},
      accountForm: [], // 页面中显示的图片、视频集合
      videoType: [
        "video/mp4",
        "video/ogg",
        "video/flv",
        "video/avi",
        "video/wmv",
        "video/rmvb",
        "video/mov",
      ],
      imgType: [
        "image/png",
        "image/bmp",
        "image/jpg",
        "image/tiff",
        "image/gif",
        "image/pcx",
        "image/tga",
        "image/exif",
        "image/fpx",
        "image/psd",
        "image/ai",
        "image/raw",
        "image/jpeg",
      ],
      // 当前选中的icon
      choosedTitleIcon: props.paramObj.titleIcons
        ? JSON.parse(JSON.stringify(props.paramObj.titleIcons))[0]
        : {
            action: "LIBRARY",
            titleInputVal: "", // 表示输入的查询、url、脚本
            titleInputType: "search",
          },
      accountTotal: 0,
      showLoading: false,
      toShowYoutube: false,
    });
    const computedTitileIcon = computed(() => {
      let arr = [];
      if (data.titleIcons.length > 0) {
        arr = data.titleIcons.map((item) => {
          item.iconUrl = item.choosed ? item.choosedIcon : item.notChooseIcon;
          if (item.choosed) {
            data.choosedTitleIcon = item;
          }
          return item;
        });
      }
      return arr;
    });
    // 视频来源 图标切换
    const showAcount = (titleIconObj) => {
      // 控制上面的图标被选中
      data.titleIcons = data.titleIcons.map((item) => {
        item.choosed = item.action === titleIconObj.action;
        return item;
      });
      data.toShowYoutube =
        titleIconObj.action === "YOUTUBE" && titleIconObj.titleInputVal;
      titleIconObj.choosed = true;
      data.choosedTitleIcon = titleIconObj;
      let choosedArr = [];
      // 判断默认选中
      if (
        data.accountForm.length > 0 &&
        data.chooseIds.length > 0 &&
        data.choosedTitleIcon.action === "LIBRARY"
      ) {
        data.accountForm.map((item) => {
          item.choosed = data.chooseIds.findIndex((v) => v === item.id) > -1;
          if (item.choosed) {
            choosedArr.push(item);
          }
        });
      }
      if (data.choosedTitleIcon.action === "LIBRARY") {
        if (choosedArr.length > 0) {
          if (props.checkBox) {
            context.emit("chooseAccount", choosedArr);
          } else {
            context.emit("chooseAccount", choosedArr[0]);
          }
        }
      } else {
        if (data.choosedTitleIcon.titleInputVal) {
          const obj2 = {
            url: data.choosedTitleIcon.titleInputVal,
            mainVideoSource: data.choosedTitleIcon.action,
          };
          context.emit("centerVideoUrl", obj2);
        }
      }
      context.emit("pobjAction", titleIconObj.action, data.titleIcons);
    };

    // 初始化 accountForm
    function init(str) {
      console.log('data.chooseIds', data.chooseIds)
      console.log('str', str)
      allFns[data.funFormName](data.funFormAttr).then((res) => {
        const resArr = res.records;
        console.log('resArr', resArr)
        if (props.paramObj.titleIcons) {
          const headIconObj = props.paramObj.titleIcons.filter((v) => v.choosed)[0];
          data.toShowYoutube =
            headIconObj.action === "YOUTUBE" && headIconObj.titleInputVal;
        }
        if (
          props.paramObj.pageType === "video" ||
          props.paramObj.pageType === "video_content"
        ) {
          resArr.map((item) => {
            item.showVideoPath = item.accessPath;
            item.choosed = data.chooseIds.findIndex((v) => v === item.id) > -1;
            item.mainVideoSource = data.choosedTitleIcon.action;
            item.resolution = item.width + "*" + item.height;
            if (data.funFormAttr.pn > 1) {
              if (data.accountForm.indexOf(item.id) == -1) {
                data.accountForm.push(item);
              }
            }
          });
          if (data.funFormAttr.pn === 1) {
            data.accountForm = resArr;
          }
        } else {
          resArr.map((item) => {
            item.showVideoPath = item.accessPath;
            item.choosed = data.chooseIds.findIndex((v) => v === item.id) > -1;
            item.mainVideoSource = data.choosedTitleIcon.action;
            item.resolution = item.width + "*" + item.height;
            if (data.funFormAttr.pn > 1) {
              if (data.accountForm.indexOf(item.id) == -1) {
                data.accountForm.push(item);
              }
            }
          });
          console.log('resArr1', resArr)
          if (data.funFormAttr.pn === 1) {
            data.accountForm = resArr;
          }
        }
        data.accountTotal = res.total;
        if (str && str === "del") {
          context.emit("chooseAccount", []);
        }
      });
    }
    init();
    //上传前回调
    const beforeUploadVideo = (file) => {
      if (
        props.paramObj.pageType === "video" ||
        props.paramObj.pageType === "video_content"
      ) {
        if (data.videoType.indexOf(file.file.type) == -1) {
          ElMessage.error({
            message: "请上传正确的视频格式!",
            type: "error",
          });
          return false;
        }
      } else {
        // if (data.imgType.indexOf(file.file.type) == -1) {
        //   ElMessage.error({
        //     message: "请上传正确的图片格式!",
        //     type: "error",
        //   });
        //   return false;
        // }
      }
      data.showLoading = true;
      uploadByPieces({
        randoms: "", // 随机数，这里作为给后端处理分片的标识 根据项目看情况 是否要加
        file: file.file, // 视频实体
        pieceSize: 5, // 分片大小
        resourceType:
          props.paramObj.pageType === "video" ||
          props.paramObj.pageType === "video_content"
            ? "LIBRARY_VIDEO"
            : "LIBRARY_IMAGE",
        success: (res) => {
          if (res.id) {
            data.showLoading = false;
            const obj = {
              accessPath: res.accessPath,
              showVideoPath: res.accessPath,
              name: res.name,
              resolution: res.width + "*" + res.height,
              // size: Math.floor((res.size / 1024 / 1024) * 100) / 100,
              size: res.size,
              choosed: false,
              id: res.id,
              duration: res.duration,
              mainVideoSource: data.choosedTitleIcon.action,
              bitRate: res.bitRate + 'kps'
            };
            data.accountForm.unshift(obj);
          }
        },
        error: (e) => {
          data.showLoading = false;
          ElMessage.error({
            message: e,
            type: "error",
          });
        },
      });
    };
    // 选择video做主视频
    const changeAccountFn = (val, index) => {
      if (props.checkBox) {
        data.chooseIds = [];
        let choosedArr = [];
        data.accountForm[index].choosed = val;
        data.accountForm.forEach((item) => {
          if (item.choosed) {
            data.chooseIds.push(item.id);
            choosedArr.push(item);
          }
        });
        // 必须选一个
        if (data.chooseIds.length < 1 && !props.chooseId0) {
          data.accountForm[index].choosed = true;
          return;
        }
        // 如果多选就返回多选的集合
        context.emit("chooseAccount", choosedArr);
      } else {
        if (val) {
          data.accountForm.map((item) => {
            item.choosed = item.id === data.accountForm[index].id;
          });
          data.chooseIds = [data.accountForm[index].id];
        } else {
          if (!props.chooseId0) {
            data.accountForm[index].choosed = true;
          } else {
            data.accountForm[index].choosed = false;
          }
          // return;
        }
        const obj = data.accountForm.find((v) => v.choosed)
          ? data.accountForm.find((v) => v.choosed)
          : {
              mainVideoSource: data.choosedTitleIcon.action,
              url: "",
            };
        context.emit("chooseAccount", obj);
      }
    };
    // 选择video区域的滑动 获取视频资源库
    const scrollVideo = async () => {
      data.funFormAttr.pn += 1;
      init();
    };
    // 查询
    const searchFn = async () => {
      if (data.choosedTitleIcon.titleInputType === "search") {
        data.funFormAttr.pn = 1;
        data.funFormAttr.kw = data.choosedTitleIcon.titleInputVal;
        allFns[data.funFormName](data.funFormAttr).then((res) => {
          let arr = res.records ? res.records : [];
          if (
            props.paramObj.pageType === "video" ||
            props.paramObj.pageType === "video_content"
          ) {
            if (arr.length > 0) {
              arr.map((item) => {
                item.showVideoPath = item.accessPath;
                item.choosed = data.chooseIds.findIndex((v) => v === item.id) > -1;
                item.mainVideoSource = data.choosedTitleIcon.action;
                item.resolution = item.width + "*" + item.height;
              });
            }
            data.accountForm = arr;
          } else {
            if (arr.length > 0) {
              arr.map((item) => {
                item.showVideoPath = item.accessPath;
                item.choosed = data.chooseIds.findIndex((v) => v === item.id) > -1;
                item.mainVideoSource = data.choosedTitleIcon.action;
                item.resolution = item.width + "*" + item.height;
              });
            }
            data.accountForm = arr;
          }
        });
      } else {
        // 输入网址的情况
        const obj = {
          url: data.choosedTitleIcon.titleInputVal,
          mainVideoSource: data.choosedTitleIcon.action,
        };
        data.toShowYoutube = false;
        nextTick(() => {
          data.toShowYoutube =
            data.choosedTitleIcon.action === "YOUTUBE" &&
            data.choosedTitleIcon.titleInputVal;
        });
        context.emit("centerVideoUrl", obj);
      }
    };
    return {
      ...toRefs(data),
      ...toRefs(props),
      showAcount,
      beforeUploadVideo,
      changeAccountFn,
      scrollVideo,
      searchFn,
      init,
      secondsToTime,
      computedTitileIcon,
    };
  },
  methods: {
    handleIconClick(i) {
      this.accountForm[i].editer = true;
      this.$nextTick(() => {
        this.$refs.nameInput.focus();
      });
    },
    blurName(name, i) {
      this.accountForm[i].name = name;
      this.accountForm[i].editer = false;
      this.$emit("changeName", { id: this.accountForm[i].id, name });
    },
  },
  watch: {
    selectAll(newVal) {
      if (newVal) {
        this.accountForm.map((item) => {
          item.choosed = true;
          this.chooseIds.find((v) => v == item.id) === undefined
            ? this.chooseIds.push(item.id)
            : "";
        });
        this.$emit("chooseAccount", this.accountForm);
      } else {
        this.chooseIds = [];
        this.accountForm.map((item) => {
          item.choosed = false;
        });
        this.$emit("chooseAccount", []);
      }
    },
    invertSelection(newVal) {
      this.chooseIds = [];
      if (newVal) {
        this.accountForm.map((item) => {
          item.choosed = !item.choosed;
          item.choosed ? this.chooseIds.push(item.id) : "";
        });
        this.$emit("chooseAccount", this.accountForm);
      } else {
        this.$emit("chooseAccount", this.accountForm);
      }
    },
    displayByIds(newVal) {
      if (newVal) {
        this.accountForm.map((item) => {
          item.disabled = this.chooseIds.findIndex((v) => v === item.id) > -1;
        });
        this.$emit("chooseAccount", this.accountForm);
      } else {
        this.accountForm.map((item) => {
          item.disabled =
            this.chooseIds.findIndex((v) => v === item.id) > -1 ? false : item.display;
        });
        this.$emit("chooseAccount", this.accountForm);
      }
    },
    todoDel: {
      async handler(newVal) {
        if (newVal) {
          await allFns[newVal.fnName](newVal.attr);
          this.funFormAttr.pn = 1;
          this.init("del");
        }
      },
      deep: true,
    },
  },
};
</script>
<style lang="less" scoped>
img {
  object-fit: contain;
}
.pb130 {
  padding-bottom: 13vh;
}
.checkBox {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.nameFont {
  width: 95%;
}
.editerIcon {
  position: absolute;
  top: 0.5vh;
  right: -0.8vw;
  transform: translate(-50%, -50%);
  // background-color: #F1F3F5;
  height: 2.5vh;
  z-index: 2;
}
.nameInput {
  width: 75%;
}
.addImg {
  width: 18vw;
  height: 21vh;
}
.videoBox {
  width: 18vw;
  height: 21vh;
}
.titleDiv {
  &_icon {
    margin-right: 0.6vw;
    width: 1.2vw;
    height: 2.4vh;
  }
}
.uploadBox {
  margin-top: 3vh;
  height: calc(100vh - 17vh);
  overflow-x: hidden;
  overflow-y: auto;
  .el-upload {
    text-align: left;
  }
  video {
    object-fit: contain;
  }
  video:focus {
    outline: none;
  }
}
.disabledBox {
  position: absolute;
  z-index: 2;
  width: 18vw;
  height: 21vh;
}
.choosedImgBox {
  width: 18vw;
  height: 21vh;
  position: absolute;
  z-index: 2;
  .choosedImg {
    width: 18vw;
    height: 100%;
    object-fit: cover;
  }
}
.gridBox {
  display: inline-grid;
  margin: 0 0.8vw;
  grid-auto-columns: 18vw;
  position: relative;
}
.bottom_style {
  display: flex;
  display: inline-block;
  width: 100%;
  text-align: center;
  span {
    font-size: 1.2vh !important;
    color: #939796;
    line-height: 4vh;
  }
}
</style>
