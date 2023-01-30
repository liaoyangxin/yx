<template>
  <div>
    <div class="right">
        <div class="right_add" v-if="fatherPageType !== 'preview'">
          <img src="@/assets/img/allAdd.png" class="pointer" @click="addCard" />
        </div>
        <div class="right_listBox">
          <div v-for="(item, index) in cards" :key="index">
            <transition name="fade">
              <!-- 预览 -->
              <div class="right_listBox_list pointer" v-if="fatherPageType === 'preview'" @click="toNewPage(item)">
                <div class="right_listBox_list_imgBox">
                  <img
                    :src="item.imageUrl?item.imageUrl:require('@/assets/position/listImage.png')"
                  />
                </div>
                <div class="flowFont">
                  <p style="font-size: 1.2vh;text-align: right">信息条目: {{ item.index }}</p>
                  <p style="font-size: 1.2vh;text-align: right">
                    时间点:
                    {{ item.showTime > 0 ? secondsToTime(item.showTime) : "00:00:00" }}
                  </p>
                  <div class="title">
                    {{item.title}}
                  </div>
                </div>
              </div>
              <!-- 修改新增 -->
              <div class="right_listBox_list" v-else>
                <div class="right_listBox_list_imgBox">
                  <img
                    v-if="item.state == -1"
                    src="@/assets/img/uploader/disable303.png"
                    class="pointer right_listBox_list_imgBox_disableImage"
                    @click="chooseImg(index)"
                  />
                  <img
                    :src="item.imageUrl?item.imageUrl:require('@/assets/img/account_addoredite_right_add_add.png')"
                    class="pointer"
                    @click="chooseImg(index)"
                  />
                </div>
                <div class="right_listBox_list_info">
                  <p style="font-size: 1.2vh">信息条目: {{ item.index }}</p>
                  <p style="font-size: 1.2vh">
                    时间点:
                    {{ item.showTime > 0 ? secondsToTime(item.showTime) : "00:00:00" }}
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
                  <!-- @focus="focusFlawInfoTitle(item)" -->
                  <el-input
                    style="margin: 1vh 0 0 1vh; width: 96%"
                    v-model="item.title"
                    
                    @blur="blurFlawInfoTitle(index)"
                    placeholder="请输入信息流标题"
                  ></el-input>
                  <div style="margin-top: 1vh; text-align: right; align-items: end">
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
                      :content="item.state == 1 || !item.state ? '禁用' : '启用'"
                    >
                      <template #reference>
                        <img
                          :src="item.state == 1 ? require('@/assets/img/search/disable.png') : require('@/assets/img/search/used.png')"
                          class="right_contentBox_rightInfo_icon"
                          style="margin: 0 1vw"
                          @click="clickFlawInfoUse(item.state, index)"
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
            v-if="showDrawerComponent === 'VideoImageList'"
            :paramObj="paramObj"
            :showTitleIcon="showTitleIcon"
            @chooseAccount="chooseAccount"
          ></VideoImageList>
          <Info
            v-else-if="showDrawerComponent === 'Info'"
            @centerVideoUrl="centerVideoUrl"
            :pObj="pObj"
            @choosedVideo="choosedVideo"
            @choosedImage="choosedImage"
          >
          </Info>
        </div>
      </el-drawer>
  </div>
