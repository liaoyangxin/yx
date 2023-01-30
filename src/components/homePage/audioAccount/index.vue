// 音频内容
<template>
  <div :loading="loadingPage">
    <div class="topSearchBox">
      <el-row :gutter="24" class="searchRow">
        <el-col :span="6">
          <Search
            :searchInfo="searchInfo1"
            @changedSearchInfo="changedSearchInfo"
          ></Search>
        </el-col>
        <el-col :span="6">
          <Search
            :searchInfo="searchInfo2"
            @changedSearchInfo="changedSearchInfo"
          ></Search>
        </el-col>
        <el-col :span="6">
          <Search
            :searchInfo="searchInfo3"
            @changedSearchInfo="changedSearchInfo"
          ></Search>
        </el-col>
        <el-col :span="6">
          <Search
            :searchInfo="searchInfo4"
            @changedSearchInfo="changedSearchInfo"
          ></Search>
        </el-col>
      </el-row>
    </div>
    <div
      class="accountMain"
      v-infinite-scroll="scrollAccountMain"
      :infinite-scroll-immediate="false"
    >
      <div class="addImgBox">
        <img src="@/assets/img/allAdd.png" @click="toAdd" style="vertical-align: top" />
        <router-view />
      </div>

      <div
        v-for="(item, index) in accountArr"
        :key="index"
        class="accountBox"
        style="text-align: left; vertical-align: top"
      >
        <div class="bBox">
          <div
            class="bBox_disabled pointer"
            v-if="item.disabled || item.state == -1"
            @click="toAudio(item.id)"
          >
            <img src="@/assets/img/uploader/disable303.png" />
          </div>
          <img :src="item.showInfoImage" class="bBox_img" @click="toAudio(item.id)" />
          <div class="bBox_div">
            <el-row>
              <el-col :span="2">
                <el-checkbox
                  v-model="item.choosed"
                  @change="changeBox(item.choosed, item.id)"
                  class="bBox_div_checkBox"
                ></el-checkbox>
              </el-col>
              <el-col :span="17" @click="toInfo(item.id)">
                <el-row class="bBox_videoInfo">
                  <el-col :span="24" class="overFlowPoint">
                    <span class="listTitleFont" :title="item.title">{{
                      item.title
                    }}</span>
                  </el-col>
                  <el-col :span="24" class="overFlowPoint">
                    类别:{{ item.categoryName }}
                  </el-col>
                  <el-col :span="24" class="overFlowPoint">
                    作者:{{ item.authorName }}
                  </el-col>
                  <el-col :span="24" class="overFlowPoint">
                    播放量:{{ item.timesWatched }}
                  </el-col>
                  <el-col :span="24" class="overFlowPoint">
                    观看人数:{{ item.viewers }}
                  </el-col>
                  <el-col :span="12" style="font-size: 0.8vh" class="overFlowPoint">
                    创建时间: {{ item.createdAt ? item.createdAt.split("T")[0] : "" }}
                  </el-col>
                  <el-col :span="12" style="font-size: 0.8vh" class="overFlowPoint">
                    修改时间: {{ item.updatedAt ? item.updatedAt.split("T")[0] : " " }}
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="5" @click="toInfo(item.id)"></el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Search from "@/components/public/search";
import { reactive, toRefs } from "@vue/reactivity";
import { ElMessage } from "element-plus";
import * as addOrEdite from "@/components/homePage/account/addOrEdite/addOrEdite";
import * as accountJs from "@/components/homePage/account/account";
export default {
  components: { Search },
  setup() {
    const searchParmas = reactive({
      searchInfo1: [
        {
          type: "textButton",
          imgUrl: require("@/assets/img/search/type.png"),
          imgTitle: "类别",
          code: "class",
          buttonArr: [],
          //   {
          //     label: "类别01拉多少房间爱死了东风科技",
          //     value: 1,
          //   },
        },
        {
          type: "textButton",
          imgUrl: require("@/assets/img/search/author.png"),
          imgTitle: "作者",
          code: "author",
          buttonArr: [
            // {
            //   label: "作者01",
            //   value: 1,
            // },
          ],
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
      searchInfo2: [
        {
          // 滑动输入
          type: "slider",
          imgUrl: require("@/assets/img/search/langTime.png"),
          imgTitle: "时长",
          code: "timeLength",
          value: [0, 0],
          max: 0,
          marks: {
            // 0: "免费",
            // 33: "会员",
            // 66: "限免",
            // 100: "收费",
          },
        },
        {
          // 滑动输入
          type: "slider",
          imgUrl: require("@/assets/img/search/lookNumber.png"),
          imgTitle: "收听次数",
          code: "watchNumberOfTimes",
          value: [0, 0],
          max: 0,
          marks: {
            // 10: "10",
            // 20: "20",
            // 30: "30",
            // 100: "50+k",
          },
        },
        {
          // 滑动输入
          type: "slider",
          imgUrl: require("@/assets/img/search/lookPerson.png"),
          imgTitle: "收听人数",
          code: "watchNumberOfPeople",
          max: 0,
          value: [0, 0],
          marks: {
            // 10: "10",
            // 20: "20",
            // 30: "30",
            // 100: "50+k",
          },
        },
      ],
      searchInfo4: [
        {
          // 滑动输入
          type: "fontSearch",
          code: "fontSearch",
          value: "",
          selectAll: false,
          imgType: "",
        },
      ],
    });
    const data = reactive({
      accountArr: [],
      choosedIds: [],
      iwpostPageData: {
        records: [],
      },
      loadingPage: false,
      accountAttr: {
        durationGe: 0,
        durationLe: 0,
        geCreateAt: "",
        idDesc: true,
        kw: "",
        leCreateAt: "",
        pn: 1,
        ps: 20,
        total: 1,
        mimeType: "POST_AUDIO",
      },
    });
    function init(str) {
      data.loadingPage = true;
      accountJs.iwpostPage(data.accountAttr).then((res) => {
        data.accountAttr.total = res.data.total;
        data.iwpostPageData = res.data;
        if (str && str === "del") {
          data.iwpostPageData.records.map((item) => {
            const index = data.accountArr.findIndex((v) => v.id === item.id);
            if (index > -1) {
              Object.assign(item, data.accountArr[index]);
            }
          });
          data.accountArr = data.iwpostPageData.records;
        } else {
          data.iwpostPageData.records.map((item) => {
            item.choosed = false;
            item.disabled = item.state === -1;
          });
          for (let i = 0; i < data.iwpostPageData.records.length; i++) {
            const item = data.iwpostPageData.records[i];
            const index = data.accountArr.findIndex((v) => v.id === item.id);
            if (index > -1) {
              data.accountArr.splice(index, 1, item);
            } else {
              data.accountArr.push(item);
              i--;
            }
          }
          data.accountArr.map((item) => {
            item.choosed = data.choosedIds.findIndex((v) => v === item.id) > -1;
          });
        }
        data.accountArr.map((item) => {
          item.showInfoImage = item.imageUrl;
          if (!item.imageUrl) {
            item.showInfoImage = require("@/assets/position/audioListImage.png");
          }
        });
        data.loadingPage = false;
      });
    }
    Promise.all([
      addOrEdite.dropDownList(),
      addOrEdite.authorDropDownList(),
      accountJs.queryLimit({ postMimeType: "POST_AUDIO" }),
    ]).then((promiseRes) => {
      searchParmas.searchInfo1[0].buttonArr = promiseRes[0];
      searchParmas.searchInfo1[1].buttonArr = promiseRes[1];
      let res = promiseRes[2];
      res.data.maxDuration = res.data.maxDuration > 0 ? res.data.maxDuration : 1;
      res.data.maxTimesWatched =
        res.data.maxTimesWatched > 0 ? res.data.maxTimesWatched : 1;
      res.data.maxViewers = res.data.maxViewers > 0 ? res.data.maxViewers : 1;
      searchParmas.searchInfo2[0].max = res.data.maxDuration;
      searchParmas.searchInfo2[0].marks = {
        0: "0",
        [res.data.maxDuration]: JSON.stringify(res.data.maxDuration),
      };
      searchParmas.searchInfo2[1].max = res.data.maxTimesWatched;
      searchParmas.searchInfo2[1].marks = {
        0: "0",
        [res.data.maxTimesWatched]: JSON.stringify(res.data.maxTimesWatched),
      };
      searchParmas.searchInfo2[2].max = res.data.maxViewers;
      searchParmas.searchInfo2[2].marks = {
        0: "0",
        [res.data.maxViewers]: JSON.stringify(res.data.maxViewers),
      };

      data.accountAttr.durationGe = 0;
      data.accountAttr.durationLe = searchParmas.searchInfo2[0].max;
      searchParmas.searchInfo2[0].value = [0, searchParmas.searchInfo2[0].max];
      data.accountAttr.timesWatchedGe = 0;
      data.accountAttr.timesWatchedLe = searchParmas.searchInfo2[1].max;
      searchParmas.searchInfo2[1].value = [0, searchParmas.searchInfo2[1].max];
      data.accountAttr.viewersGe = 0;
      data.accountAttr.viewersLe = searchParmas.searchInfo2[2].max;
      searchParmas.searchInfo2[2].value = [0, searchParmas.searchInfo2[2].max];
      init();
    });
    return {
      ...toRefs(searchParmas),
      ...toRefs(data),
      init,
    };
  },
  methods: {
    scrollAccountMain() {
      if (this.accountAttr.total !== this.accountArr.length) {
        this.accountAttr.pn += 1;
        this.init();
      }
    },
    toAdd() {
      this.$router.push("/homePage/audioAccount/addEditer");
    },
    // 预览 页面还没有写
    toAudio(id) {
      this.$router.push(`/previewComment/${id}`);
    },
    toInfo(id){
      this.$router.push({
        path: "/homePage/audioAccount/addEditer",
        query: {
          id
        }
      });
    },
    // 查询 查询里面的批量处理
    changedSearchInfo(val, type, arr) {
      switch (type) {
        case "class":
          this.accountAttr.pn = 1;
          arr.map((item) => {
            if (!item.clicked) {
              if (item.id === val.id) {
                item.clicked = true;
              }
            } else {
              if (item.id === val.id) {
                item.clicked = false;
              }
            }
          });
          this.accountAttr.categoryIds = arr.filter((v) => v.clicked).map((i) => i.id);
          break;
        case "author":
          this.accountAttr.pn = 1;
          arr.map((item) => {
            if (!item.clicked) {
              if (item.id === val.id) {
                item.clicked = true;
              }
            } else {
              if (item.id === val.id) {
                item.clicked = false;
              }
            }
          });
          this.accountAttr.authorIds = arr.filter((v) => v.clicked).map((i) => i.id);
          break;
        case "bigenTime":
          this.accountAttr.pn = 1;
          if (val) {
            this.accountAttr.geCreatedAt = val[0];
            this.accountAttr.leCreatedAt = val[1];
          } else {
            this.accountAttr.geCreatedAt = null;
            this.accountAttr.leCreatedAt = null;
          }
          break;
        case "periodTime":
          this.accountAttr.pn = 1;
          if (val) {
            this.accountAttr.geUpdatedAt = val[0];
            this.accountAttr.leUpdatedAt = val[1];
          } else {
            this.accountAttr.geUpdatedAt = null;
            this.accountAttr.leUpdatedAt = null;
          }

          break;
        case "timeLength":
          this.accountAttr.pn = 1;
          this.accountAttr.durationGe = val[0] ? val[0] : 0;
          this.accountAttr.durationLe = val[1] ? val[1] : 0;
          break;
        case "watchNumberOfTimes":
          this.accountAttr.pn = 1;
          this.accountAttr.timesWatchedGe = val[0] ? val[0] : 0;
          this.accountAttr.timesWatchedLe = val[1] ? val[1] : 0;
          break;
        case "watchNumberOfPeople":
          this.accountAttr.pn = 1;
          this.accountAttr.viewersGe = val[0] ? val[0] : 0;
          this.accountAttr.viewersLe = val[1] ? val[1] : 0;
          break;
        case "price":
          // data.accountAttr.viewersGe = val[0]
          // data.accountAttr.viewersLe = val[1]
          break;
        case "sales":
          break;
        case "salesMoney":
          break;
        case "fontSearch":
          this.accountAttr.pn = 1;
          this.searchInfo4.value = val;
          this.accountAttr.kw = val;
          break;
        case "fontSearch_selectAll":
          this.searchInfo4.selectAll = val;
          this.choosedIds = [];
          this.accountArr.map((item) => {
            item.choosed = val;
            if (val) {
              this.choosedIds.push(item.id);
            }
          });
          break;
        case "fontSearch_disable":
          console.log("this.choosedIds", this.choosedIds);
          if (this.choosedIds.length > 0) {
            this.searchInfo4.disabled = true;
            accountJs.batchDisable({ ids: this.choosedIds }).then((res) => {
              if (res.code === 200) {
                this.accountArr.map((item) => {
                  item.disabled = item.choosed;
                  item.state = item.choosed ? -1 : item.state;
                });
              }
            });
          } else {
            ElMessage.warning({
              message: "请先选择内容",
              type: "warning",
            });
          }

          break;
        case "fontSearch_use":
          if (this.choosedIds.length > 0) {
            this.searchInfo4.disabled = false;
            accountJs.batchEnable({ ids: this.choosedIds }).then((res) => {
              if (res.code === 200) {
                this.accountArr.map((item) => {
                  item.disabled = item.choosed ? false : item.disabled;
                  item.state = item.choosed ? 1 : item.state;
                });
              }
            });
          } else {
            ElMessage.warning({
              message: "请先选择内容",
              type: "warning",
            });
          }
          break;
        case "fontSearch_del":
          if (this.choosedIds.length > 0) {
            accountJs.batchDelete({ ids: this.choosedIds }).then(() => {
              this.choosedIds = [];
              this.init("del");
            });
            this.accountArr = this.accountArr.filter((v) => !v.choosed);
          } else {
            ElMessage.warning({
              message: "请先选择内容",
              type: "warning",
            });
          }
          break;
      }
      if (
        type !== "fontSearch_del" &&
        type !== "fontSearch_disable" &&
        type !== "fontSearch_use"
      ) {
        this.init();
      }
    },
    changeBox(t, id) {
      if (!t) {
        const index = this.choosedIds.findIndex((v) => v == id);
        if (index > -1) {
          this.choosedIds.splice(index, 1);
        }
      } else {
        this.choosedIds.push(id);
      }
    },
  },
};
</script>
<style lang="less" scoped>
:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #ccc;
  border: #ccc;
}
:deep(.el-checkbox__input.is-focus .el-checkbox__inner) {
  border-color: #ccc;
}
:deep(.el-checkbox__inner:hover) {
  border-color: #000;
}
.listTitleFont {
  font-size: 12px;
  font-weight: bold;
}
.accountMain {
  height: calc(100vh - 25vh);
  overflow-x: auto;
}
.addImgBox {
  display: inline-block;
  width: 18vw;
  margin: 2vh;
  text-align: center;
  img {
    width: 10vw;
    height: 20vh;
    margin-top: 15%;
    cursor: pointer;
  }
}
.accountBox {
  display: inline-grid;
  margin: 0 0.8vw;
  grid-auto-columns: 18vw;
  grid-auto-rows: calc(21vh+106px);
  margin: 2vh;
  .bBox {
    box-shadow: 0 0 10px #b6b7b8;
    border-radius: 5px;
    position: relative;
    &_disabled {
      max-width: 18vw;
      max-height: 21vh;
      img {
        width: 100%;
        height: 21vh;
        position: absolute;
        z-index: 2;
        top: 0;
        left: 0;
        right: 0;
        transform: translate(0, 0);
      }
    }
    &_img {
      width: 18vw;
      height: 21vh;
      cursor: pointer;
    }
    &_div {
      margin-top: -6px;
      cursor: pointer;
      // height: 15.8921vh;
      padding: 0.5vh 0;
      background-color: #fff;
      &_checkBox {
        position: relative;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    &_videoInfo {
      div {
        font-size: 8px;
        margin: 0;
        white-space: nowrap;
      }
      h3 {
        font-size: 10px;
        margin: 0;
        white-space: nowrap;
      }
    }
  }
}
</style>
