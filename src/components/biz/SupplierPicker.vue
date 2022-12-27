<template lang="pug">
	hp-modal-dialog(ref="supplierDialog" title="选择供应商" :width="width" :close-on-click-modal="false" @close="close('')")
		.dialog-box
			.menu-row
				el-input.input--large(v-model="searchText" placeholder="输入编码或名称查询" clearable @keyup.enter.native="query")
					i.el-input__icon.el-icon-search(slot="suffix" style="cursor:pointer;" @click="query")
				el-button.query-btn(v-if="addShow" @click="add")
					i.iconfont.iconxinzeng
					| 新增
				.toolbar
					hp-pager(ref="pager" :showPageSizes="false" :pageSize="10" :pageNo.sync="pageNo"
						:loading="supplierLoading" @pageChanged="pageChanged")
			.table-box
				vxe-table(ref="supplierTable" border stripe width="100%" height="340px" :data="tableData" size="mini"
					resizable sync-resize auto-resize highlight-current-row show-overflow="title" show-header-overflow="title" :column-key="true"
					:sort-config="{orders:['asc', 'desc'],trigger:'cell'}")
					vxe-table-column(type="seq" width="40" align="center" fixed="left")
						template(v-slot:header="{ column }")
							i.el-icon-more(style="transform: rotate(90deg)")
					vxe-table-column(title="供应商编码" align="left" header-align="center" field="todotable1")
					vxe-table-column(title="供应商名称" align="left" header-align="center" field="todotable2")
					vxe-table-column(title="省" align="left" header-align="center" field="todotable3")
					vxe-table-column(title="市" align="left" header-align="center" field="todotable4")
					vxe-table-column(title="区" align="left" header-align="center" field="todotable5")
					vxe-table-column(title="详细地址" align="left" header-align="center" field="todotable6")
					vxe-table-column(title="固话" align="left" header-align="center" field="todotable7")
					vxe-table-column(title="手机" align="left" header-align="center" field="todotable8")
					vxe-table-column(title="网站网址" align="left" header-align="center" field="todotable9")
		template(slot="footer")
			.buttons
				el-button(type="primary" @click="ok") {{$t('common.ok')}}
				el-button(@click="close('')" plain) {{$t('common.cancel')}}
		SupplierInfo(ref="supplierInfo")
</template>
<script>
import SupplierInfo from '@/components/biz/SupplierInfo'
export default {
	name: "SupplierPicker",
	components: {
		SupplierInfo
	},
	props: {
		width: {
			type: String,
			default: "1000px",
		},
		addShow: {
			type: Boolean,
			default: false
		}
	},
	data () {
		return {
			searchText: null,
			pageNo: 1,
			supplierLoading: false,
			tableData: [{
				todotable1: "test",
				todotable2: "test",
				todotable3: "test",
				todotable4: "test",
				todotable5: "test",
				todotable6: "test",
				todotable7: "test",
				todotable8: "test",
				todotable9: "test",
			}],
			currentOptions: {}
		}
	},
	methods: {
		open(options) {
			this.currentOptions = options || {};
			this.$refs.supplierDialog.open(options);
			this.$nextTick(() => {
				this.setFirstRow();
			})
			return true;
		},
		close(data) {
			if (this.$refs.supplierDialog) {
				this.searchText = null;
				return this.$refs.supplierDialog.close(data);
			}
		},
		query () {},
		pageChanged (val) {},
		getPicker(item) {
			return this.findSharedCompoment(item);
		},
		setFirstRow () {
			this.$refs.supplierTable.setCurrentRow(this.tableData[0]);
		},
		async add () {
			// todo
			const items = await this.getPicker('supplierInfo').open({
			});
			if (items) {}
		},
		ok () {
			const item = this.$refs.supplierTable.getCurrentRecord();
			this.$emit("getSupplier", item);
			this.searchText = null;
			return this.$refs.supplierDialog.close('');
		}
	}
}
</script>
<style lang="scss" scoped>
// 需根据查询条件做出修改
$query-input-large: 300px;

// 间距
// margin
$fields-right-small: 2px;
$fields-right-normal: 8px;

.input--large {
	width: $query-input-large;
}
.dialog-box {
	padding: 10px 20px;
	.menu-row {
		position: relative;
		.query-btn {
			margin-left: 10px;
			i {
				color:#558364;
				margin-right: 5px;
			}
		}
		.toolbar {
			position: absolute;
			right: 0;
			top: 0;
		}
	}
}
.table-box {
	margin-top: 10px;
}
::v-deep .vxe-table--render-default.size--mini .vxe-body--column.col--ellipsis {
	height: 30px !important;
}
</style>