<template lang="pug">
	div._contains
		.left
			component(:is="componentId" :type="componentId" @chooseApi="getData")
		.right
			api-content(:src="src")
</template>

<script>
import leftBox from './LeftBox';
import apiContent from './APIContent';
export default {
	components: {
		leftBox,
		apiContent
	},
	props: {
		show: Boolean
	},
	mixins: [],
	data() {
		return {
			componentId: 'leftBox',
			src: ''
		};
	},
	computed: {},
	watch: {
	},
	created() {},
	mounted() {},
	methods: {
		getData (url) {
			this.src = url
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
		width: 270px;
		height: 100%;
		background: #F7FAFF;
	}
	.right {
		width: 980px;
		height: 627px;
	}
}
</style>