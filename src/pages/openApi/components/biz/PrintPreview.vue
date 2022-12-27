<template lang="pug">
	div
		el-dialog(:visible="show" @close="close" v-dialogDrag width="960px" :title="titleHead" :close-on-click-modal="false")
			div.box
				div.tools
					div
						|当前使用模版 :
						hp-cascader-select(v-model="template" :clearable="false" :filterable="false" :options="temList" :props="{ label:'name', value: 'id'}" @change="temChange")
					div
						i(class="icondenglu iconfont i-blue")
						a(@click='designTem') 设计打印模版
				div.table
					vxe-table(ref="xTable" v-loading="loading" stripe width="100%" height="300px" :data="tableData" row-id="rowID" resizable highlight-hover-row highlight-current-row  header-align="center" column-draggable :column-key="true" show-overflow="tooltip" show-header-overflow="tooltip" :edit-config="{trigger: 'manual', mode: 'row',autoClear: false}"  @current-change='currentChange')
						vxe-table-column(align='center' field='opaction'  col-id="opaction" title="操作" width="100")
							template(v-slot='{ row, rowIndex }')
								template(v-if="$refs.xTable.isActiveByRow(row)")
									span.i-blue.cursor(@click="saveRowEvent(row)" style="padding-right:4px") 保存
									span.i-blue.cursor(@click="cancelRowEvent(row)") 取消
								template(v-else)
									span.i-blue.cursor(@click="editRowEvent(row)") 编辑
						vxe-table-column(:title='title'  align="center" width="100")
							template(v-slot="{ row }")
								span(:class="[defaultEXpressName === row.relationName ? 'express-Name-active' : '']") {{row.relationName}}
						vxe-table-column(title='默认打印机' :edit-render="{}" width="100")
							template(v-slot:edit="{row}")
								hp-cascader-select(v-model="curRow.printer" filterable :options="printerList" :props="{ label:'key', value: 'value'}"
							@change="(value, node)=>selectChange(row)" )
							template(v-slot="{row}")
								span {{row.printer}}
						vxe-table-column(title='份数' align='center' width="60" field="copies" :edit-render="{}")
							template(v-slot:edit="{row}")
								hp-input-number.input--small(v-model='curRow.copies' :precision='0')
						vxe-table-column(title='打印笔数' :edit-render="{}")
							template(v-slot:edit="{row}")
								span 每打印
								hp-input-number.input--small(v-model='curRow.taskNum' :precision='0')
								span 笔订单
							template(v-slot="{row}")
								span(v-show="row.taskNum") {{row.taskNum}} 笔
						vxe-table-column(title='上下偏移(毫米)'  :edit-render="{}")
							template(v-slot:edit="{row}")
								span 向
								span.direction-box
									span( @click='chooseDirection(1,curRow)' :class="[curRow.taskNum && curRow.top && curRow.topOffset < 0? 'bg-color2' : '']") 上
									span( @click='chooseDirection(2,curRow)' :class="[curRow.taskNum && curRow.top && curRow.topOffset > 0? 'bg-color' : '']") 下

								span 偏
								hp-input-number.input--small(v-model="curRow.top" :precision='0')
								span 毫米
							template(v-slot="{row}")
								span(v-if="row.topOffset") {{row.topOffset<0? "上":"下"}} 偏 {{row.top}}毫米
						vxe-table-column(title='左右偏移(毫米)' width="200" :edit-render="{}")
							template(v-slot:edit="{row}")
								span 向
								span.direction-box
									span( @click='chooseDirection(3,curRow)' :class="[curRow.taskNum && curRow.left && curRow.leftOffset < 0? 'bg-color2' : '']") 左
									span( @click='chooseDirection(4,curRow)' :class="[curRow.taskNum && curRow.left && curRow.leftOffset > 0? 'bg-color' : '']") 右
								span 偏
								hp-input-number.input--small(v-model="curRow.left" :precision='0')
								span 毫米
							template(v-slot="{row}")
								span(v-if="row.leftOffset") {{row.leftOffset>0? "右":"左"}} 偏 {{row.left}}毫米

			span(slot="footer" class="dialog-footer")
				el-button(type="primary" @click='printView') 打印预览
				el-button(plain @click='clickPrint')  打印
</template>

