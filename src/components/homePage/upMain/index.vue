<template>
    <div style='height:calc(100% - 42px)'>
         <div>
            <el-row :gutter="24" class="searchRow">
                <el-col :span="6" class="mw">
                <Search
                    :searchInfo="searchInfo1"
                    @changedSearchInfo="changedSearchInfo"
                ></Search>
                </el-col>
                <el-col :span="6" class="mw">
                <Search
                    :searchInfo="searchInfo2"
                    @changedSearchInfo="changedSearchInfo"
                ></Search>
                </el-col>
                <el-col :span="6" class="mw">
                <Search
                    :searchInfo="searchInfo3"
                    @changedSearchInfo="changedSearchInfo"
                ></Search>
                </el-col>
                <el-col :span="6" class="mw">
                <Search
                    :searchInfo="searchInfo4"
                    @changedSearchInfo="changedSearchInfo"
                ></Search>
                </el-col>
            </el-row>
            </div>
        <!-- 下方列表 -->
        <div  class='list_box'>
            <ul  v-infinite-scroll="load" infinite-scroll-disabled="disabled" class='up_list' >
                <!-- <img src="@/assets/img/uploader/square_add.png" class="add_icon" @click='addUploader()'/> -->
                <div class="add_box">
                   <img src="@/assets/img/allAdd.png" class="add_icon" @click='addUploader()'/>
                </div>
                <!-- <li class='list_item ' v-for="(item, index) in uploaderArr" :key="index"  :class="{'forbid':item.state==-1}"> -->
                <li class='list_item ' v-for="(item, index) in uploaderArr" :key="index">
                    <el-checkbox class='checkbox'  v-model="item.choosed" @change="checkBoxChange(item.choosed, item.id)"></el-checkbox>
                    <div class='left_imgbox' @click='toDetail(item)'>
                        <img  class='image' :src='item.avatarUrl'>
                    </div>
                    <div class="list_disabled" v-if="item.state==-1"  @click='toDetail(item)'>
                        <img
                        src="@/assets/img/uploader/square_forbidden.png"
                        style="width: 360px;height:205px"
                        />
                    </div>
                    <div class='uploader_info'  @click='toDetail(item)'>
                        <ul>
                            <li>{{item.title}}</li>
                            <li class='ellipsis'>
                                <el-popover placement="top" width="auto" trigger="hover" :content="item.name" :disabled='item.name&&item.name.length<12?true:false'>
                                  <template #reference>
                                      <p>姓名:{{item.name}}</p>
                                  </template>
                                </el-popover>
                            </li>
                            <li>性别：{{item.gender}}</li>
                            <li>年龄：{{item.age}}</li>
                            <li>加入时间：{{item.createdAt?item.createdAt.split('T')[0]: ''}}</li>
                            <li>最近发布时间：{{item.lastIssueTime?item.lastIssueTime.split('T')[0]: ''}}</li>
                            <li>作品总数：{{item.contentQuantity}}</li>
                            <li>作品总时长：{{item.contentDuration}}</li>
                            <li>观看总数：{{item.timesWatched}}</li>
                            <li>观众总数：{{item.viewers}}</li>
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
import { useRouter } from "vue-router";
import {reactive,toRefs, onMounted,ref,computed } from 'vue'
import * as addOrEdite from '../account/addOrEdite/addOrEdite'
import * as uploaderFns from './uploader'
import { secondsToTime } from "@/api/public/index";
import { ElMessage } from "element-plus";
export default {
    components: { Search },
    setup() {
        const router = new useRouter();
        const searchData = reactive({
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
            searchInfo3: [
                // {
                // // 滑动输入
                // type: "slider",
                // imgUrl: require("@/assets/img/search/saleroom.png"),
                // imgTitle: "销售额",
                // value: [0, 0],
                // marks: {
                //     10: "10",
                //     20: "20",
                //     30: "30",
                //     100: "50+k",
                // },
                // },
                // {
                // // 滑动输入
                // type: "slider",
                // imgUrl: require("@/assets/img/search/sales.png"),
                // imgTitle: "销量",
                // value: [0, 0],
                // marks: {
                //     0: "10",
                //     33: "20",
                //     66: "30",
                //     90: "50",
                // },
                // },
            ],
            searchInfo4: [
                {
                // 滑动输入
                type: "fontSearch",
                code: 'fontSearch',
                value: "",
                selectAll: false,
                imgTitle: "关键字",
                },
            ],
        });
        const listData = reactive({
            pageData:{
                pn:0,
                ps:10,
                total:null,
                categoryIds: [],//分类id
                authorIds:[],//up主id
                geCreatedAt: "",//创建时间开始
                geUpdatedAt: "",//修改时间开始
                kw:'',//关键字
                leCreatedAt:'',//创建时间结束
                leUpdatedAt:'',//修改时间结束
                geTimesWatched:'',//观看次数最小值
                leTimesWatched:'',//观看次数最大值
                geViewers:'',//观看人数最小值
                leViewers:'',//观看人数最大值
            } ,
            uploaderArr: [],
        });
        //动态设置marks
        function avgSplit(num,limit){
            let avg = parseInt(num/limit);
            let result = {};
            let sum = 0;
            for(let i=0;i<limit-1;i++){
                sum+=avg;
                result[sum] = sum+'';
            }
            result[num] = num+'';
            return result;
        }
         onMounted(()=>{
            uploaderFns.searchCriteria().then(res=>{
                if(res.code==200){//观看次数
                    // if(res.data.timesWatched>0){
                        res.data.timesWatched = res.data.timesWatched>0?res.data.timesWatched:1
                        res.data.viewers = res.data.viewers>0?res.data.viewers:1
                        searchData.searchInfo2[0].max= res.data.timesWatched
                        // searchData.searchInfo2[1].marks=avgSplit(res.data.timesWatched,5)
                        searchData.searchInfo2[0].marks={
                        0: "0",
                        [res.data.timesWatched]: JSON.stringify(res.data.timesWatched),
                        };
                        listData.pageData.geTimesWatched = 0
                        listData.pageData.leTimesWatched = res.data.timesWatched
                         searchData.searchInfo2[0].value=[0,res.data.timesWatched]
                    //    }
                    // if(res.data.viewers>0){//观看人数
                        searchData.searchInfo2[1].max= res.data.viewers
                        // searchData.searchInfo2[0].marks=avgSplit(res.data.viewers,5)
                        searchData.searchInfo2[1].marks={
                        0: "0",
                        [res.data.viewers]: JSON.stringify(res.data.viewers),
                        };
                        listData.pageData.geViewers = 0
                        listData.pageData.leViewers = res.data.viewers
                        searchData.searchInfo2[1].value=[0,res.data.viewers]
                    // }
              
                }

            })
         })

        //下拉加载
        const loading = ref(false)
        let noMore = computed(() => listData.pageData.total == listData.uploaderArr.length)
        let disabled = computed(() => noMore.value)
        const load = () => {
            if(noMore.value){
                noMore.value = false;
                 loading.value = false;
            }else{
                listData.pageData.pn++
                loading.value = true;
                noMore.value = false;
                initList()
            }
        }
        //初始化加载列表
       const initList = () =>{
              uploaderFns.uploaderList(listData.pageData).then(res=>{
                if(res.code === 200){
                    listData.pageData.total =res.data.total
                    listData.pageData.pages =res.data.pages
                    res.data.records.forEach(item => {
                        item.choosed = false
                        item.contentDuration = secondsToTime(item.contentDuration)
                        if(!item.avatarUrl) {
                          item.avatarUrl = require('@/assets/position/listImage.png')
                        }
                        listData.uploaderArr.push(item)
                    });
                }
              })
        }
        
       const refresh = () =>{
            listData.pageData.pn = 1
            listData.pageData.total = null;
            listData.uploaderArr = [];
            ids=[]
            searchData.searchInfo4[0].selectAll = false;
            initList();
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
            searchData.searchInfo4[0].selectAll = false;
        }
       //搜索相关下拉数据
       (async () => {
         searchData.searchInfo1[0].buttonArr =  await addOrEdite.dropDownList()
         searchData.searchInfo1[1].buttonArr =  await addOrEdite.authorDropDownList()
        })();

        //选中up主id
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
                   listData.pageData.authorIds = currIds
                   refresh()
                }else if(type==='class'){
                    if(pitchOn&&pitchOn.clicked){
                        pitchOn.clicked = false;   
                    }else{
                        pitchOn.clicked = true;
                    }
                   let currIds = arr.filter(i=>i.clicked).map(i=>i.id);
                   listData.pageData.categoryIds = currIds
                   refresh()
                }else if(type==='bigenTime'){
                    if(pitchOn){
                     listData.pageData.geCreatedAt = pitchOn[0]
                     listData.pageData.leCreatedAt = pitchOn[1]
                    }else{
                     listData.pageData.geCreatedAt = ''
                     listData.pageData.leCreatedAt =''
                    }
                     refresh()
                }else if(type==='periodTime'){
                    if(pitchOn){
                        listData.pageData.geUpdatedAt = pitchOn[0]
                        listData.pageData.leUpdatedAt = pitchOn[1]
                    }else{
                        listData.pageData.geUpdatedAt =''
                        listData.pageData.leUpdatedAt =''
                    }
                     refresh()
                }else if(type==='watchNumberOfTimes'){
                    listData.pageData.geTimesWatched = pitchOn[0]
                    listData.pageData.leTimesWatched = pitchOn[1]
                    refresh()
                }else if(type==='watchNumberOfPeople'){
                    listData.pageData.geViewers = pitchOn[0]
                    listData.pageData.leViewers = pitchOn[1]
                    refresh()
                }else if(type==='fontSearch'){
                    listData.pageData.kw = pitchOn
                    refresh()
                }else if(type==='fontSearch_disable'){
                    if(ids.length>0){
                        uploaderFns.batchDisable({ids:ids}).then(res=>{
                            if(res.code==200){
                              updateArr(listData.uploaderArr,ids,'disabled')
                            }
                        })
                    }else{
                        ElMessage.warning({
                            message: "请先选择UP主",
                            type: "warning",
                        });
                    }

                }else if(type==='fontSearch_use'){
                      if(ids.length>0){
                        uploaderFns.batchEnable({ids:ids}).then(res=>{
                            if(res.code==200){
                                updateArr(listData.uploaderArr,ids,'use')
                            }
                        })
                      }else{
                        ElMessage.warning({
                            message: "请先选择UP主",
                            type: "warning",
                        });
                    }
                }else if(type==='fontSearch_del'){
                    if(ids.length>0){
                        uploaderFns.batchDel({ids:ids}).then(res=>{
                            if(res.code==200){
                                 listData.uploaderArr = updateArr(listData.uploaderArr,ids,'del')
                            //   listData.uploaderArr = listData.uploaderArr.filter(v => !v.choosed)
                            }
                        })
                    }else{
                        ElMessage.warning({
                            message: "请先选择UP主",
                            type: "warning",
                        });
                    }
                }

                // 全选
                if (pitchOn === true) {
                    ids=[]
                    listData.uploaderArr = listData.uploaderArr.map((item) => {
                    item.choosed = true;
                    ids.push(item.id)
                    return item;
                    });
                } else if (pitchOn === false) {
                    if (listData.uploaderArr.filter((v) => v.choosed === false).length < 1) {
                    listData.uploaderArr = listData.uploaderArr.map((item) => {
                        item.choosed = false;
                        return item;
                    });
                    }
                }
        }
        //新增
        function addUploader(){
             router.push({path: "/homePage/upMain/uploaderAdd"})
        }
        //详情编辑
        function toDetail(item){
            //  router.push({path: "/homePage/upMain/upAddAndEdit",query:{id:item.id,name:'uploader'}})
             router.push({name: "uploaderEdit",params:{id:item.id,name:'uploader'}})
        }
        return{
            ...toRefs(searchData),
            ...toRefs(listData),
            checkBoxChange,
            changedSearchInfo,
            addUploader,
            toDetail,
            initList,
            refresh,
            load,
            avgSplit,
            updateArr,
            loading,
            noMore,
            disabled,
        }
    }

    
}
</script>
<style lang="less" scoped>
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
  .searchRow {
    .mw {
      width: 25vw;
    }
  }
