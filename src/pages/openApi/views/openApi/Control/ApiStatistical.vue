<template lang="pug">
	.contains
		main
			.mainContent
				.marginAuto
					label.labelTitle API统计相关数据：
					.apply
						div(style="margin-top: 14px")
							vxe-table(stripe resizable :data="tableData" align="center" height="300px")
								vxe-table-column(type="seq" width="40" align="center" fixed="left")
									template(v-slot:header="{ row }")
										i.el-icon-more(style="transform: rotate(90deg)")
								vxe-table-column(title="Appkey" field="a")
								vxe-table-column(title="Secret" field="b")
								vxe-table-column(title="使用次数" field="c")
								vxe-table-column(title="日期" field="d" width="260px")
							
</template>

<script>

export default {
	components: {},
	props: {},
	mixins: [],
	data() {
		return {
			tableData: [{}]
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

</style>