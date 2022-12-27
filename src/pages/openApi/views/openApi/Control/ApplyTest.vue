<template lang="pug">
	.contains
		main
			.mainContent
				.marginAuto
					label.labelTitle 申请测试账号
					.apply(v-if="!isBuy && !isApply")
						.box
							span.y-center(style="margin-top: 46px")
								label.labelSmallTitile-16 点击右边“申请测试账号”即可获万里牛提供测试账号
								el-button.button-220-54(@click="applyTestAccount") 申请测试账号
							span.y-center
								img.messageImg(src="@/assets/img/openApi/Control/信息icon.svg")
								label.font-gray(style="font-size: 12px") 万里牛提供测试账号，请勿将敏感数据推送至测试账号，请勿随意删除其他测试数据
							span.y-center(style="margin-left: 16px")
								label.font-gray(style="font-size: 12px") 测试对接前请仔细阅读
								a(@click="$emit('showJoinGuide')") 《接入指南》
							span.y-center(style="margin-top: 97px")
								label.lableRed 非正式付费用户开放测试账号试用时效为15天（到期数据系统自动清零），接口调用频率限制为XX
					.apply(v-if="!isBuy && isApply")
						.box
							div(style="display: flex;")
								.content
									span
										label.labelSmallTitile-18.font-gray 测试Appkey：
											label(style="color: #000000;font-family: PingFangSC, PingFangSC-Semibold;") {{Appkey}}
									span
										label.labelSmallTitile-18.font-gray 测试Secret：
											label(style="color: #000000;font-family: PingFangSC, PingFangSC-Semibold;") {{AppSecret}}
								el-button.button-160-50 复制
							span.y-center(style="margin-top: 46px")
								label.labelSmallTitile-14.font-gray 测试公司ERP账号：
									label(style="color: #000000;font-family: PingFangSC, PingFangSC-Semibold;") {{testCompanyID}}
								label.labelSmallTitile-14.font-gray(style="margin-left: 96px") 测试公司名称：
									label(style="color: #000000;font-family: PingFangSC, PingFangSC-Semibold") {{testCompanyName}}
							span.y-center(style="margin-top: 13px")
								label.labelSmallTitile-14.font-gray 测试公司有效期限：
									label(style="color: #000000;font-family: PingFangSC, PingFangSC-Semibold;") {{testCompanyDay}}
								label.labelSmallTitile-14.font-gray(style="margin-left: 96px") 测试公司到期时间：
									label(style="color: #000000;font-family: PingFangSC, PingFangSC-Semibold") {{testCompanyexpireTime}}
								a.labelSmallTitile-14(style="color:#FF573C") 申请延期一次
							span.y-center(style="margin-top: 55px")
								img.messageImg(src="@/assets/img/openApi/Control/信息icon.svg")
								label.font-gray(style="font-size: 12px") 万里牛提供测试账号，请勿将敏感数据推送至测试账号，请勿随意删除其他测试数据测试对接前请仔细阅读
								a(@click="$emit('showJoinGuide')") 《接入指南》
					.apply(v-if="isBuy && !isApply")
						.box
							span.y-center(style="margin-top: 46px")
								label.labelSmallTitile-16 点击右边“申请测试账号”即可获万里牛提供测试账号
								el-button.button-220-54 申请测试账号
							span.y-center
								im.messageImg(src="@/assets/img/openApi/Control/信息icon.svg")
								label.font-gray(style="font-size: 12px") 万里牛提供测试账号，请勿将敏感数据推送至测试账号，请勿随意删除其他测试数据
							span.y-center(style="margin-left: 16px")
								label.font-gray(style="font-size: 12px") 测试对接前请仔细阅读
								a(@click="$emit('showJoinGuide')") 《接入指南》
							span.y-center(style="margin-top: 96px")
								label.lableRed 正式付费用户开放测试账号时效为3个月（到期后系统会将数据自动清零），接口调用频率限制为XX
					.apply(v-if="isBuy && isApply")
						.box
							div(style="display: flex;")
								.content.Appkey(style="justify-content: normal;margin-top:8px")
									span
										label.labelSmallTitile-18.font-gray 测试Appkey：
											label(style="color: #000000;font-family: PingFangSC, PingFangSC-Semibold;") {{Appkey}}
									span(style="margin-top: 12px")
										label.labelSmallTitile-18.font-gray 测试Secret：
											label(style="color: #000000;font-family: PingFangSC, PingFangSC-Semibold;") {{AppSecret}}
									label.labelSmallTitile-14.font-gray(style="margin-top: 54px; width: 100%;") 测试公司ERP账号：
										label.label-width-87(style="color: #000000;font-family: PingFangSC, PingFangSC-Semibold;") {{testCompanyID}}
										label.labelSmallTitile-14.font-gray(style="margin-left: 96px") 测试公司名称：
										label(style="color: #000000;font-family: PingFangSC, PingFangSC-Semibold") {{testCompanyName}}
									label.labelSmallTitile-14.font-gray(style="margin-top: 16px; width: 100%;") 测试公司有效期限：
										label.label-width-87(style="color: #000000;font-family: PingFangSC, PingFangSC-Semibold;") {{testCompanyDay}}
										label.labelSmallTitile-14.font-gray(style="margin-left: 96px") 测试公司到期时间：
										label(style="color: #000000;font-family: PingFangSC, PingFangSC-Semibold") {{testCompanyexpireTime}}
								el-button.button-160-50.copyButton(@click="copyAppkey" data-clipboard-action="copy" data-clipboard-target=".Appkey") 复制
							span.y-center(style="margin-top: 55px")
								img.messageImg(src="@/assets/img/openApi/Control/信息icon.svg")
								label.font-gray(style="font-size: 12px") 万里牛提供测试账号，请勿将敏感数据推送至测试账号，请勿随意删除其他测试数据测试对接前请仔细阅读
								a(@click="$emit('showJoinGuide')") 《接入指南》
