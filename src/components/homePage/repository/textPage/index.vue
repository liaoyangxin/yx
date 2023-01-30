<template>
  <div>
      <template v-if="accountForm.length > 0">
        <div v-for="(item, index) in accountForm" :key="index" class="mb12 pointer gridBox">
          <img src="@/assets/position/text.png" class="imageBox" @click="lookInfo(item)"/>
          <el-row class="infoBox">
            <el-col :span="3">
              <el-checkbox
                class="checkBox"
                v-model="item.choosed"
                @change="
                  (val) => {
                    changeAccountFn(val, index);
                  }
                "
              ></el-checkbox>
            </el-col>
            <el-col :span="21" @click="lookInfo(item)">
              <div style="font-size: 1.2vh" class="overFlowPoint" :title="item.name">
                文件名：{{ item.name }}
              </div>
              <div style="font-size: 1vh">
                创作者：{{ item.authorName ? item.authorName : " " }}
              </div>
              <div style="font-size: 0.8vh">
                创建时间: {{item.createdAt? item.createdAt.split('T')[0]: ''}} <span style="margin-left: 1vw">修改时间: {{item.updatedAt?item.updatedAt.split('T')[0]:''}}</span>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="bottom_style">
          <span v-if="accountTotal === accountForm.length">无更多数据</span>
        </div>
      </template>
    <el-dialog
      v-model="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <div class="markDownBox">
        <article class="markDown_context" v-html="compiledMarkdown"></article>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import marked from 'marked'
import { reactive, toRefs } from "@vue/reactivity";
import * as allFn from './index'
export default {
	props:{
		paramObj: {
			type: Object,
			default: () => {
				return {
					fnName: '',
					fnAttr: {},
				}
			}
		},
    selectAll: {
      type: Boolean,
      default: false,
    },
    invertSelection: {
      // 反选
      type: Boolean,
      default: false,
    },
    defaultSelectIds: {
      type: Array,
      default: () => []
    },
    todoDel: {
      // 执行删除
      type: Object,
      default: () => {
        return {
          fnName: "",
          attr: {},
        };
      },
    },
	},
  setup(props,context) {
		let getParamObj = JSON.parse(JSON.stringify(props.paramObj))
    const data = reactive({
      accountForm: [],
      accountTotal: 0,
      defaultChooseIds: JSON.parse(JSON.stringify(props.paramObj)).chooseIds,
      dialogVisible: false,
      text: '',
    });
		init()
		function init() {
			allFn[getParamObj.fnName](getParamObj.fnAttr).then(res => {
        data.accountForm = []
        res.data.records.map(item => {
          if(data.defaultChooseIds.find(v => v === item.id) !== undefined){
            item.choosed = true
          } else {
            item.choosed = false
          }
        })
				data.accountForm = res.data.records
        data.accountTotal = res.data.total
				context.emit('getTotal', res.data.total)
			})
		}
		
    return {
      ...toRefs(data),
			...toRefs(props),
      ...toRefs(getParamObj),
      init,
    };
  },
  computed: {
    compiledMarkdown() {
      return marked(this.text, {sanitize: false})
    }
  },
  methods: {
    changeAccountFn(val, index){
      this.accountForm[index].choosed = val
      this.$emit("chooseAccount", this.accountForm);
    },
    lookInfo(obj) {
      allFn.textDetails({id: obj.id}).then(res => {
        this.text = res.data.content
        this.dialogVisible = true
      })
      
    }
  },
  watch: {
    paramObj: {
      handler(newVal){
        allFn[newVal.fnName](newVal.fnAttr).then(res => {
          res.data.records.map(item => {
              if(this.defaultChooseIds.length > 0 && this.defaultChooseIds.find(v => v === item.id) !== undefined){
              item.choosed = true
            }
          })
          if (newVal.fnAttr.pn === 1) {
            this.accountForm = res.data.records
          } else {
            this.accountForm = [...this.accountForm, ...res.data.records]
          }
          
          this.accountTotal = res.data.total
          this.$emit('getTotal', res.data.total)
        })
      },
      deep: true
    },
    selectAll(newVal) {
      if (newVal) {
        this.accountForm.map(item => {
          item.choosed = true
        })
      } else {
        this.accountForm.map(item => {
          item.choosed = false
        })
      }
      this.$emit("chooseAccount", this.accountForm);
    },
    invertSelection(newVal) {
      // this.chooseIds = [];
      if (newVal) {
        this.accountForm.map((item) => {
          item.choosed = !item.choosed;
          // item.choosed ? this.chooseIds.push(item.id) : "";
        });
        this.$emit("chooseAccount", this.accountForm);
      } else {
        this.$emit("chooseAccount", this.accountForm);
      }
    },
    todoDel:{
      async handler(newVal) {
        await allFn[newVal.fnName](newVal.attr);
        if (newVal.fnName ==='textBatchDelete') {
          this.defaultChooseIds = []
          this.init()
        }
        
      },
      deep: true
    }
  }
};
</script>
<style lang="less" scoped>
img{
  object-fit:contain;
}
.checkBox{
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.mb12{
	margin-bottom: 1.2vh;
}
.gridBox{
  display: inline-grid;
  margin: 1.6vh;
  .imageBox {
    width: 18vw;
    height: 21vh;
  }
  .infoBox{
    width: 18vw;
  }
}
.markDownBox{
  border: 1px solid #666;
  height: 60vh;
  overflow: hidden;
  overflow-y: auto;
  padding: 0 .5vw 2vh .5vw;
  
}
.context{
img{
    width: 50px;
  }
}
.bottom_style {
  display: flex;
  display: inline-block;
  width: 100%;
  text-align: center;
  span {
    font-size: 1.2vh !important;
    color: #939796;
    line-height: 4vh;
  }
}
</style>
