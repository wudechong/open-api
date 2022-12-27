<template lang="pug">
	el-dialog(:visible='show' title='关闭采购单' width="500px" @close="close" :close-on-click-modal='false')
		ul._container
			li(style="display:flex")
				label.label-width-4 {{$t('trade.batchClose.closeReason')}}:
				el-input(type="textarea" :rows="8" v-model="form.reason")
			li(style="display:flex")
				label.label-width-4 {{$t('trade.batchClose.specialTip')}}:
				span
					p 采购订单关闭：将不能后续入库操作，未到货将取消在途，已到货仍记实际库存。
					p 退货订单关闭：将不能后续出库操作，未出库将取消锁定，已出库仍记实际库存。
		span.footer-btn(slot="footer")
			el-button.button-w--80(type="primary" @click="confirm") {{$t('trade.batchClose.confirm')}}
			el-button.button-w--80-hover(@click="cancel") {{$t('trade.batchClose.cancel')}}
</template>

<script>

export default {
	name: 'BatchClose',
	components: {},
	props: {
		show:Boolean,
	},
	mixins: [],
	data() {
		return {
			form: {
				reason: ''
			}
		};
	},
	computed: {},
	watch: {
		show (val) {
			if (val) {
				this.init()
			}
		}
	},
	created() {},
	mounted() {},
	methods: {
		init () {
			this.form = {
				reason: '',
			}
		},
		confirm () {
			this.$emit('confirm',this.form)
		},
		cancel () {
			this.$emit('close')
		},
		close () {
			this.$emit('close')
		}
	},
	}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
._container {
	height: 200px;
	margin: 24px 32px;
  > li {
	  	margin:8px 0;
  }
}
</style>