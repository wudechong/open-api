import Mock from "mockjs";
if (~window.location.hash.indexOf('usemock')) {
	require('./mock')
}
// Mock.mock(RegExp("^/service/erp/trade/viewAuths$"), "post", require("./service/trade/permission"));
// Mock.mock(RegExp("^/service/erp/trade/dropdown/printStatus$"), "get", require("./service/trade/printStatus"));

// Mock.mock(RegExp("^/service/erp/shop/dropdown/group"), "get", require("./service/trade/shops"));
// Mock.mock(RegExp("^/calf/basic/widget/warehouse/dropdown/group"), "get", require("./service/trade/warehouses"));
// Mock.mock(RegExp("^/service/erp/express/dropdown/get"), "get", require("./service/trade/express"));
// Mock.mock(RegExp("^/service/erp/trade/logisticsTypes$"), "get", require("./service/trade/logisticsTypes"));
// Mock.mock(RegExp("^/service/erp/trade/dropdowm/deliveryRegions$"), "get", require("./service/trade/deliveryRegions"));
// Mock.mock(RegExp("^/service/erp/trade/dropdown/bizType$"), "get", require("./service/trade/bizTypes"));

// Mock.mock(RegExp("^/service/erp/trade/dropdowm/enums/invoiceQueryType$"), "get", require("./service/trade/invoiceTypes"));
// Mock.mock(RegExp("^/service/erp/trade/condition/get"), "get", require("./service/trade/condition"));
// Mock.mock(RegExp("^/service/erp/trade/marktype/mget$"), "get", require("./service/trade/markTypes"));

// Mock.mock(RegExp("^service/erp/trade/v2/query$"), "post", require("./service/trade/query"));
// Mock.mock(RegExp("^/service/erp/trade/biz/queryCount$"), "post", 83627);
// Mock.mock(RegExp("^/service/erp/trade/order/mget"), "get", require("./service/trade/orders"));
// Mock.mock(RegExp("^/service/erp/trade/v2/billingInformation/get"), "get", require("./service/trade/balances"));
// Mock.mock(RegExp("^/service/erp/trade/invoice/get"), "get", require("./service/trade/invoice"));
// Mock.mock(RegExp("^/service/erp/trade/log/get"), "get", require("./service/trade/operateRecords"));

// Mock.mock(RegExp("^/service/erp/goods/category/top"), "get", require("./service/trade/goodsCategoryTop"));
// Mock.mock(RegExp("^/service/erp/goods/category/subs"), "get", require("./service/trade/goodsCategorySub"));
// Mock.mock(RegExp("^/service/erp/goods/select$"), "post", require("./service/trade/goods"));
// Mock.mock(RegExp("^/calf/basic/widget/brand/listBrand$"), "post", require("./service/trade/brand"));
// Mock.mock(RegExp("^/service/erp/trade/v2/get/receiver"), "get", require("./service/trade/receiver"));

// Mock.mock(RegExp("^/service/erp/record/decrypt/query"), "post", require("./service/config/securityCenter-table.json"));
// Mock.mock(RegExp("^/service/erp/record/stream/query"), "post", require("./service/config/flowDetails-table.json"));

