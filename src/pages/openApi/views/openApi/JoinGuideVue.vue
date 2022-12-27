<template lang="pug">
	el-dialog(:visible='show' title='提示' width="1010px" :close-on-click-modal='false' :close-on-press-escape="false")
		.main
			component(:is="contentComponentId" :data="htmlData")
		span.footer-btn(slot="footer")
			el-button.button-w--110(type="primary" @click="confirm") 我知道了
</template>

<script>
import interfaceNorm from './JoinGuide/InterfaceNorm.vue';
export default {
	components: {
		interfaceNorm
	},
	props: {
		show: Boolean
	},
	mixins: [],
	data() {
		return {
			htmlData: '',
			contentComponentId: 'interfaceNorm'
		};
	},
	computed: {},
	watch: {},
	created() {
		this.htmlData = this.getData('012')
	},
	mounted() {},
	methods: {
		confirm () {
			this.$emit('close')
		},
		close () {
			this.$emit('close')
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
.main {
	height: 600px;
	overflow-y: auto;
}
</style>