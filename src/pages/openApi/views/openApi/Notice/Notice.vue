<template lang="pug">
	div._contains
		.left
			component(:is="componentId" :type="componentId" :data="leftLabelList" @clickTab="clickTab")
		.right
			component(:is="contentComponentId")
</template>

<script>
import leftBox from '../LeftBox';
import iterationNotice from './IterationNotice';
import systemNotification from './SystemNotification'
export default {
	components: {
		leftBox,
		iterationNotice,
		systemNotification
	},
	props: {},
	mixins: [],
	data() {
		return {
			componentId: 'leftBox',
			leftLabelList: [
				{label: '迭代公告'},
				{label: '系统通知'}
			],
			contentComponentId: 'iterationNotice'
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
					this.contentComponentId = 'iterationNotice'
					break;
				case 1:
					this.contentComponentId = 'systemNotification'
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