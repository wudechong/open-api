<template lang="pug">
	div.time
		el-tooltip(effect="dark" :content="innerValue" placement="top-start" ref="tooltip" :open-delay="500" :disabled="!innerValue")
			div
				el-date-picker(v-model="innerValue" size="mini" type="datetime" :disabled="disabled"
					format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :default-time="defaultTime"
					:placeholder="placeholder" @keyup.enter.native="enterEvent" :picker-options="pickerOptions" :clearable="clearable")
</template>

<script>
export default {
	name: "DateTimeInput",
	props: {
		start: String,
		end: String,
		defaultTime: {
			default: "00:00:00",
			type: String,
		},
		type: {
			default: "start",
			type: String,
		},
		disabled: Boolean,
		placeholder: String,
		maxDay: Number,
		clearable:{
			default: true,
			type: Boolean,
		}
	},
	data() {
		const vm = this;
		return {
			innerValue: "",
			pickerOptions: {
				shortcuts: [
					{
						text: "今天",
						onClick(picker) {
							if (vm.type == "start") {
								vm.innerEnd = vm.$utils.formatRequestDate("end");
								picker.$emit("pick", vm.$utils.formatRequestDate("start"));
							} else {
								vm.innerStart = vm.$utils.formatRequestDate("start");
								picker.$emit("pick", vm.$utils.formatRequestDate("end"));
							}
						},
					},
					{
						text: "近7天",
						onClick(picker) {
							if (vm.type == "start") {
								vm.innerEnd = vm.$utils.formatRequestDate("end");
								picker.$emit("pick", vm.$utils.formatRequestDate("start", 7));
							} else {
								vm.innerStart = vm.$utils.formatRequestDate("start", 7);
								picker.$emit("pick", vm.$utils.formatRequestDate("end"));
							}
						},
					},
					{
						text: "近15天",
						onClick(picker) {
							if (vm.type == "start") {
								vm.innerEnd = vm.$utils.formatRequestDate("end");
								picker.$emit("pick", vm.$utils.formatRequestDate("start", 15));
							} else {
								vm.innerStart = vm.$utils.formatRequestDate("start", 15);
								picker.$emit("pick", vm.$utils.formatRequestDate("end"));
							}
						},
					},
					{
						text: "近30天",
						onClick(picker) {
							if (vm.type == "start") {
								vm.innerEnd = vm.$utils.formatRequestDate("end");
								picker.$emit("pick", vm.$utils.formatRequestDate("start", 30));
							} else {
								vm.innerStart = vm.$utils.formatRequestDate("start", 30);
								picker.$emit("pick", vm.$utils.formatRequestDate("end"));
							}
						},
					},
				],
				disabledDate(time) {
					if (vm.type === "start") {
						let start = new Date(time).getTime();
						if (vm.end) {
							let end = new Date(vm.end).getTime();
							if (vm.maxDay) {
								return start > end || start < end - (vm.maxDay+1) * 24 * 3600 * 1000;
							} else {
								return start > end;
							}
						}
						return false;
					} else if (vm.type === "end") {
						let end = new Date(time).getTime();
						if (vm.start) {
							let start = new Date(vm.start).getTime();
							if (vm.maxDay) {
								return start > end || start < end - (vm.maxDay) * 24 * 3600 * 1000;
							} else {
								return start > end;
							}
						}
						return false;
					}
				},
			},
			// pickerOptions: {
     	// 	disabledDate: time => {
			// 		return this.standardTime
			// 	? Math.abs(time - this.standardTime) > 30 * 24 * 60 * 60 * 1000
			// 		: false;
			// 	},
			// 	onPick: ({ minDate }) => {
			// 		this.standardTime = new Date(minDate).getTime();
			// 	}
   		// },
		};
	},
	computed: {
		innerStart: {
			get() {
				return this.start;
			},
			set(date) {
				this.$emit("update:start", date);
			},
		},
		innerEnd: {
			get() {
				return this.end;
			},
			set(date) {
				this.$emit("update:end", date);
			},
		},
	},
	watch: {
		type: {
			handler(val) {
				if (val === "start") {
					this.innerValue = this.start;
				} else {
					this.innerValue = this.end;
				}
			},
			immediate: true,
		},
		innerValue: {
			handler(val) {
				if (this.type === "start") {
					this.innerStart = val;
				} else {
					this.innerEnd = val;
				}
			},
			immediate: true,
		},
		start: {
			handler(val) {
				if (this.type === "start") {
					this.innerValue = val;
				}
			},
		},
		end: {
			handler(val) {
				if (this.type === "end") {
					this.innerValue = val;
				}
			},
		},
	},
	methods: {
		enterEvent() {
			this.$emit("enterEvent");
		},
	},
};
</script>
<style lang="scss" scoped>
.time {
	display: inline-block;
	position: relative;
	.null {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}
	::v-deep .el-input.el-input--suffix > .el-input__inner {
		padding-right: 5px;
	}
	::v-deep .el-input.el-input--suffix > .el-input__suffix {
		right: 1px;
		.el-input__suffix-inner > .el-input__icon {
			background: #fff;
			height: 20px;
			margin-top: 2px;
			line-height: 20px;
			pointer-events: all;
		}
	}
}
</style>
