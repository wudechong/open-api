<template lang="pug">
div
	el-dialog(:visible="show" @close="close" width="500px" :title="importErrorTitle" :close-on-click-modal="false")
		.toolBar(v-if="importErrorText")
				div.toolBox
					span.icon.iconfont.iconzhongjinggaotishiicon
					span {{importErrorText}}

		vxe-table.table(:data="data" stripe resizable column-key show-overflow show-header-overflow auto-resize highlight-current-row ref="xTable" header-align="center" row-id="id" size="mini" height="158")
			vxe-table-column(type="seq" width="30" align="center")
				template(v-slot:header="{ column }")
					i(class="el-icon-more" style="transform: rotate(90deg)")
			vxe-table-column(field="rowNum" title="行号" width='60'  align="center")
			vxe-table-column(field="error" title="失败原因" align="center")
		span(slot="footer" class="dialog-footer")
			el-button(@click="cancel" type="primary")  知道了
</template>

<script>
export default {
	name: "ImportErrdisplay",
	props: {
		show: {
			type: Boolean,
			default: false,
		},
		data: Array,
		importErrorTitle: String,
		importErrorText: String,
	},
	components: {},
	data() {
		return {};
	},

	watch: {
	},
	created() {},
	methods: {
		close() {
			this.$refs.xTable.clearScroll();
			this.$emit("close");
		},
		cancel() {
			this.$refs.xTable.clearScroll();
			this.$emit("close");
		},
	},
};
</script>

<style lang="scss" scoped>
.toolBar {
	padding-left: 16px;
	padding-top: 8px;
	.toolBox {
		font-size: 14px;
		.icon {
			color: $color-red;
			padding-right: 4px;
			font-size: 18px;
		}
	}
}
.table {
	margin-top: 8px;
}
</style>
