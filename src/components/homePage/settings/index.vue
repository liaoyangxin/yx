// 设置菜单
<template>
  <div>
    <div class="iconBox pointer" v-if="!componentName">
        <el-popover v-for="(item, index) in iconArr" :key="index" placement="bottom" width="auto" trigger="hover" :content="item.title">
          <template #reference>
            <img
              :src="item.iconUrl"
              @click="clickIcon(item)"
            />
          </template>
        </el-popover>
    </div>
    <component
      :is="componentName"
    >
    </component>
  </div>
</template>
<script>
import { reactive, toRefs } from "@vue/reactivity";
import setPwd from './setPwd.vue'
export default {
  components: { setPwd },
  setup() {
    const data = reactive({
      iconArr: [
        {
          title: '安全设置',
          iconUrl: require('@/assets/img/setting.png'),
          code: 'setPwd'
        }
      ],
      showPage: 'index',
      componentName: '' 
    });
    return {
      ...toRefs(data),
    };
  },
  methods: {
    clickIcon(obj) {
      this.componentName = obj.code
      console.log('obj', obj)
    }
  }
};
</script>
<style lang="less" scoped>
.iconBox {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
