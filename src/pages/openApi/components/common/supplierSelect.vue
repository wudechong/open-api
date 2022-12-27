<template lang="pug">
	el-select.hp-cascader-select(
		ref="select"
		v-model="fakeValue"
		:size="size"
		:disabled="disabled"
		:placeholder="placeholder"
		popper-class="hp-cascader-select-dropdown"
		@visible-change="dropdownVisibleChange"
		@focus="$emit('focus')"
		@blur="$emit('blur')"
	)
		el-option(value="")

		template(slot="prefix")
			.tags
				//- el-tag(v-for="(node, index) in checkedNodes.slice(0,expandedTags)" :key="index") {{node.getText(emitLabelPath, labelSeperator)}}
				//- el-tag.collapsed(v-if="multiple && checkedNodes.length>expandedTags") {{realCollapsedTagLabel}}
				el-tag(v-for="(node, index) in checkedNodes.slice(0,1)" :key="index" v-if="!multiple || checkedNodes.length <=1") {{node.getText(emitLabelPath, labelSeperator)}}
				el-tooltip(effect="dark" placement="bottom-start" :disabled="!(checkedNodes.length>1)" :open-delay="1000")
					div(slot="content")
						div.tooltip-box(v-for="(node, index) in checkedNodes.slice(0,10)" :key="index") {{node.getText(emitLabelPath, labelSeperator)}}
						div.tooltip-box(v-if="checkedNodes.length > 10") ...
					div.tooltip
						el-tag.cursor(v-if="multiple && checkedNodes.length>1" ) {{realCollapsedTagLabel}}
			i.clear.el-icon-error(v-if="clearable && checkedNodes.length && !disabled" @click.stop="fakeValue=null")

		template
			.cascader-select-picker(:class="{multiple:multiple}")
				.header
					el-input.input-filter(v-if="filterable" ref="inputFilter" v-model.trim="filterValue"
						suffix-icon="el-icon-search" :placeholder="filterPlaceholder" @input="handleFilterInput" @keydown.enter.native="$refs.checkLi ? (focusNum = 0,$refs.check[0].$el.focus()) : ''")
				.content
					el-cascader-panel(
						v-show="!filterValue"
						ref="cascader"
						v-model="checkedPaths"
						:size="size"
						:options="options"
						:props="realProps"
						:key="keyValue"
						:class="{'multiple-panel':multiple}"
						@change="notify"
					)
					ul.suggestions(v-if="filterValue" :class="{multiple:multiple}")
						li.suggestion(v-for="(suggestion, num) in suggestions" :key="num" :class="{selected: !multiple && isSuggestionSelected(suggestion), 'focus': focusNum===num}"
							@click="suggestionItemClick(suggestion, num)" class="cursor" tabindex="-1" ref="checkLi"
							@keydown.enter.prevent="enterChecked(suggestion, $event)"
							@keydown.up="focusNum>0?(focusNum--,$refs.check[focusNum].$el.focus()) : ''"
							@keydown.down="focusNum<suggestions.length-1?(focusNum++,$refs.check[focusNum].$el.focus()) : ''")
							el-checkbox(v-if="multiple" v-model="suggestion.checked" @change="notify" :disabled="suggestion.disabled" ref="check")
							span.label(@click="clickLabel(suggestion, num, $event)") {{suggestion.label}}


</template>

<script>
import _ from "lodash"
import {Utils} from "calf-common"
import debounce from "throttle-debounce/debounce"

const NULL_VALUE = "__NULL_VALUE"

