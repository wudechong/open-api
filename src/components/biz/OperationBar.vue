<template lang="pug">
	.operation-bar
		template(v-for="(button, i) in buttons")
			.button-wrapper(:key="button.id" v-if="button.visible")
				el-dropdown(v-if="!!button.items" plain :split-button="!!button.command"
					@command="buttonClick" @click="buttonClick(button.command)" trigger="click" :hide-on-click="false" )
					span.normal(v-if="!!button.command")
						i.icon.iconfont.blue-icon(v-if="!!(button.command && button.items && button.icon)" :class="button.icon")
						span {{button.label}}
					el-button.select-btn(v-else plain @click="buttonClick(button.command)" )
						span.normal
							i.icon.iconfont.blue-icon(v-if="!!button.icon" :class="button.icon")
							span {{button.label}}
							i.down.el-dropdown__icon.el-icon-arrow-down
					el-dropdown-menu(slot="dropdown" :class="leftAlign ? 'dropdown1' : 'dropdown1_2'" :append-to-body="false")
						template(v-for="item in button.items")
							el-dropdown-item(v-if="!item.children && item.visible" :command="item.command" :key="item.command"
							:icon="(item.icon)?('iconfont ' + item.icon):null")
								span.item-label {{item.label}}
							el-dropdown-item(v-else-if="item.children && item.visible")
								el-dropdown(@command="buttonClick" @click="buttonClick(button.command)" placement="right-start" :hide-on-click="true" trigger="click"  )
									span.item-label(style="display:flex;align-items: center;")
										i.icon.iconfont(v-if="item.icon" :class="item.icon")
										span {{item.label}}
										i.icon.iconfont.icondown.icotrans
									el-dropdown-menu.dropdown1_2(slot="dropdown" class="dropdown2" :append-to-body="false")
										template(v-for="child in item.children")
											el-dropdown-item(v-if="child.visible" :command="child.command" :key="child.command"
							:icon="(child.icon)?('iconfont ' + child.icon):null") {{child.label}}

				el-button.plain.default-clr(v-else size="medium" @click="buttonClick(button.command)" :disabled="button.disabled")
					span.normal
						i.icon.iconfont.blue-icon(v-if="!!button.icon" :class="button.icon")
						el-tooltip(v-if="button.tips")
							div(slot="content")
								div(v-for="tip in button.tips") {{tip}}
							span {{button.label}}
						span(v-else) {{button.label}}

		slot(name="moreQuery")

		.spacer
		slot(name="pager")
		hp-pager(v-if="showPage" :pageNo.sync="innerPageNo" :pageSize.sync="innerPageSize" :pageSizes="pageSizes" :pageCount.sync="innerpageCount" :totalCount="totalCount" :loading="loadingTotal"
			@pageChanged="arg => $emit('pageChanged', arg)")

</template>

<script>
/**
 * 表格顶部的工具栏。
 * 左侧的按钮可通过一个外部的JSON来定义
 * 有测试支持懒查询总记录数的分页控件
 */
export default {
	name: "OperationBar",
	components: {},
	props: {
		buttons: {
			type: Array,
			default() {
				return [];
			},
		},
		showPage: {
			type: Boolean,
			default() {
				return true;
			},
		},
		leftAlign: {
			type: Boolean,
			default() {
				return true;
			}
		},
		pageNo: Number,
		pageSize: Number,
		pageSizes: Array,
		totalCount: Number,
		loadingTotal: Boolean,

	},
	data() {
		return {
			pageCount: -1,
		};
	},
	computed: {
		innerPageSize: {
			get() {
				return this.pageSize;
			},
			set(pageSize) {
				this.$emit("update:pageSize", pageSize);
			},
		},
		innerPageNo: {
			get() {
				return this.pageNo;
			},
			set(pageNo) {
				this.$emit("update:pageNo", pageNo);
			},
		},
		innerpageCount() {
			return this.totalCount >= 0
				? Math.ceil(this.totalCount / this.pageSize)
				: -1;
		},
	},
	methods: {
		buttonClick(command) {
			if (command) {
				this.$emit("buttonClick", command);
			}
		},
	},
};
</script>

<style lang="scss" scoped>
::v-deep .el-button {
	padding: 3px 12px;
}
::v-deep .el-button-group {
	display: flex;
	height: 24px;
	.el-dropdown__caret-button {
		padding: 3px;
		&::before{
			top: 0;
			bottom: 0;
			background-color: #D6D8D9;
		}
		.el-dropdown__icon {
			margin-right: 3px;
			padding-top: 2px;
		}
	}
}
::v-deep .el-dropdown__icon {
	font-size: 12px;
	padding-top: 4px;
	margin-right: -6px;
}
.dropdown2 {
	position: absolute;
	left: calc(100% - 12px) !important;
}
.dropdown1 {
	left: 0 !important;
	li.el-dropdown-menu__item {
		padding: 0;
		word-break: keep-all;
		.item-label{
			padding: 0 30px;
			outline: none;
		}
	}
}
.dropdown1_2{
	li.el-dropdown-menu__item {
		padding: 0 30px;
		outline: none;
		word-break: keep-all;
	}
}
.icotrans {
	display: inline-block;
	transform: rotate(270deg);
	font-size: 12px !important;
	line-height: 12px;
	margin-left: 8px;
	margin-top: 1px;
	margin-right: -5px !important;
}
.operation-bar {
	display: flex;
	align-items: center;
	box-sizing: border-box;
	background: $color-white;
	padding: 8px 18px 4px 18px;

	.spacer {
		flex: 1;
	}

	.button-wrapper {
		margin-right: 8px;
		height: 32px;
    display: flex;
    align-items: center;
	}

	.el-dropdown,
	.el-button {
		display: flex;
		align-items: center;
		height: 24px;
		line-height: 16px;
		color: $primary-text-color;
		.normal{
			display: flex;
			align-items: center;
		}
		.el-dropdown-menu__item{
			color: $primary-text-color;
		}
		i.icon {
			font-size: 14px; //$font-size
			margin-right: 4px;
			display: inline-block;
			height: 14px;
		}

		.el-button {
			i.el-dropdown__icon {
				margin-left: 6px;
				padding-top: 3px;
			}
		}
		.blue-icon {
			color: $button-icon-color;
		}

		&:hover {
			i.icon {
				// color: $button-hover-icon-color;
			}
		}
	}
	.el-dropdown {
		height: 32px;
		line-height: 32px;
	}
}
</style>
