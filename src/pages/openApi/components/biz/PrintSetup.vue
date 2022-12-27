<template lang="pug">
  .print-setup
    el-dialog(:title="titleHead"
      ref="dialog" width="960px" :visible="show" :close-on-click-modal="false" @close="close")
      div.box
        div.tools
          div
            |当前使用模版：
            hp-cascader-select(v-model="template" :clearable="false" :filterable="false" :options="temList" :props="{ label:'name', value: 'id'}" @change="temChange")
            i(style="margin-left:30px" class="icondenglu iconfont i-blue")
            a(@click='designTem') 设计打印模版
      vxe-table.table-trades(ref="table" height="100px" :data="tableData"
        :edit-config="{trigger: 'click'}"
        @edit-closed='editClosed'
        :row-config="{isCurrent: true, isHover: true}"
        show-overflow="tooltip"
        show-header-overflow="tooltip"
        :highlight-hover-row="true"
        header-align="center"
        align="center"
        stripe
        resizable)
        vxe-table-column(type="" field="relationName" :title="title" width="153" className="express-name")
        vxe-table-column(type="" title="默认打印机" :edit-render="{}")
          template(v-slot:header="{ column }")
            |{{column.title}}
            i.iconfont.iconpiliangxiugai.primary-color
          template(v-slot="{row}") {{row.printer}}
          template(v-slot:edit="{row}")
            hp-item-select.large(v-model="row.printer" filterable :items="printerList" :props="{label:'key', value: 'value'}")
        vxe-table-column(type="" title="打印笔数" :edit-render="{autofocus: '.el-input__inner'}" width="196")
          template(v-slot:header="{ column }")
            |{{column.title}}
            i.iconfont.iconpiliangxiugai.primary-color
          template(v-slot="{row}") {{row.taskNum}} 笔
          template(v-slot:edit="{row}")
            label 每打印
            el-input-number.input(type="number" v-model="row.taskNum" size="mini" controls-position="right" :min="0")
            label 笔订单，向
        vxe-table-column(type="" title="上下偏移（毫米）" :edit-render="{autofocus: '.el-input__inner'}" width="220")
          template(v-slot:header="{ column }")
            |{{column.title}}
            i.iconfont.iconpiliangxiugai.primary-color
          template(v-slot="{row}") 偏 {{row.topOffset <= 0 ? '上' : '下'}} {{row.top}} 毫米
          template(v-slot:edit="{row}")
            span.controller
              el-button.direction(:class="{selected: row.topIdx <= 0}" @click="setDirection(row, 'top', -1)") 上
              el-button.direction(:class="{selected: row.topIdx > 0}" @click="setDirection(row, 'top', 1)") 下
            label 偏
            el-input-number.input(type="number" v-model="row.top" size="mini" controls-position="right" :min="0" @change="setCorrectVal(row)")
            label 毫米，向
        vxe-table-column(type="" title="左右偏移（毫米）" :edit-render="{autofocus: '.el-input__inner'}" width="194")
          template(v-slot:header="{ column }")
            |{{column.title}}
            i.iconfont.iconpiliangxiugai.primary-color
          template(v-slot="{row}") 偏 {{row.leftOffset <= 0 ? '左' : '右'}} {{row.left}} 毫米
          template(v-slot:edit="{row}")
            span.controller
              el-button.direction(:class="{selected: row.leftIdx <= 0}" @click="setDirection(row, 'left', -1)") 左
              el-button.direction(:class="{selected: row.leftIdx > 0}" @click="setDirection(row, 'left', 1)") 右
            label 偏
            el-input-number.input(type="number" v-model="row.left" size="mini" controls-position="right" :min="0" @change="setCorrectVal(row)")
            label 毫米

      template(slot="footer" class="dialog-footer")
        el-button(type="primary" @click="printView") 打印预览
        el-button(plain  @click="clickPrint") 打印
</template>

