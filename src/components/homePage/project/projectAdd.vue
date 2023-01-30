<template>
  <div class='project_detail'>
       <SubTab :basicInfo='basicInfo' :disabled='disabled' :disabledState='disabledState' :currModule='currModule' @deleteIcon="deleteIcon"  @blur="blur"></SubTab>
      <div class='right_tabs'>
          <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
            <!-- 基本信息 -->
              <el-tab-pane  name="first">
                <template #label>
                  <img src='@/assets/img/uploader/GS.png'>
                </template>
                <Summarize :isDetail='false' :basicInfo='basicInfo'></Summarize>
              </el-tab-pane>
              <!-- 作品 -->
              <el-tab-pane  name="second">
                <template #label>
                   <img src='@/assets/img/uploader/zp.png'>
                </template>
                <div>无</div>
              </el-tab-pane>
              <!-- 图形 -->
              <el-tab-pane name="third">
                <template #label >
                   <img src='@/assets/img/uploader/tj.png'>
                </template>
                <div>无</div>
              </el-tab-pane>
          </el-tabs>
           
      </div>
  </div>
</template>

<script>
import {reactive,ref,toRefs} from 'vue'
import SubTab from "@/components/public/SubTab";
import Summarize from "@/components/public/Summarize";
import * as projectFns from './project'
import { useRouter } from "vue-router";
import { ElMessage } from 'element-plus'

export default {
  name: '',
  components:{
    SubTab,
    Summarize,
  },
  setup(props,context){
    let activeName = ref('first')
    let isDetail=ref(false);
    const data = reactive({
        currModule:'special',
        disabled:false,
        disabledState:false,
        basicInfo:{
        }
    })
    const router = new useRouter();
    //侧边禁用、启用、删除
    const deleteIcon = (e,obj) => {
      let ids = []
      ids.push(obj.id)
      if(e==1){//当前启用
         projectFns.batchDisable({ids:ids}).then(res=>{
              if(res.code==200){
                  data.basicInfo.state = -1
                  data.disabledState = true
              }
        })
      }else if(e==-1){//当前禁用
          projectFns.batchEnable({ids:ids}).then(res=>{
              if(res.code==200){
                  data.basicInfo.state = 1
                  data.disabledState = false
              }
        })
      }else{//删除
        if(obj.id){
          projectFns.batchDel({ids:ids}).then(res=>{
              if(res.code==200){
                router.push({path: "/homePage/project"})
              }
          })
        }else{
           ElMessage.error('请先新增专题!')
        }
      }
    }
    //基本信息失焦保存
    function blur(value) {
      value = JSON.parse(JSON.stringify(value));
      delete value["state"];
      if(Object.keys(value).length!=0){
        projectFns.subjectAddAndEdit(value).then(res=>{
          if(res.data){
              data.basicInfo.id = res.data.id
              data.basicInfo.state = res.data.state
          }
        })
      }
    }
    function handleClick(tab, event) {
       activeName = tab.props.name
    }
     return{
       ...toRefs(data),
       isDetail,
      activeName,
      deleteIcon,
      handleClick,
      blur,
      

     }
  },

}
</script>

<style lang="less"  scoped>
.project_detail{
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

