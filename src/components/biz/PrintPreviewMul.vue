<template lang="pug">
	div
		el-dialog(:visible="show" @close="close" width="960px" title="打印设置"  :close-on-click-modal="false" )
			div.box
				div.tools
					div.checkBoxList
						|需要打印的单据：
						el-checkbox-group(v-model="printsTypes" )
							el-checkbox(v-for="(button,i) in checkBoxList" :label="button.value" :key="button.value" :disabled="button.disabled" )  {{button.label}}
					
							
					div(v-if="radioBtnList.length>1")
						el-radio-group(v-model="radio1" @change="radioChange")
							el-radio-button.radioBtn(v-for="(button,i) in radioBtnList" :label="button.value" :key="button.value") {{button.label}}
				
				div.table
					vxe-table(ref="xTable" stripe width="100%" height="400px"  :data="tableData" row-id="rowID" resizable highlight-hover-row highlight-current-row  header-align="center" align="center" column-draggable :column-key="true" show-overflow="tooltip" show-header-overflow='tooltip' :edit-config="{trigger: 'click', mode: 'row'}" :row-config="{isCurrent: true, isHover: true}" @edit-actived='editActived' @edit-closed='editClosed'  )
						vxe-table-column(title='打印单据类型'  align="center" width="100")
							template(v-slot="{ row }")
								span(:class="[expressID === row.relationID ? 'express-Name-active' : '']") {{row.relationName}}
						vxe-table-column(title='默认打印机' :edit-render="{}" width="110" field="printer")
							template(v-slot:header="{ column }")
								span {{column.title}}
								i(class="iconpiliangxiugai iconfont i-blue2")
							template(v-slot:edit="{row}")
								hp-cascader-select(v-model="row.printer" filterable :options="printerList" :props="{ label:'key', value: 'value'}"
							@change="(value, node)=>selectChange(row)" )
							template(v-slot="{row}")
								span {{row.printer}}
						vxe-table-column(title='份数'  align='center' width="60" field="copies" :edit-render="{autofocus: '.el-input__inner'}" )
							template(v-slot:header="{ column }")
								span {{column.title}}
								i(class="iconpiliangxiugai iconfont i-blue2")
							template(v-slot:edit="{row}")
								hp-input-number.input--small(v-model='row.copies' :precision='0'  ref="copiesref")
							template(v-slot="{row}")
								span(v-show="row.copies") {{row.copies}}
						vxe-table-column(title='打印笔数' :edit-render="{autofocus: '.el-input__inner'}"  field="taskNum")
							template(v-slot:header="{ column }")
								span {{column.title}}
								i(class="iconpiliangxiugai iconfont i-blue2")
							template(v-slot:edit="{row}")
								span 每打印
								hp-input-number.input--small(v-model='row.taskNum' :precision='0')
								span 笔订单
							template(v-slot="{row}")
								span(v-show="row.taskNum") {{row.taskNum}} 笔
						vxe-table-column(title='上下偏移(毫米)'  :edit-render="{autofocus: '.el-input__inner'}"  field="topBtOffset")
							template(v-slot:header="{ column }")
								span {{column.title}}
								i(class="iconpiliangxiugai iconfont i-blue2")
							template(v-slot:edit="{row}")
								span 向
								span.direction-box
									span.cs-p( @click='chooseDirection(1,row)' :class="[row.taskNum && row.top && row.topOffset < 0? 'bg-color2' : '']") 上
									span.cs-p( @click='chooseDirection(2,row)' :class="[row.taskNum && row.top && row.topOffset > 0? 'bg-color' : '']") 下

								span 偏
								hp-input-number.input--small(v-model="row.top" :precision='0' )
								span 毫米
							template(v-slot="{row}")
								span(v-if="row.topOffset") {{row.topOffset<0? "上":"下"}} 偏 {{row.top}}毫米
						vxe-table-column(title='左右偏移(毫米)' width="200" :edit-render="{autofocus: '.el-input__inner'}"  field="leftRiOffset")
							template(v-slot:header="{ column }")
								span {{column.title}}
								i(class="iconpiliangxiugai iconfont i-blue2")
							template(v-slot:edit="{row}")
								span 向
								span.direction-box
									span.cs-p( @click='chooseDirection(3,row)' :class="[row.taskNum && row.left && row.leftOffset < 0? 'bg-color2' : '']") 左
									span.cs-p( @click='chooseDirection(4,row)' :class="[row.taskNum && row.left && row.leftOffset > 0? 'bg-color' : '']") 右
								span 偏
								hp-input-number.input--small(v-model="row.left" :precision='0' )
								span 毫米
							template(v-slot="{row}")
								span(v-if="row.leftOffset") {{row.leftOffset>0? "右":"左"}} 偏 {{row.left}}毫米
				div.printRemind(v-if="showPrintRemind")
					el-checkbox(v-model="printRemind") 已打印提醒 
					el-tooltip(placement="top-start" :open-delay="300")
						div(slot="content")
							span 勾选：已经打印过的订单将提示是否再次打印</br>
							span 不勾选：已经打印过得订单将不再打印
						i.iconfont.iconyiwentishi.i-yellow

			span(slot="footer" class="dialog-footer")
				el-button(plain @click="saveHandle") 保存设置
