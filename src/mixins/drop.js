export default {
  props: {
    view: [String, Number],
  },
  data() {
    return {
      tableColumn: [], // 渲染的数据
      initTableColumn: [], // 仅用于存储，不用于渲染
      headCount: 0, // tableData数组以外的列的数目，比如seq，checkbox

      tableArrowVisible: '',
      tableSetVisible: false,
      goodsTableSetVisible: false,
      tableEvent: {},
      goodsDisplayModeEvent: {},
      tableRandom: 0,
      goodsTableRandom: 0,
    }
  },
  watch: {
    tableSetVisible(val) {
      if (!val) {
        document.removeEventListener("click", this.onDropGlobalClick);
      }
    },
    goodsTableSetVisible(val) {
      if (!val) {
        document.removeEventListener("click", this.onDropGoodsGlobalClick);
      }
    }
  },
  methods: {
    // 列拖拽改变结束
		async columnDragEnd(ref, view) {
			const {fullColumn} = this.$refs[ref].getTableColumn();
      this.initTableColumn = _.cloneDeep(fullColumn);
			await this.saveOrderColumnSet(fullColumn.splice(this.fixed), view)
		},
    // 保存订单列设置
    saveOrderColumnSet(colums, view) {
      let grids = colums.map(val => {
				return {
					visible: val.visible,
					width: val.resizeWidth || val.width,
          field: val.property,
          title: val.title,
          id: val.cid
				}
			})
      // const result = grids.filter(val=> {
      //   return val.visible
      // })
      return this.$http.post('/service/erp/trade/v2/storeTradeGridColumns', {
        grids: grids,
        view,
      })
    },
    async saveRowH1Check() {
      this.otherGrids.forEach(val => {
        if (val.code === 'height') {
          val.visible = !this.rowH1Check;
        }
      })
      const res = await this.$http.post('/web/erp/grid/store', {
        grids: this.otherGrids,
        viewType: 'trade_approve',
				moduleType: 'trade_approve_other'
      })
    },
    // 获取订单列设置
    getOrderColumnSet(type) {
      return this.$http.get('/service/erp/trade/v2/getTradeGridColumns', {
        viewType: type
      })
    },
    tableSettingClick(e) {
      this.tableEvent = {
        e
      }
      this.tableSetVisible = !this.tableSetVisible
      this.goodsTableSetVisible = false;
      if (this.tableSetVisible) {
        setTimeout(() => {
          document.addEventListener("click", this.onDropGlobalClick)
        })
      }
    },
    // 全局监听点击事件
    onDropGlobalClick(e) {
      if (this.$refs.columnSet && !this.$refs.columnSet.contains(e.target)) {
        this.tableRandom = Math.random()
      }
    },
    switchGoodsDisplayMode(e) {
      this.tableEvent = {
        e
      }
			this.goodsTableSetVisible = !this.goodsTableSetVisible;
      this.tableSetVisible = false;
      if (this.goodsTableSetVisible) {
        setTimeout(() => {
          document.addEventListener("click", this.onDropGoodsGlobalClick)
        })
      }
    },
    // 全局监听点击事件
    onDropGoodsGlobalClick(e) {
      if (this.$refs.goodsTableSet && !this.$refs.goodsTableSet.contains(e.target)) {
        this.goodsTableRandom = Math.random()
      }
    },
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
        
        this.showTaobao = false;
				setTimeout(() => {
					this.showTaobao = true;
          setTimeout(() => {
            window.Light.init();
          }, 300);
				}, 300)
      }
    },
    sortChange({order}, ref) {
      if (order === 'null') {
        this.$refs[ref].clearSort()
      }
      this.showTaobao = false;
      setTimeout(() => {
        this.showTaobao = true;
        setTimeout(() => {
          window.Light.init();
        }, 300);
      }, 300)
    },
  },

}
