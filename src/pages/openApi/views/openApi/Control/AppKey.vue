<template lang="pug">
	.contains
		header
			.headerContent
				img(src="@/assets/img/openApi/Control/头像.svg")
				ul
					li
						label.labelText1 杭州湖畔网络技术有限公司
					li
						label.labelText2(style="margin-right: 96px") ERP：专业版本
						label.labelText2 API版本：ERP API 
							label.labelText2(v-if="!isBuy && isApply") （试用15天）
						label.labelText3(v-if="!isBuy && isApply") 立即购买
						label.labelText2(v-if="isBuy && isApply" style="margin-left: 96px") 到期时间：{{ expireTime }}
						
		.contentLine
		main
			.mainContent
				.marginAuto(v-if="!isBuy")
					div(v-if="!isApply")
						label.labelTitle 申请Appkey
						.apply
							.box
								div(style="display: flex;")
									.content
										span
											label.labelSmallTitile-16 点击右边“申请Appkey”即可获得贵司正式对接密钥
										span.y-center
											img.messageImg(src="@/assets/img/openApi/Control/信息icon.svg")
											label(style="font-size: 12px") 正式对接密钥，请勿随意给到第三方，接口调用频率限制为XX
									el-button.button(@click="applyAppKey") 申请Appkey
								label.lableRed 非正式付费用户开放Appkey时效为15天（到期后系统会将数据自动清零）
					div(v-if="isApply")
						label.labelTitle 申请Appkey
						.apply(style="height: 242px")
							.box
								div(style="display: flex;")
									.content.Appkey(style="justify-content: normal;")
										span
											label.labelSmallTitile-18.font-gray Appkey：
												label(style="color: #000000;font-family: PingFangSC, PingFangSC-Semibold;") {{Appkey}}
										span(style="margin-top: 12px")
											label.labelSmallTitile-18.font-gray AppSecret：
												label(style="color: #000000;font-family: PingFangSC, PingFangSC-Semibold;") {{AppSecret}}
										label.labelSmallTitile-14.font-gray(style="margin-top: 24px; width: 100%;") 试用有效期：
											label(style="color: #000000;font-family: PingFangSC, PingFangSC-Semibold;") 15天
											label.labelSmallTitile-14.font-gray(style="margin-left: 96px") 试用到期时间：
											label(style="color: #000000;font-family: PingFangSC, PingFangSC-Semibold") {{expireTime}}
									el-button.button.copyButton(@click="copyAppkey" data-clipboard-action="copy" data-clipboard-target=".Appkey") 复制
								span.y-center(style="margin-top: 30px")
									img.messageImg(src="@/assets/img/openApi/Control/信息icon.svg")
									label(style="font-size: 12px") 正式对接密钥，请勿随意给到第三方，接口调用频率限制为XX
								label.lableRed(style="top: 19px") 非正式付费用户开放Appkey时效为15天（到期后系统会将数据自动清零）
				.marginAuto(v-if="isBuy" style="margin-bottom:32px")
					div(v-if="!isApply")
						label.labelTitle 正式Appkey：
						.apply
							.box
								div(style="display: flex;")
									.content
										span
											label.labelSmallTitile-16 点击右边“申请Appkey”即可获得贵司正式对接密钥
										span.y-center
											img.messageImg(src="@/assets/img/openApi/Control/信息icon.svg")
											label(style="font-size: 12px") 正式对接密钥，请勿随意给到第三方，接口调用频率限制为XX
									el-button.button(@click="applyAppKey") 申请Appkey
					div(v-if="isApply")
						label.labelTitle 正式Appkey：
						.apply
							.box
								div(style="display: flex;")
									.content.Appkey
										span
											label.labelSmallTitile-18.font-gray Appkey：
												label(style="color: #000000") {{Appkey}}
										span
											label.labelSmallTitile-18.font-gray AppSecret：
												label(style="color: #000000") {{AppSecret}}
									el-button.button.copyButton(@click="copyAppkey" data-clipboard-action="copy" data-clipboard-target=".Appkey") 复制
								span.y-center(style="margin-top: 13px")
									img.messageImg(src="@/assets/img/openApi/Control/信息icon.svg")
									label(style="font-size: 12px") 正式对接密钥，请勿随意给到第三方，接口调用频率限制为XX
		.contentLine(v-if="isBuy && isApply")
		footer(v-if="isBuy && isApply")
			.y-center(style="justify-content: end; margin: 12px 77px 0 0; height: 38px;" @click="changeStatus")
				label.labelFooter 添加白名单
				i.iconfont.icondown.icon-button(style="font-size: 18px" :class="{icon_down: !openTable}")
			.search.y-center.x-center(v-show="openTable")
				el-input(v-model="searchValue" style="width: 370px" placeholder="输入你想添加的白名单")
				el-button.button 添加白名单
			.labelList(v-show="openTable")
				label 白名单列表
				div(style="margin-top: 14px")
					vxe-table(stripe resizable :data="tableData" align="center" height="300px")
						vxe-table-column(type="seq" width="40" align="center" fixed="left")
							template(v-slot:header="{ row }")
								i.el-icon-more(style="transform: rotate(90deg)")
						vxe-table-column(title="白名单名称" field="a")
						vxe-table-column(title="Secret" field="b")
						vxe-table-column(title="使用次数" field="c")
						vxe-table-column(title="日期" field="d" width="260px")


</template>

