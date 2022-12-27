<template lang="pug">
	el-dialog(:visible='show' title='提示信息' width="600px" @close='close')
		main(style="height:100%;padding:0 8px")
			vxe-table(:data="tableData" height='250' stripe :border="false" resizable column-key :show-overflow="'tooltip'" show-header-overflow="tooltip" sync-resize auto-resize highlight-current-row ref="xTable" header-align="center" row-id="_xid" size="mini")
				vxe-table-column(type="seq" width="40" align="center" fixed="left")
					template(v-slot:header="{ column }")
						i.el-icon-more(style="transform: rotate(90deg)")
				vxe-table-column(v-for="(config) in tableColumn" :key="config.id" header-align="center" :width="config.width" :title="config.title" :field="config.field" :align="config.align" sortable :fixed="config.fixed" :visible="config.visible")
					template(v-slot="{ row, rowIndex }")
						div(v-if="config.field === 'errorType'")
							div(v-if="row.errorType ==  400 && forceSubmit && checkType == 1") 能
							div(v-else) 不能
						div(v-else) {{row[config.field]}}
		span.footer-btn(slot="footer")
			el-button.button-w--110-hover(v-if="forceSubmit && checkType == 1" type="primary" @click="forceSubmitClick") 强制提交负库存商品
			el-button.button-w--110(v-if="showPush" type="primary" @click="confirm") {{confirmBtnText}}
			el-button.button-w--80-hover(@click="cancel") {{$t('common.cancel')}}
</template>

<script>

export default {
	name:'BatchError',
	components: {},
	props: {
		show:Boolean,
		data: {
			type: Array,
			default: () => []
		},
		typeErr: {
			type: String,
			default: undefined
		},
	},
	mixins: [],
	data() {
		return {
			tableColumn: [],
			wmsErrorList:[],
			errorList:[],
			showPush:false,
			loading: false,
			forceSubmit: false,
			checkType: undefined,
			confirmBtnText: '强制关闭'
		};
	},
	computed: {
		tableData () {
			return this.data
		},
	},
	watch: {
		data:{
			handler(val){
				val.forEach(item=>{
					if(item.pushWmsError){
						this.wmsErrorList.push(item)
					}
				})
				if(this.wmsErrorList.length>0){
					this.showPush=true
				}else{
					this.showPush=false
				}
				this.errorList = []
				val.forEach(item => {									// 如果有推外部系统失败的显示驳回发起人按钮
					if (this.typeErr == 'tradeApproval') {
						this.errorList.push(item)
						this.showPush = true
						this.confirmBtnText = '驳回发起人'
					}
				})
				this.forceSubmit = val.findIndex(item => item.errorType == 400) != undefined && val.findIndex(item => item.errorType == 400) != -1 ? true : false
			}
		}
	},
	async created() {
		this.tableColumn = [
			{ field: 'errorType', title: '能否强制提交', width: 150, align: 'center', visible: true},
			{ field: 'code', title: '单据编号', width: 150, align: 'center', id: '1', visible: true },
			{ field: 'message', title: '信息内容', align: 'left', id: '2', visible: true },
		]
		this.checkType = await this.getCheckType()
	},
	mounted() {},
	methods: {
		forceSubmitClick () {
			this.$emit('forceSubmit',this.tableData)
		},
		 // 获取负库存校验策略开关
		getCheckType () {
			return this.$http.get('/service/erp/purchase/get/inv/negative', {
			}).catch(() => {
				this.$loading().close()
			})
		},
		cancel () {
			this.$emit('close')
		},
		close () {
			this.$emit('close')
		},
		confirm(){
			if (this.confirmBtnText == '强制关闭') {
				this.$emit('handleWmsError',this.wmsErrorList)
				this.wmsErrorList=[]
			}else if (this.confirmBtnText == '驳回发起人') {
				this.$emit('returnStart',this.errorList)
			}
			this.$emit('close')
		}
	},
	}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
::v-deep .vxe-table .vxe-body--column {
    vertical-align: inherit;
}
</style>