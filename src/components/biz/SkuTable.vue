<template lang="pug">
	div
		transition(:name="name")
			div.sku-table(ref='skuTable' :style="{ left: isNum(skuLeft) ? skuLeft+'px': skuLeft, top: isNum(skuTop) ? skuTop+'px': skuTop,'position':fixed? 'fixed':'absolute' }" v-show='show')
				.table-container(v-loading='eloading')
					div(style="height:263px;overflow-y: scroll" ref="skus")
						ul(v-if="skuData&&skuData.length>0")
							li.row(v-for="(row,i) in skuData" :key="row.skuID" @click="currentChange(row, i)" :class="{'active': currIndex === i}")
								.img-box
									img(:src="row.pic" v-if="row.pic")
									i.iconfont-calf.icon-image-empty(v-else)
								div.middle

									div.title
										span.ellipsis.code {{$t('biz.skuTable.code')}}{{row.code}}
										span.ellipsis {{row.name}}
									div.content
										span.ellipsis.goodsName  {{row.goodsName}}
										span.ellipsis(v-if="row.barCode") {{$t('biz.skuTable.barCode')}}{{row.barCode}}
						.empty(v-else)
							empty-tip(:loading="eloading" :marginTop="emptyMarginTop")


</template>
<script>
import EmptyTip from "@components/biz/EmptyTip";
export default {
	name: "SkuTable",
	components: {
		EmptyTip,
	},
	props: {
		skuData: Array,
		skuTop: {
			type: [Number, String],
			default: 26,
		},
		skuLeft: {
			type: [Number, String],
			default: 180,
		},
		show: {
			type: Boolean,
			default: false,
		},
		name: {
			type: String,
			default: "el-zoom-in-top",
		},
		eloading: {
			type: Boolean,
			default: false,
		},
		fixed: Boolean,
		emptyMarginTop: {
			type: String,
			default: '5%'
		},
	},
	data() {
		return {
			currRow: null,
			currIndex: -1,
		};
	},
	watch: {
		show(val) {
			if (val) {
				this.keyDown();
			} else {
				document.onkeydown = null;
			}
		},
		skuData: {
			handler() {
				this.currRow = this.skuData.length ? this.skuData[0] : null;
				this.currIndex = this.skuData.length ? 0 : -1;
				this.$nextTick(() => {
					this.$refs.skus.scrollTop = 0;
				});
			},
			immediate: true,
		},
	},
	methods: {
		currentChange(row, i) {
			row.skuCode = row.code;
			row.size = 1;
			row.price = row.salePrice || 0;
			row.priceTwo = row.price;
			row.payment = row.size * row.price;
			this.currRow = row;
			this.currIndex = i;
			this.$emit("change", row);
		},
		keyDown() {
			document.onkeydown = (e) => {
				//事件对象兼容
				let e1 =
					e || event || window.event || arguments.callee.caller.arguments[0];
				//键盘按键判断:左箭头-37;上箭头-38；右箭头-39;下箭头-40

				if (e1?.keyCode == 38 && this.skuData.length) {
					// 按下上箭头
					if (this.currIndex === -1) {
						this.currIndex = 0;
					} else {
						this.currIndex > 0 ? this.currIndex-- : null;
					}
					if (
						this.$refs.skus.scrollTop < (this.currIndex + 1) * 66 &&
						this.$refs.skus.scrollTop >= ((this.currIndex + 1) * 66 - 264)
					) {
					} else {
						this.$refs.skus.scrollTop = ((this.currIndex + 1) * 66 - 264);
					}
					this.currRow = this.skuData[this.currIndex];
				} else if (e1 && e1.keyCode == 40) {
					// 按下下箭头
					if (this.currIndex === this.skuData.length - 1) {
						this.currIndex = this.skuData.length - 1;
					} else {
						this.currIndex < this.skuData.length - 1 ? this.currIndex++ : null;
					}
					if (
						this.$refs.skus.scrollTop <= (this.currIndex + 1) * 66 &&
						this.$refs.skus.scrollTop >= ((this.currIndex + 1) * 66 - 264)
					) {
					} else {
						this.$refs.skus.scrollTop = ((this.currIndex + 1) * 66 - 264);
					}
					this.currRow = this.skuData[this.currIndex];
				} else if (e1 && e1.keyCode == 13) {
					// enter
					if (this.currIndex > -1 && this.currRow) {
						this.currentChange(this.currRow, this.currIndex);
					}
					e1.stopPropagation();
				}
			};
		},
		isNum(height) {
			return !isNaN(height);
		},
	},
	mounted() {
		let _this = this;
		document.addEventListener("click", function(e) {
			if (
				_this.$refs &&
				_this.$refs.skuTable &&
				!_this.$refs.skuTable.contains(e.target)
			) {
				_this.$emit("hide");
			}
		});
	},
};
</script>
<style lang="scss" scoped>
.empty {
	text-align: center;
	// line-height: 360px;
}
.sku-table {
	position: absolute;
	top: 26px;
	left: 180px;
	width: 580px;
	height: 275px;
	border-radius: 3px;
	padding: 12px 0 12px 0;
	box-sizing: border-box;
	box-shadow: 0px 0px 9px 0px rgba(23, 31, 37, 0.4);
	background-color: #ffffff;
	z-index: 20;

	.row {
		height: 46px;
		padding: 4px 4px 4px 16px;
		overflow: hidden;
		margin-bottom: 12px;
		.img-box {
			float: left;
			.icon-image-empty {
				font-size: 46px;
				display: block;
				margin-top: 10px;
				color: mix($placeholder-text-color, transparent);
			}
		}
		&:hover {
			background-color: $tag-color !important;
			z-index: 9999;
		}
		&.active {
			background-color: #d6e6f4 !important;
			z-index: 9999;
		}

		div {
			img {
				width: 46px;
				height: 46px;
				display: block;
			}
			&.middle {
				height: 32px;
				display: flex;
				flex-direction: column;
				padding: 6px 0 8px 6px;
				flex: 1 auto;
				line-height: 15px;
				justify-content: center;

				.title {
					display: flex;
					span {
						width: 299px;
						display: inline-block;
						&.code {
							padding-right: 20px;
							width: 120px;
						}
					}
				}
				.content {
					color: $secondary-text-color;
					display: flex;
					span {
						display: inline-block;
						&.goodsName {
							width: 220px;
							margin-right: 10px;
						}
					}
				}
			}
		}
	}
}
</style>
