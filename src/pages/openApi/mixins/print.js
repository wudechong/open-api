export default {
	data () {
	  return {
		printConfig: [],
		template: undefined,
		currentTemplate: {},
  
	  }
	},
	created () {
	  this.getPrintConfig()
	  this.getPrintTemplate()
	},
	methods: {
	  // 打印调用此方法
	  // 打印
	  async print () {
		let obj = await this.getPrintData(false)
		obj = await this.printHandle(obj)
		this.updateStatus(obj)
	  },
	  // 打印配置
	  async getPrintConfig () {
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
			this.printConfig = arr
		  }
		})
	  },
	  // 打印模板
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
	  // 获取打印模板数据
	  async getPrintData (preview) {
		this.$message('正在打印')
		let ids = this.selectData.map(item => {
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
		  // view: 'outbound.widget.AutoPrint',
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
	  // 打印
	  printHandle ({ r, body }) {
		return new Promise((resolve, reject) => {
		  window.PrintCenter.print(r.printRequests, 1, (billIDs, billNos, msg, status) => {
			body.ids = billIDs.split(',')
			resolve({ body, status, msg })
		  })
		})
	  },
	  // 更新打印状态
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
	},
  }