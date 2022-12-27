<template lang="pug">
	hp-modal-dialog(ref="modelDialog" :title="title" v-dialogDrag :top="getTop()" :width="width" :close-on-click-modal="false" @close="()=>close()")
		left-right-container.goods-picker(left-width='180px' drag height="440px" v-if="showTree")
			template(v-slot:left)
				div.left-tree
					el-tree(ref="tree" :props="props" highlight-current lazy :load="loadNode"
						node-key="categoryID" @node-click="handleNodeClick")
			template(v-slot:right)
				.v-box
					.box
						el-form#formCondition(:inline="true")
							//- el-form-item(:label="$t('biz.goodsPicker.brand')")
								lazy-select.input--small(v-model="form.brand" :props="{label:'brandName', value: 'brandID'}" :options="brand")
							el-form-item(:label="$t('biz.goodsPicker.goodsName')")
								el-input(v-model="form.goods" @keyup.enter.native="keyupEnter")
							el-form-item(:label="$t('biz.goodsPicker.name')")
								el-input(v-model="form.sku"  @keyup.enter.native="keyupEnter")
							el-form-item(:label="$t('biz.goodsPicker.productNo')" v-if="showProductNo")
								el-input(v-model="form.productNo"  @keyup.enter.native="keyupEnter")
							el-form-item(:label="$t('biz.goodsPicker.status')" v-if="showStatus&&multiple")
								hp-item-select(v-model="form.isExcept" clearable filterable
								:items="statusList" :props="{label:'label', value: 'value'}" placeholder="")
							//- el-form-item(v-if="onlySupplier")
								el-checkbox(v-model="form.supplierOwner" :true-label="true" :false-label="false") 仅显示供应商可供商品
							el-form-item
								el-button(type="primary" @click="query") {{$t('common.queryButton')}}
								el-button(plain @click='reset') {{$t('common.resetButton')}}

						.toolbar
							hp-pager(ref="pager" :showTotal="showTotal" :pageSize="pageSize" :pageNo.sync="pageNo" :pageCount.sync="pageCount" :totalCount="total"
								:loading="loading" isGoods :pageSizes="pageSizes" @pageChanged="pageChanged" @toggle="toggle")
					.flex-box
						vxe-table.table-goods(ref="tableGoods" width="100%" height="100%" :data="tableData" border="none"
							v-loading="tableLoading" resizable auto-resize highlight-hover-row highlight-current-row
							:checkbox-config="{checkMethod: checkMethod}" show-overflow="tooltip" show-header-overflow="tooltip"
							:tree-config="{ labelField: 'name', children: 'children', trigger: multiple ? 'default' : 'row' }"
							:edit-config="{ trigger: 'click', mode: 'cell'}"
							:seq-config="{seqMethod: seqMethod}"
							@cell-click="handleClick" @cell-dblclick="handleDblclick" @checkbox-all="selectChangeEvent" @checkbox-change="selectChangeEvent")
							vxe-table-column(type="seq" :title="$t('common.sn')" width="45" align="center")
							vxe-table-column(tree-node type="checkbox" v-if="multiple" width="50" align="center" class-name="check-box" )
							vxe-table-column(tree-node  v-if="!multiple" title="..." width="50" align="center")
							vxe-table-column(width="45" :title="$t('biz.goodsPicker.image')" className="image" align="center")
								template(v-slot="{row}")
									hp-popper-img(:src="row.pic" :width="24" :height="24")
							vxe-table-column(field="code" :title="$t('biz.goodsPicker.tbCode')" align="left" header-align="center")
							vxe-table-column(field="barCode" :title="$t('biz.goodsPicker.barCode')" align="left" header-align="center")
							vxe-table-column(field="name" :title="$t('biz.goodsPicker.tbGoodsName')+'/'+$t('biz.goodsPicker.tbName')" align="left" header-align="center")
							vxe-table-column(field="salePrice" :width="120" :title="$t('biz.goodsPicker.salePrice')" align="right" header-align="center")
								template(v-slot="{ row }")
									span {{ (row.salePrice || 0) | toFixedN(2) }}
							vxe-table-column(field="inventory" :width="120" align="center" v-if="warehouseID")
								template(v-slot:header="{ column }")
									span {{permission.csw_open_occupy_inventory ? $t('biz.goodsPicker.occupy') : $t('biz.goodsPicker.available')}}({{warehouseName}})
								template(v-slot="{ row }")
									span {{ (permission.csw_open_occupy_inventory ? row.occupy : row.available) | toFixedN(occupyDecimal.inventoryNumDigit || 0, '')}}
							vxe-table-column(field="num" :title="$t('biz.goodsPicker.num')" :editRender="{}" align="right" header-align="center" v-if="isShowNumColumn")
								template(v-slot:header="{ column }")
									span {{column.title}}
									i(class="iconpiliangxiugai iconfont i-blue")
								template(v-slot:edit="{row}")
									hp-input-number(v-model="row.num" v-focus :precision="0" :min="1" :max="999999" :disabled="checkRow(row)" @change="changNum(row)")

		template(slot="footer")
			.buttons
				//- el-button#buttonClear(@click="clear" plain) {{$t('common.clear')}}
				el-button(type="primary" @click="save") {{$t('common.ok')}}
				el-button(@click="close()" plain) {{$t('common.cancel')}}
				.summary(v-show="multiple")
					span.text {{$t('biz.goodsPicker.selectedImageCount')}}
					span.count {{selection.concat(defaultOtherCheck).length}}
					i.iconfont.iconshanchu1.clearColor(@click="clear")