<script>
import { mapState } from "vuex";
import deepClone from "lodash/cloneDeep";
import OperationBar from "@components/biz/OperationBar";
export default {
	name: "PrintPreview",
	props: {
		show: {
			type: Boolean,
			default: false,
		},
		templateType: Number,
		defaultEXpressName: String,
		data: Array,
		expressType: Number
	},
	components: {
		OperationBar,
	},
	data() {
		return {
			headTitle: "打印单据类型",
			tableData: [],
			printConfig: [],
			printerList: [],
			// currentTemplate: null,
			// express: null,
			// expressList: [],
			// expressData: null,
			curRow: null, //当前编辑的行
			// titleType: "",

			temList: [],
			currentTemplate: {},
     	 	template: undefined,
			loading: false,
		};
	},
	computed: {
		...mapState("common", ["shopGroup", "warehouseGroup"]),
		title() {
			let value = "配货单";
			switch (this.expressType) {
				case "1":
				case 1:
					value = "快递公司";//快递单
					break;
				case "2":
				case 2:
				case "9":
				case 9:
					value = "打印单据类型";
					break;
				case "3":
				case 3:
					value = "配货单";
					break;
			}
			return value;
		},
		titleHead() {
			let value = "配货单打印设置";
			switch (this.expressType) {
				case "1":
				case 1:
					value = "快递单打印设置";
					break;
				case "2":
				case 2:
					value = "发货单打印设置";
					break;
				case "9":
				case 9:
					value = "打印预览与设置: 打印配置已绑定您的登录账号，您可在任何一台电脑上登录该账号使用当前打印配置"
			}
			return value;
		},
	},
	watch: {
		async show(val) {
			if (val) {
				await this.getPrintTemplate()
				this.init()
				this.getPrintConfig()
				this.printerList = window.PrintCenter.getPrinterList();
			}
		},
	},
	created() {},
	methods: {
		editRowEvent(row) {
			this.curRow = deepClone(row);
			this.$refs.xTable.setActiveRow(row);
		},
		cancelRowEvent(row) {
			const xTable = this.$refs.xTable;
			xTable.clearActived().then(() => {
				// 还原行数据
				xTable.revertData(row);
			});
		},
		saveRowEvent(row) {
			if (this.expressType != 1) {
				if (!this.currentTemplate) {
					this.$message({
						message: "请选择使用模板",
						type: "warning",
					});
					return;
				}
			}
			this.editClosed();
			this.tableData.forEach((v) => {
				if (this.expressType !== 1) {
					v.relationID = this.currentTemplate && this.currentTemplate.type;
				}
			});
			if (this.expressType !== 1) {
				this.curRow.relationID =
					this.currentTemplate && this.currentTemplate.type;
			}
			const body = JSON.parse(JSON.stringify([this.curRow]));
			this.$refs.xTable.clearActived().then(async () => {
				const loading = this.$loading({
					text: "正在保存",
				});
				const r = await this.$http.post("/service/erp/print/configs/update", {
					configs: body,
				});

				loading.close();
				const res = await this.$http.get("/service/erp/print/configs/get");
				if (res) {
					localStorage.printConfigs = JSON.stringify(res);
					this.getPrintConfig();
				}
			});
		},
		editClosed() {
			this.curRow.topOffset =
				this.curRow.topOffset < 0 || !this.curRow.topOffset
					? -this.curRow.top
					: this.curRow.top;
			this.curRow.leftOffset =
				this.curRow.leftOffset < 0 || !this.curRow.leftOffset
					? -this.curRow.left
					: this.curRow.left;
		},
		selectChange(row) {
			row.state$ = "MODIFIED";
		},
		currentChange({ row }) {
			this.expressData = row;
		},
		/**
		 * 打印配置
		 */
		getPrintConfig () {
			this.loading = true
			return this.$http.get(`/service/erp/print/configs/get`).then(r => {
				if (r) {
				let arr = []
				r.forEach(v => {
					v.isNumEdit = false
					v.isUpEdit = false
					v.isLeftEdit = false
					v.isEdit = false
					v.left = v.leftOffset ? Math.abs(v.leftOffset) : null
					v.top = v.topOffset ? Math.abs(v.topOffset) : null
					if (v.templateType === this.templateType) { // 入库单
					arr.push(v)
					}
				})
				this.tableData = this.printConfig = arr
				}
			}).finally(() => {
				this.loading = false
			})
		},
		/**
		 * 得到打印模板
		 */
		async getPrintTemplate () {
			return this.$http.post(`/service/erp/templates/query`, {
				includeSimilarTypes: false,
				system: false,
				type: this.templateType,
			}).then(async r => {
				this.temList = r
				this.template = r[0] ? r[0].id : ''
				this.currentTemplate = r[0]
				r.forEach(item => {
					if (item.defaultTemplate) {
						this.template = item.id
						this.currentTemplate = item
					}
				})
			})
		},
		/**
		 * 选择模板
		 */
		temChange (id) {
			[this.currentTemplate] = this.temList.filter(item => {
				return item.id == id
			})
		},
		/**
		 * 设计打印模板
		 */
		async designTem () {
			if (this.data.length == 0) {
				this.$message.warning('请先勾选订单！')
				return
			}
			let [obj] = this.temList.filter(item => {
				return item.id == this.template
			})
			this.$http.get(`/service/erp/templates/templateEditorUrl/get`).then((res) => {
				if (res) {
					window.open(
						`${res}?templateID=${obj.id}&templateType=${obj.type}&subType=${obj.subType}`
					)
				}
			})
		},
		chooseDirection(type, row) {
			if (!row.taskNum) {
				return;
			}
			if (row.top) {
				if (type == 1) {
					row.topOffset = -row.top;
				}
				if (type == 2) {
					row.topOffset = row.top;
				}
			}
			if (row.left) {
				if (type == 3) {
					row.leftOffset = -row.left;
				}
				if (type == 4) {
					row.leftOffset = row.left;
				}
			}
		},
		/**
		 * 获得打印模板数据
		 */
		async getPrintData (preview) {
			if (this.data.length == 0) {
				this.$message.warning('请先勾选订单')
				return
			}
			this.$message('正在打印')
			let ids = this.data.map(item => {
				return item.billID
			})
			let body = {
				directPrint: false,
				copies: this.printConfig[0].copies,
				leftOffset: this.printConfig[0].leftOffset,
				topOffset: this.printConfig[0].topOffset,
				taskNum: this.printConfig[0].taskNum,
				printer: this.printConfig[0].printer,
				ids,
				preview,
				templateID: this.currentTemplate && this.currentTemplate.id,
				templateType: this.templateType,
				sourceType: 1,
				relationID: this.currentTemplate && this.currentTemplate.id,
				relationName: this.currentTemplate && this.currentTemplate.name,
				others: {
				billType: 0
				}
			}
			return this.$http.post(`/service/erp/print/printData/get`, body).then(r => {
				return { r, body }
			}).finally(() =>
				this.$loading().close()
			)
			},
		/**
		 * 打印预览
		 */
		async printView () {
			if (this.data.length == 0) {
				this.$message.warning('请先勾选订单！')
				return
			}
			let obj = await this.getPrintData(true)
			window.PrintCenter.print(obj.r.printRequests, 0,)
		},
		/**
		 * 打印
		 */
		printHandle ({ r, body }) {
			return new Promise((resolve, reject) => {
				window.PrintCenter.print(r.printRequests, 1, (billIDs, billNos, msg, status) => {
					body.ids = billIDs.split(',')
					resolve({ body, status, msg })
				})
			})
		},
		/**
		 * 更新打印状态
		 */
		async updateStatus ({ body, status, msg }) {
			this.$http.post(`/service/erp/print/status/update`, {
				copies: body.copies,
				msg,
				ids: body.ids,
				status,
				type: body.templateType,
				sourceType: 0,
				others: {
				billType: 0
				}
			}).then(r => {
				if (r.code === 0) {
				this.$message({
					isShowCancelBtn: false,
					content: r.message,
					confirmBtnText: "确定"
				})
				}
			})
		},
		async clickPrint () {
			if (this.data.length == 0) {
				this.$message.warning('请先勾选订单！')
				return
			}
			let obj = await this.getPrintData(false)
			obj = await this.printHandle(obj)
			this.updateStatus(obj)
		},
		close () {
			this.$emit('close')
		},
		init () {
			this.template = this.temList[0].id
			this.currentTemplate = this.temList[0]
			this.temList.forEach(item => {
				if (item.defaultTemplate) {
					this.template = item.id
					this.currentTemplate = item
				}
			})
		},
	}
};
</script>

