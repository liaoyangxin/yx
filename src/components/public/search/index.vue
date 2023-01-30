<template>
  <div class="searchPage">
    <div v-for="(item, index) in searchInfo" :key="index">
      <!-- 按钮搜索 -->
      <div
        v-if="item.type === 'textButton'"
        style="overflow: hidden"
        class="typeBox"
        :ref="item.refName"
      >
        <el-popover
          placement="bottom"
          width="auto"
          trigger="hover"
          :content="item.imgTitle"
        >
          <template #reference>
            <img :src="item.imgUrl" class="imgStyle" />
          </template>
        </el-popover>
        <!-- {{item.buttonArr}} -->
        <span
          v-for="(buttonObj, index2) in item.buttonArr"
          type="text"
          :class="buttonObj.clicked ? 'chooseMenuFont' : ''"
          :ref="buttonObj.refName"
          :key="index2"
          @click="changeSearchInfo(buttonObj, item.code, item.buttonArr)"
        >
          <span v-if="index2 < 4" class="buttonObj fontShow" :title="buttonObj.name">{{
            buttonObj.name
          }}</span>
        </span>

        <el-dropdown
          class="moreBox"
          @command="handleCommand"
          size="small"
          :hide-on-click="false"
          v-if="item.buttonArr.length > 4"
        >
          <span class="el-dropdown-link" style="margin-left: 0" trigger="hover">
            更多<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu style="max-height: 90vh">
              <el-dropdown-item
                v-for="buttonObj in item.buttonArr"
                :key="buttonObj.id"
                :command="buttonObj.id"
                :class="buttonObj.clicked ? 'chooseMenuFont' : ''"
                @click="changeSearchInfo(buttonObj, item.code, item.buttonArr)"
                >{{ buttonObj.name }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <!-- 日期搜索 -->
      <div v-else-if="item.type === 'rangePicker'" class="typeBox">
        <el-popover
          placement="bottom"
          width="auto"
          trigger="hover"
          :content="item.imgTitle"
        >
          <template #reference>
            <img
              :src="item.imgUrl"
              class="imgStyle"
              style="
                position: absolute;
                top: 50%;
                left: 0;
                transform: translate(0, -50%);
              "
            />
          </template>
        </el-popover>
        <el-date-picker
          style="width: auto; max-width: 15vw; margin-left: 4vh"
          class="datePicker"
          v-model="item.value"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DDTHH:mm:ss"
          @change="changeSearchInfo(item.value, item.code, [], item.type)"
        ></el-date-picker>
      </div>
      <!-- 滑动搜索 -->
      <div v-else-if="item.type === 'slider'" class="slider typeBox">
        <el-popover
          placement="bottom"
          width="auto"
          trigger="hover"
          :content="item.imgTitle"
        >
          <template #reference>
            <img :src="item.imgUrl" class="imgStyle slider_img" />
          </template>
        </el-popover>
        <!-- :show-tooltip="false" -->
        <el-slider
          class="slider_slider"
          v-model="item.value"
          range
          :max="item.max"
          :marks="item.marks"
          @change="changeSearchInfo(item.value, item.code)"
        >
        </el-slider>
      </div>
      <!-- 搜索框 -->
      <div v-else-if="item.type === 'fontSearch'" class="typeBox">
        <div class="fontSearchBox">
          <el-input
            v-model="item.value"
            @keyup.enter="(e) => changeSearchInfo(e.target.value, item.code)"
            style="height: 4.8vh"
          ></el-input>
          <div class="typeBox_button">
            &nbsp;
            <!-- <el-popover
              placement="bottom"
              width="auto"
              trigger="hover"
              content="全选/非全选"
            >
              <template #reference>
                <el-checkbox
                  v-model="item.selectAll"
                  @change="changeSearchInfo(item.selectAll, 'fontSearch_selectAll')"
                ></el-checkbox>
              </template>
            </el-popover> -->
            <!-- -------------------------------------------------------------------- 全选、反选 暂时不放开-->
            <!-- <el-popover
              v-if="item.showInvertSelection"
              placement="bottom"
              width="auto"
              trigger="hover"
              content="反选"
            >
              <template #reference>
                <el-checkbox
                  v-model="item.invertSelection"
                  @change="changeSearchInfo(item.invertSelection, 'fontSearch_selectInvertSelection')"
                ></el-checkbox>
              </template>
            </el-popover> -->
            <div class="fontSearchBox_imgBox">
              <el-popover
                placement="bottom"
                width="auto"
                trigger="hover"
                v-if="!item.showNotDisable"
                content="禁用"
              >
                <template #reference>
                  <img
                    src="@/assets/img/search/disable.png"
                    @click="changeSearchInfo('disable', 'fontSearch_disable')"
                  />
                </template>
              </el-popover>

              <el-popover
                placement="bottom"
                width="auto"
                trigger="hover"
                v-if="!item.showNotDisable"
                content="启用"
              >
                <template #reference>
                  <img
                    src="@/assets/img/search/used.png"
                    @click="changeSearchInfo('use', 'fontSearch_use')"
                  />
                </template>
              </el-popover>

              <el-popover placement="bottom" width="auto" trigger="hover" content="删除">
                <template #reference>
                  <img
                    src="@/assets/img/search/del.png"
                    @click="changeSearchInfo('del', 'fontSearch_del')"
                  />
                </template>
              </el-popover>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs } from "@vue/reactivity";
