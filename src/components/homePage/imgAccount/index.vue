// 图片内容
<template>
  <div class='img_content'  style='height:calc(100% - 42px)'>
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
      <div class='img_content_list'>
        <ul  class='item_box' v-infinite-scroll="load" infinite-scroll-disabled="disabled">
          <div class='add_box'><img class='add_icon' src='@/assets/img/allAdd.png'  @click='add()' ></div>
          <li class='img_item' v-for="(item, index) in imgArr" :key="index">
                <div class='preview_img' @click="imgPreview(item.id)">
                    <!-- <img src='../../../assets/img/uploader/image.jpg'> -->
                    <img :src='item.imageUrl'>
                </div>
                <div class="list_disabled" v-if="item.state==-1">
                    <img src="@/assets/img/uploader/disable303.png" style="width:18vw;height:21vh;border-radius:1px 1px 0 0;"/>
                </div>
                <div  class='edit_box'>
                      <div class='checkbox' >
                          <el-checkbox class='checkbox'  v-model="item.choosed" @change="checkBoxChange(item.choosed, item.id)"></el-checkbox>
                      </div>
                      <ul  @click="imgAccountEdit(item.id)">
                        <li class='title' >内容标题:{{item.title}}</li>
                        <li>内容类别:{{item.categoryName}}</li>
                        <li>作者:{{item.authorName}}</li>
                        <li>阅读量:{{item.timesWatched}}</li>
                        <li>阅读人数:{{item.viewers}}</li>
                        <li>创建时间:{{item.createdAt?item.createdAt.split('T')[0]: ''}}</li>
                        <li>最近修改时间:{{item.updatedAt?item.updatedAt.split('T')[0]: ''}}</li>
                      </ul>
                </div>
          </li>
        </ul>
        <div class='bottom_style'>
                <span v-if="!noMore">加载中...</span>
                <span v-if="noMore">无更多数据</span>
        </div>
      </div>
  </div>