<style lang="scss" scoped>
.input--small {
	width: 32px !important;
}
.express-Name-active {
	color: $color-red;
}
.direction-box {
	display: inline-block;
	height: 24px;
	line-height: 24px;
	background-color: $border-color;
	color: #ffffff;
	margin: 0 10px;
	border-radius: 4px;

	> span {
		display: inline-block;
		height: 24px;
		line-height: 24px;
		padding: 0 4px;
	}
	> .bg-color {
		background-color: $color-blue;
		color: $color-white;
		border-top-right-radius: 4px;
		border-bottom-right-radius: 4px;
	}
	> .bg-color2 {
		background-color: $color-blue;
		color: $color-white;
		border-top-left-radius: 4px;
		border-bottom-left-radius: 4px;
	}
}
.box {
	.tools {
		display: flex;
		justify-content: space-between;
		padding: 16px;
		a {
			padding-left: 4px;
		}
	}
}
.footer {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 16px;
}
::v-deep .vxe-header--column {
	background-image: linear-gradient(#fff,#fff),linear-gradient(#fff,#fff) !important;
}
::v-deep .vxe-table .vxe-body--column {
    vertical-align: inherit;
}
::v-deep .vxe-table--render-default.size--mini .vxe-body--column.col--ellipsis {
	height: 29.6px;
}
</style>