</template>

<script>
import _ from "lodash";
import { mapState } from "vuex";
import LeftRightContainer from "@/components/common/LeftRightContainer";
import LazySelect from "@/components/biz/LazySelect";

export default {
	name: "GoodsPicker",
	props: {
		width: {
			type: String,
			default: "1000px",
		},
	},
	components: {
		LeftRightContainer,
		LazySelect,
	},
	data() {
		return {
			props: {
				children: "children",
				label: "categoryName",
				isLeaf: "hasChild",
			},

			form: {
				brand: undefined,
				goods: undefined,
				sku: undefined,
				productNo: undefined,
				isExcept: undefined,
			},
			// 能传入的字段，可手动添加
			tableData: [],
			selection: [],
			value: [],
			disabledSkus: [], // 禁用
			data: {},
			multiple: true,
			title: this.$t("biz.goodsPicker.title"),
			isGroup: false,
			isSingle: false,
			showProductNo: true,
			showStatus: false,
			onlySupplier: false,
			warehouseID: null,
			warehouseName: null,
			defaultOtherCheck: [], // 根据v-model 实际勾选非当前页的skuID
			isShowNumColumn: false, //是否显示数量字段
			goodsLimit: 0, // 商品种类最大值限制
			pageNo: 1,
			pageSize: 10,
			pageCount: -1,
			total: 0,
			pageSizes: [10, 20, 50, 100],

			nodeChlid: null,
			isLoad: false,
			tableLoading: false,
			loading: false,
			showTree: false,
			showTotal: false,
			statusList: [
				{ label: this.$t("biz.goodsPicker.selected"), value: false },
				{ label: this.$t("biz.goodsPicker.notSelected"), value: true },
			],
			localStorageKey: 'goods_dialog_pageSize',
		};
	},
	computed: {
		...mapState("common", ["brand", "occupyDecimal"]),
		...mapState("permission", ["permission"]),
	},
	created() {
		if (!this.brand || !this.brand.length) {
			this.$store.dispatch("common/loadBrand");
		}
		if (localStorage[this.localStorageKey]) {
			this.pageSize = Number(localStorage[this.localStorageKey])
		}
	},
	methods: {
		open(options) {
			this.value = _.cloneDeep(
				options.selections?.filter((val) => val.skuID) || []
			);
			this.disabledSkus = _.cloneDeep(options.disabledSkus || []);
			this.multiple = options.multiple ?? true; //只有当左侧为null和undefined时才会返回右侧的值
			this.title = options.title || this.$t("biz.goodsPicker.title");
			this.isGroup = options.isGroup ?? false;
			this.isSingle = options.isSingle ?? false;
			this.showProductNo = options.showProductNo ?? true;
			this.warehouseID = options.warehouseID ?? null;
			this.warehouseName = options.warehouseName ?? null;
			this.showStatus = options.showStatus ?? false;
			this.onlySupplier = options.onlySupplier ?? false;
			this.isShowNumColumn = options.isShowNumColumn ?? false;
			this.goodsLimit = options.goodsLimit ?? 0;
			this.isLoad = false;
			this.showTree = true;
			this.initValue();
			//可移动的弹窗去除移动距离
			this.$nextTick(() => {
				let dragDom = this.$refs["modelDialog"].$el.querySelector(
					".el-dialog"
				);
				dragDom.style.cssText += ";top:0px;left:0px";
			});
			return this.$refs.modelDialog.open(options);
		},
		close(data) {
			this.showTree = false;
			this.tableData = [];
			this.clear();
			return this.$refs.modelDialog.close(data);
		},
		clear() {
			this.$refs.tableGoods.clearCheckboxRow();
			this.value = [];
			this.selection = [];
			this.defaultOtherCheck = [];
		},
		// 选中默认
		initValue() {
			this.defaultOtherCheck = [];

			// 将tableData全部展开
			let all = [];
			this.tableData.forEach((item) => {
				if (item.children) {
					all.push(...item.children);
				} else {
					all.push(item);
				}
			});
			// 筛选出已勾选的商品
			let checkedList = [];
			for (let obj of this.value) {
				let off = true;
				for (let item of all) {
					if (item.skuID == obj.skuID) {
						checkedList.push(item);
						off = false;
						break;
					}
				}
				if (off) {
					this.defaultOtherCheck.push(obj);
				}
			}
			// 勾选/取消
			this.$nextTick(() => {
				this.selection = _.cloneDeep(checkedList);
				this.$refs.tableGoods.setCheckboxRow(checkedList, true); // 重新勾选
			});
		},
		keyupEnter() {
			this.query();
		},
		//
		async loadNode(node, resolve) {
			// 是组合商品
			if (this.isGroup) {
				if (node.level === 0) {
					let twoData = [
						{
							categoryID: "2",
							categoryName: this.$t("biz.goodsPicker.allGroup"),
							hasChild: false,
							isPackage: 1,
						},
					];
					setTimeout(() => {
						node.level = 1;
						this.loadNode(node, resolve);
					});
					this.$nextTick(() => {
						const tree = this.$refs.tree;
						tree.setCurrentNode(twoData[0]);
						this.nodeChlid = tree.getCurrentNode();
						this.query();
					});

					return resolve(twoData);
				}
				if (node.level === 1) {
					if (this.isLoad) return resolve([]);
					let data = await this.getChlid("2", 1);
					data.forEach((v) => {
						v.hasChild = !v.hasChild;
					});
					this.isLoad = true;
					return resolve(data);
				}
			} else if (this.isSingle) {
				if (node.level === 0) {
					let twoData = [
						{
							categoryID: "1",
							categoryName: this.$t("biz.goodsPicker.allSingle"),
							hasChild: false,
							isPackage: 0,
						},
					];
					setTimeout(() => {
						node.level = 1;
						this.loadNode(node, resolve);
					});
					this.$nextTick(() => {
						const tree = this.$refs.tree;
						tree.setCurrentNode(twoData[0]);
						this.nodeChlid = tree.getCurrentNode();
						this.query();
					});

					return resolve(twoData);
				}
				if (node.level === 1) {
					if (this.isLoad) return resolve([]);
					let data = await this.getChlid("1", 0);
					data.forEach((v) => {
						v.hasChild = !v.hasChild;
					});
					this.isLoad = true;
					return resolve(data);
				}
			} else {
				if (node.level === 0) {
					let res = await this.getTopCategory();
					setTimeout(() => {
						node.level = 1;
						this.loadNode(node, resolve);
					});
					this.$nextTick(() => {
						const tree = this.$refs.tree;
						tree.setCurrentNode(res[0]);
						this.nodeChlid = tree.getCurrentNode();
						this.query();
					});

					return resolve(res);
				}
				if (node.level === 1) {
					if (this.isLoad) return resolve([]);
					let twoData = [
						{
							categoryID: "1",
							categoryName: this.$t("biz.goodsPicker.allSingle"),
							hasChild: false,
							isPackage: 0,
						},
						{
							categoryID: "2",
							categoryName: this.$t("biz.goodsPicker.allGroup"),
							hasChild: false,
							isPackage: 1,
						},
					];
					this.isLoad = true;
					return resolve(twoData);
				}
			}

			let data = await this.getChlid(node.data.categoryID, node.data.isPackage);
			data.forEach((v) => {
				v.hasChild = !v.hasChild;
			});
			resolve(data);
		},
		//查询分类
		getTopCategory() {
			return this.$http.get("/service/erp/goods/category/top", { topID: 0 });
		},
		// 查询子集
		getChlid(parentID, isPackage) {
			return this.$http.get("/service/erp/goods/category/top/subs", {
				parentID,
				isPackage,
			});
		},
		// 获取商品
		async getGoods() {
			this.tableLoading = true;
			let result = this.selection.concat(this.defaultOtherCheck);
			this.value = _.cloneDeep(result);
			let goodsIDs = [];
			if (this.multiple && this.value) {
				goodsIDs = [
					...new Set(
						result.map((val) => {
							return val.goodsID;
						})
					),
				];
			}
			// 获取当前所有选中
			let exceSkuIDs = result.map((val) => {
				return val.skuID;
			});
			this.showTotal && this.getTotal();
			// 如果已选为0
			if (exceSkuIDs.length === 0 && this.form.isExcept === false) {
				this.tableData = [];
				this.tableLoading = false;
				return;
			}
			try {
				const res = await this.$http.post("/service/erp/goods/select", {
					...this.form,
					goodsSelected:
						this.form.isExcept !== undefined ? goodsIDs : undefined,
					skuSelected:
						this.form.isExcept !== undefined ? exceSkuIDs : undefined,
					categoryID:
						(this.nodeChlid && this.nodeChlid.categoryID) ||
						(this.isGroup ? "2" : this.isSingle ? "1" : 0),
					goodsType: this.isGroup
						? 1 : this.isSingle ? 0 
						: this.nodeChlid && this.nodeChlid.categoryID != 0
						? this.nodeChlid && this.nodeChlid.isPackage
						: "",
					pageNo: this.pageNo,
					pageSize: this.pageSize,
				});
				if (res) {
					this.tableData = res.$data;
					if (this.warehouseID) {
						this.getInventory();
					}
					this.data = res;
					if (this.showTotal) {
						this.pageNo = res.$pageNo;
					} else {
						this.$refs.pager.parseResponse(this.data);
					}
					// this.$refs.pager.parseResponse(res);
					if (this.multiple && this.value) {
						this.initValue();
					}
				}
			} finally {
				this.tableLoading = false;
			}
		},
		// 获取总条数
		getTotal() {
			if (this.loading) return;
			this.loading = true;
			let result = this.selection.concat(this.defaultOtherCheck);
			this.value = _.cloneDeep(result);
			let goodsIDs = [];
			if (this.multiple && this.value) {
				goodsIDs = [
					...new Set(
						result.map((val) => {
							return val.goodsID;
						})
					),
				];
			}
			// 获取当前所有选中
			let exceSkuIDs = result.map((val) => {
				return val.skuID;
			});
			// 如果已选为0
			if (exceSkuIDs.length === 0 && this.form.isExcept === false) {
				this.total = 0;
				this.pageCount = 1;
				this.loading = false;
				return;
			}
			this.$http
				.post("/service/erp/goods/count", {
					...this.form,
					goodsSelected:
						this.form.isExcept !== undefined ? goodsIDs : undefined,
					skuSelected:
						this.form.isExcept !== undefined ? exceSkuIDs : undefined,
					categoryID:
						(this.nodeChlid && this.nodeChlid.categoryID) ||
						(this.isGroup ? "2" : this.isSingle ? "1" : 0),
					goodsType: this.isGroup
						? 1 : this.isSingle ? 0 
						: this.nodeChlid && this.nodeChlid.categoryID != 0
						? this.nodeChlid && this.nodeChlid.isPackage
						: "",
				})
				.then((r) => {
					this.total = r;
					this.pageCount = Math.ceil(this.total / this.pageSize) || 1;
				})
				.finally(() => {
					this.loading = false;
				});
		},
		// 获取库存
		async getInventory() {
			let result = [];
			this.tableData.forEach((val) => {
				if (!val.children) {
					result.push(val);
				} else {
					val.children.forEach((item) => {
						result.push(item);
					});
				}
			});
			const res = await this.$http.post(
				"/erp/goods/inventory/query",
				result.map((val) => {
					return {
						warehouseID: this.warehouseID,
						goodsID: val.goodsID,
						skuID: val.skuID,
					};
				})
			);
			if (!res.code) {
				this.tableData.forEach((val) => {
					if (!val.children) {
						this.$set(val, "occupy", res[val.skuID]?.occupy || 0);
						this.$set(val, "available", res[val.skuID]?.available || 0);
					} else {
						val.children.forEach((item) => {
							this.$set(item, "occupy", res[item.skuID]?.occupy || 0);
							this.$set(item, "available", res[item.skuID]?.available || 0);
						});
					}
				});
			}
		},
		// 切换是否显示页码数总数
		toggle() {
			this.showTotal = !this.showTotal;
			if (this.showTotal) {
				this.getTotal();
			} else {
				(this.pageCount = -1), (this.total = 0);
				this.$nextTick(() => {
					this.$refs.pager.parseResponse(this.data);
				});
			}
		},
		// 树 点击
		handleNodeClick(data) {
			if (
				data.categoryID === this.nodeChlid.categoryID &&
				data.isPackage === this.nodeChlid.isPackage
			)
				return;
			this.nodeChlid = data;
			this.query();
		},
		// 勾选/全选
		selectChangeEvent({ records }) {
			let arr = [];
			records.forEach((v) => {
				if (!v.children) {
					this.isShowNumColumn ? (v.num = v.num || 1) : "";
					arr.push(v);
				}
			});
			if (this.isShowNumColumn) {
				let off = false,
					result = [];
				this.tableData.forEach((val) => {
					if (!val.children) {
						result.push(val);
					} else {
						result.push(val);
						val.children.forEach((item) => {
							result.push(item);
						});
					}
				});
				result.forEach((val) => {
					off = false;
					for (let item of records) {
						if (item.code === val.code) {
							off = true;
							break;
						}
					}
					if (val.children || !off) {
						val.num = undefined;
					}
				});
			}
			this.selection = arr;
		},
		// 点击行
		handleClick({ row }) {
			if (!this.multiple) {
				let arr = [];
				if (!row.children) {
					arr.push(row);
				}
				this.selection = arr;
			}
			if (
				this.isShowNumColumn &&
				!row.children &&
				this.$refs.tableGoods.isCheckedByCheckboxRow(row)
			) {
				this.$refs.tableGoods.setActiveCell(row, "num");
			}
		},
		// 双击
		handleDblclick({ row }) {
			if (!this.multiple) {
				let arr = [];
				if (!row.children) {
					arr.push(row);
				}
				if (arr.length) {
					this.selection = arr;
					this.save();
				}
			}
		},
		getGoodsIDs(array) {
			let different = [],
				differentIDs = [];
			// 先把树结构的父级push
			for (let item of array) {
				if (item.children && item.children.length > 0) {
					different.push(item);
					differentIDs.push(item.goodsID);
				}
			}
			// push不同goodsid的item
			for (let item of array) {
				if (!differentIDs.includes(item.goodsID)) {
					different.push(item);
					differentIDs.push(item.goodsID);
				}
			}

			let result = [];
			for (let i = 0; i < different.length; i++) {
				for (let item of this.tableData) {
					if (!different[i].skuID) {
						result.push(different[i]);
						break;
					}
					if (item.skuID === different[i].skuID) {
						result.push(different[i]);
						break;
					}
				}
			}
			return result;
		},
		// 保存
		save() {
			if (this.multiple && this.value) {
				if (
					this.goodsLimit > 0 &&
					this.goodsLimit < this.selection.concat(this.defaultOtherCheck).length
				) {
					this.$confirm(
						this.$t("biz.goodsPicker.limitErr") + "20！",
						this.$t("common.tip"),
						{
							confirmButtonText: this.$t("biz.goodsPicker.comfrimText"),
							iconClass: "iconfont iconjichuxinxitishi i-blue",
							showCancelButton: false,
						}
					);
					return;
				}
				this.close(this.selection.concat(this.defaultOtherCheck));
				this.$refs.tableGoods.clearCheckboxRow();
			} else {
				this.close(this.selection);
				this.$refs.tableGoods.clearCheckboxRow();
			}
		},
		checkMethod({ row }) {
			if (row.children && row.children.length > 0) {
				return !row.children.every((val) => {
					return this.disabledSkus.includes(val.skuID);
				});
			} else {
				if (!row.skuID) return true;
				return !this.disabledSkus.includes(row.skuID);
			}
		},
		// 翻页
		pageChanged({ pageNo, pageSize }) {
			this.pageNo = pageNo;
			this.pageSize = pageSize;
			localStorage[this.localStorageKey] = pageSize;
			this.getGoods();
		},
		query() {
			this.pageNo = 1;
			(this.pageCount = -1), (this.total = 0);
			this.getGoods();
		},
		// 重置
		reset() {
			// this.nodeChlid = undefined
			this.form = {
				brand: undefined,
				goods: undefined,
				sku: undefined,
				productNo: undefined,
				isExcept: undefined,
			};
		},
		checkRow(row) {
			let codes = this.$refs.tableGoods.getCheckboxRecords(true).map((val) => {
				return val.code;
			});
			if (codes.includes(row.code) && !row.children) {
				return false;
			}
			return true;
		},
		changNum(row) {
			if (!row.num) {
				setTimeout(() => {
					this.$set(row, num, 1);
				});
			}
		},
		seqMethod({ row, rowIndex, column, columnIndex }) {
			if (rowIndex === -1) {
				return "";
			}
			return rowIndex + 1;
		},
		getTop() {
			let top = document.body.offsetHeight - 561;
			if (top > 0) {
				return top / 2 + 'px';
			}
			return '0px';
		},
	},
};
</script>

