<template lang="pug">
	iframe(:key="key" :src="url" frameborder="0" width="100%" height="100%" scrolling="auto")
</template>

<script>

export default {
	components: {},
	props: {
		src: String
	},
	mixins: [],
	data() {
		return {
			url: '',
			key: new Date().getDate()
		};
	},
	computed: {},
	watch: {
		src: {
			handler (val) {
				this.key = new Date().getTime()
				this.url = `http://localhost:8091/static/web/#/apiContent/${val}`
			},
			immediate: true
		}
	},
	created() {},
	mounted() {},
	methods: {},
	}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类

</style>