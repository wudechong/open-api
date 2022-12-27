<template lang="pug">
	div.urlDataDetail
		h2 JavaSDK实例
		label hopi-request.jar是万里牛提供的java调用接口jar包；
		label TestOpenApi2.java是测试类，使用了订单查询接口调用测试，如有需求，可以下载使用。
		a
			i.iconfont.iconlianjieicon(style="font-size: 14px") 接口调用SDK及示例.rar

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
	margin: 20px;
	display: flex;
	flex-direction: column;
	height: 64px;
    justify-content: space-between;
	font-size: 14px;
	a {
		margin-top: 12px
	}
}
::v-deep .lake-content{
	margin: 20px;
	p {
		margin: 10px;
	}
}
</style>