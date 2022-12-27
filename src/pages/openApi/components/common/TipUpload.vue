<template lang="pug">
	el-upload(:action='action' :headers='headers' :data='data' :name='name' :accept='accept' :multiple='multiple' :limit='limit' :show-file-list='false' :on-success='handleSuccess' :on-error='onError' :on-progress='onProgress' :on-change='onChange' :before-upload='beforeUpload' :disabled='disabled')
		el-popover(trigger="hover" placement="top-start" v-if="showImg")
			.img-box
				img.bigPic(:src="showImg" width="100%" style="")
				span {{title}}
			.avatar-uploader(@mouseover='maskVisible=true' @mouseleave='maskVisible=false' slot="reference")
				img.avatar( :src='showImg' :style="{height:height+'px', width:width+'px'}" style='display: block;')
				slot(name='default')
				.mask(v-if='maskVisible' @click.stop='()=>{}')
					i.el-icon-download(v-if='download' @click.stop='handleDownload')
					i.el-icon-delete(v-if='!disabled && remove' @click.stop='delFile')
					slot(name='content')
		span(v-else)
			.avatar-uploader
				i.el-icon-plus.avatar-uploader-icon(:style="{height:height+'px', width:width+'px', lineHeight:height+'px'}")
</template>

<script>
export default {
	name: "TipUpload",
	props: {
		action: String,
		imgUrl: {
			type: String,
			default: "",
		},
		headers: Object,
		data: Object,
		name: String,
		accept: String,
		onSuccess: Function, // 上传成功
		onError: Function, // 上传失败
		onProgress: Function, // 上传时
		onChange: Function,
		beforeUpload: Function,
		disabled: Boolean,
		multiple: Boolean,
		limit: Number,
		height: {
			type: Number,
			default: 100,
		},
		width: {
			type: Number,
			default: 100,
		},
		// 显示下载按钮
		download: Boolean,
		// 显示删除按钮
		remove: {
			type: Boolean,
			default: true,
		},
		imgType: {
			type: Array,
			default() {
				return [".gif", ".png", ".jpg", ".jpeg"];
			},
		},
	},
	components: {},
	data() {
		return {
			response: {},
			file: {},
			fileList: [],
			showImg: "",
			fileImg: require("../../assets/imgs/file_icon.png"),
			title: "",
			maskVisible: false,
		};
	},
	watch: {
		imgUrl: {
			handler(val) {
				if (!val) {
					return;
				}

				let status = this.imgType.some((type) => {
					return (
						val.includes(type) || val.toLowerCase().includes(type.toLowerCase())
					);
				});
				let name = val.substring(val.lastIndexOf("/")+1),
					title = name.substring(name.lastIndexOf("_"),-1),
					type = name.substring(name.lastIndexOf("."));
				this.title = title? title+type : "";
				if (status) {
					this.showImg = val;
				} else {
					this.showImg = this.fileImg;
				}
			},
			immediate: true,
		},
	},
	created() {},
	methods: {
		//
		handleSuccess(response, file, fileList) {
			this.onSuccess(response, file, fileList);

			this.response = response;
			this.file = file;
			this.fileList = fileList;
			if (!file.raw.type.includes("image")) {
				this.showImg = this.fileImg;
			} else {
				this.showImg = URL.createObjectURL(file.raw);
			}
		},
		// 下载
		handleDownload() {
			this.$emit("download", this.imgUrl);
			window.open(this.imgUrl);
		},
		// 删除图片
		delFile() {
			this.showImg = "";
			this.$emit("remove", this.imgUrl);
		},
	},
};
</script>

<style lang="scss" scoped>
.img-box {
	display: flex;
	flex-direction: column;
	>span {
		margin-top: 5px;
		font-weight: bold;
	}
}
.bigPic {
	width: 204px;
	height: 204px;
}
::v-deep .el-upload {
	border: 1px dashed #d9d9d9;
	border-radius: 6px;
	cursor: pointer;
	overflow: hidden;
	&:hover {
		border-color: #409eff;
	}
}
.avatar-uploader {
	position: relative;
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 100px;
		height: 100px;
		line-height: 100px;
		text-align: center;
	}
	.avatar {
		width: 100px;
		height: 100px;
	}
	.mask {
		background: rgba(0, 0, 0, 0.6);
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		justify-content: space-around;
		align-items: center;
		i {
			font-size: 14px;
			color: white;
		}
	}
}
</style>
