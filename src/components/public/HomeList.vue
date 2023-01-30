<template>
        <div class='HomeList' v-if='isDetail'>
            <div class='search'>
              <div style='width:25vw;height:18.52vh'>
                      <Search :searchInfo="searchInfo4" @changedSearchInfo="changedSearchInfo"></Search>
              </div>
            </div>
            <div class='list_box'>
                <ul  v-infinite-scroll="load" infinite-scroll-disabled="disabled" class='pro_list'>
                    <div class='add_box'>
                      <img class='add_btn' src='@/assets/img/allAdd.png' @click='addinfo()' >
                    </div>
                    <li class='list_item' v-for="(item,index) in info.listArr" :key="index">
                        <div class='top_img'  @click='jumping(item)'>
                            <img  class='slider_bar'  :src='item.imageUrl'>
                        </div>
                        <div class="list_disabled" v-if="item.state==-1"   @click='jumping(item)'>
                          <img
                            src="@/assets/img/uploader/disable303.png"
                            style="width:18vw;height:21vh;border-radius:1px 1px 0 0;"
                          />
                        </div>
                        <div class='video_info'>
                            <div class='checkbox' >
                              <el-checkbox class='checkbox'  v-model="item.choosed" @change="checkBoxChange(item.choosed, item.id)"></el-checkbox>
                            </div>
                          <!-- 专题列表 -->
                            <ul  class='pro_box' v-if='type.showType =="projectList"' @click='jumping(item)'>
                                <li>建立时间:{{item.createdAt?item.createdAt.split('T')[0]: ''}}</li>
                                <li>最近发布:{{item.lastIssueTime?item.lastIssueTime.split('T')[0]: ''}}</li>
                                <li>作品总数：{{item.contentQuantity}}</li>
                                <li>作品总时长：{{item.contentDuration}}</li>
                                <li>观看总数:{{item.timesWatched}}</li>
                                <li>观众总数:{{item.viewers}}</li>
                                <li>创作者人数:{{item.numberOfAuthors}}&nbsp;&nbsp;&nbsp;分类数:{{item.numberOfCategories}}</li>
                            </ul>
                            <div class='right'  v-if='type.showType =="projectList"' @click='jumping(item)'>
                                <el-popover placement="top" width="auto" trigger="hover" :content="item.name" :disabled='item.name&&item.name.length<5?true:false'>
                                  <template #reference>
                                      <p>{{item.name}}</p>
                                  </template>
                                </el-popover>
                               <p v-if='item.name'>专题标签</p>
                            </div>
                          <!-- 类别列表 -->
                            <ul class='category_box' v-if='type.showType =="categoryList"' @click='jumping(item)'>
                                <li>建立时间:{{item.createdAt?item.createdAt.split('T')[0]: ''}}</li>
                                <li>最近发布:{{item.lastIssueTime?item.lastIssueTime.split('T')[0]: ''}}</li>
                                <li>作品总数：{{item.contentQuantity}}</li>
                                <li>作品总时长：{{item.contentDuration}}</li>
                                <li>观看总数:{{item.timesWatched}}</li>
                                <li>观众总数:{{item.viewers}}</li>
                                <li>创作者人数:{{item.numberOfAuthors}}</li>
                            </ul>
                            <div class='right'  v-if='type.showType =="categoryList"' @click='jumping(item)'>
                              <el-popover placement="top" width="auto" trigger="hover" :content="item.name" :disabled='item.name&&item.name.length<5?true:false'>
                                  <template #reference>
                                      <p>{{item.name}}</p>
                                  </template>
                                </el-popover>
                               <p v-if='item.name'>分类标签</p>
                            </div>

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
import { reactive,ref,computed } from 'vue'
import * as categoryFns from '../homePage/category/category'
import * as projectFns from '../homePage/project/project'
import { useRoute,useRouter } from "vue-router";
import { ElMessage } from 'element-plus'
import { secondsToTime } from "@/api/public/index";

