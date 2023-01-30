import { createStore } from "vuex";
import pageHome from './modals/pageHome.js'
import getters from './getters.js'
const store = createStore({
	// state: {
	// 	count: 1
	// },
	// mutations: {
	// 	COUNT(state, num) {
	// 		state.count = num
	// 	}
	// },
	// actions: {
	// 	setCount({ commit }, num) {
	// 		commit('COUNT', num)
	// 	}
    // }
    modules: {
        pageHome
    },
    getters
})
export default store