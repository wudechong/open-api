<template lang="pug">
	div._contains
		.left
			component(:is="componentId" :type="componentId" :data="leftLabelList" @clickTab="clickTab")
		.right
			component(:is="contentComponentId" :data="htmlData")
</template>

<script>
import leftBox from '../LeftBox';
import joinProcess from './JoinProcess';
import interfaceNorm from './InterfaceNorm';
import SDKDownload from './SDKDownload';
import useScene from './UseScene';
export default {
	components: {
		leftBox,
		joinProcess,
		interfaceNorm,
		SDKDownload,
		useScene
	},
	props: {},
	mixins: [],
	data() {
		return {
			componentId: 'leftBox',
			leftLabelList: [
				{label: '对接流程'},
				{label: '接口规范'},
				{label: '对接场景'},
				{label: 'SDK下载'}
			],
			htmlData: '',
			contentComponentId: 'joinProcess'
		};
	},
	computed: {},
	watch: {},
	created() {
		this.getData('011')
		this.contentComponentId = 'joinProcess'
	},
	mounted() {},
	methods: {
		clickTab(index) {
			switch (index) {
				case 0:
					this.getData('011')
					this.contentComponentId = 'joinProcess'
					break;
				case 1:
					this.getData('012')
					this.contentComponentId = 'interfaceNorm'
					break;
				case 2:
					this.getData('013')
					this.contentComponentId = 'useScene'
					break;
				case 3:
					this.getData('014')
					this.contentComponentId = 'SDKDownload'
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