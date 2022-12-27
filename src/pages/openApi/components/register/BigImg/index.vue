<template lang="pug">
  div
    .big-img(ref='imgDom' v-show='show' :style="{ top: top+ 'px', left: left + 'px' }")
      img(style='display:block;' :style='options' :src='url')
</template>

<script>
export default {
  name: 'BigImg',
  props: {
  },
  components: {},
  data () {
    return {
      options: {},
      show: false,
      event: null,
      url: '',

      left: 0,
      top: 0,
    }
  },
  watch: {
    event: {
      handler (e) {
        this.$nextTick(() => {
          let imgDom = this.$refs.imgDom,
            height = Number(this.getStyle(imgDom, 'height').split('px')[0]),
            width = Number(this.getStyle(imgDom, 'width').split('px')[0]),
            windowHeight = window.innerHeight,
            windowWidth = window.innerWidth

          let bottom = e.pageY + height + 10 // 下边缘
          let right = e.pageX + width + 10 // 右边缘

          if (bottom > windowHeight) {
            this.top = e.pageY - height - 10
          } else {
            this.top = e.pageY + 10
          }
          if (right > windowWidth) {
            this.left = e.pageX - width - 10
          } else {
            this.left = e.pageX + 10
          }
        })
      },
    }
  },
  computed: {

  },
  created () {

  },
  methods: {
    getStyle (obj, attr) {
      return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr]
    },
  },
}
</script>

<style lang="scss" scoped>
.big-img {
  position: absolute;
  top: 0;
  left: 0;
  padding: 8px;
  border-radius: 5px;
  background-color: #ffffff;
  pointer-events: none;
  z-index: 9999;
  box-sizing: border-box;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
}
</style>
