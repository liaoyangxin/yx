<template>
  <div class='up_detail'>
       <SubTab :basicInfo='basicInfo' :isDetail='true' :disabled='disabled' :disabledState='disabledState' :currModule="currModule" @deleteIcon="deleteIcon"  @blur="blur"></SubTab>
      <div class='right_tabs'>
          <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
            <!-- 基本信息 -->
              <el-tab-pane  name="first">
                <template #label>
                  <img src='@/assets/img/uploader/GS.png'>
                </template>
                <BasicDesc :isDetail='true' :disabled='disabled' :disabledState='disabledState' :basicInfo='basicInfo'  @blur="blur"></BasicDesc>
              </el-tab-pane>
              <!-- 作品 -->
              <el-tab-pane  name="second">
                <template #label>
                   <img src='@/assets/img/uploader/zp.png'>
                </template>
                <ListOfWorks ref="listRef" :isDetail='true' :disabledAdd='disabledState' :type='type' v-if='activeName=="second"'></ListOfWorks>
              </el-tab-pane>
              <!-- 图形 -->
              <el-tab-pane name="third">
                <template #label >
                   <img src='@/assets/img/uploader/tj.png'>
                </template>
                <Statistics  :isDetail='true' v-if="activeName=='third'"></Statistics>
              </el-tab-pane>
          </el-tabs>
      </div>
  </div>
</template>

<script>
import {reactive,ref,toRefs} from 'vue'
import SubTab from "@/components/public/SubTab";
import ListOfWorks from "@/components/public/ListOfWorks";
import Statistics from "@/components/public/Statistics";
import BasicDesc from "@/components/homePage/upMain/BasicDesc";
import * as uploaderFns from './uploader'
import { useRoute,useRouter } from "vue-router";
import { ElMessage } from 'element-plus'
import { secondsToTime } from "@/api/public/index";
export default {
  name: '',
  components:{
    SubTab,
    BasicDesc,
    ListOfWorks,
    Statistics
  },
  setup(props,context){
    const listRef = ref(null)
    let activeName = ref('first')
    const data = reactive({
        type:{
           showType:'works',//listofwork展示作品
           curPage:activeName
        },
        disabled:false,
        disabledState:true,
        currModule:'uploader',
        basicInfo:{
        }
    })
    const router = new useRouter();
    const route = new useRoute();
    if(route.params&&route.params.id){//详情界面
      //查询详情
      uploaderFns.autherDetail(route.params.id).then(res=>{
        if(res.code==200){
          data.basicInfo = res.data
          data.basicInfo.createdAt = res.data.createdAt?res.data.createdAt.split('T')[0]:''
          data.basicInfo.contentDuration = secondsToTime( data.basicInfo.contentDuration)
          data.basicInfo.musicDuration = secondsToTime( data.basicInfo.musicDuration)
          data.basicInfo.wordDuration = secondsToTime( data.basicInfo.wordDuration)
          data.basicInfo.imageDuration = secondsToTime( data.basicInfo.imageDuration)
          if(res.data.state==-1){
            data.disabledState =true
          }else{
            data.disabledState = false
          }
        }
      })
    }
    function handleClick(tab, event) {
       activeName = tab.props.name
    }
    //禁用、启用、删除
    const deleteIcon = (e,obj) => {
      let ids = []
      ids.push(obj.id)
      if(e==1){//当前启用
         uploaderFns.batchDisable({ids:ids}).then(res=>{
              if(res.code==200){
                  data.basicInfo.state = -1
                  data.disabledState = true;
                  listRef.value.refresh();
              }
        })
      }else if(e==-1){//当前禁用
          uploaderFns.batchEnable({ids:ids}).then(res=>{
              if(res.code==200){
                  data.basicInfo.state = 1
                   data.disabledState = false;
                   listRef.value.refresh();
              }
        })
      }else{//删除
        if(obj.id){
          uploaderFns.batchDel({ids:ids}).then(res=>{
              if(res.code==200){
                router.push({path: "/homePage/upMain"})
              }
          })
        }else{
           ElMessage.error('请先新增up主!')
        }
      }
    }
    //基本信息失焦保存
    function blur(value) {
        if( Object.keys(value).length!=0){
          uploaderFns.autherAddAndEdit(value).then(res=>{
            if(res.data){
              data.basicInfo.id = res.data.id
              data.basicInfo.state = res.data.state
            }
          })
        }
    }

     return{
       ...toRefs(data),
      activeName,
      deleteIcon,
      handleClick,
      blur,
      listRef
     }
  },

}
</script>

<style lang="less"  scoped>
.up_detail{
  height:calc(100vh - 60px);  
  // height:100%;  
  display: flex;
  padding:30px;
  background-color:#F7F7F7;
  .right_tabs{
      width:100%;
       height:calc(100vh - 60px);  
      margin-left:38px;
     .production{
          width:100%;
          height:100%;
         .search{
            height:200px;
            margin:60px 50px 50px 0;
            display:flex;
            justify-content:flex-end;
         }
        // :deep(.pro_list){
        //     // display: grid;
        //     grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
        //     justify-items:center;
        //     height:calc(100% - 310px);
        //     overflow:scroll;
        // }
     }
     :deep(.el-tabs){
        height:calc(100vh - 60px);  
     }
      :deep(.el-tabs__header){
        margin:0;
      }
      :deep(.el-tabs__nav .is-top){
        width:160px;
        height:80px;
        line-height:80px;
        background-color:#fff;
        box-shadow: 5px 0 5px #E4E4E4,
                      0 -5px 5px #E4E4E4;
      }
      :deep(.el-tabs--card>.el-tabs__header .el-tabs__nav){
        border:none;
        
      }
      :deep(.el-tabs--card>.el-tabs__header .el-tabs__item){
          border-color: #e4e7ed;
          text-align:center;
          padding-top:15px;
          color:rgb(88, 88, 88);

        }
      :deep(.el-tabs__content){
         height:calc(100vh - 140px);  
        background-color:#fff;
        box-shadow: 2px 2px 20px #E4E4E4;
      }
      :deep(.el-tab-pane){
         height:calc(100vh - 140px) ;
      }
      :deep(.el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active){
         border-bottom:none;
      }

      :deep(.el-tabs--card>.el-tabs__header .el-tabs__item.is-active){
          border-bottom-color: #fff;
      }
  }
}

 
</style>

