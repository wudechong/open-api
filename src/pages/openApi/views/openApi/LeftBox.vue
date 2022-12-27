<template lang="pug">
	div
		.contains
			.labelBox(v-for="(item, index) in data" :key="index" :class="{labelColor:tab == index}" @click="clickTab(index)")
				label.labelText {{item.label}}
</template>

<script>

export default {
	components: {},
	props: {
		type: String,
		data: Array
	},
	mixins: [],
	data() {
		return {
			tab: 0,
		};
	},
	computed: {},
	watch: {},
	created() {},
	mounted() {},
	methods: {
		clickTab(index) {
			this.tab = index
			this.$emit('clickTab', index)
		}
	},
	}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.contains {
	position: relative;
	top: 73px;
	.labelBox {
		height: 54px;
		width: 100%;
		border-radius: 3px;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		.labelText {
			width: 100px;
			height: 16px;
			font-size: 16px;
			font-family: PingFangSC, PingFangSC-Regular;
			font-weight: 400;
			text-align: left;
			color: #171f25;
			line-height: 16px;
			cursor: pointer;
		}
	}
	.labelColor {
		background: #D2DEF1;
	}
}
</style>