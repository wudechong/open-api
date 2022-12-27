<template lang="pug">
	.contains
		//- header
			el-select(v-model="type" placeholder="请选择" size="medium" @change="typeChange(val)")
				el-option(v-for="item in options" :key="item.value" :label="item.label" :value="item.value")
		main
			label.title 三方系统对接
			el-tree.tree-bg(ref="systemTree" node-key="value" :data="systemData" :props="defaultProps" highlight-current @node-click="chooseApi")
			label.title 自有商城对接
			el-tree.tree-bg(:data="shopData" :props="defaultProps" highlight-current @node-click="chooseApi")
					
      
</template>

<script>

export default {
	components: {},
	props: {},
	mixins: [],
	data() {
		return {
			type: '',
			options: [
				{value: '1',label: 'ERP'}, 
				{value: '2',label: 'OMS'}, 
				{value: '3',label: 'BI'} 
			],
			systemData: [
						 {value: '169771397576914115', label: '采购', children: [
							{value: '169771397576914115/369408446229959149/采购', label: 'erp/purchase/purchasereturnbill/close'},
							{value: '169771397576914115/369408446229959150/采购', label: 'erp/purchase/purchasebill/close'},
							{value: '169771397576914115/369408446229959151/采购', label: 'erp/purchase/purchasebill/stockin/count/query'},
							{value: '169771397576914115/369408446229969007/采购', label: 'erp/purchase/purchasebill/approve'},
							{value: '169771397576914115/400058224244759223/采购', label: 'erp/purchase/purchasebill/add'},
							{value: '169771397576914115/400058224244759224/采购', label: 'erp/purchase/purchasebill/update'},
							{value: '169771397576914115/400058674563159224/采购', label: 'erp/purchase/purchaseBillReturn/update'},
							{value: '169771397576914115/458890603097235239/采购', label: 'erp/purchase/purchasebill/query'},
							{value: '169771397576914115/460704957454059265/采购', label: 'erp/purchase/purchasereturnbill/add'},
							{value: '169771397576914115/461005456112081795/采购', label: 'erp/purchase/purchasebill/stockin/query'},
							{value: '169771397576914115/502109867234894987/采购', label: 'erp/purchase/purchasereturnbill/query'},
							{value: '169771397576914115/556278844105607012/采购', label: 'erp/purchase/purchasestockbill/add'},
							{value: '169771397576914115/569478623438619291/采购', label: 'erp/purchase/purchasebill/stockout/query'},
							{value: '169771397576914115/573943601056966632/采购', label: 'erp/purchase/purchasestockbackproductbill/add'}
							]
						 },
						 {value: '215049398424697496', label: '商品', children: [
							{value: '215049398424697496/173812354021814672/商品', label: '/erp/goods/query/olngoods'},
							{value: '215049398424697496/176101762750313326/商品', label: '/erp/goods/add/goodspackage'},
							{value: '215049398424697496/1761017627509229901/商品', label: '/erp/goods/item/bom/update'},
							{value: '215049398424697496/271832050430666528/商品', label: '/erp/goods/query/goodspackage'},
							{value: '215049398424697496/673949850831829636/商品', label: '/erp/goods/update/goodspackage'},
							{value: '215049398424697496/676664580630525341/商品', label: '/erp/goods/catagory/query'},
							{value: '215049398424697496/762652706676164835/商品', label: '/erp/goods/query/goodspackages'}
							]
						 },
						 {value: '356351257821045226', label: '库存', children: [
							{value: '356351257821045226/10470596507755555/库存', label: 'erp/open/inventory/inventorycheckbill/add'},
							{value: '356351257821045226/108277283805075024/库存', label: 'erp/stock/out/requestbill/add'},
							{value: '356351257821045226/206664577229197656/库存', label: 'erp/sn/querytrace'},
							{value: '356351257821045226/265059882712608769/库存', label: 'erp/stock/in/requestbill/add'},
							{value: '356351257821045226/269777824582630864/库存', label: 'erp/allocation/changebill/add'},
							{value: '356351257821045226/276247479662833616/库存', label: 'erp/stock/in/requestbill/query'},
							{value: '356351257821045226/450000532560514733/库存', label: 'erp/open/inventory/items/get/by/modifytime'},
							{value: '356351257821045226/450000532560514734/库存', label: 'erp/open/inventory/stream/query'},
							{value: '356351257821045226/450000532560514736/库存', label: 'erp/open/inventory/uploadinventory/deduct'},
							{value: '356351257821045226/469480715289088018/库存', label: 'erp/allocation/changebill/close'},
							{value: '356351257821045226/476064672740685509/库存', label: 'erp/open/inventory/syn'},
							{value: '356351257821045226/567110450451362715/库存', label: 'erp/sn/querysnbybillcode'},
							{value: '356351257821045226/602050811249697932/库存', label: 'erp/stock/in/requestbill/close'},
							{value: '356351257821045226/669489201320193734/库存', label: 'erp/stock/in/stockbill/add'},
							{value: '356351257821045226/700190918879971951/库存', label: 'erp/open/inventory/inventorycheckbill/query'},
							{value: '356351257821045226/759081979355691294/库存', label: 'erp/allocation/changebill/query'},
							{value: '356351257821045226/769409847133645305/库存', label: 'erp/allocation/in/changebill/query'},
							{value: '356351257821045226/871951207192625457/库存', label: 'erp/stock/in/stockbill/query'},
							{value: '356351257821045226/901575153007263594/库存', label: 'erp/stock/out/stockbill/query'},
							{value: '356351257821045226/901578956231475215/库存', label: 'erp/stock/product/out/bill/query'},
							{value: '356351257821045226/901578956231475216/库存', label: 'erp/stock/product/in/bill/query'},
							{value: '356351257821045226/908282050419434659/库存', label: 'erp/stock/out/requestbill/close'},
							{value: '356351257821045226/919169589927395078/库存', label: 'erp/stock/out/requestbill/query'},
							{value: '356351257821045226/973941961903578947/库存', label: 'erp/allocation/out/changebill/query'},
							{value: '356351257821045226/976604106677589605/库存', label: 'erp/stock/out/stockbill/add'},
							{value: '356351257821045226/990722824582630864/库存', label: '/erp/allocation/out/transfer/create'},
							{value: '356351257821045226/99072288990077330864/库存', label: '/erp/allocation/in/transfer/create'}
							]
						 },
						 {value: '378234837450191186', label: '售后', children: [
							{value: '378234837450191186/12345678208990722/售后', label: '/erp/open/return/order/oln/return/query'},
							{value: '378234837450191186/3a7fce4c748911ed801b/售后', label: '/erp/open/return/order/update/return/head'},
							{value: '378234837450191186/567125761144969896/售后', label: 'erp/open/return/order/list'},
							{value: '378234837450191186/567125761144969898/售后', label: 'erp/open/return/order/exchange/save'},
							{value: '378234837450191186/567125761149907221/售后', label: '/erp/open/return/order/close'},
							{value: '378234837450191186/572196571595552471/售后', label: '/erp/open/return/order/oln/query'},
							{value: '378234837450191186/573708265887927783/售后', label: 'erp/sale/stock/in/add'},
							{value: '378234837450191186/809194405658573253/售后', label: 'erp/sale/stock/in/query'},
							{value: '378234837450191186/860702732220354879/售后', label: 'erp/open/return/order/stock/in'}
							]
						 },
						 {value: '406602329304549469', label: '基础信息', children: [
							{value: '406602329304549469/175691525615758546/基础信息', label: 'erp/base/supplier/modify'},
							{value: '406602329304549469/467772411033139769/基础信息', label: 'erp/b2b/distr/query'},
							{value: '406602329304549469/574012557544625891/基础信息', label: 'erp/base/storage/query'},
							{value: '406602329304549469/574012559907221985/基础信息', label: '/erp/base/shop/page/get'},
							{value: '406602329304549469/608927477722185596/基础信息', label: 'erp/batch/billbatch'},
							{value: '406602329304549469/701993608436045266/基础信息', label: 'erp/goods/update/item'},
							{value: '406602329304549469/712989787127325553/基础信息', label: 'erp/goods/spec/open/query/goodswithspeclist'},
							{value: '406602329304549469/776068318029907226/基础信息', label: 'erp/goods/item/correspondence'},
							{value: '406602329304549469/874064213581831712/基础信息', label: 'erp/goods/spec/open/query'},
							{value: '406602329304549469/904410576977336142/基础信息', label: 'erp/goods/add/item'},
							{value: '406602329304549469/910339200115041066/基础信息', label: 'erp/base/supplier/add'},
							{value: '406602329304549469/971709885693627051/基础信息', label: 'erp/base/supplier/query'}
							]
						 },
						 {value: '771605118380008557', label: '销售', children: [
							{value: '771605118380008557/160966424263944454/销售', label: 'erp/opentrade/list/trades'},
							{value: '771605118380008557/160966424263944455/销售', label: 'erp/opentrade/trade/exception/commit'},
							{value: '771605118380008557/204222651687169249/销售', label: 'erp/sale/stock/out/query'},
							{value: '771605118380008557/365229563022869547/销售', label: 'erp/opentrade/modify/remark'},
							{value: '771605118380008557/504403854662315314/销售', label: 'erp/opentrade/modify/mark'},
							{value: '771605118380008557/506474725143943883/销售', label: 'erp/opentrade/reply/exception/trades'},
							{value: '771605118380008557/560750024772484685/销售', label: 'erp/opentrade/send/trades'},
							{value: '771605118380008557/560750024772484686/销售', label: 'erp/opentrade/modify/pics'},
							{value: '771605118380008557/564870353118088977/销售', label: 'erp/sale/stock/out/add'},
							{value: '771605118380008557/611058485549710084/销售', label: 'erp/opentrade/reply/approve/trades'},
							{value: '771605118380008557/772181737045454072/销售', label: 'erp/opentrade/trade/commit'},
							{value: '771605118380008557/802172113968192958/销售', label: 'erp/opentrade/query/mark'},
							{value: '771605118380008557/976005520600699149/销售', label: 'erp/onlinetrade/general/printinfo'},
							{value: '771605118380008557/97600552060069919/销售', label: 'erp/onlinetrade/general/consign'},
							{value: '771605118380008557/977937628254023202/销售', label: 'erp/sale/stock/count/query'}
							]
						 },
						 {value: '771605118380008600', label: '售后（跨境ERP）', children: [
							{value: '771605118380008600/778671513049243649/售后（跨境ERP）', label: '/cerp/after_sales/stock/in/v2/query'}
							]
						 },
						 {value: '778671512982134784', label: '销售（跨境ERP）', children: [
							{value: '778671512982134784/778671512982134786/销售（跨境ERP）', label: '/cerp/openorder/query/list/trades'},
							{value: '778671512982134784/778671513049243651/销售（跨境ERP）', label: '/cerp/sale/stock/query_outbill_sales/out/query'},
							{value: '778671512982134784/778671513049243653/销售（跨境ERP）', label: '/cerp/sale/stock/query_outbill/count/query'},
							{value: '778671512982134784/778671513049243655/销售（跨境ERP）', label: '/cerp/openorder/print/general/printinfo'},
							{value: '778671512982134784/778671513049243657/销售（跨境ERP）', label: '/cerp/openorder/tag_query/query/mark'},
							{value: '778671512982134784/778671513049243659/销售（跨境ERP）', label: '/cerp/openorder/modify_order_status/reply/approve/trades'},
							{value: '778671512982134784/778671513049243661/销售（跨境ERP）', label: '/cerp/openorder/modify_order_exce/trade/exception/commit'},
							{value: '778671512982134784/778671513116352512/销售（跨境ERP）', label: '/cerp/openorder/remark/modify/remark'},
							{value: '778671512982134784/778671513116352514/销售（跨境ERP）', label: '/cerp/openorder/tag/remove/mark'},
							{value: '778671512982134784/778671513116352516/销售（跨境ERP）', label: '/cerp/openorder/tag/add/mark'},
							{value: '778671512982134784/778671513384787968/销售（跨境ERP）', label: '/cerp/sale/stock/add_outbill/out/add'},
							{value: '778671512982134784/847192707721076761/销售（跨境ERP）', label: '/cerp/openorder/send_trades/send/trades'}
							]
						 },
						 {value: '778671513586114572', label: '基础信息（跨境ERP）', children: [
							{value: '778671513586114572/778671512982134788/基础信息（跨境ERP）', label: '/cerp/base_info/shop/query/list/shops'},
							{value: '778671513586114572/778671513586114570/基础信息（跨境ERP）', label: '/cerp/base_info/bill/batch/query'}
							]
						 },
						 
						],
			shopData: [
				{value: '408942084066973178', label: 'B2C', children: [
					{value: '408942084066973178/169290599653277536/B2C', label: 'inventories/erp'},
					{value: '408942084066973178/269707471083849206/B2C', label: 'items/open'},
					{value: '408942084066973178/674297577751243968/B2C', label: 'categories/open'},
					{value: '408942084066973178/703867962550690686/B2C', label: 'trades/erp/status'},
					{value: '408942084066973178/875754084793018377/B2C', label: 'inventories/erp/single'},
					{value: '408942084066973178/876303274116687378/B2C', label: 'trades/open'},
					{value: '408942084066973178/9876524346433575377/B2C', label: 'refund/open'}
					]
				},
				{value: '778671513116352517', label: 'B2C（跨境ERP）', children: [
					{value: '778671513116352517/778671513183461376/B2C（跨境ERP）', label: '/cerp/inventories/query_single/erp/single'},
					{value: '778671513116352517/778671513183461378/B2C（跨境ERP）', label: '/cerp/inventories/query/erp'},
					{value: '778671513116352517/778671513250570241/B2C（跨境ERP）', label: '/cerp/trades/is_send/erp/single'},
					{value: '778671513116352517/778671513250570243/B2C（跨境ERP）', label: '/cerp/categories/add/open'},
					{value: '778671513116352517/778671513250570245/B2C（跨境ERP）', label: '/cerp/items/add/open'},
					{value: '778671513116352517/778671513317679105/B2C（跨境ERP）', label: '/cerp/trades/add/open'}
					]
				},
				{value: '819344228125811115', label: '消息', children: [
					{value: '819344228125811115/408265516197583221/消息', label: 'item_quantity_upload_msg'},
					{value: '819344228125811115/676291463384942549/消息', label: 'trade_send_msg'}
					]
				},
			],
			defaultProps: {
				children: 'children',
				value: 'value',
				label: 'label'
			},
		};
	},
	computed: {},
	watch: {
	},
	created() {
		this.getTree()
	},
	mounted() {
	},
	methods: {
		getTree () {
			this.$nextTick(() => {
				this.$refs.systemTree.root.childNodes[0].expanded = true
				this.$refs.systemTree.root.childNodes[0].childNodes[0].isCurrent = true
				this.$emit('chooseApi', this.$refs.systemTree.root.childNodes[0].childNodes[0].data.value)
			})
		},
		chooseApi (data, node) {
			if (!data.children) {
				this.$refs.systemTree.root.childNodes[0].childNodes[0].isCurrent = false
				this.$emit('chooseApi', data.value)
			}
		},
	},
	}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.contains {
	// > header {
	// 	margin: 27px 0 0 20px;
	// }
	height: 620px;
	overflow: auto;
	> main {
	    display: flex;
		flex-direction: column;
		align-items: stretch;
		// overflow: auto;
		height: auto;
		.title {
			width: 96px;
			height: 16px;
			font-size: 16px;
			font-family: PingFangSC, PingFangSC-Regular;
			font-weight: 400;
			text-align: left;
			color: #171f25;
			line-height: 16px;
			margin: 30px 0 27px 23px;
		}
		.tree-bg {
			background: #F7FAFF;
		}
	}
}
::v-deep .el-tree-node__content {
    display: flex;
    align-items: center;
    height: 50px !important;
    cursor: pointer;
}
</style>