</template>
<script>
import Search from "@/components/public/search";
// import { reactive, toRefs ,ref,computed,onMounted} from '@vue/reactivity';
import {reactive,toRefs, onMounted,ref,computed } from 'vue'
import { useRouter } from "vue-router";
import * as accountFns from "../account/account";
import * as addOrEdite from '../account/addOrEdite/addOrEdite'
import { ElMessage } from "element-plus";
export default {
  components: {Search},
  setup(){
    const router = new useRouter();
    const searchParmas = reactive({
        searchInfo1: [
            {
            type: "textButton",
            imgUrl: require("@/assets/img/search/type.png"),
            imgTitle: "类别",
            code: 'class',
            buttonArr: [],
            },
            {
            type: "textButton",
            imgUrl: require("@/assets/img/search/author.png"),
            imgTitle: "作者",
            code: 'author',
            buttonArr: [],
            },
            {
            // 时间段
            type: "rangePicker",
            imgUrl: require("@/assets/img/search/date.png"),
            imgTitle: "创建时间",
            code: 'bigenTime',
            value: [],
            },
            {
            // 时间段
            type: "rangePicker",
            imgUrl: require("@/assets/img/search/update.png"),
            imgTitle: "修改时间",
            code: 'periodTime',
            value: [],
            },
        ],
        searchInfo2: [
            {
                // 滑动输入
                type: "slider",
                imgUrl: require("@/assets/img/search/lookNumber.png"),
                imgTitle: "观看次数",
                code: 'watchNumberOfTimes',
                value: [0, 0],
                max:0,
                marks:{
                    // 25:'25',
                    // 50:'50',
                    // 75:'75',
                    // 100:'100',
                }
            },
            {
                // 滑动输入
                type: "slider",
                imgUrl: require("@/assets/img/search/lookPerson.png"),
                imgTitle: "观看人数",
                code: 'watchNumberOfPeople',
                value: [0, 0],
                max:0,
                marks: {},
            },

            // {
            //     // 滑动输入
            //     type: "slider",
            //     imgUrl: require("@/assets/img/search/charge.png"),
            //     imgTitle: "价格",
            //     value: [0, 0],
            //     max:100,
            //     marks: {
            //         0: "免费",
            //         33: "会员",
            //         66: "限免",
            //         100: "收费",
            //     },
            // },
        ],
        searchInfo3: [],
        searchInfo4: [
          {
            // 滑动输入
            type: "fontSearch",
            code: "fontSearch",
            value: "",
            selectAll: false,
            imgType: "",
          }
        ],
    })
    const imgData = reactive({
      imgArr:[],
      queryWorks: {
        ps: 20,
        pn: 0,
        total: 1,
        mimeType:'POST_IMAGE',
        categoryIds: [],//分类id
        authorIds:[],//up主id
        geCreatedAt: "",//创建时间开始
        geUpdatedAt: "",//修改时间开始
        kw:'',//关键字
        leCreatedAt:'',//创建时间结束
        leUpdatedAt:'',//修改时间结束
        timesWatchedGe:'',//观看次数最小值
        timesWatchedLe:'',//观看次数最大值
        viewersGe:'',//观看人数最小值
        viewersLe:'',//观看人数最大值
      },
    });
   onMounted(()=>{
            accountFns.queryLimit().then(res=>{
                if(res.code==200){//观看次数
                        res.data.maxTimesWatched = res.data.maxTimesWatched>0?res.data.maxTimesWatched:1
                        res.data.maxViewers = res.data.maxViewers>0?res.data.maxViewers:1
                        searchParmas.searchInfo2[0].max= res.data.maxTimesWatched
                        searchParmas.searchInfo2[0].marks={
                        0: "0",
                        [res.data.maxTimesWatched]: JSON.stringify(res.data.maxTimesWatched),
                        };
                        imgData.queryWorks.timesWatchedGe = 0
                        imgData.queryWorks.timesWatchedLe = res.data.maxTimesWatched
                         searchParmas.searchInfo2[0].value=[0,res.data.maxTimesWatched]
                        //  最大观看人数
                        searchParmas.searchInfo2[1].max= res.data.maxViewers
                        searchParmas.searchInfo2[1].marks={
                        0: "0",
                        [res.data.viewers]: JSON.stringify(res.data.maxViewers),
                        };
                        imgData.queryWorks.viewersGe = 0
                        imgData.queryWorks.viewersLe = res.data.maxViewers
                        searchParmas.searchInfo2[1].value=[0,res.data.maxViewers]
                }
            })
    }),
    //搜索相关下拉数据
    (async () => {
      searchParmas.searchInfo1[0].buttonArr =  await addOrEdite.dropDownList()
      searchParmas.searchInfo1[1].buttonArr =  await addOrEdite.authorDropDownList()
    })();
        //下拉加载
    const loading = ref(false)
    let noMore = computed(() => imgData.queryWorks.total == imgData.imgArr.length)
    let disabled = computed(() => noMore.value)
    const load = () => {
        if(noMore.value){
            noMore.value = false;
            loading.value = false;
        }else{
            imgData.queryWorks.pn++
            loading.value = true;
            noMore.value = false;
            initImgManageList()
        }
       

    }
    //初始化数据
   const initImgManageList=()=>{
        //视频内容同一接口
        accountFns.iwpostPage(imgData.queryWorks).then(res=>{
          if(res.code==200){
                imgData.queryWorks.total =res.data.total
                imgData.queryWorks.pages =res.data.pages
                console.log("res.data.records",res.data.records)
                res.data.records.forEach(item => {
                    item.choosed = false
                    if(!item.imageUrl) {
                        item.imageUrl = require('@/assets/position/listImage.png')
                    }
                    imgData.imgArr.push(item)
                });
          }
        })
    }

    const refresh=()=>{
            imgData.queryWorks.pn = 1
            imgData.queryWorks.total = null;
            imgData.imgArr = [];
            ids=[]
            searchParmas.searchInfo4[0].selectAll = false;
            initImgManageList();
    }
   function updateArr(arr,idArr,type){
            if(type=='del'){
                return arr.filter(v => !v.choosed)
            }else{
                arr.map(item => {
                    if(idArr.indexOf(item.id)!==-1){//包含选中的id--禁用state为-1  启用为1
                        item.state =type=='disabled'? -1:1
                        item.choosed = false
                    }
                })
            }
            ids=[]
            imgData.searchInfo4[0].selectAll = false;
    }
        //选中id
    let ids=[]
    function checkBoxChange(check, id) {
        if (check) {
              ids.push(id)
        }else{
            let index = ids.findIndex(item => {
                if ( item == id) {
                return true;
                }
            });
            ids.splice(index,1)
        }
    }
    function changedSearchInfo(pitchOn,type,arr) {
            if(type==='author'){
                if(pitchOn&&pitchOn.clicked){
                    pitchOn.clicked = false;   
                }else{
                    pitchOn.clicked = true;
                }
              let currIds = arr.filter(i=>i.clicked).map(i=>i.id);
                imgData.queryWorks.authorIds = currIds
                refresh()
            }else if(type==='class'){
                if(pitchOn&&pitchOn.clicked){
                    pitchOn.clicked = false;   
                }else{
                    pitchOn.clicked = true;
                }
                let currIds = arr.filter(i=>i.clicked).map(i=>i.id);
                imgData.queryWorks.categoryIds = currIds
                refresh()
            }else if(type==='bigenTime'){
                if(pitchOn){
                  imgData.queryWorks.geCreatedAt = pitchOn[0]
                  imgData.queryWorks.leCreatedAt = pitchOn[1]
                }else{
                  imgData.queryWorks.geCreatedAt = ''
                  imgData.queryWorks.leCreatedAt =''
                }
                  refresh()
            }else if(type==='periodTime'){
                if(pitchOn){
                    imgData.queryWorks.geUpdatedAt = pitchOn[0]
                    imgData.queryWorks.leUpdatedAt = pitchOn[1]
                }else{
                    imgData.queryWorks.geUpdatedAt =''
                    imgData.queryWorks.leUpdatedAt =''
                }
                  refresh()
            }else if(type==='watchNumberOfTimes'){
                console.log("🚀 ~ file: index.vue ~ line 326 ~ changedSearchInfo ~ pitchOn", pitchOn)

                imgData.queryWorks.timesWatchedGe = pitchOn[0]
                imgData.queryWorks.timesWatchedLe = pitchOn[1]
                refresh()
            }else if(type==='watchNumberOfPeople'){
                imgData.queryWorks.viewersGe = pitchOn[0]
                imgData.queryWorks.viewersLe = pitchOn[1]
                refresh()
            }else if(type==='fontSearch'){
                imgData.queryWorks.kw = pitchOn
                refresh()
            }
            else if(type==='fontSearch_disable'){
                if(ids.length>0){
                    accountFns.batchDisable({ids:ids}).then(res=>{
                        if(res.code==200){
                          updateArr(imgData.imgArr,ids,'disabled')
                        }
                    })
                }else{
                    ElMessage.warning({
                        message: "请先选择图片分类",
                        type: "warning",
                    });
                }

            }else if(type==='fontSearch_use'){
                  if(ids.length>0){
                    accountFns.batchEnable({ids:ids}).then(res=>{
                        if(res.code==200){
                            updateArr(imgData.imgArr,ids,'use')
                        }
                    })
                  }else{
                    ElMessage.warning({
                        message: "请先选择图片分类",
                        type: "warning",
                    });
                }
            }else if(type==='fontSearch_del'){
                if(ids.length>0){
                    accountFns.batchDelete({ids:ids}).then(res=>{
                        if(res.code==200){
                              imgData.imgArr = updateArr(imgData.imgArr,ids,'del')
                        //   listData.uploaderArr = listData.uploaderArr.filter(v => !v.choosed)
                        }
                    })
                }else{
                    ElMessage.warning({
                        message: "请先选择图片分类",
                        type: "warning",
                    });
                }
            }

            // 全选
            if (pitchOn === true) {
                ids=[]
                imgData.imgArr = imgData.imgArr.map((item) => {
                item.choosed = true;
                ids.push(item.id)
                return item;
                });
            } else if (pitchOn === false) {
                if (imgData.imgArr.filter((v) => v.choosed === false).length < 1) {
                imgData.imgArr = imgData.imgArr.map((item) => {
                    item.choosed = false;
                    return item;
                });
                }
            }
      
    }
    //新增
    function add(){
          router.push({path: "/homePage/imgAccount/ImgAccountAdd"})
    }
    //预览
    const imgPreview=(id)=>{
          router.push({name: "fonImgtPreview",params:{id:id,type:'img'}})
        //  router.push(`/imgAccountPreview/${id}`);
    }
    //编辑
    const imgAccountEdit=(id)=>{
         router.push({path: "/homePage/imgAccount/ImgAccountAdd",query:{id:id}})
    }
    
    return {
      ...toRefs(searchParmas),
      ...toRefs(imgData),
      loading,
      noMore,
      disabled,
      load,
      refresh,
      initImgManageList,
      changedSearchInfo,
      updateArr,
      add,
      checkBoxChange,
      imgPreview,
      imgAccountEdit
    }

  }
}
</script>
<style lang="less" scoped>
.img_content{
  .img_content_list{
       height: calc(100vh - 240px);     
       overflow: auto;
     .item_box{
          display: grid;
          justify-items:center;
          position: relative;
          grid-template-columns:repeat(4, 1fr);
          margin-top: 20px;
        .add_box{
                width: 360px;
                height:200px;
                margin:30px 30px 0 30px;
                text-align:center;
                vertical-align: middle;
            .add_icon{
                width:50%;
                cursor: pointer;
            }
        }
        .img_item{
                  position: relative;
                  width:18vw;
                  height:calc(21vh + 132px);
                  margin-bottom:2.78vh;
                  background:#F1F3F5;
                  font-size:12px;
                  color:#606266;
                  box-shadow: 0 0 10px #b6b7b8;
                  // border-radius: 5px;
                  border-radius:1px 1px 0 0; 
          .preview_img{
                height:21vh;
                width:100%;
            img{
                  height:21vh;
                  width:100%;
                  cursor: pointer;
                  border-radius: 1px 1px 0 0;
                  object-fit: cover;
            }
          }
          .list_disabled{
                      top: 0;
                      left: 0;
                      bottom: 0;
                      right: 0;
                      img {
                        position: absolute;
                        width:100%;
                            top: 0;
                            left: 0;
                            transform: translate(0, 0);
                      }
          }
          .edit_box{
                    height:122px;
                    display:grid;
                    grid-template-columns:10% 55% 35%;
                    justify-items:start;
                    align-items:center;
                    margin:0.46vh 0.52vw;
                    // font-size:0.63vw;
                    font-size:8px;
                    .checkbox{
                      height:90%;
                      display:flex;
                      align-items:flex-end;
                    }
          }
        }
     }
     .bottom_style{
          display: flex;
          display:inline-block;
          width:100%;
          text-align:center;
          span{
              font-size:12px!important;
              color:#939796;
              line-height:40px;
          }
      }
  }
}
@media screen and (max-width: 1680px) {
  .img_content{
    :deep(.img_content_list){
        .item_box{
           grid-template-columns:repeat(3, 1fr);
        }  
   }
  }
}
</style>