<style lang="scss" scoped>
$row-height: 32px;
::v-deep .el-dialog {
	> .el-dialog__footer {
		border-top: 1px solid $extra-light-border-color;
		padding: 28px 32px;
	}
}

.clearColor {
	color: $secondary-icon-button-color;
	cursor: pointer;
	padding-left: 8px;
}

#formCondition {
	padding: 0 12px;

	.el-select,
	.el-input {
		width: 100px;
	}
}

.toolbar {
	text-align: right;
	padding: 0 12px;
	margin-bottom: 8px;
}

.table-goods {
	::v-deep {
		.vxe-table--header-wrapper {
			background-color: #eaeaea;
		}
		.vxe-body--column {
			line-height: $row-height !important;
			max-height: $row-height;
			height: $row-height !important;

			&.image {
				> .vxe-cell {
					padding-top: 4px;
				}
			}
		}
	}
}

.buttons {
	position: relative;
	text-align: center;

	#buttonClear {
		position: absolute;
		left: 16px;
	}

	> .summary {
		display: inline-block;
		position: absolute;
		font-size: $font-size;
		right: 150px;
		white-space: nowrap;
		margin-right: 12px;
		line-height: 28px;

		> .text {
			color: $secondary-text-color;
		}

		> .count {
			color: $primary-color;
		}
	}
}
.goods-picker {
	height: 440px;
}
.left-tree {
	width: calc(100% + 10px);
	overflow-x: hidden;
	height: 100%;
}
::v-deep .el-tree > .el-tree-node:nth-child(1) .el-tree-node__expand-icon {
	visibility: hidden;
}
::v-deep .check-box .vxe-cell--tree-node,
::v-deep .check-box .vxe-cell--tree-node .vxe-tree-cell {
	padding-left: 0 !important;
}
::v-deep .goods-picker ._left-wrap {
	background-color: transparent;
}
::v-deep .el-form-item__label {
	padding-right: 0;
}
::v-deep
	.vxe-table
	.vxe-body--row
	.is--disabled.vxe-cell--checkbox
	.vxe-checkbox--icon:after {
	content: "";
	position: absolute;
	height: 0.64em;
	width: 0.32em;
	top: 50%;
	left: 50%;
	border: 1px solid #333;
	border-left: 0;
	border-top: 0;
	transform: translate(-50%, -50%) rotate(45deg);
}
::v-deep
	.vxe-table
	.vxe-body--row
	.is--disabled.vxe-cell--checkbox
	.vxe-checkbox--icon:before {
	border-color: #aeaeae;
}
::v-deep .vxe-table .vxe-cell {
	line-height: 32px;
	max-height: 32px !important;
}
::v-deep .table-goods .vxe-table--body tr:nth-child(2n) {
	background-color: #f5f6f7;
}
</style>
