<template lang="pug">
	transition(:name="transitionName")
		._contains(v-if="show" :style="{left: left+'px', top: top+'px'}")
			.title 自定义列
			vxe-table.column-set(:data="showTable" ref="defaultTable" :height="314" :show-header="false" border="none" resizable show-overflow="title" header-align="center" size="mini" @checkbox-change="change")
				vxe-table-column(type="checkbox" width="40" align="right")
				vxe-table-column(title="列名" field="title" align="left")
			.bottom
				.box
					| 列表行高：
					el-tooltip(content="订单列表里，可看较大商品图片" placement="top-start" ref="switch" :disabled="switchDisabled")
						.tips
					el-switch.print-switch-sm(v-model="zRowH1Check" active-color="#6DD400" inactive-color="#aeaeae" active-text="小行高" inactive-text="大行高" @change="changeRowH")
</template>

<script>
import Sortable from 'sortablejs'
import DROP_MIXINS from '@/mixins/drop.js';
export default {
	name: 'ColumnNewSet', // 新的保存接口，存在单双行
	props: {
		show: Boolean,
		data: {
			type: Array,
			default () {
				return []
			},
		},
		event: Object,
		random: Number,
		fixed: Number, // 固定的列数
		view: Number || String,
		rowH1Check: Boolean,
		otherGrids: Array,
	},
	mixins: [DROP_MIXINS],
	data () {
		return {
			tableData: [],
			fixedTable: [],
			showTable: [], // 显示的table
			selectRecords: [],
			transitionName: 'el-zoom-in-top',

			top: 0,
			left: 0,
			windowHeight: window.innerHeight,
			windowWidth: window.innerWidth,
			zRowH1Check: false,
			switchDisabled: true,
		}
	},
	watch: {
		show (v) {
			if (v) {
				this.zRowH1Check = this.rowH1Check;
				this.fixedTable =  _.cloneDeep(this.data).splice(0, this.fixed);
				this.tableData = _.cloneDeep(this.data).splice(this.fixed);
				this.showTable = this.tableData.filter(item=> {
					return !item.hidden;
				})
				let tableDataIndex = []
				this.showTable.forEach((v, i) => {
					if (v.visible) {
						tableDataIndex.push(this.showTable[i])
					}
				})
				this.switchDisabled = false;
				this.$nextTick(() => {
					this.$refs.defaultTable.setCheckboxRow(tableDataIndex, true)
				})
				setTimeout(() => {
					this.$refs.switch.show();
				}, 300)
				setTimeout(() => {
					this.$refs.switch.hide();
					this.switchDisabled = true;
				}, 2000)
			}
		},
		random (val) {
			this.confirm()
			this.saveRowH1Check();
		},
		event: {
			handler (val) {
				this.top = 30;
				this.left = val.e.clientX - 190 < 0 ? 10 : val.e.clientX - 190
				this.transitionName = this.top < 0 ? 'el-zoom-in-bottom' : 'el-zoom-in-top'
			},
		}
	},
	computed: {

	},
	methods: {
		confirm () {
			this.saveOrderColumnSet(this.tableData)
			this.$emit('close')
		},
		// 保存订单列设置
		saveOrderColumnSet(colums) {
			let grids = colums.map((val, index) => {
				return {
					visible: val.visible,
					width: val.resizeWidth || val.width,
					code: val.property,
					label: val.title,
					index: index,
				}
			})
			return this.$http.post('/web/erp/grid/store', {
				grids: grids,
				viewType: 'trade_approve',
				moduleType: 'trade_approve_trade_table'
			})
		},
		
		change() {
			let selectRecords = this.$refs.defaultTable.getCheckboxRecords()
			if (selectRecords.length < 3) {
				this.$message({
					message: '最少保留3列！',
					type: 'warning'
				});
				return
			}
			this.tableData.forEach(item => {
				let index = selectRecords.findIndex(item1 => {
					return item.id == item1.id
				})
				if (index != -1) {
					item.visible = true
				} else {
					item.visible = false
				}
			})
			const initTableColumn = [...this.fixedTable, ...this.tableData]
			this.$emit('change', initTableColumn)
		},
		changeRowH(val) {
			this.$emit('update:rowH1Check', val);
			this.$http.post(this.$utils.getSupportUrl() + "/web/erp/support/buriedLog/save", {
				type: 102,
				content: val ? '单行行高' : '双行行高'
			}, { silence: true });
		}
	}
}
</script>

<style lang="scss" scoped>
._contains {
	position: absolute;
	top: 0;
	left: 10px;
	background: white;
	width: 250px;
	overflow: hidden;
	box-shadow: 0px 5px 15px 0 rgba(0, 0, 0, 0.5);
	border-radius: 5px;
	z-index: 1000;
	overflow: auto;
	height: 400px;
	border-radius: 3px;
	.title{
		height: 36px;
		background: #f5f6f7;
		font-size: 14px;
		color: #171f25;
		line-height: 36px;
		text-indent: 15px;
	}
	.bottom {
		height: 40px;
		padding: 8px 18px 0;
		line-height: 40px;
		.box{
			position: relative;
			display: flex;
			align-items: center;
			border-top: 1px solid #f2f2f2;;
			::v-deep .el-switch{
				margin-left: 10px;
				span {
					font-weight: normal;
				}
			}
			.tips{
				position: absolute;
				left: 70px;
				width: 40px;
				height: 24px;
			}
		}
	}
}
.icon-drag {
	cursor: pointer;
}
::v-deep .vxe-table--render-default.column-set .vxe-body--column{
	line-height: 30px;
	.c--title{
		padding-left: 3px !important;
		padding-right: 3px !important;
	}
}

// 开关
::v-deep .el-switch.print-switch-sm {
	height: 16px;
	line-height: 16px;
	.el-switch__core {
		width: 28px !important;
		height: 16px !important;
		&:after {
			width: 12px;
			height: 12px;
		}
	}
	>span{
		line-height: 20px;
	}
}
::v-deep .el-switch.print-switch-sm.is-checked .el-switch__core::after {
	margin-left: -14px;
}
</style>
