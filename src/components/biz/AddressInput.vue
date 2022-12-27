<template lang="pug">
	.address-input
		el-input(v-model="innerAddress" autocomplete="off" v-selectAll :disabled="disabled" @change="change" @keyup.enter.native="enter" :maxlength="maxlength" :placeholder="placeholder")
		span.btn(@click.stop="confirm" :class="{'act': innerAddress}" v-if="!disabled && showBtn") 识别
</template>

<script>
import AddressParse from 'address-parse';
export default {
	props: {
		value: String,
		disabled: Boolean,
		showBtn: {
			type: Boolean,
			default: true,
		},
		maxlength: {
			type: Number,
			default: 64
		},
		placeholder: {
			type: String,
			default: '粘贴地址信息，识别后自动拆分姓名、电话、地址'
		}
	},
	computed: {
		innerAddress: {
			get() {
				return this.value;
			},
			set(val) {
				this.$emit("update:value", val);
			}
		}
	},
	mounted() {
		_.remove(AddressParse.constructor.ExcludeKeys, (val) => {
			return val === '电话';
		})
	},
	methods: {
		// 设置地址
		confirm() {
			if (this.innerAddress) {
				const res = AddressParse.parse(this.innerAddress);
				const result = res[res.length - 1];
				this.setArea(result);
				this.$emit('confirm', result);
			}
		},
		enter() {
			if (this.innerAddress) {
				const res = AddressParse.parse(this.innerAddress);
				const result = res[res.length - 1];
				this.setArea(result);
				this.$emit('enter', result);
			}
		},
		setArea(result) {
			console.log(result)
			let city = result.city.replace('市', '');
			let specialArr = ['其它区', '河南三门峡经济开发区'];
			for (let item of specialArr) {
				if (this.innerAddress.includes(item) && result.details.includes(item) && !result.area && result.province && result.city) {
					result.area = item;
					result.details = result.details.replace(item, '');
				}
			}
			// if (!this.innerAddress.includes(city)) {
			// 	result.area = "";
			// }
			let reg = /[1-9]\d*/mg, residue = "";
			let nums = this.innerAddress.match(reg) || [];
			for (let item of nums) {
				if (item.indexOf(result.mobile) === 0 && item !== result.mobile) {
					residue = item.replace(result.mobile, ' ');
					break;
				}
			}
			result.name = result.name.replace(residue, '');
		},
		change(val){
			this.$emit('change', val);
		}
	},
}
</script>
<style lang="scss" scoped>
.address-input{
	position: relative;
	.btn{
		position: absolute;
		padding: 2px 6px;
		right: 2px;
		top: 2px;
		background: #e3e6e8;
		border-radius: 10px;
		color: #fff;
		cursor: default;
		&.act{
			color: $primary-color;
			background: #ebf3f9;
			cursor: pointer;
		}
	}
}
</style>