<script>
export default {
	name: 'PrintSetup',
	components: {},
	props: {
		show: Boolean,
		expressType: Number,
		data: Array,
		templateType: Number
	},
	data() {
		return {
			currentTemplate: null,
			tableData: [],
			printConfigs: null,
			template: undefined,
			printerList: [],
			temList: [],
			headerTitle:''
		}
	},
	mounted() {},
	watch: {
		async show(val) {
			if (val) {
				if (!this.printConfigs) {
					this.printConfigs = await this.getPrintCfg()
				}

				this.currentTemplate = null
				this.getPrintTemplate()
        		this.getPrintConfig()
				this.printerList = window.PrintCenter.getPrinterList()
			}
		},

	},
	computed: {
      title() {
        let title
        if (this.expressType == 1) {
          title = '快递公司'
        } else {
          title = '打印单据类型'
        }
        return title
      },
	  titleHead() {
			let value = "打印设置";
			switch (this.templateType) {
				case "201":
				case 201:
					value = "正次转换单打印设置";
					break;
				case "9":
				case 9:
					value = "打印预览与设置: 打印配置已绑定您的登录账号，您可在任何一台电脑上登录该账号使用当前打印配置"
			}
			return value;
		},
	},
	methods: {
		close() {
			this.$emit('close')
		},
		setDirection(row, dir, idx) {
			row[dir + 'Idx'] = idx
			row[dir + 'Offset'] = row[dir] * idx
			this.$forceUpdate()
		},
		setCorrectVal(row) {
			row.topOffset = row.top * (row.topOffset === 0 ? row.topIdx : row.topOffset < 0 ? -1 : 1)
			row.leftOffset = row.left * (row.leftOffset === 0 ? row.leftIdx : row.leftOffset < 0 ? -1 : 1)
			this.$forceUpdate()
		},
		editClosed ({ row, rowIndex, column }) {
			this.update()
		},
		// 获取打印配置
		getPrintCfg() {
			const result = this.$http.get('/service/erp/print/configs/get').then(r => {
				if (r) {
					let status = false
					r.some(item => {
						if (item.templateType == '201') {
							status = true
						}
					})
					if (!status) {
						r.push({relationID: "201", relationName: "正次转换单", templateType: 201, copies: 1, applicationType: 2})
					}
					return r
				}
			})
			return result
		},
		// 打印模板
		getPrintTemplate() {
			this.$http
				.post('/service/erp/templates/query', {
					includeSimilarTypes: false,
					system: false,
					type: this.templateType
				})
				.then(async r => {
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
		//  打印配置
		getPrintConfig() {
			let arr = [],
				list = this.printConfigs
			list.forEach(v => {
				if (v.templateType === this.templateType) {
					v.left = v.leftOffset ? Math.abs(v.leftOffset) : 0
					v.top = v.topOffset ? Math.abs(v.topOffset) : 0 
					v.leftOffset = v.leftOffset || 0
					v.topOffset = v.topOffset || 0
					v.topIdx = v.topOffset <= 0 ? -1 : 1
					v.leftIdx = v.leftOffset <=0 ? -1 : 1
					arr.push(v)
				}
			})
			this.$set(this, 'tableData', arr)
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
			this.$http.get(`/service/erp/templates/templateEditorUrl/get`).then((res) => {
				if (res) {
					window.open(
						`${res}?templateID=${this.currentTemplate.id}&templateType=${this.currentTemplate.type}&subType=${this.currentTemplate.subType}`
					)
				}
			})
		},
		update() {
			this.$http.post('/service/erp/print/configs/update', { configs: this.tableData }).then(r => {
				this.$message.success('保存成功')
			}).catch(err => console.log(err))
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
				copies: this.tableData[0].copies,
				leftOffset: this.tableData[0].leftOffset,
				topOffset: this.tableData[0].topOffset,
				taskNum: this.tableData[0].taskNum,
				printer: this.tableData[0].printer,
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
		async clickPrint () {
			if (this.data.length == 0) {
				this.$message.warning('请先勾选订单！')
				return
			}
			let obj = await this.getPrintData(false)
			obj = await this.printHandle(obj)
			this.updateStatus(obj)
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
		}
		}
	}
</script>

<style lang="scss" scoped>
$main-color: #007eeb;
.primary-color {
	color: $primary-color;
}
.input {
	width: 72px;
	margin: 0 4px;
}
::v-deep {
	.el-input > .el-input__inner[type='number'] {
		padding-right: 0;
	}
	.vxe-table--body .vxe-cell {
		line-height: 32px;
	}
	.vxe-table--render-default.vxe-editable.size--mini .vxe-body--column {
	}
	.vxe-table--render-default.vxe-editable .vxe-body--column.col--actived {
	}
	.express-name .vxe-cell {
	}
}
.direction {
	width: 24px;
	height: 24px;
	overflow: hidden;
	padding: 0;
	margin: 0;
	border: none;
}
.controller {
	margin-right: 12px;
}
.controller .direction {
	background: #d6d8d9;
	color: #87959c;
	&.selected {
		background: $main-color;
		color: #fff;
	}
	&:first-child {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}
	&:last-child {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
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
</style>
