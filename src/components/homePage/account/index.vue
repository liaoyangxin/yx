<template>
  <div class="accountPage">
    <div>
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
      <div style=""> 
        <div class="addImgBox">
          <img src="@/assets/img/allAdd.png" @click="toAdd" style="vertical-align:top"/>
        </div>
        
        <div v-for="(item, index) in accountArr" :key="index" class="accountBox" style="text-align: left;vertical-align:top"> 
          <div class="bBox">
            <div
              class="bBox_disabled pointer"
              v-if="item.disabled || item.state == -1"
              @click="toVideo(item.id)"
            >
              <img
                src="@/assets/img/uploader/disable303.png"
              />
            </div>
            <img :src="item.showInfoImage" class="bBox_img" @click="toVideo(item.id)" />
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
                      <span class="listTitleFont" :title="item.title">{{ item.title }}</span>
                    </el-col>
                    <el-col :span="24" class="overFlowPoint"> 类别:{{ item.categoryName }} </el-col>
                    <el-col :span="24" class="overFlowPoint"> 作者:{{ item.authorName }} </el-col>
                    <el-col :span="24" class="overFlowPoint"> 播放量:{{ item.timesWatched }} </el-col>
                    <el-col :span="24" class="overFlowPoint"> 观看人数:{{ item.viewers }} </el-col>
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
      <div class="bottom_style">
        <span v-if="iwpostPageAttr.total === accountArr.length">无更多数据</span>
      </div>
    </div>
  </div>