</template>

<script>
import Clipboard from 'clipboard'
export default {
	components: {
	},
	props: {},
	mixins: [],
	data() {
		return {
			isBuy: false,
			isApply: false,
			Appkey: '3023557369',
			AppSecret: 'a9d6e16b7d993acb003c363aa2af2283',
			testCompanyID: '15677889900',
			testCompanyName: 'XX公司_测试',
			testCompanyDay: '15天',
			testCompanyexpireTime: '2022-11-16',
		};
	},
	computed: {},
	watch: {},
	created() {},
	mounted() {},
	methods: {
		getCompanyType () {
			this.$http.get("/service/developer/authorize/company/types/get").then(res => {

			})
		},
		applyTestAccount () {
			this.getCompanyType()
			this.$http.post("/service/developer/authorize/apply", {

			}).then(res => {
				
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
	> main {
		.mainContent {
			.marginAuto {
				margin: 55px auto 0;
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
					height: 294px;
					background: #FEF7E5;
					margin-top: 33px;
					.box {
						height: 54px;
						position: relative;
						top: 33px;
						margin-left: 74px;
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
							width: 220px;
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
							justify-content: space-between;
							width: 525px;
    						margin-right: 65px;
						}
						.button-160-50 {
							width: 160px;
							height: 50px;
							background: #F7B500;
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
						.button-220-54 {
							width: 220px;
							height: 54px;
							background: #F7B500;
							border-radius: 3px;
							display: flex;
							justify-content: center;
							font-size: 20px;
							font-family: PingFangSC, PingFangSC-Semibold;
							font-weight: 600;
							text-align: left;
							color: #ffffff;
							line-height: 40px;
							margin-left: 135px;
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
}
.font-gray {
	color: #6D7472 !important;
}
.messageImg {
	width: 18px;
	height: 18px;
	margin-right: 4px;
}
.label-width-87 {
    min-width: 87px;
    display: inline-block;
    text-align: left;
}
</style>