export default {
  name: '',
  components:{
    Search
  },
  props:{
   isDetail:{
        type: Boolean,
        required: true,
    },
  //  disabledAdd:{
  //       type: Boolean,
  //       required: true,
  //   },
    type:{
        type: Object,
        required: true,
    }
  },
  setup (props){
    const router = new useRouter();
    const route = new useRoute();
    const searchInfo4 =reactive([
        {
          type: "fontSearch",
          value: "",
          selectAll: false,
          imgTitle: "关键字",
          code:'fontSearch'
        },
    ])
     
    const info =reactive({
      //作品信息参数
       queryWorks:{
          // authorIds:[],
          // categoryIds:[],
          // subjectIds:[],
          kw:'',//关键字
          pn: 0,
          ps: 10,
        },
        listArr:[]
    })
    // if(route.params&&route.params.id){//详情界面查询视频参数
    //   if(route.params.name=='uploader'){
    //     info.queryWorks.authorIds.push(route.params.id)
    //   }else if(route.params.name=='classify'){
    //     info.queryWorks.categoryIds.push(route.params.id)
    //   }else if(route.params.name=='special'){
    //     info.queryWorks.subjectIds.push(route.params.id)
    //   }
    // }
    const loading = ref(false)
    let noMore = computed(() => info.queryWorks.total == info.listArr.length)
    let disabled = computed(() => noMore.value)
      //下拉加载
      const load = () => {
          if(noMore.value){
              noMore.value = false;
              loading.value = false;
          }else{
              info.queryWorks.pn++
              loading.value = true;
              noMore.value = false;
              initVideoList()
          }
      }
    const initVideoList=()=>{
      // if(props.type.showType=='works'){
      //   uploaderFns.videoList(info.queryWorks).then(res=>{
      //     if(res.code==200){
      //           info.queryWorks.total =res.data.total
      //           info.queryWorks.pages =res.data.pages
      //           res.data.records.forEach(item => {
      //               item.choosed = false
      //               if(!item.imageUrl) {
      //                   item.imageUrl = require('@/assets/position/listImage.png')
      //               }
      //               info.listArr.push(item)
      //           });
      //     }
      //   })
      // }else 
      if(props.type.showType=='categoryList'){//分类列表
         categoryFns.categoryList(info.queryWorks).then(res=>{
          if(res.code==200){
                info.queryWorks.total =res.data.total
                info.queryWorks.pages =res.data.pages
                res.data.records.forEach(item => {
                    item.choosed = false
                     item.contentDuration = secondsToTime(item.contentDuration)
                    if(!item.imageUrl) {
                        item.imageUrl = require('@/assets/position/listImage.png')
                    }
                    info.listArr.push(item)
                });
          }
        })
      }else if(props.type.showType=='projectList'){//专题列表
         projectFns.subjectList(info.queryWorks).then(res=>{
          if(res.code==200){
                info.queryWorks.total =res.data.total
                info.queryWorks.pages =res.data.pages
                res.data.records.forEach(item => {
                    item.choosed = false
                     item.contentDuration = secondsToTime(item.contentDuration)
                     if(!item.imageUrl) {
                        item.imageUrl = require('@/assets/position/listImage.png')
                    }
                    info.listArr.push(item)
                });
          }
        })


      }

    }
    const refresh=()=>{
            info.queryWorks.pn = 1
            info.queryWorks.total = null;
            info.listArr = [];
            ids=[]
            searchInfo4[0].selectAll = false;
            initVideoList();
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
        searchInfo4[0].selectAll = false;
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
    //上方搜索及禁用删除等
    function changedSearchInfo(pitchOn,type) {
         if(type==='fontSearch'){
              info.queryWorks.kw = pitchOn
              refresh()
         }

         if(props.type.showType=='categoryList'&&ids.length>0){
            if(type==='fontSearch_disable'){
                categoryFns.batchDisable({ids:ids}).then(res=>{
                    if(res.code==200){
                        updateArr(info.listArr,ids,'disabled')
                      }
                })
            }else if(type=== "fontSearch_use"){
                categoryFns.batchEnable({ids:ids}).then(res=>{
                    if(res.code==200){
                        updateArr(info.listArr,ids,'use')
                    }
                })
            }else if(type=== "fontSearch_del"){
                categoryFns.batchDel({ids:ids}).then(res=>{
                    if(res.code==200){
                        info.listArr = updateArr(info.listArr,ids,'del')
                    }
                })
            }
         }else if(props.type.showType=='projectList'&&ids.length>0){
            if(type==='fontSearch_disable'){
                projectFns.batchDisable({ids:ids}).then(res=>{
                    if(res.code==200){
                         updateArr(info.listArr,ids,'disabled')
                      }
                })
            }else if(type=== "fontSearch_use"){
                projectFns.batchEnable({ids:ids}).then(res=>{
                    if(res.code==200){
                        updateArr(info.listArr,ids,'use')
                    }
                })
            }else if(type=== "fontSearch_del"){
                projectFns.batchDel({ids:ids}).then(res=>{
                    if(res.code==200){
                        info.listArr = updateArr(info.listArr,ids,'del')
                    }
                })
            }
         }else{
           if(props.type.showType=='categoryList'&&type!=='fontSearch'){
               ElMessage.warning({
                      message: "请先选择类别",
                      type: "warning",
               });
           }else if(props.type.showType=='projectList'&&type!=='fontSearch'){
               ElMessage.warning({
                      message: "请先选择专题",
                      type: "warning",
               });
           }

        }

        // 全选
        if (pitchOn === true) {
            ids=[]
            info.listArr =  info.listArr.map((item) => {
            item.choosed = true;
            ids.push(item.id)
            return item;
            });
        } else if (pitchOn === false) {
            if ( info.listArr.filter((v) => v.choosed === false).length < 1) {
             info.listArr =  info.listArr.map((item) => {
                item.choosed = false;
                return item;
            });
            }
        }

    }
    const jumping = (item)=>{
       if(props.type.showType=='categoryList'){
         router.push({name: "categoryEdit",params:{id:item.id,name:'classify'}})
      }else if(props.type.showType=='projectList'){
         router.push({name: "projectEdit",params:{id:item.id,name:'special'}})
      }

    }

    const addinfo = ()=>{
      if(props.type.showType=='categoryList'){
         router.push({path: "/homePage/category/categoryAdd"})
      }else if(props.type.showType=='projectList'){
         router.push({path: "/homePage/project/projectAdd"})
      }

    }
     return{
       info,
      searchInfo4,
      checkBoxChange,
      changedSearchInfo,
      refresh,
      load,
      jumping,
      addinfo,
      updateArr,
      loading,
      noMore,
      disabled,

     }
  }
}
</script>

<style scoped lang="less">

      .HomeList{
              width:100vw;
              height:100vh;
              :deep(.el-checkbox__input.is-checked .el-checkbox__inner){
                background-color:#ccc;
                border:#ccc;
              }
              :deep(.el-checkbox__input.is-focus .el-checkbox__inner){
                border-color:#ccc;
              }
              :deep(.el-checkbox__inner:hover){
                border-color:#000;
              }
            .search{
                height:200px;
                margin:30px 50px 0px 0;
                display:flex;
                justify-content:flex-end;
            }
            .list_box{
                height: calc(100vh - 450px);     
                overflow: auto;
                padding-top:1.85vh;
                .bottom_style{
                    width:100%;
                    text-align:center;
                    span{
                        font-size:12px!important;
                        color:#939796;
                        line-height:3.7vh;
                    }
                }
              .pro_list_3{
                 grid-template-columns:repeat(3, 1fr);
              }
              .pro_list{
                    // padding-top:9.63vh;
                    display: grid;
                    justify-items:center;
                    position: relative;
               .add_box{
                    width:18vw;
                    height:calc(21vh + 132px);
                    margin-bottom:2.78vh;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content:center;
                    position: relative;
                .add_btn{
                      width: 10vw;
                      height: 20vh;
                    cursor: pointer;
                    position: relative;
                    
                  }
                  .add_btn_disabled{
                          width:18vw;
                          height:calc(21vh + 132px);
                          margin-bottom:2.78vh;
                          position: absolute;
                            top:0;
                            left:0;
                            transform: translate(0, 0);
                  }
               }
  
                .list_item{
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
                  .top_img{
                      height:21vh;
                      width:100%;
                      background-color:#f9fbfc;
                      border-radius:1px 1px 0 0;
                    .slider_bar{
                      height:21vh;
                      width:100%;
                      cursor: pointer;
                      border-radius: 1px 1px 0 0;
                      object-fit: cover;
                    }
                  }
                  .list_disabled {
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
                  .video_info{
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



                    .price{
                      font-size:24px;
                      color:#000;
                      width:100%;
                      text-align:center;
                      .price_item{
                          font-size:12px;
                          color:red;
                        .return_date{
                          font-size:12px;
                        }
                        .old_price{
                            font-size:18px;
                            text-decoration:line-through;
                        }
                      }
                    }
                    .price>span{
                      font-size:34px;
                    }
                    .category_box{
                      width:15.1vw;
                      cursor: pointer;
                      
                    }
                    .pro_box{
                       width:15.1vw;
                       cursor: pointer;
                    }
                    .right{
                      width:100%;
                      text-align: right;
                       cursor: pointer;
                    }
                    .right>p:nth-child(1){
                      text-overflow:ellipsis;//超出显示省略号
                      overflow:hidden;//超出部分文字隐藏
                      white-space:nowrap;//强制不换行
                      // font-size:1.56vw;
                      font-size:1.3vw;
                      // font-size:30px;
                      font-weight: bold;
                    }

                    .right>p:nth-child(2){
                      font-size:0.63vw;
                    }
                  }
                }

                
              }
           }
      }
 @media screen and (max-width: 1680px) {
  .production{
     .search{
          height:160px;
          margin:0px 50px 1.85vh 0;
     }

  }
}
@media screen and  (max-height:1080px){
   .production{
     .list_box{
       height: calc(100vh - 450px)
     }
  }
}
@media screen and (max-height: 760px) {
   .production{
     .list_box{
       height: calc(100vh - 46vh)
     }
  }
}
@media screen and (max-height: 750px) {
   .production{
     .list_box{
       height: calc(100vh - 56vh);
     }

  }
}

@media screen and (min-height:761px) and (max-height:920px){
   .production{
     .list_box{
       height: calc(100vh - 41vh)
     }
  }
}
</style>
