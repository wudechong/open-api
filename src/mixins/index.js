const mixins = {
	methods: {
      /**
     * 
     * @param {*} msg  信息
     * @param {*} type  类型
     * @param {*} btnStr  按钮文案
     * @param {*} title 标题
     */
    alert(msg, confirmButtonText = "确定", type = "warning", title = "提示") {
      this.$alert(msg, title, {
          type,
          confirmButtonText: confirmButtonText,
        }
      );
    },
    /**
     * 
     * @param {*} msg  信息 可接收html
     * @param {*} type  类型
     * @param {*} btnStr  按钮文案
     * @param {*} title 标题
     */
    async confirm(msg, confirmButtonText = "确定", cancelButtonText = "取消", type = "warning", title = "提示") {
      const res =	await this.$confirm(msg, title, {
        dangerouslyUseHTMLString: true,
        type,
        confirmButtonText,
        showCancelButton: true,
        cancelButtonText,
      })
      return res
    },
  },
}

export default mixins