</template>

<script>
import { mapState } from "vuex";
import deepClone from "lodash/cloneDeep";
// import OperationBar from "@components/biz/OperationBar";
export default {
	name: "PrintPreviewMul",
	props: {
		show: {
			type: Boolean,
			default: false,
		},
		showPrintRemind: {
			type: Boolean,
			default: false,
		},
        processStatus:{
            type: Number,
			default: 3,

        },
		expressID: {
			type: String,
			default: null,
		},
		radioBtnList: {
			type: Array,
			default: () => {
				return [
					{ label: "快递单设置", value: "1", key: "express", disabled: true },
					{ label: "发货单单设置", key: "send", value: "2" },
					{ label: "吊牌设置", key: "tag", value: "3" },
				];
			},
		},
		checkBoxList: {
			type: Array,
			default: () => {
				return [
					{ label: "快递单", value: "1", key: "express" },
					{ label: "发货单", key: "send", value: "2" },
					{ label: "吊牌", key: "tag", value: "3" },
				];
			},
		},
	},
	components: {},

	data() {
		return {
			printsTypes: ["1"],
			radio1: "1",
			tableData: [],
			expressData: [], //快递单
			sendData: [],
			tagData: [],

			printerList: [],
			curRow: null, //当前编辑的行
			printRemind: false,
		};
	},
	computed: {
		...mapState("common", ["shopGroup", "warehouseGroup"]),
		...mapState("common", ["routerInfo"]),
	},
	watch: {
		show(val) {
			if (val) {
                this.radio1= "1";
				this.getPrintConfig();
				this.printerList = window.PrintCenter.getPrinterList();
				this.getPrintType();
				if(this.showPrintRemind){
					this.getPrintRemindsConfig()
				}
				
			}
		},
	},
	created() {},
	methods: {
		radioChange(val) {
			switch (val) {
				case "1":
					this.tableData = this.expressData;
					break;
				case "2":
					this.tableData = this.sendData;
					break;
				case "3":
					this.tableData = this.tagData;
					break;
			}
		},
		editActived({ row, rowIndex, column }) {
			this.curRow = deepClone(row);
		},
		editClosed({ row, rowIndex, column }) {
			switch (column.property) {
				case "printer": //默认打印机
					if (this.curRow.printer != row.printer) {
						row.state$ = "MODIFIED";
					}
					break;
				case "copies": //份数
					if (this.curRow.copies != row.copies) {
						row.state$ = "MODIFIED";
					}
					break;
				case "taskNum": //打印笔数
					if (this.curRow.taskNum != row.taskNum) {
						row.state$ = "MODIFIED";
					}
					break;
				case "topBtOffset": //
					if (
						this.curRow.top != row.top ||
						this.curRow.topOffset != row.topOffset
					) {
						row.state$ = "MODIFIED";
					}
					break;
				case "topBtOffset":
					if (
						this.curRow.left != row.left ||
						this.curRow.leftOffset != row.leftOffset
					) {
						row.state$ = "MODIFIED";
					}
					break;
			}
		},
		// 获取打印类型配置
		async getPrintType(status) {
			let printsTypes = [];
			try {
				const r = await this.$http.get(`/service/erp/print/configs/auto/get`, {
					processStatus: this.processStatus,
				});
				if (r.expressStatus) {
					printsTypes.push("1");
				}
				if (r.dispatchStatus) {
					printsTypes.push("2");
				}
				if (r.tagStatus) {
					printsTypes.push("3");
				}
				this.printsTypes = printsTypes;
			} catch (error) {}
		},
		async getPrintRemindsConfig(){
				try {
				let url = `${this.routerInfo.host}/saleTradeController.do?method=getPrintTipSwitch`;
				const r = await this.$http.get(url);
				this.printRemind=r;
			
			} catch (e) {}

		},
		// 保存后台配置
		async saveConfig() {
			const isExpress = this.printsTypes.includes("1");
			const isSend = this.printsTypes.includes("2");
			const isTag = this.printsTypes.includes("3");
			let data = {
				processStatus: this.processStatus,
				expressStatus: isExpress ? 1 : 0,
				dispatchStatus: isSend ? 1 : 0,
				tagStatus: isTag ? 1 : 0,
			};
			try {
				const r = await this.$http.post(
					"/service/erp/print/configs/auto/update",
					data
				);
			} catch (error) {}
		},
		//保存打印配置
		async savePrintConfig() {
			let arr = [],
				allTemplate = [...this.expressData, ...this.tagData, ...this.sendData];
			allTemplate.forEach((v) => {
				if (v.state$ === "MODIFIED") {
					arr.push(v);
				}
			});
			if (!arr.length) {
				this.close();
				return;
			}
			const loading = this.$loading({
				text: "正在保存",
			});
			let body = deepClone(arr);
			try {
				const r = await this.$http.post("/service/erp/print/configs/update", {
					configs: body,
				});
				loading.close();
				if (!r.code) {
					this.close();
					this.$message.success("保存成功");
				}
			} catch (err) {}
		},
		//保存设置
		async saveHandle() {
			this.saveConfig();
			if(this.showPrintRemind){
				this.saveConfig2();
			}
			
			this.savePrintConfig();
		},

		selectChange(row) {
			row.state$ = "MODIFIED";
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
		//  打印配置
		async getPrintConfig() {
			let arr = [],
				arr2 = [],
				arr3 = [];
			let list = await this.$http.get(`/service/erp/print/configs/get`);
			if (list.code) {
				return;
			}
			list.forEach((v) => {
				v.isNumEdit = false;
				v.isUpEdit = false;
				v.isLeftEdit = false;
				v.isEdit = false;
				v.leftOffset = v.leftOffset;
				v.topOffset = v.topOffset;
				v.left = v.leftOffset ? Math.abs(v.leftOffset) : null;
				v.top = v.topOffset ? Math.abs(v.topOffset) : null;
				if (v.templateType === 1) {
					// 快递单
					arr.push(v);
				} else if (v.templateType === 2) {
					arr2.push(v);
				} else if (v.templateType === 26) {
					arr3.push(v);
				}
			});
			this.tableData = this.expressData = arr;
			// 选中的快递名标红
			if (this.expressID) {
				this.tableData.forEach((r) => {
					if (this.expressID == r.relationID) {
						this.$set(r, "isChecked", true);
					}
				});
			}
			this.sendData = arr2;
			this.tagData = arr3;
		},
		async saveConfig2(){
			try {
				let param={open:this.printRemind}
				let url = `${this.routerInfo.host}/saleTradeController.do?method=savePrintTip`;
				const r = await this.$http.get(url,param);
			
			} catch (e) {}

		},


		cancel() {
			this.$emit("close");
		},
		close() {
			this.$emit("close");
		},
	},
};
</script>

<style lang="scss" scoped>
.i-blue2 {
	color: $primary-color;
}
.input--small {
	width: 32px !important;
}
.express-Name-active {
	color: $color-red;
}
.printRemind {
	margin-left: 16px;
	margin-top:8px;
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
		.checkBoxList {
			display: flex;
			::v-deep.el-checkbox {
				margin-right: 10px;
			}
		}
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
</style>
