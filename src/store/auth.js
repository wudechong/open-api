const auth = {
	namespaced: true,

	state: {
		showSensitiveData: false, // 查看敏感信息
		userInfo: {} // 用户信息
	},

	mutations: {
		setShowSensitiveData: (state, data) => {
			state.admin = data
		},
		setUserInfo: (state, data) => {
			state.userInfo = data
		}
	}
}

export default auth