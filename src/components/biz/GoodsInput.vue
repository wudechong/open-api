<template lang="pug">
	.el-select.goods-input(@click='handleClick($event)')
		el-input(v-model="innerLabel" ref="label" @input='handleInput($event)' @blur='handleBlur' :placeholder="placeholder" :disabled="disabled" :readonly="!filterable"
			:class="{focused}" )
			template(slot="suffix")
				i.icon.el-input__icon.el-icon-more(@click="action")
				i.el-input__icon.el-icon-circle-close.el-input__clear(@click="clear" v-if="innerLabel")

			template(slot="prefix")
				.tags(v-if="!multiple && selections.length")
					el-tag {{selections[0][labelField]}}
				.tags(v-else-if="(multiple&&selections.length && !selections[selections.length - 1].skuID ? selections.length - 1 : selections.length) > 1")
					el-tag {{realCollapsedTagLabel}}
		SkuTable(:show="show && filterable" :fixed="fixed" :skuData="skuData" :skuLeft="skuLeft" :skuTop='top' :eloading="loading" @change="change" @hide="hideTable" :name='name')
</template>

<script>
/**
 * 商品选择对话框
 */
import SkuTable from "@/components/biz/SkuTable";
import _ from "lodash";
let timer;
export default {
	name: "GoodsInput",
	components: {
		SkuTable: SkuTable,
	},
	model: {
		prop: "value",
		event: "change",
	},
	props: {
		value: {
			type: [String, Array],
		},
		label: {
			type: [String, Array],
		},
		goodsIDs: {
			type: Array,
			default() {
				return []
			}
		},
		multiple: {
			type: Boolean,
			default: true,
		},
		separator: String, // value和label为string且多选时必传，否则不传
		placeholder: {
			type: String,
			default: "请输入商品编码",
		},
		getGoodsPicker: Function,
		valueField: {
			type: String,
			default: "skuID",
		},
		labelField: {
			type: String,
			default: "code",
		},
		collapsedTagLabel: String,
		skuLeft: {
			type: [Number, String],
			default: -402,
		},
		filterable: Boolean, // 使用可输入选择，label和value和selections的最后为数值可能为空，需要去掉
		prop: {
			type: Object,
			default: () => {
				return {};
			},
		},
		callBack: Function,
		// 校验
		examine: {
			type: Function,
			default: function () {
				return true
			}
		},
		disabled: Boolean,
		fixed: Boolean, // 是否是fixed定位
		skuTop: {
			type: [String, Number],
			default: 26,
		},
		clearInput: Boolean,  // 当为选择skuTable的选项时，清除input中的value
	},
	data() {
		return {
			selections: [],
			focused: false,
			show: false,
			loading: false,
			skuData: [],
			name: "el-zoom-in-top", //el-zoom-in-bottom"   el-zoom-in-top
			top: this.skuTop || 26,
		};
	},
	computed: {
		innerLabel: {
			get() {
				if (this.label) {
					if (this.label.length) {
						this.$nextTick(() => {
							this.$refs.label.focus();
						})
					}
					if (this.separator) {
						return this.label;
					} else {
						if (this.multiple) {
							return this.label.length === 1
								? `${this.label[0]}`
								: `${this.label.join(",")}`;
						} else {
							return this.label;
						}
					}
				} else {
					return "";
				}
			},
			set(text) {
				if (text) {
					if (!this.filterable) return;
					let arr = text.split(",");
					if (this.separator || !this.multiple) {
						this.$emit("update:label", text);
					} else if (this.multiple) {
						this.$emit("update:label", arr);
						let ids = [];
						this.selections.forEach(val => {
							if (arr.includes(val.code)) {
								ids.push(val.skuID);
							}
						})
						if (arr.length !== ids.length) {
							ids.push('');
						}
						this.$emit("update:value", ids);
					}
				} else {
					this.setSelection([]);
				}
			},
		},
		realCollapsedTagLabel() {
			return (this.collapsedTagLabel || `已选[count]个`).replace(
				"[count]",
				" " +
					(!this.selections[this.selections.length - 1].code
						? this.selections.length - 1
						: this.selections.length) +
					" "
			);
		},
	},
	watch: {
		value: {
			handler() {
				let selections = [];
				if (this.value) {
					let values, labels, goodsIDs;
					if (this.separator) {
						values = this.value.split(this.separator);
						if (this.label) {
							labels = this.label.split(this.separator);
						}
					} else {
						if (this.multiple) {
							values = this.value;
							labels = this.label;
							goodsIDs = this.goodsIDs;
						} else {
							values = [this.value];
							labels = [this.label];
						}
					}
					let i = 0;
					for (const value of values) {
						selections.push({
							[this.valueField]: value,
							[this.labelField]: labels[i],
							goodsID: goodsIDs[i]
						});
						i++;
					}
				}
				this.selections = selections;
			},
			immediate: true,
		},
		show(val) {
			this.$emit('show', val);
		}
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
		setSelection(selections) {
			this.selections = selections;
			const values = [],
				labels = [],
				goodsIDs = [];
			for (const selection of selections) {
				values.push(selection[this.valueField]);
				labels.push(selection[this.labelField]);
				goodsIDs.push(selection.goodsID)
			}
			if (this.separator) {
				this.$emit("update:value", values.join(this.separator));
				this.$emit("update:label", labels.join(this.separator));
				this.$emit("update:skus", selections.join(this.separator));
			} else {
				if (this.multiple) {
					this.$emit("update:value", values);
					this.$emit("update:label", labels);
					this.$emit("update:goodsIDs", goodsIDs);
					this.$emit("update:skus", selections);
				} else {
					this.$emit("update:value", values[0] || '');
					this.$emit("update:label", labels[0] || '');
					this.$emit("update:skus", selections[0] || '');
				}
			}
		},
		async action() {
			if (this.disabled) return;
			if (!this.examine()) {
				return
			}
			this.callBack? this.callBack() : '';
			const goodsPicker = this.getGoodsPicker && this.getGoodsPicker();
			if (goodsPicker) {
				const selections = await goodsPicker.open({
					multiple: this.multiple,
					selections: this.selections,
					...this.prop,
				});
				if (selections) {
					this.setSelection(selections);
					this.$nextTick(() => {
						this.$refs?.label?.blur();
					});
					this.callBack? this.callBack() : '';
				}
				this.callBack? this.callBack() : '';
			} else {
				this.$message("找不到[商品选择框]");
			}
		},
		clear() {
			this.innerLabel = "";
		},
		hideTable () {
			this.show = false
			this.clearInput ? this.innerLabel = '' : null;   // 当为选择skuTable的选项时，清除input中的value
		},
		handleInput(val) {
			let arr = val.split(",");
			val = arr[arr.length - 1];
			if (timer) {
				clearTimeout(timer);
			}

			this.skuData = [];
			if (!val) {
				this.show = false;
				this.$emit("clear");
				return;
			}
			if (!this.examine()) {
				return
			}
			this.show = true;
			this.loading = true;
			this.$emit("input", val);
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
			this.selections = this.selections.filter((v) => {
				return v.skuID;
			});
			if (this.multiple) {
				const selections = this.$utils.uniqBy(
				[...this.selections, row, {}],
					"skuID"
				);
				this.setSelection(selections);
			} else {
				this.setSelection([row]);
			}
			this.show = false;
		},
		handleClick(e) {
			let y = e.clientY;
			if (this.fixed) {
				this.top = this.skuTop || 26;
				return
			}
			if (y + 260 > window.innerHeight) {
				this.top = -277;
				this.name = "el-zoom-in-bottom";
			} else {
				this.top = 26;
				this.name = "el-zoom-in-top";
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.goods-input {
	> .el-input {
		::v-deep > .el-input__inner {
			padding-left: 5px !important;
		}
		.el-input__clear {
			display: none;
		}
		&:hover .el-input__clear {
			display: block;
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
				background-color: #fff;
				margin-left: 2px;
				> .el-tag {
					margin: 0;
					padding: 0 4px;
					border-width: 0;
					height: $base-element-height - 6;
					line-height: $base-element-height - 6;
					position: relative;
					border-radius: $border-radius;
					color: $primary-text-color;
					background-color: transparent;
					line-height: 24px;
				}
			}
		}

		::v-deep .el-input__suffix {
			height: auto;
			// top: 1px;
			bottom: 1px;
			overflow: hidden;
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
