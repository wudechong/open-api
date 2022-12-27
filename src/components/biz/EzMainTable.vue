<template lang="pug">
	.easy-table-box.single-row(v-loading="loading" id="ezTableBox")
		vxe-table.ez-table-default(border stripe ref="ezTable" width="100%" height="100%" :data="data" size="mini" row-id="_xid"
			resizable sync-resize auto-resize highlight-current-row show-overflow="tooltip" :row-class-name="getRowClass" show-header-overflow="tooltip" :column-key="true"
			:sort-config="{orders:['asc', 'desc', 'null'],trigger:'default',showIcon: false}" :checkbox-config="{trigger: 'cell'}" :row-config="{isHover:rowHover}" :cell-class-name="getCellClassName"
			@cell-click="cellClick" @scroll="scrollTable" column-draggable)
			// --- 序号列 ---
			vxe-table-column(type="seq" width="40" align="center" fixed="left")
				template(v-slot:header="{ column }")
					i.el-icon-more(style="transform: rotate(90deg)")
			// --- 复选框列 ---
			vxe-table-column(type="checkbox" fixed="left" align="center" header-align="center" field="checkbox" width="36" v-if="colConfig.hasCheck")
			// --- 操作列 ---
			vxe-table-column(title="操作" align="center" header-align="center" :width="operaWidth" v-if="colConfig.hasOpera")
				template(v-slot="{row}")
					.operate-btns
						span(v-for="(opera, operaIdx) in operaConfig" :key="operaIdx")
							a(v-if="opera.title && opera.param" @click="set(opera.method, row[opera.param])") {{opera.title}}
							a(v-else-if="opera.title" @click="set(opera.method,row)") {{opera.title}}
							a(v-else-if="!opera.title && opera.param" @click="set(opera.method, row[opera.param])") {{matchingName(row[opera.field], opera.titleMap)}}
							a(v-else @click="set(opera.method,row)") {{matchingName(row[opera.field], opera.titleMap)}}
							span.col-hr(v-if="operaIdx!==operaConfig.length-1") |
			// --- 数据列 ---
			vxe-table-column(v-for="(item, index) in tableColumns" :key="index" :title="item.title" :field="item.field" :width="item.width"
				:align="item.align || 'center'" :header-align="item.headerAlign || 'center'" :fixed="item.fixed"
				:sortable="item.sortable" :sort-by="({row})=>rowSort(row,item.field)" sort-type="string")
				template(v-slot:header="{ column }")
					| {{item.type==='imagelist'?'商品显示':column.title}}
					el-tooltip(v-if="item.type==='imagelist'" content="切换显示方式" :open-delay="300" placement="top-start")
						i.iconfont.icondown.icon-button(@click.stop="switchGoodsDisplayMode($event)")
					span.sort-span(@click="sortClickEvent(column, 'ezTable')" v-if="item.sortable")
						i.iconfont.iconpaixushang.sort-asc(:class="{'sort-act':column.order === 'asc'}")
						i.iconfont.iconpaixuxia.sort-desc(:class="{'sort-act':column.order === 'desc'}")
				template(v-slot="{row, column}")
					span(v-if="item.type==='text'") {{row[item.field]}}
					span(v-else-if="item.type==='time'") {{formatTime(row[item.field])}}
					span(v-else-if="item.type==='matchingtext'") {{matchingName(row[item.field], item.matching, item.matchingField)}}
					span(v-else-if="item.type==='money'") {{formatCurrency(row[item.field])}}
					.order-items(v-else-if="(item.type==='image' || (item.type==='imagelist' && goodsDisplayMode==='image')) && row[item.field]")
						el-tooltip(v-for="(order,idx) in row[item.field].slice(0,picNum(column))" :key="(order.skuCode||'')+idx" placement="top-start" :disabled="isScroll"
							class="image" :open-delay="300")
							div(slot="content")
								template(v-if="order.goodsName||order.skuCode")
									span 名称：{{order.goodsName}}
									br(v-if="order.skuNmae")
									span(v-if="order.skuNmae") 规格：{{order.skuName}}
									br
									span 编码：{{order.skuCode}}
								template(v-else)
									span 未关联系统商品
							.order-item
								hp-popper-img(:src="order.pic" :thumb="$utils.thumbUrl(order.pic, 24, 24)" :width="24" :height="24")
								.num {{order.num}}
					.order-items.text(v-else-if="row[item.field]")
						el-tooltip(placement="top-start" :disabled="!getGoodsDetail(row[item.field]) || isScroll" :class="goodsDisplayMode" :open-delay="300")
							div(slot="content" v-html="getGoodsDetail(row[item.field])")
							div.nowrap
								span(v-for="(order,idx) in row[item.field]" :key="(order.skuCode||'')+idx")
									span.brief {{(goodsDisplayMode==='name') ? order.goodsName : order.skuCode}}
									span.num [{{order.num}}]
			template(#empty)
				empty-tip(:loading="loading")
		div(ref="goodsTableSet")
			goods-table-set(:show="goodsTableSetVisible" tableBox="ezTableBox" :event="tableEvent" :value.sync="goodsDisplayMode" :random="goodsTableRandom" @close="goodsTableSetVisible=false")
</template>

<script>
/**
 * --【业务组件】 简易表格（复选框+操作列+数据显示）--
 * 
 * @param {Array} data 表格数据
 * @param {Boolean} loading 是否正在加载
 * @param {Array} tableColumn 表格数据列配置
 * @param {Object} colConfig 表格功能列配置
 * 		（hasCheck：复选框列，hasOpera：操作列）
 * @param {Array} operaConfig 表格操作列按钮List
 * 		（method[set调用]：功能方法名，title：按钮title，param：传递row中某字段，不填则传递row）
 * @param {Boolean} showSelectBg 是否显示勾选选中区域背景色
 * @param {Boolean} rowHover 是否有hover悬浮背景色
 * 
 * --【业务组件】 END
 */
import _ from "lodash";
import DROP_MIXINS from "@mixins/drop.js";
import GoodsTableSet from "./GoodsTableSet";
import EmptyTip from "@components/biz/EmptyTip";
export default {
	name: "EzMainTable",
	mixins: [DROP_MIXINS], // DROP_MIXINS自定义列
	components: {
		GoodsTableSet,
		EmptyTip
	},
	props: {
		data: {
			type: Array,
			default: function () {
				return []
			}
		},
		loading: {
			type: Boolean,
			default: true
		},
		tableColumns: {
			type: Array,
			default: function () {
				return []
			}
		},
		colConfig: {
			type: Object,
			default: function () {
				return {
					hasCheck: false,
					hasOpera: false
				}
			}
		},
		operaConfig: {
			type: Array,
			default: function () {
				return []
			}
		},
		showSelectBg: {
			type: Boolean,
			default: false
		},
		rowHover: {
			type: Boolean,
			default: false
		}
	},
	data () {
		return {
			isScroll: false,
			scrollTimer: null,
			goodsDisplayMode: "image",
			head: {
				row: null,
				index: 0
			},
			currentIndex: 0,
		}
	},
	computed: {
		operaWidth () {
			return this.operaConfig.length*40;
		},
	},
	watch: {
		data: {
			handler(now, old) {
				if (this.colConfig.hasCheck) {
					if ((old.length !== now.length) || (old.length>0 && now.length>0 && old[0]._xid !== now[0]._xid)) {
						this.$refs.ezTable.setCurrentRow(this.data[0]);
						this.head.row = _.cloneDeep(this.data[0]);
						this.head.index = 0;
						this.currentIndex = 0;
					}
				}
			}
		}
	},
	mounted () {
		if (this.colConfig.hasCheck) {
			this.$refs.ezTable.setCurrentRow(this.data[0]);
		}
		this.head.row = _.cloneDeep(this.data[0]);
		this.head.index = 0;
		this.currentIndex = 0;
	},
	methods: {
		set (method, data) {
			this.$emit("set", method, data);
		},
		matchingName (data, list, matchingField) {
			let name = "";
			if (!matchingField) {
				let obj = list.find(ele => {
					return ele.id === data;
				});
				if (obj!==undefined) name = obj.name;
			} else {
				let obj = list.find(ele => {
					return ele[matchingField.id] === data;
				});
				if (obj!==undefined) name = obj[matchingField.name];
			}
			return name;
		},
		getRowClass ({row, rowIndex}) {
			if (this.showSelectBg) {
				let isChecked = this.$refs.ezTable.isCheckedByCheckboxRow(row);
				if (isChecked && rowIndex === this.currentIndex) {
					return "show-select-bg selected-row row--current";
				} else if (isChecked && rowIndex !== this.currentIndex) {
					return "show-select-bg selected-row";
				} else if (rowIndex === this.currentIndex){
					return "show-select-bg row--current";
				} else {
					return "show-select-bg";
				}
			} else {
				return "";
			}
		},
		cellClick ({ row, rowIndex, $event }) {
			if (this.colConfig.hasCheck) {
				// 快捷键勾选
				this.currentIndex = rowIndex;
				let arr = [];
				if ($event.shiftKey) {
					// 按shift
					document.body.onselectstart = function () {
						return false
					}
					if (this.head.index <= rowIndex) {
						for (let i = this.head.index; i<=rowIndex; i++) {
							arr.push(this.data[i]);
						}
					} else {
						for (let i = this.head.index; i>=rowIndex; i--) {
							arr.push(this.data[i]);
						}
					}
					this.$refs.ezTable.setCheckboxRow(arr, true);
				} else if ($event.ctrlKey) {
					// 按ctrl
					let isChecked = this.$refs.ezTable.isCheckedByCheckboxRow(row);
					this.$refs.ezTable.setCheckboxRow(row, !isChecked);
					this.head.row = _.cloneDeep(row);
					this.head.index = rowIndex;
				} else {
					this.head.row = _.cloneDeep(row);
					this.head.index = rowIndex;
					document.body.onselectstart = function () {
						return true
					}
				}

			}
		},
		// 获取当前列宽放下几个图片
		picNum(column) {
			let width = column.renderWidth || column.width;
			return Math.ceil((width - 16) / 34);
		},
		// 表格滚动
		scrollTable() {
			this.scrollTimer = null;
			this.isScroll = true;
			this.$refs.ezTable.closeTooltip();
			if (this.scrollTimer) clearTimeout(this.scrollTimer);
			this.scrollTimer = setTimeout(() => {
				delete this.scrollTimer;
				this.isScroll = false;
			}, 2000);
		},
		// 获取单元格class名
		getCellClassName ({row, column}) {
			let matchFields = [];
			let tableColumns = this.tableColumns.filter(item => {
				return item.type === "image" || (item.type === 'imagelist' && this.goodsDisplayMode==='image');
			});
			if (tableColumns && tableColumns.length > 0) {
				tableColumns.forEach(ele => {
					matchFields.push(ele.field);
				})
			}
			if (matchFields.includes(column.property)) {
				return "match-image-box"
			}
		},
		getGoodsDetail(arr) {
			let detail = "",
				index = 0;
			for (let item of arr) {
				if (index < 4) {
					if (item.goodsName || item.skuName || item.skuCode) {
						detail += `<div>
							${item.goodsName ? "名称：" + item.goodsName : ""} ${
							item.skuName ? "规格：" + item.skuName : ""
						} ${item.skuCode ? "编码：" + item.skuCode : ""}
						</div>`;
						index++;
					}
				} else {
					detail += `<div>...</div>`;
					break;
				}
			}
			return detail;
		},
		// 排序商品
		rowSort(row, field) {
			if (field === "image" || field === "imagelist") {
				let images = "",
					name = "",
					code = "";
				for (const item of (row[field] || []).slice(0, 4)) {
					images += item.pic + item.num;
					name += item.goodsName + item.num;
					code += item.skuCode + item.num;
				}
				if (this.goodsDisplayMode === "image") {
					return images;
				} else if (this.goodsDisplayMode === "imagename") {
					return name;
				} else if (this.goodsDisplayMode === "code") {
					return code;
				}
			} else {
				return row[field];
			}
		},
	}
}
</script>

<style lang="scss" scoped>
$line-height: 22px;
$row-vertical-padding: 5px;
$row-height: ($line-height + $row-vertical-padding) * 2;
$row-content-height: $line-height * 2;
$remind-size: 14px;
$thumb-image-box-size: 22px;
$select-row-bg: #DAE7F1;

// 表格样式
.easy-table-box.single-row {
	position: relative;
	flex: 1;
	.column-hr {
		color: $secondary-text-color;
	}
	.border--full {
		::v-deep .vxe-table--header-wrapper th {
			border-right: 1px solid #fff;
		}
	}
}
// 表格样式
.ez-table-default {
	height: 100%;
	::v-deep {
		.vxe-table--body-wrapper > .vxe-table--body .vxe-body--row{
			&.show-select-bg.selected-row {
				background-color: $select-row-bg;
				&.row--current {
					background-color: #BCD5E6 !important;
				}
			}
			&.show-select-bg.row--stripe.row--current {
				background-color:  #BCD5E6 !important;
			}
			&.show-select-bg.row--current {
				background-color: #BCD5E6 !important;
			}
		}
		.vxe-body--column {
			padding: $row-vertical-padding 0 !important;
			line-height: $line-height;
			&.wrap {
				> .vxe-cell {
					white-space: normal !important;
				}

				> .vxe-cell > .vxe-cell--label {
					display: inline-block;
					white-space: normal;
					width: 100%;
					margin-right: 10px;
				}
			}
			&.match-image-box {
				padding: 0 !important;
				> .vxe-cell {
					height: 100%;
					align-items: center;
					display: flex;
					align-items: center;
				}
			}
		}
	}
	::v-deep .vxe-cell {
		line-height: $line-height !important;
		.sort-span {
			position: relative;
			padding: 0 8px;
			cursor: pointer;
			.sort-asc {
				position: absolute;
				height: 10px;
				top: -5px;
				left: 2px;
				color: #b7c2c7;
			}
			.sort-desc {
				position: absolute;
				height: 10px;
				bottom: 4px;
				left: 2px;
				color: #b7c2c7;
			}
			.sort-act {
				color: #87959c;
			}
		}
	}
}
.operate-btns {
	display: flex;
	a {
		color: $primary-color;
		cursor: pointer;
		&:hover {
			color: $light-primary-color;
		}
	}
	.col-hr {
		color: #CCCCCC;
		margin: 0 5px;
	}
}
.order-items {
	display: flex;
	&.text {
		overflow: hidden;
	}
	.order-item {
		cursor: default;
		display: inline-block;
		&.image {
			display: inline-flex;
			margin-right: 10px;
			font-size: 0;
			position: relative;
			width: $thumb-image-box-size;
			height: $thumb-image-box-size;
			line-height: $thumb-image-box-size;
			> .num {
				color: $primary-color;
				border: $primary-color 1px solid;
				border-radius: 11px;
				position: absolute;
				font-size: $font-size;
				min-width: 8px;
				max-width: 14px;
				height: 8px;
				line-height: 8px;
				text-align: center;
				padding: 2px;
				right: -8px;
				bottom: -4px;
				background: $color-white;
				transform: scale(0.9);
				white-space: nowrap;
				overflow: hidden !important;
				text-overflow: ellipsis;
			}
		}
	}
}
</style>