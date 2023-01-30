<template>
<!-- 侧边信息页签 -->
  <div class="subtab">
      <div class='left_label'>
        <div>
            <div class='left_top'>
                <div class='icon'>&nbsp;</div>
                <div class='left_title'  @click="leftImageClick">
                   <img :disabled='disabledState' v-if='currModule=="uploader"' :src="basicInfo.avatarUrl?basicInfo.avatarUrl:require('@/assets/img/uploader/up_avtar.png')" style='width:8.33vw;height:8.33vw;object-fit: cover;'>
                   <img :disabled='disabledState' v-else :src="basicInfo.imageUrl?basicInfo.imageUrl:require('@/assets/img/uploader/up_avtar.png')" style='width:8.33vw;;height:8.33vw;object-fit: cover;'>
                   <img v-if='disabledState' class='left_title_disabled'  src='@/assets/img/uploader/disable303.png' >
                </div>
            </div>
            <ul class='left_middle' v-if='currModule=="uploader"'>
              <li>电子邮箱：<p><el-input v-model="basicInfo.email" @blur="blur()" :disabled='disabled' size='mini' class='edit'/></p></li>
              <li>联系电话：<p><el-input v-model="basicInfo.contactNumber" @blur="blur()" :disabled='disabled' size='mini' class='edit'/></p></li>
              <li>微信：<p><el-input v-model="basicInfo.wechat" @blur="blur()" :disabled='disabled' size='mini' class='edit'/></p></li>
            </ul>
            <ul class='left_middle' v-else-if='currModule=="classify"'>
              <li>分类名称：<p><el-input v-model="basicInfo.name" @blur="blur()" :disabled='disabled' size='mini' class='edit' clearable/></p></li>
              <li>分类别名：<p><el-input v-model="basicInfo.alias" @blur="blur()"  :disabled='disabled' size='mini' class='edit'  placeholder='请输入字母和数字' clearable/></p></li>
            </ul>
            <ul class='left_middle' v-else-if='currModule=="special"'>
              <li>专题名称：<p><el-input v-model="basicInfo.name" @blur="blur()" :disabled='disabled' size='mini' class='edit'/></p></li>
              <li>专题别名：<p><el-input v-model="basicInfo.alias" @blur="blur()" :disabled='disabled' size='mini' class='edit' placeholder='请输入字母和数字'/></p></li>
            </ul>
        </div>
        <div class='left_icons'>
            <!-- <img src="../assets/img/search/disable.png" @click="iconBtn('forbidden')"/><br/> -->
            <el-tooltip content="删除" effect="light" placement="right">
              <img src="@/assets/img/search/del.png" @click="iconBtn('delete',basicInfo)"/>
            </el-tooltip><br/>
            <!-- <el-tooltip :content="basicInfo.state==1?'禁用':'启用'" effect="light" placement="right">
              <img :src="basicInfo.state==1?require('@/assets/img/search/disable.png'):require('@/assets/img/search/used.png')" @click="iconBtn(basicInfo.state,basicInfo)"/>
            </el-tooltip><br/> -->
            <el-tooltip :content="basicInfo.state==-1?'启用':'禁用'" effect="light" placement="right">
              <img :src="basicInfo.state==-1?require('@/assets/img/search/used.png'):require('@/assets/img/search/disable.png')" @click="iconBtn(basicInfo.state,basicInfo)"/>
            </el-tooltip><br/>
            <img src="@/assets/img/uploader/balck8.png"  @click="back"/>
        </div>
      </div>
  </div>
     <el-drawer
      v-if="showAddVideo"
      v-model="showAddVideo"
      :destroy-on-close="true"
      direction="rtl"
      size="65%;"
      :with-header="false"
      :show-close="false"
      :before-close="drawerClose"
    >
      <div style="margin: 50px 90px 0px 90px">
        <VideoImageList
          :paramObj="paramObj"
          :showTitleIcon="false"
          :rowNumber="3"
          @chooseAccount="chooseAccount"
        ></VideoImageList>
      </div>
    </el-drawer>
</template>