</template>
<script>
import { reactive, toRefs } from '@vue/reactivity'
import { ElMessage } from "element-plus";
import VideoImageList from "@/components/public/videoImageList/index/index.vue";
import Info from "./info"
import { secondsToTime } from "@/api/public/index";
import * as indexJs from "./indexjs.js"
import $store from "@/store/index.js"
import eventBus from "@/eventBus"
export default {
  components: { VideoImageList, Info },
  props:{
    fatherPageType: {
      type: String,
      default: ''
    },
    rightCards:{
      type: Array,
      default: () => []
    }
  },
  setup(){
    const videoImageListParam = reactive({
      paramObj: {
        chooseIds: [],
        pageType: "image",
        funFormName: "imagePage",
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
      pObj: {}
    })
    const data = reactive({
      // cards:[],
      drawer: false,
      nowCardIndex: -1,
      showDrawerComponent: 'VideoImageList',
      showTime: 0,
    })

    return {
      ...toRefs(data),
      ...toRefs(videoImageListParam),
      secondsToTime
    }
  },
  computed:{
    cards(){
      return this.rightCards
    }
  },
  methods: {
    saveCards(obj){
      this.$emit('saveRight', obj)
    },
    // 新增一条信息流
    async addCard(){
       await eventBus.on("centerTime",(val) => {
        this.showTime = val.time
        eventBus.off('centerTime')
      })
      for (let i = 0; i < this.cards.length; i++) {
            const item = this.cards[i];
            if (
              item.showTime == this.showTime ||
              (this.showTime < item.showTime && item.showTime - 3 <= this.showTime) ||
              (this.showTime - 3 <= item.showTime && item.showTime < this.showTime)
            ) {
              ElMessage.warning({
                message: "每个信息流的间隔不能少于3秒",
                type: "warning",
              });
              return;
            }
          }
          const obj = {
            imageUrl: "",
            index: "",
            showTime: this.showTime ? this.showTime : 0,
            conversionRate: "0%",
            title: "",
            imageId: null,
            // id: res.data,
            isDelete: null,
            state: null,
            infoIp: "",
            infoTab: "",
          };
        this.saveCards(obj)
    },
    // 选择封面
    chooseImg(index){
      this.paramObj.chooseIds = [this.cards[index].imageId]
      this.nowCardIndex = index
      this.drawer = true
      this.showDrawerComponent = 'VideoImageList'
    },
    delFlawInfo(index){
      this.cards[index].isDelete = -1;
      indexJs.infoFlowDelete({ ids: [this.cards[index].id] }).then((res) => {
        if (res.code === 200) {
          this.cards.splice(index, 1);
          this.cards.map((item, index) => {
            item.index = index + 1 + " / " + this.cards.length;
          });
        }
      })
    },
    clickFlawInfoUse(state, index){
      let val = state === -1 ? 1 : -1
      this.cards[index].state = val;
      let fnName = state === -1 ? 'infoFlowEnable' : 'infoFlowDisable'
      indexJs[fnName]({ ids: [this.cards[index].id] })
    },
    blurFlawInfoTitle (index) {
      this.saveCards(this.cards[index])
    },
    async flawInfo(index) {
      if (!this.cards[index].title){
        ElMessage.warning({
          message: "请先输入信息流标题",
          type: "warning",
        });
      }else{
        let obj = await $store.dispatch('getVuexRightPObjContent', this.cards[index])
        if (obj) {
          this.drawer = true
          this.showDrawerComponent = "Info"
        }
      }
    },
    async toNewPage(cardObj) {
      // if (this.mainVideoSource === "YOUTUBE") {
      //   this.$refs.previewYoutube.stopVideo();
      // } else {
      //   const centerVideo = document.getElementById("centerVideo");
      //   if (centerVideo) {
      //     centerVideo.pause();
      //   }
      // }
      let obj = await $store.dispatch('getVuexRightPObjContent', cardObj)
      if (obj) {
        obj.id = cardObj.id
        this.$emit('flowObj', obj)
      }
    },
    chooseAccount(obj){
      this.paramObj.chooseIds = [obj.id]
      const index = this.nowCardIndex
      this.cards[index].imageId = obj.id
      this.cards[index].imageUrl = obj.accessPath
      this.saveCards(this.cards[index])
    },
    // 信息流详情的关闭 做音频的暂停
    drawerClose() {
      this.drawer = false
    },
  }
}
</script>
<style lang="less" scoped>
.right {
    height: calc(100vh - 8.9955vh);
    overflow-y: auto;
    .right_contentBox_rightInfo_icon {
      width: 1.2vw;
    }
    &_listBox {
      &_list {
        display: inline-grid;
        grid-template-columns: 1fr 1.5fr 0.1fr;
        box-shadow: #b6b6b7 0 0 1vh;
        height: 21vh;
        padding: 1vh;
        margin: 2vh;
        .flowFont{
          position: relative;
          .title{
            margin-left: 1vw;
            font-size: 2.5vh;
            font-weight: bold;
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
</style>