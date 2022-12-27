<template lang="pug">
	div._contains
		.left
			component(:is="componentId" :type="componentId" :data="leftLabelList" @clickTab="clickTab")
		.right
			component(:is="contentComponentId" :data="htmlData")
</template>

<script>
import leftBox from '../LeftBox';
import commonProblem from './CommonProblem';
import joinSupport from './JoinSupport';
export default {
	components: {
		leftBox,
		commonProblem,
		joinSupport
	},
	props: {},
	mixins: [],
	data() {
		return {
			componentId: 'leftBox',
			leftLabelList: [
				{label: '常见问题'},
				{label: '对接支持'}
			],
			contentComponentId: 'commonProblem',
			htmlData: ''
		};
	},
	computed: {},
	watch: {},
	created() {
		this.getData('022')
		this.contentComponentId = 'commonProblem'
	},
	mounted() {},
	methods: {
		clickTab(index) {
			switch (index) {
				case 0:
					this.getData('022')
					this.contentComponentId = 'commonProblem'
					break;
				case 1:
					this.contentComponentId = 'joinSupport'
					break;
			}
		},
		getData (id) {
			this.$http.get(`http://hpublic.hupun.com/mp/open/doc/${id}.json`,{},{withCredentials: false}).then(res => {
				this.htmlData = res.html
			})
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