// import { nextTick, onMounted, ref } from "vue";
export default {
  props: {
    searchInfo: {
      type: Array,
      default: () => {},
    },
  },
  setup(props, content) {
    let searchInfo = reactive(props.searchInfo);
    function changeSearchInfo(pitchOn, type, arr, itemType) {
      if (itemType === "rangePicker" && pitchOn) {
        const arr = pitchOn[1].split("T");
        pitchOn[1] = arr[0] + "T23:59:59";
      }
      content.emit("changedSearchInfo", pitchOn, type, arr);
    }
    function handleCommand(command) {
      console.log("选择了" + command);
    }

    return {
      ...toRefs(searchInfo),
      changeSearchInfo,
      handleCommand,
    };
  },
};
</script>
<style lang="less">
.demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 1.4vh;
  margin-bottom: 2vh;
}
.el-popover,
.el-popper {
  min-width: 1.5vw !important;
}
.searchPage {
  // overflow-x: auto;
  // 这里是slider滑块的样式
  .moreBox {
    position: absolute;
    top: 50%;
    right: 0;
    background-color: rgb(241, 243, 245);
    z-index: 2;
    transform: translate(0, -55%);
    cursor: pointer;
    padding-left: .5vw;
    span {
      font-size: 1vh;
    }
  }
  .el-slider {
    padding-top: 1.6vh;
    .el-slider__input {
      margin-top: 0;
    }
    .el-slider__runway {
      height: 0.8vh;
      margin-top: 0;
      margin-bottom: 0 !important;
      background-color: #ffffff;
      border: 1px solid #dcdfe6;
      .el-slider__bar {
        background-color: #ccc;
        height: .8vh;
      }
      .el-slider__button-wrapper {
        top: 0;
        height: 0.8vh;
        .el-slider__button {
          width: 0.2vw;
          height: 1vh;
          border-radius: 0;
          margin-top: -2vh;
          background: #ffffff;
          border: solid 0.2vh #ccc;
        }
      }
      .el-slider__stop {
        width: 0.3vw;
        height: 0.8vh;
        border-radius: 0;
        background-color: #dcdfe6;
      }
      .el-slider__marks-text {
        white-space: nowrap;
        color: #717171;
        // margin-top: 0;
        margin-top: 1vh;
        font-size: 1vh;
        // transform: translateX(-115%);
      }
    }
  }
  .datePicker {
    margin-left: 0.6vw;
  }

  .typeBox {
    margin: 1.2vh 0;
    white-space: nowrap;
    position: relative;
    .moreFont {
      position: absolute;
      right: -1.5vw;
      top: 1.7vh;
      z-index: 2;
      transform: translate(-50%, -50%);
    }
  }
  .imgStyle {
    height: 3vh;
  }
  .slider {
    .slider_img {
      float: left;
    }
    .slider_slider {
      width: 15vw;
      margin-left: 2vw;
    }
  }
  .buttonObj {
    font-size: 1vh;
    padding: 0 0.6vw;
    cursor: pointer;
  }
  .fontSearchBox {
    height: 100%;
    padding: 2vh;
    background-color: #fff;
    box-shadow: 0 0 1vh #b6b7b8;
    .typeBox_button {
      margin-top: 5vh;
      .fontSearchBox_imgBox {
        float: right;
        img {
          margin: 0 1.1vw;
          height: 3vh;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
<style lang="less" scoped>
.fontShow {
  // float: left;
  display: inline-block;
  width: 2.5vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
