<template>
<!-- 分类主页 -->
    <!-- <ListOfWorks :isDetail='true' :type='type'></ListOfWorks> -->
       <HomeList :isDetail='true' :type='type'></HomeList>
</template>
<script>
import HomeList from "@/components/public/HomeList";
import { reactive,toRefs } from 'vue'

export default {
  components:{
    HomeList,
  },
  setup (){
    const info =reactive({
        type:{
           showType:'categoryList',
          //  authorIds:[],
        },
    })

    return{ 
      ...toRefs(info)
    }
  }
}
</script>
<style lang="less" scoped>
.HomeList{
    width:100%;
    height:100%;
    :deep(.search){
        height:200px;
        margin:0px 20px 0px 0;
        display:flex;
        justify-content:flex-end;
    }
    :deep(.list_box){
        height: calc(100vh - 260px);  
        .pro_list{
          //  grid-template-columns: repeat(auto-fit, minmax(360px,392px));
           grid-template-columns:repeat(4, 1fr);
           justify-items:center;
        }   
   }
}
@media screen and (max-width: 1680px) {
  .HomeList{
    :deep(.list_box){
        .pro_list{
           grid-template-columns:repeat(3, 1fr);
        }  
   }
  }
}
</style>