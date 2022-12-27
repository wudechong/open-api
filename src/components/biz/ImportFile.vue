<template lang="pug">
div
	el-dialog(:visible="show" @close="close" width="500px" :title="title" :close-on-click-modal="false" v-dialogDrag ref="importOrderMarkDialogDrag")
		div.box
			div.upload-box(:class="uploadStatus?'':'importBox'" @click="upload")
				div.upload-text-box.uploading-text-box(v-if="uploadStatus==='uploading'")
					svg.icon.svgIcon(aria-hidden="true" style="font-size:32px")
						use(xlink:href="#iconexcleicon-daochu")
					div.upload-text
						span {{fileName}}
						el-progress(:percentage="percentage" color="#007EEB")
				div.upload-text-box(v-else )
					i.iconfont(:class="uploadStatusIcon?uploadStatusIcon:''")
					div.upload-text(:class="uploadStatus?'':'cursor'" v-html="uploadStatusText")
			div.link
				a(@click="downloadTemplate" v-if="!uploadStatus")
					i.iconfont.iconxiazaimoban
					span 下载模版
				a.i-red(@click="downloadFailTemplate" v-if="(uploadStatus==='fail'||uploadStatus==='portion')&&errTable&&errTable.length>0 && showErr")
					//- i.iconfont.iconxiazaimoban 查看失败原因
					span 查看失败原因
			div.gray.rule
				div 导入说明：
				div 1.文件格式必须与模板完全一致！
				div 2.导入的数据要全部通过校验，才能导入成功。
				slot(name="rule")
		span(slot="footer" class="dialog-footer")
			el-button(@click="confirm" type="primary" v-if="uploadStatus&&uploadStatus!=='uploading'")
				span(v-if="uploadStatus==='fail'") 重新上传
				span(v-if="uploadStatus==='portion'||uploadStatus==='success'") 继续上传
	ImportErrdisplay(:show="errdisplayVisible" :importErrorTitle="importErrorTitle" :importErrorText="importErrorText" :data="errTable" @close="errdisplayVisible=false")
