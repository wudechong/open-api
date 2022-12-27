<template lang="pug">
  ._containers(ref='containers' :style="{height: isNum(h) ? h+'px': h}")
    ._left-box(ref='leftBox' :style='{width: width}')
      ._left-wrap(ref='leftWrap')
        slot(name='left')
    .drag-line-box(ref='dragLine' :class="{'drag-move': drag}")
      .line(@click.stop.prevent='lineClick' @mousedown.stop.self='' @mousemove.stop='' v-show='isShow')
    ._right-box
      slot(name='right')
</template>

<script>
export default {
  name: 'LeftRightContainer',
  props: {
    leftWidth: {
      type: String,
      default: '25%'
    },
    drag: {
      type: Boolean,
      default: true,
    },
    height: [Number, String],
  },
  components: {},
  data () {
    return {
      width: this.leftWidth,
      initWidth: this.leftWidth,
      boxVisible: false,
      isShow: true,
      h: this.height || '100vh',
    }
  },
  watch: {
  },
  created () {
    window.onresize = () => {
      this.h = this.height || '100vh';
    };
  },
  mounted () {
    if (!this.drag) return
    let width
		this.$nextTick(() => {
			let _this = this
			let line = this.$refs.dragLine
      let domToLeft = _this.$refs.containers.getBoundingClientRect().left
			line.onmousedown = function () {
				document.onmousemove = function (e) {
					_this.isShow = false
					e = e || window.event
					width = e.clientX
					if (width >= window.innerHeight - 6) {
						width = window.innerHeight - 6
					}
					_this.width = (width - domToLeft) + 'px';
					_this.initWidth = (width - domToLeft) + 'px';

					line.style.backgroundColor = '#aaa'
				}
				document.onmouseup = function () {
					document.onmousemove = null
					_this.isShow = true
					line.style.backgroundColor = '#eee'
          document.onmouseup = null
				}
			}
		})
  },
  methods: {
    isNum(height) {
      return !isNaN(height);
    },
    lineClick () {
      this.boxVisible = !this.boxVisible
      if (this.boxVisible) {
        this.width = '0'
      } else {
        this.width = this.initWidth
      }
    },
    onClickMenu (item) {
      this.$emit('menuChange', item)
    },
  },
}
</script>

<style lang="scss" scoped>
._containers {
  display: flex;
}
._left-box {
  height: 100%;
  box-sizing: border-box;
  transition: all 0.3s;
  overflow: auto;
  white-space: nowrap;
  overflow-x: hidden;
  ._left-wrap {
    height: 100%;
    width: 100%;
  }
}
.drag-line-box {
  width: 5px;
  height: 100%;
  display: flex;
  align-items: center;
  background: #eee;
  .line {
    width: 100%;
    height: 60px;
    background: #ccc;
    cursor: pointer;
    &:hover {
      background: #00aaff;
    }
  }
}
.drag-move{
  cursor: e-resize;
  user-select: none;
}
._right-box {
  flex: 1;
  box-sizing: border-box;
  overflow: auto;
}
.side-menus {
  padding-top: 24px;
  text-align: center;
  .menu-box {
    padding: 10px 5px;
    font-size: 13px;
    transition: all linear 0.1s;
  }
}
</style>
