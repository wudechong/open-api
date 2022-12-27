import {http} from "calf-vue"

const permission = {
	namespaced: true,
	state: {
		permission: {}
	},
	mutations: {
		setPermission: (state, data) => {
			state.permission = data
		}
	},
	actions: {
		loadPermission: async ({commit}, playload) => {
			const res = await http.post("/service/erp/trade/viewAuths", playload)
            let obj={}
			for (const item of res) {
				obj[item.code] = item.hasAuth
			}
			commit("setPermission", obj)
		}
	}
}

export default permission
