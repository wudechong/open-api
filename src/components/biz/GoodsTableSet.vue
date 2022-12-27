
<template lang="pug">
  transition(:name="transitionName")
    ._contains(v-if="show" :style="{left: left+'px', top: top+'px'}")
      ul
        li(v-for="item of goodsDisplayModes" :key="item.value" :class="{'active': goodsDisplayMode === item.value}" @click="setActive(item)")
          | {{item.label}}
</template>

<script>
export default {
  name: 'GoodsTableSet',
  props: {
    show: Boolean,
    value: {
      type: String,
    },
    event: Object,
    random: Number,
    tableBox: String
  },
  data () {
    return {
			goodsDisplayModes: [{
        value: 'image',
        label:'商品图片+数量',
      },{
        value: 'name',
        label:'商品名称+数量',
      },{
        value: 'code',
        label:'商品编码+数量',
      }],
      goodsDisplayMode: 'image',
      transitionName: 'el-zoom-in-top',

      top: 0,
      left: 0,
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      localStorageGoods: "erp_trade_approval_goods_table",
    }
  },
  watch: {
    random (val) {
      this.$emit('close');
    },
    event: {
      handler (val) {
        this.top = 30;
        let scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft
        let tableLeft = document.getElementById(this.tableBox).offsetLeft;
        this.left = val.e.clientX - tableLeft - 80 + scrollLeft;
        this.transitionName = this.top < 0 ? 'el-zoom-in-bottom' : 'el-zoom-in-top'
      },
    },
    value: {
      handler (val) {
        if (val) {
          this.goodsDisplayMode = val;
        }
      },
      immediate: true,
    }
  },
  computed: {

  },
  methods: {
    setActive(item) {
      localStorage[this.localStorageGoods] = item.value;
      this.goodsDisplayMode = item.value;
      this.$emit('update:value', item.value);
      this.$emit('close');
    },
    getContainer() {
			return this.findSharedCompoment('container');
		},
  }
}
</script>

<style lang="scss" scoped>
._contains {
  position: absolute;
  top: 0;
  left: 10px;
  background: white;
  width: 128px;
  overflow: hidden;
  box-shadow: 0px 5px 15px 0 rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  z-index: 1000;
  overflow: auto;
  border-radius: 3px;
  text-align: center;
  .title{
    height: 36px;
    background: #f5f6f7;
    font-size: 14px;
    color: #171f25;
    line-height: 36px;
  }
  ul li{
    height: 36px;
    line-height: 36px;
    color: #171f25;
    cursor: pointer;
    &.active{
      background-color: $item-current-color;
    }
  }
}
.icon-drag {
  cursor: pointer;
}
::v-deep .vxe-table--render-default.column-set .vxe-body--column{
  line-height: 30px;
  .c--title{
    padding-left: 3px !important;
    padding-right: 3px !important;
  }
}
</style>
