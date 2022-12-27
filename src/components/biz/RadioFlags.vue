<template lang="pug">
	el-radio-group.radio-flags(v-model="flag" size="mini" :disabled="disabled")
		el-radio-button(v-for="flag in flags" :key="flag.value" :value="flag.value" :label="flag.value" @click.native.prevent="changeRangeType(flag.value)")
			span(v-if="!flag.value") 无
			i.iconfont.iconqizi(v-else :class="flag.class")
</template>

<script>
/**
 * 旗子的选择框
 */
export default {
	name: "RadioFlags",
	model: {
		prop: "value",
		event: "change",
	},
	props: {
		value: Number,
		// value: {
		// 	type: [Number, String],
		// },
		disabled: Boolean,
		cancel: Boolean,
	},
	data() {
		return {
			flags: [
				{ value: 0, label: "无旗子", class: "none" },
				{ value: 1, label: "红", class: "red" },
				{ value: 2, label: "黄", class: "yellow" },
				{ value: 3, label: "绿", class: "green" },
				{ value: 4, label: "蓝", class: "blue" },
				{ value: 5, label: "紫", class: "purple" },
			],
			flag: 0,
		};
	},
	watch: {
		value: {
			handler(v) {
				this.flag = v;
			},
			immediate: true,
		},
	},
	methods: {
		change() {
			this.$emit("change", this.flag);
		},
		// 再次点击radeo
		changeRangeType(val) {
			if (this.disabled) return;
			if (this.flag === undefined || val !== this.flag) {
				this.flag = val;
			} else if (val === this.flag) {
				if (this.cancel) {
					this.flag = undefined;
				}
			}
			this.change();
		},
	},
};
</script>

<style lang="scss" scoped>
.radio-flags {
	i.iconfont.iconqizi {
		&.gray {
			color: #b7c2c7;
		}
		&.red {
			color: #FF573C;
		}

		&.yellow {
			color: #F4CE00;
		}

		&.green {
			color: #6DD400;
		}

		&.blue {
			color: #126BF2;
		}

		&.purple {
			color: #B620E0;
		}
	}

	::v-deep .el-radio-button__inner {
		height: 24px;
        // background-color: #D6E6F4;
	}
}
</style>