export default {
	name: "HpCascaderSelect",
	model: {
		prop: "value",
		event: "change"
	},
	props: {
		value: {},
		placeholder: String,
		filterPlaceholder: {
			type: String,
			default: "请输入过滤条件"
		},
		options: Array,
		props: Object,
		expandedTags: {
			type: Number,
			default: 0
		},
		collapsedTagLabel: String,
		emitValuePath: Boolean,
		emitValue: Boolean, // 是否抛出联级id
		valueSeperator: {
			type: String,
			default: ","
		},
		emitLabelPath: Boolean,
		labelSeperator: {
			type: String,
			default: " / "
		},
		size: {
			type: String,
			default: "mini"
		},
		debounce: {
			type: Number,
			default: 600
		},
		filterable: {
			type: Boolean,
			default: true
		},
		disabled: Boolean,
		filterMethod: Function,
		clearable: {
			type: Boolean,
			default: true
		},
		multiple: Boolean,
		checkStrictly: Boolean
	},
	data() {
		return {
			fakeValue: undefined,
			filterValue: undefined,
			visible: false,
			suggestions: undefined,
			checkedNodes: [],
			checkedPaths: undefined,
			keyValue: 1, // 改变数据源是会报错，只要监听到数据源发生变化 ，改变keyValue的值，达到重新渲染的效果
			timer: null,
			focusNum: -1,
		}
	},
	computed: {
		realProps() {
			const props = {
				multiple: this.multiple,
				checkStrictly: this.checkStrictly,
				emitPath: this.emitValuePath,
				value: 'value',
				label: 'label',
				children: '',
				leaf: 'leaf'
			}
			if (this.props) {
				Object.assign(props, this.props)
			}
			return props
		},
		leafOnly() {
			return !this.checkStrictly
		},
		realCollapsedTagLabel() {
			if (this.expandedTags > 0) {
				return "+" + (this.checkedNodes.length - this.expandedTags)
			} else {
				return (this.collapsedTagLabel || "已选[count]个").replace(
					"[count]", " " + (this.checkedNodes.length - this.expandedTags) + " ")
			}
		}
	},
	watch: {
		value: {
			handler(value, oldValue) {
				if (value === oldValue) return
				if (!this.multiple && value == null) {
					value = NULL_VALUE
				}
				if (!_.isEqual(this.checkedPaths, value)) {
					this.$nextTick(() => this.setValue(value))
				}
			},
			immediate: true
		},
		options: {
			handler(options, oldOptions) {
				if (options === oldOptions) return
				if (options) {
					this.checkOptions(options)

					if (this.checkedPaths) {
						this.$nextTick(() => this.setValue(this.checkedPaths))
					}
				}
			},
			immediate: true
		},
		fakeValue(value, oldValue) {
			if (value === oldValue) return
			if (!value && this.checkedNodes.length) {
				this.$refs.cascader.clearCheckedNodes()
			}
		}
	},
	created() {
		this.handleFilterInput = debounce(this.debounce, () => {
			this.focusNum = -1;
			this.refreshSuggestions(this.filterValue)
			if (!this.suggestions.length) {
				this.$emit('inputChange', this.filterValue)
				setTimeout(() => {
					this.$forceUpdate();
				});
			}
		})
	},
	methods: {
		checkOptions(options) {
			this.keyValue++;
			const valuePropName = this.realProps.value
			const childrenPropName = this.realProps.children
			const loop = (arr) => {
				arr.forEach(item => {
					if (item[valuePropName] === undefined) {
						item[valuePropName] = `_${Utils.makeId()}`
					}

					if (childrenPropName && item[childrenPropName]) {
						loop(item[childrenPropName]);
					}
				})
			}
			loop(options)
		},
		async setValue(value) {
			this.$refs.cascader?.syncMultiCheckState()
			setTimeout(() => {
				this.$forceUpdate();
			});
			let checkedValues = value
			if (!this.multiple && checkedValues != null) {
				checkedValues = [checkedValues]
			}
			const paths = [], checkedNodes = []
			if (checkedValues) {
				for (const checkedValue of checkedValues) {
					let finalValue = checkedValue
					if ((finalValue || finalValue === 0) && this.emitValuePath) {
						if (this.valueSeperator) {
							const arr = finalValue.split(this.valueSeperator);
							finalValue = arr[arr.length - 1]
						} else {
							finalValue = finalValue[finalValue.length - 1]
						}
					}

					const node = this.$refs.cascader.getNodeByValue(finalValue)
					if (node) {
						checkedNodes.push(node)
						paths.push(node.path)
					}
				}
			}
			if (!_.isEqual(this.checkedPaths, value)) {
				this.checkedPaths = value
			}
			this.checkedNodes = checkedNodes
			this.fakeValue = (checkedNodes.length) ? this.realCollapsedTagLabel : undefined
		},
		async dropdownVisibleChange(visible) {
			this.visible = visible
			if (visible) {
				const menus = this.$refs.cascader.menus
				if (menus.length > 1) menus.splice(1)
			} else {
				this.filterValue = undefined
				this.focusNum = -1;
			}

			const inputFilter = this.$refs?.inputFilter?.$el
			if (inputFilter) {
				if (visible) {
					this.$nextTick(() => {
						inputFilter.style.width = inputFilter.offsetWidth + "px"
					})
				} else {
					setTimeout(() => {
						inputFilter.style.width = "100%"
					}, 500)
				}
			}
		},
		refreshSuggestions(filterValue) {
			if (filterValue) {
				let filterMethod = this.filterMethod
				if (!filterMethod) {
					filterMethod = (node, keyword) => node.label.toLowerCase().includes(keyword.toLowerCase())
				}

				this.suggestions = this.$refs.cascader.getFlattedNodes(this.leafOnly).filter(node => {
					if (node.isDisabled) return false
					return filterMethod(node, filterValue)
				})
			} else {
				this.suggestions = []
			}
		},
		isSuggestionSelected(suggestion) {
			return _.isEqual(suggestion.value, this.checkedPaths)
		},
		suggestionItemClick(suggestion, num) {
			if (!this.multiple) {
				this.$refs.cascader.clearCheckedNodes()
				suggestion.checked = true
				this.setValue(suggestion.value)
				this.$nextTick(() => this.notify())
			} else {
				this.focusNum = num;
				this.$refs.check[num].$el.focus()
			}
		},
		clickLabel(suggestion, num) {
			if (this.multiple) {
				this.$refs.checkLi[num].querySelector('input').click();
			}
		},
		enterChecked(suggestion, el) {
			if (this.multiple) {
				if (!el.target) return;
				const input = el.target.querySelector('input');
				if (input) {
					input.click();
				} else {
					el.target.click();
				}
			}
		},
		notify() {
			const checkedNodes = this.$refs.cascader.getCheckedNodes(this.leafOnly)
			if (!this.multiple && checkedNodes[0] == null) {
				checkedNodes.splice(0, 1)
			}

			const emitValuePath = this.emitValuePath, valueSeperator = this.valueSeperator
			const values = checkedNodes.map(node => {
				if (node) {
					if (emitValuePath) {
						return node.getPath().join(valueSeperator)
					} else {
						return node.value
					}
				}
			})

			if (this.emitValue) {
				const emitValues = checkedNodes.map(node => {
					if (node) {
						return node.getPath().join(valueSeperator)
					}
				})
				this.$emit('getEmitValues', emitValues)
			}

			this.checkedNodes = checkedNodes
			this.fakeValue = (checkedNodes.length) ? this.realCollapsedTagLabel : undefined

			const items = checkedNodes.map(node => node.data)
			if (this.multiple) {
				this.$emit("change", values, {
					items,
					nodes: checkedNodes
				})
			} else {
				this.$emit("change", values[0], {
					item: items[0],
					node: checkedNodes[0]
				})

				this.$nextTick(() => {
					if (checkedNodes.length && this.visible && this.$refs.select) {
						this.$refs.select.visible = false
					}
				})
			}
		},
	}
}
</script>

