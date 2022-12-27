<template lang="pug">
	.contains
		header
			img.img(src="@/assets/img/openApi/ServiceSupport/微信.svg")
			label.labelSmallTitile-20 万里牛API对接微信企业群，请扫码加入
		footer
			label 如果您在对接在开发过程中遇到问题，请加该群。在申请信息中填写对应公司及问题，否则不能通过。 如有其他erp业务问题可以直接咨
			label 询在线客服同学，本群只提供api对接支持。
			label(style="margin-top:20px") 提示：提供的测试账号广大商户都在使用，所以不要把正式数据推送到测试账号。
</template>

<script>

export default {
	components: {},
	props: {},
	mixins: [],
	data() {
		return {

		};
	},
	computed: {},
	watch: {},
	created() {},
	mounted() {},
	methods: {},
	}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.contains {
	> header {
		width: 925px;
		height: 221px;
		background: #F4F8FE;
		margin: 40px 0 0 15px;
		display: flex;
		.img {
			margin-left: 66px;
		}
	}
	> footer {
		display: flex;
		flex-direction: column;
		margin: 46px 0 0 88px;
		> label {
			width: 838px;
			font-size: 14px;
			font-family: PingFangSC, PingFangSC-Regular;
			font-weight: 400;
			text-align: left;
			color: #000000;
			line-height: 22px;
		}
	}
}
.labelSmallTitile-20 {
	width: 360px;
	height: 28px;
	font-size: 20px;
	font-family: PingFangSC, PingFangSC-Semibold;
	font-weight: 600;
	text-align: left;
	color: #171f25;
	line-height: 28px;
	margin: auto;
}
</style>