import { http } from "calf-vue";

const api = {
	/** 买家ID/收件人/线上单号/系统单号 */
	bizCode() {
		return http.get("/service/erp/trade/dropdown/bizCode");
	},

	/** 订单类型 */
	bizType() {
		return http.get("/service/erp/trade/dropdown/bizType");
	},

	/** 订单状态 */
	tradeStatus() {
		return http.get("/service/erp/trade/dropdowm/enums/query/tradeStatus");
	},

	/** 操作员 */
	operator(query) {
		return http.post("/service/erp/user/operator/dropdown", {
			keyword: "",
		});
	},

	/** 打印状态 */
	printStatus() {
		return http.get("/service/erp/trade/dropdown/printStatus");
	},

	/** 打印模板 */
	printData() {
		return http.post("/service/erp/print/printData/get", undefined, {silence: true});
	},
	/** 获取快递承运商 */
	expressCarrier() {
		return http.get("/service/erp/express/carrier/dropdown/get")
	},

	/** 配送区域 */
	deliveryRegions() {
		return http.get("/service/erp/trade/dropdowm/deliveryRegions");
	},

	/** 配送方式 */
	logisticsTypes() {
		return http.get("/service/erp/trade/logisticsTypes");
	},

	/** 省份 */
	provinces(type = 1, code = "") {
		// if (document.location.href.indexOf("erp-oms") < 0) {
		// 	return http.get("/service/register/address", {type, code})
		// } else {
		return http.get("/service/address/byType/region", { type, code });
		// }
	},

	/** 时间类型 */
	timeTypes() {
		return http.get("/service/erp/trade/dropdown/timeTypes");
	},

	/** 业务员 */
	salesman(query = {}) {
		return http.post("/service/erp/user/salesman/dropdown", query);
	},

	/** 店铺（分组)  不维护了*/
	shopGroup(params) {
		return http.get("/service/erp/shop/dropdown/group", {
			exporting: false,
			status: 1,
			...params,
		});
	},

	/** 店铺（下拉) 不维护了 */
	shopList(params) {
		return http.get("/service/erp/shop/dropdown/mget", params);
	},
	/** calf店铺（下拉) */
	cShopGroup(params) {
		return http.get("/calf/basic/widget/shop/dropdown/group", {
			status: 1,
			...params,
		});
	},
	/** 系统店铺（下拉) */
	listAuth() {
		return http.post("/calf/basic/widget/shop/listAuth", {
			shopType: "0"
		})
	},

	/** 仓库列表（分组) */
	warehouseGroup() {
		return http.get("/calf/basic/widget/warehouse/dropdown/group");
	},

	/** 仓库列表 */
	warehouse() {
		return http.get("/service/erp/warehouse/dropdown/get");
	},

	/** 订单标记 */
	markTypes() {
		return http.get("/service/erp/trade/marktype/mget");
	},

	/** 快递下拉 */
	express(type = 0, limit = false) {
		return http.get("/service/erp/express/dropdown/get", { type, limit }); // 0:全部，1:内贸，2:外贸
	},

	// 员工管理快递下拉框
	cExpressDropdown() {
		return http.get("/calf/basic/widget/express/dropdown/get");
	},

	/** calf快递下拉 */
	cExpress() {
		return http.get("/calf/basic/widget/express/query");
	},

	/** 品牌 */
	brand() {
		return http.post("/calf/basic/widget/brand/listBrand", {});
	},

	/** 分销商下拉 */
	distList() {
		return http.get("/service/erp/operator/distributor/list");
	},

	/** 单品种类 */
	goodsTypes() {
		return http.get("/service/erp/trade/dropdown/goodsTypes");
	},

	/** 异常列表 */
	errorList() {
		return http.get("/service/erp/trade/errortype/mget");
	},

	/** 发票类型 */
	invoiceTypes() {
		return http.get("/service/erp/trade/dropdowm/enums/invoiceQueryType");
	},

	/** 单据列表 */
	gbillTypes() {
		return http.get("/service/erp/exchange/dropdown/exchangeType");
	},

	/** 地址 */
	address() {
		return http.get("/service/address/getRegions");
	},
	/** 获取用户信息 */
	userInfo() {
		return http.get("/service/erp/user/currentUser");
	},
	/**
	 * 下载并关联
	 * @param {*} tradeID
	 * @param {*} orderID
	 */
	linkOrderGoods(tradeID, orderID) {
		return http.postFormData("post", "/service/erp/trade/linkOrderGoods", {
			tradeID: tradeID,
			orderID: orderID,
		});
	},

	/** 地区 */
	region() {
		return http.get("/calf/basic/widget/region/tree");
	},

	/** 收支账户 */
	account() {
		return http.get("/calf/basic/widget/finance/query");
	},

	/** 仓库打回原因 */
	backMarkList() {
		return http.get("/service/erp/trade/marktype/reason/get");
	},

	/** 供应商 */
	supplier() {
		return http.post("/calf/basic/widget/supplier/query", {
			pageNo: 1,
			pageSize: 1000,
			statuses: ["1"],
		});
	},

	/** 获取操作权限 */
	operationPermission() {
		return http.get("/calf/basic/widget/permission/getOperation");
	},

	/**获取数据权限 */
	getDataPermission() {
		return http.get("/calf/basic/widget/permission/getDataPermission");
	},

	/** 是否管理员 */
	isAdmin() {
		return http.get("/calf/basic/widget/permission/check/doc");
	},

	// 全部商品分类
	goodsCategory() {
		return http.get("/service/erp/goods/category/all", { topID: -2 });
	},

	// 国家
	erpCountry() {
		return http.get("/calf/basic/widget/region/country");
	},

	/** 角色 */
	roleList() {
		return http.get("/service/erp/operator/roles");
	},
	/** 发票信息 */
	invoiceList() {
		return http.get("/service/erp/trade/dropdowm/enums/invoiceQueryType");
	},
	/**获取路由信息 */
	routerInfo() {
		return http.get("/service/erp/disassembleTrade/query/urls");
	},
	/**获取操作员 */
	operationList() {
		return http.get("/service/erp/user/getAllOperation");
	},
	// 获取库存小数位
	occupyDecimal() {
		return http.get('/service/erp/trade/v2/ui/config',undefined,{ silence: true })
	},
	/** 获取客户 */
	customList(data) {
		return new Promise(async resolve => {
			const res = await http.post("/service/erp/custom/query", data);
			resolve(res.$data)
		})
	},
	/** 店铺平台查询 */
	shopType() {
		return http.post("/calf/basic/widget/shop/shopTypes");
	},
	// 查询金额保留小数精度
	pricePrecision () {
		return http.get('/calf/basic/widget/decimal/get',undefined,{ silence: true })
	},
};

export default api;
