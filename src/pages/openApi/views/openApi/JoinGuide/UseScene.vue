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
	margin: 20px;
	.ne-text {
		font-size: 14px !important;
		font-family: PingFangSC, PingFangSC-Regular !important;
	}
	#u7a0b1429,#udfdbd976,#u817f5e5e,#ud581dcfd,#ub554e4e2,#u2779aa9a {
		.ne-text {
			font-size: 20px !important;
			font-family: PingFangSC, PingFangSC-Semibold !important;
		}
	}
	#u08507258,#ubaf9c373,#udad3965f,#ud9a005ec,#uf0d1bf07,#u19bbc2da,#uf879b3df,#u668180b9,#u2a17511e,
	#u25aed761 {
		.ne-text {
			font-size: 16px !important;
			font-family: PingFangSC, PingFangSC-Semibold !important;
		}
	}
	#u7a0b1429,#ud581dcfd,#u25aed761,#u30dc4e27,#u128b98be,#u3693f19f,#u51ca9922 {
		margin-bottom: 12px;
	}
	#udfdbd976,#u817f5e5e,#ub554e4e2,#u2779aa9a,#u8aa17bda {
		margin: 24px 0 12px 0;
	}
	#u265e23ef {
		display: none;
	}
	#ubaf9c373,#udad3965f,#ud9a005ec,#uf0d1bf07 {
		margin-top: 8px;
	}
	table {
		margin: 8px 0 24px 24px;
	}
	#u1af834d4,#ud07a581b,#ubca33152,#uee9d68b7,#u24bda00b,#uafc8350f,#u59740c8d,#u5b759cb3,#u8f8b7960,#u0c3b616b {
		margin: 8px 0 12px;
	}
	#ubdb7e20b {
		a {
			font-size: 15px;
		}
	}
}
</style>