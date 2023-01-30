import { createStore } from 'vuex'

import * as addOrEditeFns from "@/components/homePage/account/addOrEdite/addOrEdite.js"
export default createStore({
  state: {
    vuexRightPObj: {}
  },
  mutations: {
    getVuexRightPObj(state, newVal) {
      state.vuexRightPObj = newVal
    }
  },
  actions : {
    setVuexRightPObj(context, newVal){
      context.commit('getVuexRightPObj', newVal)
    },
    getVuexRightPObjContent(context,obj){
      return new Promise((reslove)=>{
        addOrEditeFns.infoFlowDetails({ id: obj.id }).then(res => {
          const infoObj = Object.assign(this.state.vuexRightPObj,{content: res.data.content},{infoId:obj.id, infoTab: res.data.type, iwpostId: res.data.iwpostId})
          context.commit('getVuexRightPObj', infoObj)
          reslove(infoObj)
        })
      })
    }
  }
})