<script>
import VideoImageList from "@/components/public/videoImageList/index/index.vue";
import { useRouter } from "vue-router";
import {toRefs,reactive} from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
export default {
  name: 'subtab',
  components: { VideoImageList },
  emits: ['blur','deleteIcon'],
  props:{
    isDetail:{
        type: Boolean,
        required: true,
    },
   basicInfo:{
        type: Object,
        required: true,
    },
   currModule:{
        type: String,
        required: true,
    },
   disabled:{
        type: Boolean,
        required: true,
    },
   disabledState:{
        type: Boolean,
        required: true,
    },
  },
  setup (props, {emit}) {
        const data = reactive({
          //  basicInfo:props.basicInfo,
           showAddVideo: false,
           titleInputType:"url",
            paramObj: {
              chooseIds: [],
              pageType: "video",
              funFormName: "videoPage", // 在组件中获取数据的方法名称
              titleInputType: "search",
              funFormAttr: {
                duration: null,
                geCreateAt: "",
                leCreateAt: "",
                kw: "",
                pn: 1,
                ps: 11,
                size: null,
                idDesc:true
              },
            },
          });

        //点击显示图片列表
        const leftImageClick = () => {
            if(props.disabled&&props.disabledState){
                      ElMessage.error('请先输入证件号码！')
              }else{
                data.showAddVideo = true;
                data.paramObj.pageType = 'image'
                data.paramObj.funFormName = 'imagePage'
                if(props.currModule==='uploader'){
                    data.paramObj.chooseIds = [props.basicInfo.avatarId]
                }else{
                  data.paramObj.chooseIds = [props.basicInfo.imageId]
                }
            }
          }
          //选中上传图片
          const chooseAccount = (obj) => {
            if(props.currModule==='uploader'){
              props.basicInfo.avatarUrl = obj.accessPath
              props.basicInfo.avatarId = obj.id
            }else{
              props.basicInfo.imageUrl = obj.accessPath
              props.basicInfo.imageId = obj.id
            }
             emit('blur', props.basicInfo)
          }
          const drawerClose = () => {
            data.showAddVideo = false;
          };

        const router = new useRouter();
        let pathname = window.location.pathname
        let tmpArr = pathname.split("/")
        let curPage = '/homePage/'+tmpArr[2]
        //返回
        const back=()=>{
            router.push(curPage)
        }
        //input框失焦保存
        function blur(value){
          emit('blur', props.basicInfo)
        }
        //禁用删除图标
        function iconBtn(value,obj){
          if(value=='delete'){
              ElMessageBox.confirm(
                  showDelMessage(),
                  '删除',
                  {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true,
                  }
                )
                  .then(() => {
                    emit('deleteIcon', value,obj)
                  })
                  .catch(() => {
                    // ElMessage({
                    //   type: 'info',
                    //   message: '已取消',
                    // })
              })
          }else{
             emit('deleteIcon', value,obj)
          }

        }

        const showDelMessage = ()=>{
          if(props.currModule=='uploader'){
                return'是否确认删除该UP主?'
          }else if(props.currModule=='classify'){
                return'是否确认删除该分类?'
          }else{
                return'是否确认删除该专题?'
          }

        }
        return{
            ...toRefs(data),
            chooseAccount,
            back,
            iconBtn,
            blur,
            drawerClose,
            leftImageClick,
            showDelMessage
        }
  }

}
</script>

<style scoped lang="less">
:deep(.el-input--mini){
    height: 1.45833vw;
    line-height: 1.45833vw;
}
.edit :deep(.el-input__inner){
    background-color:#EEEEEF;
    height: 1.45833vw;
    line-height: 1.45833vw;
}
.edit :deep(.el-input__inner:focus){
    border-color:#EEEEEF;
}
.edit :deep(.el-input__inner:hover){
    border-color:#EEEEEF;
}
  .left_label{
      height:calc(100vh - 60px);
      min-width:15.625vw;
      background-color: #fff;
      box-shadow: #d1d1d1 0px 0px 10px;
      display: flex;
      flex-direction: column;
      // flex-wrap: wrap;
      justify-content:space-between;
        .left_top{
            .icon{
              width:20px;
              background-color: #ccc;
              text-align: center;
              margin:20px auto;
              font-size: 16px;
              border-radius: 50%;
            }
            .left_title{
              width:8.33vw;
              height:8.33vw;
              margin:40px auto;
              position: relative;
              .left_title_disabled{
                        position: absolute;
                        width:8.33vw;
                        height:8.33vw;
                        top:0;
                        left:0;
              }
            }
        }
      .left_middle{
          width:8.85vw;
          height:14vh;
          margin:0px auto;
          font-size:0.83vw;
          color: #2c3e50;
          li>p{
            font-size:0.83vw;
             background-color: #D2D2D2;
            text-align: center;
            margin:5px 0;
          }
      }
      .left_icons{
          text-align: right;
          height:22vh;
          margin:1.04167vw;
          img{
            cursor: pointer;
            margin:0.78125vw;
          }

      }
  }

</style>