</template>
<script>
import ImportErrdisplay from "./ImportErrdisplay";
export default {
	name: "importFile",
	props: {
		show: Boolean,
		title: String,
		initUploaderObj: Object,
		downloadTemplate: Function,
		importErrorText: String,
		importErrorTitle: String,
		showErr: {
			type: Boolean,
			default: true,
		}
	},
	components: {
		ImportErrdisplay,
	},
	data() {
		return {
			uploader: undefined,
			errTable: [],
			errorExcelPath: "", //错误的excel url
			sussTable: [],
			errdisplayVisible: false,
			uploadStatusIcon: "el-icon-upload",
			uploadStatusText: `<span>点击上传</span>`,
			uploadStatus: "", //成功success，失败fail，部分成功部分失败portion
			percentage: 30,
			fileName: "",
			sucessFlag: 0,
		};
	},

	watch: {
		show(val) {
			if (val) {
				this.initUploader();
				this.initData();
				//可移动的弹窗去除移动距离
				this.$nextTick(() => {
					let dragDom = this.$refs["importOrderMarkDialogDrag"].$el.querySelector(
						".el-dialog"
					);
					dragDom.style.cssText += ";top:0px;left:0px";
				});
			}
		},
	},
	created() {},
	methods: {
		// 获取路径
		getDoc() {
			return this.$http.get("/trade/service/exportTemplate/doc/get");
		},
		// 查看失败原因
		async downloadFailTemplate() {
			// window.open(this.errorExcelPath);
			this.errdisplayVisible = true;
		},

		// 上传
		async initUploader() {
			this.uploader = App.initUploader(this.initUploaderObj)
				.done((res) => {
					this.uploader.hide();
					console.log(res);
					this.$emit("setData", res);
					if (res.errorDetails && res.errorDetails.length != 0) {
						this.errTable = res.errorDetails;
						this.errorExcelPath = res.errorExcelPath;
						let count = res.totalNum - res.errorNum;
						if (count > 0) {
							this.uploadStatus = "portion"; //部分成功，部分失败。
							this.uploadStatusText = `<span>导入成功<span class='i-green'> ${count} </span>条，失败<span class='i-red'> ${res.errorNum} </span>条</span>`;
							this.uploadStatusIcon = "iconchenggongtishiicon";
							this.sucessFlag++;
						} else {
							this.uploadStatus = "fail"; //失败
							this.uploadStatusText = `<span>导入失败</span>`;
							this.uploadStatusIcon = "iconzhongjinggaotishiicon";
						}
					} else {
						this.uploadStatus = "success"; //成功
						this.uploadStatusText = `<span>导入成功</span>`;
						this.uploadStatusIcon = "iconchenggongtishiicon";
						this.sucessFlag++;
						this.$emit("success", res);
					}
					this.$forceUpdate()
				})
				.progress((res) => {
					if (res.stage === "uploading") {
						//开始上传
						this.uploader.hide();
						if (res.current != res.total) {
							this.percentage = parseInt((res.current / res.total) * 100); //丢弃小数部分,保留整数部分
							this.uploadStatus = "uploading"; //成功
							this.uploadStatusIcon = "iconwenjianleixing-word";
						} else {
							this.percentage = 100;
						}
					}
					if (res.stage && res.stage === "queued") {
						if (res.fileName) {
							this.fileName = res.fileName;
						}
					}
				})
				.fail((err) => {
					this.uploader.hide();
					this.uploadStatus = "fail"; //失败
					this.uploadStatusText = "导入失败";
					this.uploadStatusIcon = "iconzhongjinggaotishiicon";
				});
		},
		//
		upload() {
			if (!this.uploadStatus) {
				this.uploader.show();
			}
		},
		close() {
			this.$emit("close");
			if (this.sucessFlag > 0) {
				this.$emit("success");
			}
		},
		confirm() {
			this.uploader.show();
		},
		initData() {
			this.uploadStatusIcon = "el-icon-upload";
			this.uploadStatusText = "点击上传";
			this.uploadStatus = ""; //成功success，失败fail，部分成功部分失败portion
			this.fileName = "";
			this.sucessFlag = 0;
		},
	},
};
</script>

<style lang="scss" scoped>
::v-deep.el-progress {
	.el-progress__text {
		color: #bfc7ca;
	}
	.el-progress-bar {
		.el-progress-bar__outer {
			background-color: #d6e6f4;
		}
	}
}

.box {
	margin: 32px 40px 0px;
	.upload-box {
		width: 418px;
		height: 58px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px dashed #d9d9d9;
		background-color: #f5f6f7;
		border-radius: 2px;
		&.importBox:hover {
			border: 1px dashed #007eeb;
			background-color: #f0f5fa;
			.upload-text {
				color: #007eeb;
			}
		}
		.upload-text-box {
			display: flex;

			align-items: center;
			justify-content: center;
			.upload-text {
				padding-left: 4px;
				flex: 1;
				color: #171f25;
			}
			i {
				font-size: 43px;
				color: #b7c2c7;
				&.iconchenggongtishiicon {
					font-size: 32px;
					color: $color-light-green;
				}
				&.iconzhongjinggaotishiicon {
					font-size: 32px;
					color: $color-red;
				}
				&.iconwenjianleixing-word {
					font-size: 32px;
					color: $color-blue;
				}
				&.icon-excleicon-daochu {
					font-size: 32px;
					color: $color-blue;
				}
			}
		}
		.uploading-text-box {
			width: 70%;
		}
	}
	.link {
		width: 420px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		i {
			&.iconxiazaimoban {
				font-size: 14px !important;
			}
		}
	}
	.rule {
		div {
			line-height: 20px;
		}
	}
}
</style>
