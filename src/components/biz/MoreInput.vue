<template lang="pug">
	.el-select.more-input(@click.once='handleClick($event)' ref="moreInput")
		el-input(v-model="innerValue" @input='handleInput($event)' v-focusSelect :readonly="readonly" :placeholder="placeholder" :disabled="disabled")
			template(slot="suffix")
				i.icon.el-input__icon.el-icon-more(@click="action")
				i.el-input__icon.el-icon-circle-close.el-input__clear(@click="clear" v-if="innerValue && !disabled")
		SkuTable(:show="show && filterable" :fixed="fixed" :skuData="skuData" :skuLeft="skuLeft" :skuTop='top' :eloading="loading" @change="changeGoods" @hide="hideTable" :name='name')
</template>

<script>
/**
 * 三点选择对话框
 */
import SkuTable from "@/components/biz/SkuTable";
export default {
	name: "MoreInput",
	components: {
		SkuTable: SkuTable,
	},
	model: {
		prop: "value",
		event: "update",
	},
	props: {
		value: {
			type: String,
		},
		placeholder: {
			type: String,
			default: ''
		},
		disabled: Boolean,
		filterable: Boolean,
		fixed: Boolean,  // 弹窗表格内-true
		readonly: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			loading: false,
			show: false,
			top: 26,
			skuLeft: 0,
			skuData: [],
			name: "el-zoom-in-top",
			innerValue: ''
		};
	},
	computed: {
	},
	watch: {
		value: {
			handler(val) {
				this.innerValue = val;
			},
			immediate: true
		},
		innerValue(val) {
			if (!val) {
				this.$emit("clear");
			}
			this.$emit("update:value", val)
		}
	},
	mounted() {
	},
	methods: {
		async action() {
			this.$emit('more')
		},
		handleInput: _.debounce(function(val) {
			this.skuData = [];
			if (!val) {
				this.show = false;
				return;
			}
			this.show = true;
			this.loading = true;
			this.$emit('update:value', this.innerValue)
			this.$http
				.post("/service/erp/goods/quickSelect", { keyword: val })
				.then((r) => {
					this.loading = false;
					this.skuData = r;
				});
		}, 800),
		hideTable () {
			this.show = false
		},
		handleClick(e) {
			if (this.fixed) {
				let {top, left} = this.$refs.moreInput.getBoundingClientRect();
				this.top= top + 26;
				this.skuLeft = left
				return
			}
 			let y = e.clientY;
			if (y + 260 > window.innerHeight) {
				this.top = -277;
				this.name = "el-zoom-in-bottom";
			} else {
				this.top = 26;
				this.name = "el-zoom-in-top";
			}
		},
		changeGoods(row) {
			this.$emit('update:value', row.code)
			this.$emit('changeGoods', row);
			this.show = false;
		},
		clear() {
			this.innerValue = '';
		}
	},
};
</script>

<style lang="scss" scoped>
.more-input {
	position: relative;
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
		::v-deep .el-input__suffix {
			.el-input__icon {
				cursor: pointer;

				&:hover {
					color: $icon-button-hover-color;
				}
			}
		}
	}
}
</style>
