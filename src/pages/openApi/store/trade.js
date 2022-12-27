const common = {
  	namespaced: true,
  	state: {
        supplierList: [], // 供应商
		supplierGroupList: [], // 供应商分组
		salesmanList: [], // 业务员
		warehouseList: [], // 仓库
  	},

  	mutations: {
		SET_SUPPLIER: (state, { res = [], once }) => {
			state.supplierList = res;
			state.supplierList_once = once;
		},
		SET_SUPPLIERGROUP: (state, { res = [], once }) => {
			state.supplierGroupList = res;
			state.supplierGroupList_once = once;
		},
		SET_SALESMAN: (state, { res = [], once }) => {
			state.salesmanList = res;
			state.salesmanList_once = once;
		  },
		SET_WAREHOUSE: (state, { res = [], once }) => {
			state.warehouseList = res;
			state.warehouseList_once = once;
		},
	}
}

export default common;
