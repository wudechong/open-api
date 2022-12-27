<template lang="pug">
	div._contains
		.left
			component(:is="componentId" :type="componentId" :data="leftLabelList" @clickTab="clickTab")
		.right
			component(:is="contentComponentId" @showJoinGuide="$emit('showJoinGuide')")
</template>

<script>
import leftBox from '../LeftBox';
import appKey from './AppKey';
import applyTest from './ApplyTest'
import apiStatistical from './ApiStatistical';
import apiMessage from './Message';
export default {
	components: {
		leftBox,
		appKey,
		applyTest,
		apiStatistical,
		apiMessage
	},
	props: {},
	mixins: [],
	data() {
		return {
			componentId: 'leftBox',
			leftLabelList: [
				{label: 'Appkey管理'},
				{label: '申请测试'},
				{label: 'API统计'},
				{label: '报文查看'}
			],
			contentComponentId: 'appKey'
		};
	},
	computed: {},
	watch: {},
	created() {},
	mounted() {},
	methods: {
		clickTab(index) {
			switch (index) {
				case 0:
					this.contentComponentId = 'appKey'
					break;
				case 1:
					this.contentComponentId = 'applyTest'
					break;
				case 2:
					this.contentComponentId = 'apiStatistical'
					break;
				case 3:
					this.contentComponentId = 'apiMessage'
					break;
			}
		}
	},
	}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
._contains {
	width: 1200px;
	height: 756px;
	background: white;
	display: flex;
	.left {
		width: 220px;
		height: 100%;
		background: #F7FAFF;
	}
	.right {
		width: 980px;
		height: 627px;
		overflow: auto;
	}
}
</style>