</template>
<script>
import Search from "@/components/public/search";
import { ElMessage } from "element-plus";
import { reactive, toRefs } from "@vue/reactivity";
import router from "@/routes/index";
import * as addOrEdite from "../account/addOrEdite/addOrEdite";
import * as accountFns from "./account.js";
export default {
  components: { Search },
  setup() {
    const searchData = reactive({
      searchInfo1: [
        {
          type: "textButton",
          imgUrl: require("@/assets/img/search/type.png"),
          imgTitle: "类别",
          code: "class",
          buttonArr: [],
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
          imgTitle: "观看次数",
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
          imgTitle: "观看人数",
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
      iwpostPageData: {
        records: [],
      },
      iwpostPageAttr: {
        ps: 20,
        pn: 1,
        total: 1,
      },
      choosedIds: [],
    });
    async function init(str) {
      const res = await accountFns.iwpostPage(data.iwpostPageAttr);
      data.iwpostPageAttr.total = res.data.total;
      data.iwpostPageData = res.data;
      if (str && str === "search") {
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
      data.accountArr.map(item => {
        item.showInfoImage = item.imageUrl
        if(!item.imageUrl) {
          item.showInfoImage = require('@/assets/position/listImage.png')
        }
      })
    }
    (async () => {
      searchData.searchInfo1[0].buttonArr = await addOrEdite.dropDownList();
      searchData.searchInfo1[1].buttonArr = await addOrEdite.authorDropDownList();
      // init()
      await accountFns.queryLimit().then((res) => {
        res.data.maxDuration = res.data.maxDuration > 0 ? res.data.maxDuration : 1;
        res.data.maxTimesWatched =
          res.data.maxTimesWatched > 0 ? res.data.maxTimesWatched : 1;
        res.data.maxViewers = res.data.maxViewers > 0 ? res.data.maxViewers : 1;
        searchData.searchInfo2[0].max = res.data.maxDuration;
        searchData.searchInfo2[0].marks = {
          0: "0",
          [res.data.maxDuration]: JSON.stringify(res.data.maxDuration),
        };
        searchData.searchInfo2[1].max = res.data.maxTimesWatched;
        searchData.searchInfo2[1].marks = {
          0: "0",
          [res.data.maxTimesWatched]: JSON.stringify(res.data.maxTimesWatched),
        };
        searchData.searchInfo2[2].max = res.data.maxViewers;
        searchData.searchInfo2[2].marks = {
          0: "0",
          [res.data.maxViewers]: JSON.stringify(res.data.maxViewers),
        };

        data.iwpostPageAttr.durationGe = 0;
        data.iwpostPageAttr.durationLe = searchData.searchInfo2[0].max;
        searchData.searchInfo2[0].value = [0, searchData.searchInfo2[0].max];
        data.iwpostPageAttr.timesWatchedGe = 0;
        data.iwpostPageAttr.timesWatchedLe = searchData.searchInfo2[1].max;
        searchData.searchInfo2[1].value = [0, searchData.searchInfo2[1].max];
        data.iwpostPageAttr.viewersGe = 0;
        data.iwpostPageAttr.viewersLe = searchData.searchInfo2[2].max;
        searchData.searchInfo2[2].value = [0, searchData.searchInfo2[2].max];
      });
      await init();
    })();
    function toVideo(id) {
      router.push(`/preview/${id}`);
    }
    function toAdd() {
      router.push("/homePage/account/AddAccount");
    }
    function toInfo(id) {
      router.push({
        path: "/homePage/account/AddAccount",
        query: {
          id: id,
        },
      });
    }
    function changeBox(t, id) {
      if (!t) {
        searchData.searchInfo4[0].selectAll = false;
        const index = data.choosedIds.findIndex((v) => v == id);
        if (index > -1) {
          data.choosedIds.splice(index, 1);
        }
      } else {
        data.choosedIds.push(id);
      }
    }
    // 查询 查询里面的批量处理
    async function changedSearchInfo(val, type, arr) {
      let str = "";
      switch (type) {
        case "class":
          str = "search";
          data.iwpostPageAttr.pn = 1;
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
          data.iwpostPageAttr.categoryIds = arr.filter((v) => v.clicked).map((i) => i.id);
          break;
        case "author":
          str = "search";
          data.iwpostPageAttr.pn = 1;
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
          data.iwpostPageAttr.authorIds = arr.filter((v) => v.clicked).map((i) => i.id);
          break;
        case "bigenTime":
          str = "search";
          data.iwpostPageAttr.pn = 1;
          if (val) {
            data.iwpostPageAttr.geCreatedAt = val[0];
            data.iwpostPageAttr.leCreatedAt = val[1];
          } else {
            data.iwpostPageAttr.geCreatedAt = null;
            data.iwpostPageAttr.leCreatedAt = null;
          }
          break;
        case "periodTime":
          str = "search";
          data.iwpostPageAttr.pn = 1;
          if (val) {
            data.iwpostPageAttr.geUpdatedAt = val[0];
            data.iwpostPageAttr.leUpdatedAt = val[1];
          } else {
            data.iwpostPageAttr.geUpdatedAt = null;
            data.iwpostPageAttr.leUpdatedAt = null;
          }

          break;
        case "timeLength":
          str = "search";
          data.iwpostPageAttr.pn = 1;
          data.iwpostPageAttr.durationGe = val[0] ? val[0] : 0;
          data.iwpostPageAttr.durationLe = val[1] ? val[1] : 0;
          break;
        case "watchNumberOfTimes":
          str = "search";
          data.iwpostPageAttr.pn = 1;
          data.iwpostPageAttr.timesWatchedGe = val[0] ? val[0] : 0;
          data.iwpostPageAttr.timesWatchedLe = val[1] ? val[1] : 0;
          break;
        case "watchNumberOfPeople":
          str = "search";
          data.iwpostPageAttr.pn = 1;
          data.iwpostPageAttr.viewersGe = val[0] ? val[0] : 0;
          data.iwpostPageAttr.viewersLe = val[1] ? val[1] : 0;
          break;
        case "price":
          // data.iwpostPageAttr.viewersGe = val[0]
          // data.iwpostPageAttr.viewersLe = val[1]
          break;
        case "sales":
          break;
        case "salesMoney":
          break;
        case "fontSearch":
          str = "search";
          data.iwpostPageAttr.pn = 1;
          searchData.searchInfo4.value = val;
          data.iwpostPageAttr.kw = val;
          break;
        case "fontSearch_selectAll":
          searchData.searchInfo4.selectAll = val;
          data.choosedIds = [];
          data.accountArr.map((item) => {
            item.choosed = val;
            if (val) {
              data.choosedIds.push(item.id);
            }
          });
          break;
        case "fontSearch_disable":
          if (data.choosedIds.length > 0) {
            searchData.searchInfo4.disabled = true;
            accountFns.batchDisable({ ids: data.choosedIds }).then((res) => {
              if (res.code === 200) {
                data.accountArr.map(item => {
                  item.disabled = item.choosed
                  item.state = item.choosed? -1 : item.state
                })
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
          if (data.choosedIds.length > 0) {
            searchData.searchInfo4.disabled = false;
            accountFns.batchEnable({ ids: data.choosedIds }).then((res) => {
              if (res.code === 200) {
                data.accountArr.map((item) => {
                  item.disabled = item.choosed ? false : item.disabled;
                  item.state = item.choosed? 1 : item.state
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
          
          if (data.choosedIds.length > 0) {
            accountFns.batchDelete({ ids: data.choosedIds }).then(() => {
              data.choosedIds = [];
              init(str);
            });
            data.accountArr = data.accountArr.filter((v) => !v.choosed);
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
        await init(str);
      }
    }
    // 滚动查询
    const scrollAccountMain = () => {
      if (data.iwpostPageAttr.total !== data.accountArr.length) {
        data.iwpostPageAttr.pn += 1;
        init();
      }
    };
    return {
      ...toRefs(searchData),
      ...toRefs(data),
      // ...toRefs(fun)
      toVideo,
      toInfo,
      changeBox,
      changedSearchInfo,
      toAdd,
      scrollAccountMain,
    };
  },
};
</script>
<style>
.fade-leave-active {
  transition: opacity 2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active 用于 2.1.8 以下版本 */ {
  transform: translateY(10px);
  opacity: 0;
}
</style>
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
.listTitleFont{
  font-size: 12px;
  font-weight: bold;
}
.accountPage {
  display: grid;
  height: calc(100vh - 40px);
  .accountMain {
    height: calc(100vh - 25vh);
    overflow-x: auto;
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
      div{
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
.bottom_style {
  display: flex;
  display: inline-block;
  width: 100%;
  text-align: center;
  span {
    font-size: 12px !important;
    color: #939796;
    line-height: 4vh;
  }
}
.addImgBox{
  display: inline-block;
  width: 18vw;
  margin: 2vh;
  text-align: center;
  img{
    width: 10vw;
    height: 20vh;
    margin-top: 15%;
    cursor: pointer;
  }
}
</style>