.upSerach{
    display: grid;
    // grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
}

.searchPage:nth-child(2){
  margin:0 auto;
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
.list_box{
   height: calc(100vh - 231px);     
   overflow: auto;

}
.up_list{
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(360px, 390px));
    grid-template-rows: repeat(auto-fit, minmax(220px, 1fr));
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
    .list_item{
        position: relative;
        box-shadow:0 0 15px #D6D7D9;
        margin:30px 30px 0 30px;
        width: 360px;
        display:flex;
        justify-content:flex-start;
        .checkbox{
            display:flex;
            align-items: flex-end;
            margin:0 0 20px 10px;
        }
        .left_imgbox{
            width:160px;
            height:160px;
            margin:20px 8px 20px 10px;
            cursor: pointer;
            .image{
               width:160px;
               height:160px;   
               object-fit: cover;
            }
        }
        .list_disabled{
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            img {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            }
        }
        .uploader_info{
            cursor: pointer;
            text-align:left;
            margin-top: 20px;
            width:160px;
            ul,li{
                font-size:12px;
                color:#939796;
                padding: 0;
                margin: 0;
                list-style: none;
            }
            ul>li:nth-child(1){
                font-size:20px;
                color:#000;
                font-weight: 600;
            }
            ul>li:nth-child(2)>p{
                text-overflow:ellipsis;//超出显示省略号
                overflow:hidden;//超出部分文字隐藏
                white-space:nowrap;//强制不换行
            }
            // .ellipsis{

            // }

        }


    }
    // .forbid::before{
    //     content:' ';
    //     background:url("../../../assets/img/uploader/square_forbidden.png");
    //     background-position: 50% 50%;
    //     width:360px;
    //     height:200px;
    //     position: absolute;
    //     left:-2px;
    //     top:-2px;
    // }

}

  
</style>