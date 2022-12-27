<template lang="pug">
	div.urlDataDetail
		header
			div
				label.labelTitle 对接流程
			div(style="display: flex; justify-content: center;")
				img(src="@/assets/img/openApi/JoinGuide/编组 7.svg")
		div(v-html="data")
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
	header {
		margin: 20px 20px 0;
		.labelTitle {
			height: 20px;
			font-size: 20px;
			font-family: PingFangSC, PingFangSC-Semibold;
			font-weight: 600;
			text-align: left;
			color: #171f25;
			line-height: 20px;
		}
		img {
			width: 580px;
		}
	}
}
::v-deep .lake-content{
	margin: 20px;
	#ub4b0367b,#u68ae8f74,#u39950b3f,#u4219795c,#ud7b734c8 {
		display: flex;
    	justify-content: center;
		margin: 12px 0 24px 0;
	}
	#u42c0853e {
		display: none;
		justify-content: center;
		.ne-text {
			font-size: 20px !important;
			font-family: PingFangSC, PingFangSC-Semibold !important;
		}
	}
	#ub24b5029 {
		.ne-text {
			font-size: 16px !important;
			font-family: PingFangSC, PingFangSC-Semibold !important;
		}
	}
	#u1cc30a4a,#ubeeec24d,#uc64f4286,#u7bd7be5c,#u82889944 {
		.ne-text {
			font-size: 14px !important;
			font-family: PingFangSC, PingFangSC-Regular !important;
		}
	}
}
</style>