<style lang="scss">
$input-suffix-width: 20px;

.hp-cascader-select {
	display: inline-block;

	.el-input--prefix {
		display: flex;
		align-items: center;
		left: 0;

		> .el-input__inner {
			padding-left: 5px !important;
		}

		> .el-input__prefix {
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

		> .el-input__suffix {
			display: flex;
		}
	}

	> .el-input {
		> .el-input__inner {
			color: transparent !important;
		}
	}

	&:hover {
		i.clear {
			display: block !important;
			width: 12px;
		}
	}
}

.hp-cascader-select-dropdown {
	padding: 8px;

  .el-scrollbar__bar.is-horizontal {
    display: none;
  }

	.el-select-dropdown__item {
		display: none;
	}

	.cascader-select-picker {
		> .header {
			padding-bottom: 8px;

			.input-filter input {
				width: calc(100% - 1px);
			}
		}

		> .content {
			> .el-cascader-panel {
				border-style: none;
				width: 100%;

				> .el-cascader-menu:first-of-type {
					flex: 1 1 auto;
				}

				.el-cascader-menu__list {
					padding: 0;
				}
			}
		}

		&:not(.multiple) {
			padding-left: 6px;

			li.el-cascader-node {
				.el-icon-check {
					display: none;
				}
			}
		}
	}

	.suggestions {
		> .suggestion {
			padding: 0 10px;
			height: 34px;
			line-height: 34px;
			outline: none;

			&.focus {
				background-color: $item-current-color !important;
			}

			> .el-checkbox {
				margin-right: 10px;
			}

			&:hover {
				background: $item-hover-color;
			}

			&.selected {
				background: $item-current-color;
			}
		}

		.el-checkbox__input.is-focus .el-checkbox__inner {
			border-color: $border-color;
		}

		.el-checkbox.is-checked .el-checkbox__input .el-checkbox__inner {
			border-color: $primary-color;
		}
	}
}

.tooltip-box {
	line-height: 18px;
}
</style>
