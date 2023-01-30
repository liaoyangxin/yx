<template>
  <div>
    <div class="leftBox">
      <div class="dian"></div>
      <div style="margin-left: 5%">
        <p style="font-size: 1.6vh">{{ propsGetObj.titleFont }}:</p>
        <div
          v-if="propsGetObj.type === 'preview' || propsGetObj.type === 'previewAudio'"
          class="leftInfoBx"
          style="font-size: 2vh; margin: 0 5%"
        >
          {{ propsGetObj.title }}
        </div>
        <div v-else>
          <el-input
            style="font-size: 2vh; width: 95%"
            resize="none"
            :rows="3"
            :readonly="!propsGetObj.canToDo"
            @blur="saveTitle"
            type="textarea"
            v-model="propsGetObj.title"
            :placeholder="fatherPorps.titlePlaceholder"
          />
        </div>
      </div>
      <img
        v-if="propsGetObj.type === 'previewAudio'"
        class="leftBox_addImg"
        :src="
          propsGetObj.imageUrl
            ? propsGetObj.imageUrl
            : require('@/assets/position/audioListImage.png')
        "
      />
      <img
        v-else
        class="leftBox_addImg pointer"
        :src="
          propsGetObj.imageUrl
            ? propsGetObj.imageUrl
            : require('@/assets/img/preview/addh.png')
        "
        @click="leftImageClick"
      />
      <div v-if="propsGetObj.type === 'previewAudio'" style="margin: 1vh 5% 0 5%">
        <p style="font-size: 1.6vh">简介:</p>
        <div class="leftInfoBx" style="font-size: 2vh; margin: 0 5%">
          {{ propsGetObj.excerpt }}
        </div>
      </div>

      <el-input
        v-if="fatherPorps.type === 'editeAudio'"
        style="font-size: 2vh; width: 96%; margin-left: 2%"
        resize="none"
        :rows="3"
        @blur="saveFont"
        v-model="propsGetObj.excerpt"
        :readonly="!propsGetObj.canToDo"
        type="textarea"
        placeholder="请输入音频简介"
      />
      <div class="leftBox_shareIcon">
        <div
          v-for="item in iconArr"
          :key="item.type"
          :class="index !== iconArr.length - 1 ? 'editeIconBox' : ''"
        >
          <el-popover placement="left" width="auto" trigger="hover" :content="item.title">
            <template #reference>
              <img :src="item.iconUrl" @click="clickLeftIcon(item.type)" />
            </template>
          </el-popover>
        </div>
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
          @chooseAccount="chooseAccount"
          :showTitleIcon="showTitleIcon"
        ></VideoImageList>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import VideoImageList from "@/components/public/videoImageList/index/index.vue";
import { reactive, toRefs } from "@vue/reactivity";
import { ElMessageBox, ElMessage } from "element-plus";
export default {
  components: { VideoImageList },
  props: {
    fatherPorps: {
      type: Object,
      default: () => {},
    },
    iconArr: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const data = reactive({
      drawer: false,
      showTitleIcon: false,
      saveObj: {},
      paramObj: {
        pageType: "image", // 表示是图片还是视频 video-视频选择 video_content-内容页的视频展示主要是下面的文字不一样 image-图片选择
        chooseIds: [], // 默认选中的id
        funFormName: "imagePage",
        funFormAttr: {
          duration: null,
          geCreateAt: "",
          idDesc: true,
          kw: "",
          leCreateAt: "",
          pn: 1,
          ps: 11,
          size: null,
        },
      },
    });
    return {
      ...toRefs(data),
    };
  },
  computed: {
    propsGetObj() {
      return this.fatherPorps;
    },
  },
  methods: {
    saveTitle() {
      this.saveObj.title = this.propsGetObj.title;
      this.$emit("saveLeft", this.saveObj);
    },
    saveFont() {
      this.saveObj.excerpt = this.propsGetObj.excerpt;
      this.$emit("saveLeft", this.saveObj);
    },
    leftImageClick() {
      if (this.propsGetObj.canToDo) {
        if (this.fatherPorps.type === "editeAudio") {
          this.showTitleIcon = false;
        }
        this.drawer = true;
      } else {
        if (this.fatherPorps.type === "editeAudio") {
          ElMessage.warning({
            message: "请先选择音频",
            type: "warning",
          });
        }
      }
    },
    chooseAccount(chooseObj) {
      this.paramObj.chooseIds = [chooseObj.id];
      this.propsGetObj.imageUrl = chooseObj.accessPath;
      this.saveObj.imageUrl = chooseObj.accessPath;
      this.saveObj.imageId = chooseObj.id;
      this.$emit("saveLeft", this.saveObj);
    },
    clickLeftIcon(type) {
      switch (type) {
        case "black": // 返回
          this.$router.push(sessionStorage.getItem("lasterRouter"));
          break;
        case "disable": // 禁用
          this.$emit("setIsDisabled", true);
          break;
        case "used": // 启用
          this.$emit("setIsDisabled", false);
          break;
        case "del": // 删除
          ElMessageBox.confirm("是否确认删除该内容?", "删除", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            showClose: false,
            type: "warning",
            center: true,
          }).then(() => {
            this.$emit("toDel");
          });
          break;
        case "instagram": // instagram
          this.$emit("showShare", "instagram");
          break;
        case "Twitter": // Twitter
          this.$emit("showShare", "Twitter");
          break;
        case "Facebook": // Facebook
          this.$emit("showShare", "Facebook");
          break;
        case "QQ": // QQ
          this.$emit("showShare", "QQ");
          break;
        case "weibo": // 微博
          this.$emit("showShare", "weibo");
          break;
        case "weixin": // 微信
          this.$emit("showShare", "weixin");
          break;
        case "h5": // h5海报
          this.$emit("showShare", "h5");
          break;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.leftBox {
  min-width: 50px;
  max-width: 20vw;
  box-shadow: 0 0 2vh #b6b6b7;
  background-color: #fff;
  height: calc(100vh - 4vh);
  margin: 2vh;
  .dian {
    background-color: rgb(220, 220, 220);
    width: 20px;
    height: 20px;
    position: relative;
    top: 2vh;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    margin-bottom: 2vh;
  }
  .leftInfoBx {
    height: 10vh;
    // max-height: 10vh;
    overflow-y: auto;
  }
  &_addImg {
    width: 100%;
    max-height: 21vh;
    margin-top: 2vh;
  }
  position: relative;
  &_shareIcon {
    position: absolute;
    right: 1vw;
    bottom: 2vh;
    img {
      width: 1vw;
      height: 1vw;
      cursor: pointer;
    }
  }
  .editeIconBox {
    margin-bottom: 2vh;
  }
}
</style>
