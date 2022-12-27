<template lang="pug">
	div
		ul.tabs
			li.tabs-item(v-for="(s, i) in list"
				:key="i"
				:style="{width: s.width ? s.width + 'px' : ''}"
				:class="[tabIndex === i ? 'tabs-item--active' : '']"
				@click="handleClick(s, i)")
				| {{ s.text }}
				span(v-if="s.id === '1' && type ==='trade'")
					| 共: {{count}} 笔
</template>
<script>
export default {
  name: 'DetailTabs',
  props: {
    list: {
      type: Array,
      default: () => []
    },
    count: {
      type: [Number, String],
      default: 0
    },
    type: {
      type: [Number, String],
      default: ''
    },
  },
  data() {
    return {
      tabIndex: 0
    };
  },
  methods: {
      handleClick(s, i) {
          this.tabIndex = i
          this.$emit('click', {content: s, index: i})
      }
  },
};
</script>
<style lang="scss" scoped>
.tabs {
  display: flex;
  // padding: 4px 0 0 2px;
  padding: 0 0 0 2px;
  height: 27px;
  line-height: 28px;
  border-bottom: 1px solid #BCD5E6;
  .tabs-item {
    display: inline-block;
    padding: 0 20px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    color: #333;
    cursor: default;
    user-select: none;
    text-align: center;
	cursor: pointer;
    &:hover {
      background-color: #dae7f1;
    }
    >span {
      margin-left: 10px;
      color: #777;
    }
  }
  .tabs-item--active {
    background-color: #BCD5E6 !important;
  }
}
</style>
