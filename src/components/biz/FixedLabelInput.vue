<template lang="pug">
	.fixed-input
		.label(:style="{width:typeFieldWidth}") {{label}}
		slot
			el-input.input(v-model="innerValue" v-selectAll :clearable="clearable")
</template>

<script>
export default {
	name: "FixedLabelInput",
	props: {
		typeFieldWidth: String,
		label: String,
		value: String,
		clearable: Boolean,
	},
	watch: {
		innerValue(innerValue) {
			this.valueChanged(innerValue);
		},
	},
	data() {
		return {
			innerValue: undefined,
		};
	},
	mounted() {
		this.innerValue = this.value;
	},
	methods: {
		valueChanged(value) {
			this.$emit("update:value", value);
		},
	},
};
</script>

<style lang="scss" scoped>
.fixed-input {
	display: inline-flex;
	align-items: center;
	.label {
		border: 1px solid;
		height: 22px;
		line-height: 22px;
		text-align: center;
		border-color: $input-border-color !important;
		border-radius: $border-radius 0 0 $border-radius !important;
		border-right-width: 0 !important;
		background: #f5f6f7;
	}
	::v-deep input.el-input__inner {
		box-sizing: border-box;
		border-radius: 0 $border-radius $border-radius 0 !important;
	}
	::v-deep .el-input-number.is-controls-right .el-input-number__decrease {
		top: 12px;
	}
	::v-deep .el-input-number.is-controls-right .el-input__inner {
		padding-left: 0;
		padding-right: 25px;
	}

}
</style>
