export default {
  data() {
    return {
    }
  },
  watch: {
  },
  methods: {
    // 排序
    sortClickEvent (column, ref) {
      // 如果触发了列的其他功能按钮
      if (column.sortable) {
        if (column.order === 'desc') {
          this.$refs[ref].clearSort()
        } else if (column.order === 'asc') {
          this.$refs[ref].sort(column.property, 'desc')
        } else {
          this.$refs[ref].sort(column.property, 'asc')
        }
      }
    },
    // 表格滚动
		scrollTable(ref) {
			this.$refs[ref].closeTooltip();
		},
    tradeCellMouseLeave(ref) {
			this.$refs[ref].closeTooltip();
		},
    // 是否显示背景斑马线,
		setTableBg(lineHeight = 32, ref, data) {
			if (!this.data.length) {
				this.isNotFull = true;
				return;
			}
			const tableHeight = this.$refs[ref]?.$el?.clientHeight - 30;
			if (this.data.length * lineHeight < tableHeight) {
				this.isNotFull = true;
			} else {
				this.isNotFull = false;
			}
		},
  },

}