<script>
import Clipboard from 'clipboard'
export default {
	components: {},
	props: {},
	mixins: [],
	data() {
		return {
			isBuy: true,
			isApply: false,
			expireTime: '2023年11月1日',
			Appkey: '3023557369',
			AppSecret: 'a9d6e16b7d993acb003c363aa2af2283',
			searchValue: '',
			tableData: [{a: 'HJKLPJNNGGG', b:'HJKLPJNNGGG', c: '2000', d: '2022-11-29'}],

			openTable: false
		};
	},
	computed: {},
	watch: {},
	created() {
		this.getApplicationStatus()
	},
	mounted() {},
	methods: {
		changeStatus () {
			this.openTable = !this.openTable
		},
		getApplicationStatus() {
			this.$http.get("/service/developer/authorize/application/get",{sandbox: true}).then(res => {
				
			})
		},
		applyAppKey() {
			this.$http.post("/service/developer/authorize/apply").then(res => {
				
			})
		},
		copyAppkey() {
			var clipboard = new Clipboard('.copyButton')
			clipboard.on('success', e => {
				this.$message.success('复制成功')
				// 释放内存
				clipboard.destroy()
			})
			clipboard.on('error', e => {
				// 不支持复制
				this.$message.warning('该浏览器不支持自动复制')
				// 释放内存
				clipboard.destroy()
			})
		}
	},
	}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.contains {
	display: flex;
	flex-direction: column;
	> header {
		height: 215px;
		.headerContent {
			height: 89px;
			margin: 86px 0 0 82px;
			display: flex;
			> ul {
				> li {
					margin: 21px 0 21px 40px;
					.labelText1 {
						font-size: 16px; 
						height: 12px;
						font-family: PingFangSC, PingFangSC-Regular;
						font-weight: 400;
						text-align: left;
						color: #171f25;
						line-height: 12px;
					}
					.labelText2 {
						font-size: 14px; 
						height: 12px;
						font-family: PingFangSC, PingFangSC-Regular;
						font-weight: 400;
						text-align: left;
						color: #171f25;
						line-height: 12px;
					}
					.labelText3 {
						height: 12px;
						font-size: 14px;
						font-family: PingFangSC, PingFangSC-Semibold;
						font-weight: 600;
						text-align: left;
						color: #ff573c;
						line-height: 12px;
						cursor: pointer;
					}
				}
			}
		}
	}
	.contentLine {
		width: 904px;
		height: 0px;
		opacity: 1;
		border: 0.5px dashed #979797;
		margin: 0 auto;
	}
	> main {
		.mainContent {
			.marginAuto {
				margin: 42px auto 0;
				width: 852px;
				.labelTitle {
					height: 20px;
					font-size: 20px;
					font-family: PingFangSC, PingFangSC-Semibold;
					font-weight: 600;
					text-align: left;
					color: #171f25;
					line-height: 20px;
				}
				.apply {
					width: 852px;
					height: 167px;
					background: #EAFAF6;
					margin-top: 26px;
					.box {
						height: 54px;
						position: relative;
						top: 48px;
						margin-left: 38px;
						.labelSmallTitile-18 {
							height: 14px;
							font-size: 18px;
							font-family: PingFangSC, PingFangSC-Regular;
							font-weight: 400;
							text-align: left;
							color: #000000;
							line-height: 14px;
						}
						.labelSmallTitile-16 {
							height: 14px;
							font-size: 16px;
							font-family: PingFangSC, PingFangSC-Regular;
							font-weight: 400;
							text-align: left;
							color: #000000;
							line-height: 14px;
						}
						.labelSmallTitile-14 {
							height: 14px;
							font-size: 14px;
							font-family: PingFangSC, PingFangSC-Regular;
							font-weight: 400;
							text-align: left;
							color: #000000;
							line-height: 14px;
						}
						.content {
							display: flex;
							flex-direction: column;
							justify-content: space-around;
							width: 450px;
							margin-right: 116px;
						}
						.button {
							width: 220px;
							height: 54px;
							background: #32cdaa;
							border-radius: 3px;
							display: flex;
							justify-content: center;
							font-size: 20px;
							font-family: PingFangSC, PingFangSC-Semibold;
							font-weight: 600;
							text-align: left;
							color: #ffffff;
							line-height: 40px;
						}
						.lableRed {
							top: 10px;
							position: relative;
							height: 14px;
							font-size: 14px;
							font-family: PingFangSC, PingFangSC-Regular;
							font-weight: 400;
							text-align: left;
							color: #ff573c;
							line-height: 14px;
						}
					}
				}
			}
		}
	}
	> footer {
		margin-bottom: 20px;
		.labelFooter {
			right: 10px;
			height: 20px;
			font-size: 14px;
			font-family: PingFangSC, PingFangSC-Regular;
			font-weight: 400;
			text-align: left;
			color: #32cdaa;
			line-height: 20px;
			cursor: pointer;
		}
		.icon_down {
			width: 18px;
			height: 30px;
			font-size: 18px;
			transform: rotate(-90deg);
		}
		.search {
			width: 844px;
			height: 108px;
			background: #f4f8fe;
			border-radius: 3px;
			margin: 14px auto 0;
			.button {
				width: 160px;
				height: 40px;
				background: #027cff;
				border-radius: 0px 2px 2px 0px;
				color: #ffffff;
				font-size: 15px;
				font-family: PingFangSC, PingFangSC-Semibold;
				font-weight: 600;
				text-align: left;
				color: #ffffff;
				line-height: 21px;
				text-align: center;
			}
		}
		.labelList {
			width: 844px;
			height: 20px;
			font-size: 16px;
			font-family: PingFangSC, PingFangSC-Semibold;
			font-weight: 600;
			text-align: left;
			color: #000000;
			line-height: 20px;
			margin: 14px auto 0;
		}
	}
}
::v-deep .el-input__inner {
	height: 40px !important;
}
.font-gray {
	color: #6D7472 !important;
}
.messageImg {
	width: 18px;
	height: 18px;
	margin-right: 4px;
}
.transform {
	transform: rotate(90deg) !important;
}
</style>