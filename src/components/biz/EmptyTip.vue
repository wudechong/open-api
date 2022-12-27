<template lang="pug">
	.empty-box(:style="{'margin-top': marginTop}")
		img(src="//hpublic.oss-cn-hangzhou.aliyuncs.com/erp/images/trade/nodata.svg")
		span(v-if="loading")
			| 请稍等，数据正在加载中...
		span(v-else)
			| 暂无数据
</template>

<script>
export default {
	name: "EmptyTip",
	props: {
		loading: Boolean,
		marginTop: {
			type: String,
			default: '-15%'
		}
	},
	components: {},
	watch: {},
	data() {
		return {};
	},
	methods: {},
};
</script>

<style lang="scss" scoped>
.empty-box {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	img {
		opacity: 0.6;
	}
	> span {
		font-size: 14px;
		color: #acadaf;
		opacity: 0.6;
	}
}
</style>
