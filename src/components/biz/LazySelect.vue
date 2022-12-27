<template lang="pug">
	vxe-pulldown(ref='xDown' @hide-panel='hidePanel' :disabled='disabled' transfer)
		template(#default)
			el-input.readonly(v-model='inputLabel' :placeholder='currPlaceholder' @click.native='togglePanel' readonly :disabled='disabled')
				template(slot='prefix')
					.tags
						el-tag(v-if='!multiple || inputLabels.length == 1') 
							img(v-if="showImg && !multiple" :src="inputImg")
							template(v-else) {{inputLabels[0]}}
						el-tooltip(effect='dark' placement='bottom-start' :disabled='!(inputLabels.length>1)' :open-delay='1000')
							div(slot='content')
								.tooltip-box(v-for='(label, index) of inputLabels.slice(0,10)' :key='index')
									| {{label}}
								.tooltip-box(v-if='inputLabels.length>10')
									| ...
							.tooltip
								.el-tag.cursor(v-if='multiple && inputLabels.length > 1')
									| 已选 {{inputLabels.length}} 个
					i.clear.el-icon-error(v-if='clearable && inputLabels.length && !disabled' @click.stop='clear')
				template(slot='suffix')
					i.el-input__icon.el-icon-arrow-down(key='arrow-down' :class="{'is-reverse': !dropDownVisible}" @click.stop='togglePanel')
		template(#dropdown)
			.dropdown-box
				el-input.filter(v-model.trim='filterValue' @input='handleFilterInput' suffix-icon='el-icon-search' :placeholder='filterPlaceholder')
				div(v-if='multiple' class="mg-b-10")
					el-checkbox.operate-check(:indeterminate='isIndeterminate' @change='checkAll' v-model='allChecked') 全选
					el-checkbox.operate-check.reverse(@change='checkReverse') 反选
				vxe-list.my-dropdown(height='auto' :data='list' auto-resize ref='box')
					template(#default='{ items }')
						template(v-if='!multiple')
							.list-item(:class="{'focus': item[props.value] === inputValue, 'show-img': showImg}" v-for='item in items' :key='item[props.value]' @click='selectEvent(item)')
								img(:src="item[props.src]" v-if="showImg")
								span(v-if="showTitle") {{ item[props.label] }}
						template(v-else-if='multiple')
							el-checkbox.list-item(:class="{'show-img': showImg}" @change='multipleChange' v-for='item in items' :key='item[props.value]' v-model='item.checked' :disabled="item.disabled") 
								img(:src="item[props.src]" v-if="showImg")
								span(v-if="showTitle") {{ item[props.label] }}
				.footer(v-if="addOperate && !filterValue")
					el-button.button-w.x-center.y-center(icon="el-icon-plus" @click="addOperateClick") {{addText}}
</template>

<script>
import debounce from "throttle-debounce/debounce"

export default {
	name: "LazySelect",
	model: {
		prop: 'value',
		event: 'changeValue'
	},
	props: {
		props: {
			type: Object,
			default() {
				return {
					label: 'label',
					value: 'value',
					extraSearch: 'extraSearch',
					src: 'url'
				}
			}
		},
		multiple: {
			type: Boolean,
			default: false,
		},
		value: {},
		options: {
			type: Array,
			default: () => {
				return []
			}
		},
		debounce: {
			type: Number,
			default: 600
		},
		filterPlaceholder: {
			type: String,
			default: "请输入过滤条件"
		},
		placeholder: String,
		disabled: Boolean,
		clearable: {
			type: Boolean,
			default: true
		},
		showTitle: {
			type: Boolean,
			default: true
		},
		showImg: Boolean,
		addOperate: {
			type: Boolean,
			default: false
		},
		addText: {
			type: String,
			default: "新增供应商"
		}
	},
	data() {
		return {
			filterValue: undefined,
			list: [],
			inputLabel: undefined,
			inputLabels: [],
			inputValue: undefined,
			inputValues: [],
			inputImg: '',
			dropDownVisible: false,
			allChecked: false,  // 全选
			isIndeterminate: false,
			optionsList: [],
			currPlaceholder:undefined
		}
	},
	watch: {
		value: {
			handler(value, oldValue) {
				if (value === oldValue) return
				if (!this.multiple) {
					this.inputValue = value;
				} else if (this.multiple) {
					this.inputValues = value;
				}
				this.setLabel()
			},
			immediate: true
		},
		options: {
			handler(options, oldOptions) {
				if (options === oldOptions) return
				if (options) {
					this.optionsList = _.cloneDeep(this.options);
					this.list = this.optionsList;
					this.optionsList.forEach(val => {
						this.$set(val, 'checked', false);
					})
					this.$nextTick(() => {
						this.setLabel()
					})
				}
			},
			immediate: true
		},
		inputLabels: {
			handler(val) {
				if (val.length > 0) {
					this.currPlaceholder = undefined
				}else{
					this.currPlaceholder = this.placeholder
				}
			}
		},
		dropDownVisible: {
			handler(status) {
				if (status) {
					this.$emit('blur')
				} else {
					this.$emit('focus')
				}
			}
		}
	},  
	created() {
		this.handleFilterInput = debounce(this.debounce, () => {
			this.filter(this.filterValue)
		});
	},
	methods: {
		// 下拉显示隐藏
		togglePanel () {
			if (this.disabled) return
			this.$refs.xDown.togglePanel()
			this.dropDownVisible = !this.dropDownVisible;
			if (!this.dropDownVisible) {
				this.hidePanel()
				return
			}
			let checkList = (this.optionsList || []).filter(val => {
				return val.checked;
			})
			this.setOperateCheck(checkList);
			this.$nextTick(() => {
				this.$refs.box.$el.querySelector('.vxe-list--virtual-wrapper').scrollTop = 0;

				let w = this.$refs.xDown.$el.offsetWidth;
				let wrapper = this.$refs.box.$el.querySelector('.vxe-list--virtual-wrapper');
				if (w - 8 > wrapper.offsetWidth) {
					wrapper.style.width = w - 8 + 'px';
				}
			})
		},
		// 筛选
		filter (value) {
			this.list = value ? this.optionsList.filter((val) => {
				if (val[this.props.extraSearch]) {
					return val[this.props.label].toLowerCase().includes(value.toLowerCase()) || val[this.props.extraSearch].toLowerCase().includes(value.toLowerCase())
				}else{
					return val[this.props.label].toLowerCase().includes(value.toLowerCase())
				}
			}) : this.optionsList;
			let checkList = this.optionsList.filter(val => {
				return val.checked;
			})
			this.$nextTick(() => {
				this.setOperateCheck(checkList);
			})
		},
		// 单选
		selectEvent (item) {
			if (!this.multiple) {
				this.inputLabels = item[this.props.label] ? [item[this.props.label]]: [];
				this.inputValue = item[this.props.value];
				this.$refs.xDown.hidePanel();
				this.update();
				this.inputImg = item[this.props.src] || '';
			}
		},
		// 下拉隐藏操作
		hidePanel() {
			this.filterValue = undefined;
			this.dropDownVisible = false;
			this.list = this.optionsList;
		},
		// 初始化label操作
		setLabel() {
			this.optionsList.forEach(item => {
				this.$set(item, "checked", false);
			})
			let checkList = [];
			if (this.multiple && this.inputValues.length) {
				checkList = this.optionsList.filter(val => {
					return this.inputValues.includes(val[this.props.value]);
				})
				this.optionsList.forEach(val => {
					if (this.inputValues.includes(val[this.props.value])) {
						this.$set(val, 'checked', true);
					} else {
						this.$set(val, 'checked', false);
					}
				})
				this.setOperateCheck(checkList);
			} else if (!this.multiple && this.inputValue) {
				checkList = this.optionsList.filter(val => {
					return this.inputValue === val[this.props.value];
				})
				this.inputImg = checkList.length ? checkList[0][this.props.src] : '';
			}
			this.inputLabels = checkList.map(val => {
				return val[this.props.label]
			});
		},
		addOperateClick () {
			this.togglePanel()
			this.$emit('addOperate')
		},
		// 清空
		clear() {
			this.inputLabels = [];
			this.inputImg = '';
			this.inputValue = undefined;
			this.inputValues.splice(0);
			this.optionsList.forEach(val => {
				val.checked = false;
			})
			this.allChecked = false;
			this.isIndeterminate = false;
			this.update([]);
		},
		// 多选点击操作
		multipleChange() {
			let checkList = [];
			checkList = this.optionsList.filter(val => {
				return val.checked;
			})
			this.setOperateCheck(checkList);
			let inputValues = checkList.map(val => {
				return val[this.props.value];
			})
			this.inputValues.splice(0, this.inputValues.length, ...inputValues)
			this.inputLabels = checkList.map(val => {
				return val[this.props.label];
			})
			this.update(checkList);
		},
		setOperateCheck(checkList) {
			if (this.list.length !== checkList.length) {
				this.allChecked = false;
			} else {
				this.allChecked = true;
			}
			if (checkList.length && !this.allChecked) {
				this.isIndeterminate = true;
			} else {
				this.isIndeterminate = false;
			}
			if (this.list.length === 0) {
				this.allChecked = false;
				this.isIndeterminate = false;
			}
		},
		// 全选
		checkAll() {
			this.list.forEach(val => {
				if (val.disabled) return
				val.checked = this.allChecked;
			})
			this.multipleChange();
		},
		// 反选
		checkReverse() {
			this.list.forEach(val => {
				if (val.disabled) return
				val.checked = !val.checked;
			})
			this.multipleChange();
		},
		update(list) {
			if (this.multiple) {
				this.$emit('changeValue', this.inputValues);
				this.$emit('change', { val: this.inputValues, items: list});
			} else {
				this.$emit('changeValue', this.inputValue);
				let filter = this.optionsList.filter(val => {
					return val[this.props.value] === this.inputValue;
				})
				this.$emit('change', { val: this.inputValue, item: filter[0]});
			}
		}
	}
}
</script>

<style lang="scss" scoped>
$input-suffix-width: 20px;
::v-deep {
	.el-input .el-icon-arrow-down {
		color: #c7c9ca;
		font-size: 12px;
		transition: transform .3s;
		transform: rotate(180deg);
		cursor: pointer;
	}
	.el-input .is-reverse {
		transform: rotate(0deg);
	}
	.el-input .el-input__prefix {
		display: flex;
		align-items: center;
		height: auto;
		left: 0;
		right: 21px;
		top: 50%;
		transform: translateY(-50%);
	}
}
.readonly ::v-deep input{
	cursor: pointer;
}
.readonly :hover {
	.el-icon-error{
		display: inline;
	}
}
.el-input__prefix {
	display: flex;
	align-items: center;
	height: auto;
	left: 0;
	right: 21px;
	top: 50%;
	transform: translateY(-50%);

	> .tags {
		display: flex;
		flex-wrap: nowrap;
		width: 100%;
		height: 100%;
		overflow: hidden;
		height: $base-element-height - 6;

		.tooltip {
			display: flex;
		}

		.el-tag {
			margin: 0 0 0 4px;
			padding: 0 4px;
			border-width: 0;
			height: $base-element-height - 6;
			line-height: $base-element-height - 6;
			position: relative;
			border-radius: $border-radius;
			color: $primary-text-color;
			background-color: transparent;

			&.collapsed {
				background-color: transparent;
				margin-left: 0;
			}
			img{
				height: 100%;
			}
		}
	}

	> i.clear {
		display: none;
		position: absolute;
		top: 0;
		right: -3px;
		cursor: pointer;
		background: $color-white;
		text-align: center;
		width: $input-suffix-width;
		height: $base-element-height - 6;
		line-height: $base-element-height - 6;

		&:before {
			content: "\e70d";
			font-family: iconfont-calf;
		}
	}
}

</style>
<style lang="scss">
$input-suffix-width: 20px;
.vxe-pulldown--panel{
	padding: 2px 0;
	min-width: 198px !important;
	
	.vxe-pulldown--wrapper .dropdown-box{
		position: relative;
		border: 1px solid #e3e6e8;
		border-radius: 4px;
		background-color: #fff;
		box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
		box-sizing: border-box;
		padding: 14px 8px 8px;
		width: 198px !important;

	}
	.dropdown-box .vxe-list--virtual-wrapper{
		margin-right: -8px;
		width: 188px !important;
		max-height: 200px;
	}
	.vxe-list--body .list-item{
		display: flex;
		height: 34px;
		padding: 0 20px 0 12px;
		align-items: center;
		white-space: nowrap; 
		cursor: pointer;
		margin-right: 0;
		&.show-img{
			height: 42px;
			img {
				height: 28px;
				vertical-align: middle;
			}
		}
		&:hover{
			background: #ebf3f9;
		}
		&.focus {
			background: #d6e6f4!important;
		}
	}

	.el-checkbox__inner:after {
		box-sizing: content-box;
		content: "";
		border: 1px solid #fff;
		border-left: 0;
		border-top: 0;
		height: 7px;
		left: 4px;
		position: absolute;
		top: 1px;
		transform: rotate(45deg) scaleY(1);
		width: 3px;
		transition: transform .15s ease-in .05s;
		transform-origin: center;
	}
	.el-checkbox__label{
		padding-left: 10px;
	}
	.filter{
		line-height: 24px;
		height: 24px;
		margin-bottom: 8px;
	}
	.operate-check{
		padding-left: 12px;
		.el-checkbox__label{
			padding-left: 10px;
		}
		&.reverse {
			.el-checkbox__input{
				display: none;
			}
			.el-checkbox__label{
				color: #999 !important;
			}
		}
	}
	.mg-b-10{
		margin-bottom: 6px;
	}
}
.dropdown-box{
	.button-w {
		width: 100%;
		height: 33px;
		border-color: #0869bd;
		color: #0869bd;
		background: transparent !important;
		&:hover {
			border-color: #007eeb!important;
			color: #007eeb!important;
		}
	}
	.footer {
		height: 33px;
		width: calc(100% - 24px);
		padding: 2px 12px;
	}
}
</style>
