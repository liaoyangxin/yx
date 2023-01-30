const pageHome = {
	state: {
		urlTitle: '', // 分享链接的title
	},
	mutations: {
		SET_DO_INIT(state, urlTitle) {
			state.urlTitle = urlTitle
		},
	},
	actions: {
		setDoInIT({commit}, urlTitle) {
            console.log('doInit', urlTitle)
			commit('SET_DO_INIT', urlTitle)
		}
	}
}
 
export default pageHome