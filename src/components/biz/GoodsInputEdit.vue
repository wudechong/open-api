<template lang="pug">
	.el-select.goods-input
		vxe-pulldown(ref="xDown" transfer)
			template(v-slot)
				el-input.my-input(v-model="skuCode" @input='handleInput($event)' @blur='handleBlur' v-focus :placeholder="placeholder"
					:class="{focused}" clearable)
					i.icon.el-input__icon.el-icon-more(slot="suffix" @click="action")
			template(v-slot:dropdown)
				SkuTable(:show="show && filterable" :skuData="skuData" :skuLeft="width-522" :skuTop="top" :eloading="loading" @change="change" @hide="show=false")
</template>
<script>
/**
 * 商品选择对话框
 */
import SkuTable from "@/components/biz/SkuTable";
import _ from "lodash";
let timer;
export default {
	name: "GoodsInputEdit",
	components: {
		SkuTable: SkuTable,
	},
	props: {
		row: {
			type: Object,
		},
		multiple: {
			type: Boolean,
			default: true,
		},
		placeholder: {
			type: String,
			default: "请输入商品编码",
		},
		getGoodsPicker: Function,
		getSelectRows: Function,
		width: {
			type: [String, Number],
			default: 120,
		},
		top: {
			type: [String, Number],
			default: 0,
		},
		filterable: Boolean,
	},
	data() {
		return {
			focused: false,
			show: false,
			loading: false,
			skuData: [],
			skuCode: "",
		};
	},
	computed: {},
	watch: {
		row: {
			handler(val) {
				this.skuCode = val.skuCode || "";
			},
			immediate: true,
		},
	},
	mounted() {
		const input = this.$el.querySelector("input");
		input.addEventListener("focus", () => {
			this.focused = true;
		});
		input.addEventListener("blur", () => {
			this.focused = false;
		});
	},
	methods: {
		async action() {
			const goodsPicker = this.getGoodsPicker && this.getGoodsPicker();
			if (goodsPicker) {
				const selections = await goodsPicker.open({
					multiple: this.multiple,
					selections: [],
				});
				if (selections) {
					this.getSelectRows(selections);
				}
			} else {
				this.$message("找不到[商品选择框]");
			}
		},
		handleInput(val) {
			if (timer) {
				clearTimeout(timer);
			}

			this.skuData = [];
			if (!val) {
				this.show = false;
				this.$refs.xDown.hidePanel();
				return;
			}

			this.show = true;
			this.$refs.xDown.showPanel();
			this.loading = true;
			timer = setTimeout(() => {
				let skuCode = val;
				if (!skuCode) return;
				this.$http
					.post("/service/erp/goods/quickSelect", { keyword: skuCode })
					.then((r) => {
						this.loading = false;
						this.skuData = r;
					});
			}, 300);
		},
		handleBlur() {},
		change(row) {
			this.getSelectRows([row]);
			clearTimeout(timer);
			this.show = false;
			this.$refs.xDown.hidePanel();
		},
	},
};
</script>

<style lang="scss" scoped>
.goods-input {
	.el-input {
		::v-deep > .el-input__inner {
			padding-left: 5px !important;

			&:not(:focus) {
				color: transparent !important;
			}
		}

		::v-deep > .el-input__prefix {
			height: auto;
			left: 0;
			right: 21px;
			top: 3px;
			bottom: 3px;
			pointer-events: none;

			> .tags {
				display: flex;
				flex-wrap: nowrap;
				width: 100%;
				height: 100%;
				overflow: hidden;

				> .el-tag {
					margin: 0 0 0 4px;
					padding: 0 4px;
					border-width: 0;
					height: $base-element-height - 6;
					line-height: $base-element-height - 6;
					position: relative;
					border-radius: $border-radius;
					color: $primary-text-color;
					background-color: $input-tag-color;
				}
			}
		}

		::v-deep .el-input__suffix {
			.el-input__icon {
				cursor: pointer;

				&:hover {
					color: $icon-button-hover-color;
				}
			}
		}

		&.focused {
			::v-deep > .el-input__prefix > .tags {
				display: none;
			}
		}
	}
}
</style>
