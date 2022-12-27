<template lang="pug">
	div.urlDataDetail(v-html="data")
</template>

<script>

export default {
	components: {},
	props: {
		data: String
	},
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
.urlDataDetail {
	
}
::v-deep .lake-content{
	margin: 10px 30px;
	font-size: 15px;
	p:nth-child(2n) {
		margin: 26px 0 17px;
		padding: 0 10px;
		background: #f4f8fe;
		width: 925px;
		height: 86px;
		display: flex;
    	align-items: center;
		span {
			font-size: 14px;
			font-family: PingFangSC, PingFangSC-Semibold !important;
			color: #7E848A !important;
		}
	}
	p:nth-child(2n + 1) {
		border-top: 1px dashed #979797;
    	padding-top: 13px;
		span {
			font-size: 16px;
			font-family: PingFangSC, PingFangSC-Semibold !important;
		}
	}
}
</style>