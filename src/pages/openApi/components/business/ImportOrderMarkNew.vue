<template lang="pug">
div
	el-dialog(:visible="show" @close="close" width="500px" :title="title" :close-on-click-modal="false" v-dialogDrag ref="importOrderMarkDialogDrag")
		div.box
			div.chooseConditions
				<slot name="chooseConditions"></slot>
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
					span {{$t('return.setPurchase.importConsiderations.downloadTemplate')}}
				a.i-red(@click="downloadFailTemplate" v-if="(uploadStatus==='fail'||uploadStatus==='portion')&&errTable&&errTable.length>0")
					span {{$t('return.setPurchase.importConsiderations.viewFailureReasons')}}
			div.gray.rule
				<slot name="content"></slot>
		span(slot="footer" class="dialog-footer")
			el-button(@click="confirm" type="primary" v-if="uploadStatus&&uploadStatus!=='uploading'") 
				span(v-if="uploadStatus==='fail'") {{$t('return.setPurchase.importConsiderations.reUpload')}}
				span(v-if="uploadStatus==='portion'||uploadStatus==='success'") {{$t('return.setPurchase.importConsiderations.continueUploading')}}
</template>
<script>

export default {
	name: "importOrderMark",
	props: {
		show: {
			type: Boolean,
			default: false,
		},
		/**
		 * 改造data变pros
		 */
		errTable: Array,
		uploadStatus: String,
		uploadStatusText: String,
		uploadStatusIcon: String,
		fileName: String,
		percentage: {
			type: Number,
			default: 30,
		},
		sucessFlag: {
			type: Number,
			default: 0,
		},
		title: String,
		
	},
	components: {
	},
	data() {
		return {
			
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
		// 下载
		downloadTemplate () {
			this.$emit('downloadTemplate')
		},
		// 下载
		downloadFailTemplate () {
			this.$emit('downloadFailTemplate')
		},
		// 上传
		initUploader() {
			this.$emit('initUploader')
		},
		//
		upload() {
			this.$emit('upload')
		},
		close() {
			this.$emit("close");
			if (this.sucessFlag > 0) {
				this.$emit("success");
			}
		},
		confirm() {
			this.$emit('confirm')
		},
		initData() {
			// this.uploadStatus = "uploading"; //成功success，失败fail，部分成功部分失败portion
			// this.uploadStatusIcon = "el-icon-upload";
			// this.uploadStatusText = this.$t('return.setPurchase.importConsiderations.clickToUpload');
			// this.uploadStatus = ""; //成功success，失败fail，部分成功部分失败portion
			// this.fileName = "";
			// this.sucessFlag = 0;
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
	.chooseConditions {
		margin-bottom: 12px;
	}
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
