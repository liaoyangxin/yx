<template>
  <div class="main">
    <div v-for="(item, index) in boxArr" :key="index" class="contentBox">
      <el-row>
        <el-col :span="5">
          <img :src="item.imgUrl" class="imgClass" />
        </el-col>
        <el-col :span="item.threeArr ? 13 : 19">
          <el-row>
            <el-col :span="24"
              ><span class="title">{{ item.title }}</span></el-col
            >
            <el-col :span="24"
              ><span class="account">{{ item.account }}</span></el-col
            >
          </el-row>
        </el-col>
        <el-col :span="6" v-if="item.threeArr">
          <div class="threeBox">
            <el-row v-for="(item3, index3) in item.threeArr" :key="index3">
              <el-col :span="24" class="threeTitle">{{ item3.title3 }}</el-col>
              <el-col :span="24" class="threeValue">{{ item3.value }}</el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs } from "@vue/reactivity";
import {secondsToTime} from '@/api/public'
import * as homePageFns from '@/api/homePage'
export default {
  setup() {
    const data = reactive({
      loading: true,
      boxArr: [
        {
          imgUrl: require("@/assets/img/homePage/author.png"),
          title: "作者数量",
          account: 0,
        },
        {
          imgUrl: require("@/assets/img/homePage/account.png"),
          title: "内容数",
          account: 0,
          threeArr: [
            {
              title3: "内容时长",
              value: "0",
            },
            {
              title3: "观看次数",
              value: 0,
            },
          ],
        },
        {
          imgUrl: require("@/assets/img/homePage/get.png"),
          title: "总收益",
          account: 0,
          threeArr: [
            {
              title3: "本周收益",
              value: "0",
            },
            {
              title3: "本月收益",
              value: 0,
            },
          ],
        },
      ],
    });
    return {
      ...toRefs(data),
    };
  },
  created(){
    this.init()
  },
  methods:{
    init() {
      homePageFns.initData().then(res => {
        if(res.code === 200) {
          this.boxArr[0].account = res.data.numberOfAuthors
          this.boxArr[1].account = res.data.contentQuantity
          this.boxArr[1].threeArr[0].value = secondsToTime(res.data.contentDuration)
          this.boxArr[1].threeArr[1].value = res.data.timesWatched
          this.boxArr[2].account = res.data.totalRevenue
          this.boxArr[2].threeArr[0].value = res.data.earningsThisWeek
          this.boxArr[2].threeArr[1].value = res.data.earningsThisMonth
        }
      })
    }
  }
};
</script>
<style lang="less" scoped>
.main {
  padding-top: 30px;
  widows: 100%;
  div:last-child {
    margin-bottom: 0;
  }
  .contentBox {
    width: 752px;
    height: 200px;
    padding: 16px 28px 50px 0;
    margin: auto;
    background-color: rgb(161, 161, 161);
    margin-bottom: 30px;
    .imgClass {
      width: 152px;
      height: 152px;
      // display: flex;
      // align-items: center;
      // justify-content: center;
      margin-top: 30px ;
    }
    .title {
      font-size: 66px;
      color: #fff;
      line-height: 98px;
      margin-top: 26px;
    }
    .account {
      font-size: 114px;
      color: #fff;
      line-height: 114px;
    }
    .threeBox {
      margin-top: 26px;
      .threeTitle {
        text-align: right;
        font-size: 34px;
        line-height: 42px;
        color: rgb(224, 224, 224);
      }
      .threeValue {
        text-align: right;
        font-size: 42px;
        line-height: 50px;
        color: rgb(242, 242, 242);
      }
    }
  }
}
</style>
