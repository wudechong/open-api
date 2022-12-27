<template lang="pug">
	.box(:style="{ height: h + 'px' }")
		.header(:style="{ height: boxH + 'px' }")
			slot(name="content")

		transition(name="el-zoom-in-bottom")
			.container(ref="container" :style="{ top: containerT + 'px' }" v-show="isBox")
				.line
				slot(name="footer")
			
		.drag-line(ref="dragLine" :style="{ top: top + 'px' }")
			span.line-block(@click.stop.prevent="close" @mousedown.stop.self='' @mousemove.stop="" v-show="isShow")
</template>

<script>
export default {
	name: 'TopBottomContainer',
	data() {
		return {
			isShow: true,
			isBox: true,

			h: window.innerHeight - 96,
			top: window.innerHeight - 201,
			boxH: window.innerHeight - 297,
			containerT: window.innerHeight - 297,
			tempTop: 0,
			screenHeight: 0,
			initH: window.innerHeight - 96,
		}
	},
	mounted() {
		let top
		this.$nextTick(() => {
			let _this = this
			let line = this.$refs.dragLine
			line.onmousedown = function() {
				document.onmousemove = function(e) {
					_this.isShow = false
					this.isBox = true
					e = e || window.event
					top = e.clientY
					if (top >= window.innerHeight - 6) {
						top = window.innerHeight - 6
					}
					if (top <= 156) {
						top = 156
					}
					this.top = top
					line.style.top = top + 'px'
					line.style.backgroundColor = 'rgba(0,0,0,0.7)'
				}
				document.onmouseup = function() {
					document.onmousemove = null
					document.onmousedown = null
					_this.isShow = true
					_this.$refs.container.style.top = top - 96 + 'px'
					_this.boxH = top - 96
					line.style.backgroundColor = 'transparent'
					_this.$emit('change', { boxH: _this.boxH - 3 })
				}
			}
		});
	},
	methods: {
		getCurrentStyle(node) {
			var style = null

			if (window.getComputedStyle) {
				style = window.getComputedStyle(node, null)
			} else {
				style = node.currentStyle
			}

			return style
		},
		
		close() {
			let h = window.innerHeight
			this.isBox = !this.isBox
			let h1 = this.getCurrentStyle(this.$refs.container)
			if (!this.isBox) {
				this.$refs.dragLine.style.top = h - 6 + 'px'
				this.boxH = this.h - 6
			} else {
				let top = Number(h1.top.split('px')[0])
				this.$refs.dragLine.style.top = top + 96 + 'px'
				this.boxH = top
			}
			this.$emit('change', { boxH: this.boxH - 3 })
		},
	},
}
</script>
<style lang="scss" scoped>
.box {
	position: relative;
	// padding-top: 5px;
	box-sizing: border-box;
	width: 100%;
	.header {
		overflow: auto;
	}
}
.container {
	position: absolute;
	width: 100%;
	bottom: 0;
	background: #fff;
	// overflow: hidden;
}
.drag-line {
	position: fixed;
	left: 0;
	width: 100%;
	height: 5px;
	background-color: transparent;
	cursor: n-resize;
	user-select: none;
	z-index: 19;
	&:hover {
		.line-block {
			background: #1c82cb;
		}
	}
}
.line {
	position: absolute;
	top: 0;
	width: 100%;
	height: 5px;
	background: #eeeeee;
	z-index: 19;
}
.line-block {
	cursor: pointer;
	width: 55px;
	height: 5px;
	position: absolute;
	left: 50%;
	top: -4px;
	margin: 0 -24px;
	background-color: #d9d9d9;
	z-index: 19;
	&:hover {
		background-color: #1c82cb !important;
	}
}
</style>
