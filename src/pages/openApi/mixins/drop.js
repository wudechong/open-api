export default {
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
			const {
				fullColumn
			} = this.$refs[ref].getTableColumn();
			this.initTableColumn = _.cloneDeep(fullColumn);
			await this.saveOrderColumnSet(fullColumn.splice(this.fixed), view)
		},
		// 保存订单列设置
		saveOrderColumnSet(colums, view) {
			let grids = colums.map(val => {
				return {
					gridType:view,
					companyID:val.companyID,
					visible: val.visible,
					width: val.resizeWidth || val.width,
					field: val.property,
					property:val.property,
					operatorID:val.operatorID,
					title: val.title,
				}
			})
			return this.$http.post('/calf/basic/widget/grid/column', {
				columns: grids,
				gridType: view,
				query: false,
			})
		},
		// 获取订单列设置
		getOrderColumnSet(type) {
			return this.$http.post('/calf/basic/widget/grid/column', {
				gridType: type,
				query: true
			})
		},
		async setOrderColumnSet(type) {
			const colums = await this.getOrderColumnSet(type);
			const { fullColumn } = this.$refs.xTable.getTableColumn();
			const result = [];
			colums.forEach((val, index, arr) => {
				for (const item of fullColumn) {
					if (val.property === item.property) {
						item.width = val.width;
						item.visible = val.visible;
						item.companyID = val.companyID;
						item.operatorID = val.operatorID
						result.push(item);
						break;
					}
				}
			});
			this.initTableColumn = [...fullColumn.splice(0, this.fixed), ...result];
			this.$refs.xTable.loadColumn(this.initTableColumn);
		},
		columnSetChange(initTableColumn) {
			this.initTableColumn = initTableColumn;
			this.$refs.xTable.loadColumn(initTableColumn);
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
		sortClickEvent(column, ref) {
			// 如果触发了列的其他功能按钮
			if (column.sortable) {
				if (column.order === 'asc') {
					this.$refs[ref].clearSort()
				} else if (column.order === 'desc') {
					this.$refs[ref].sort(column.property, 'asc')
				} else {
					this.$refs[ref].sort(column.property, 'desc')
				}
			}
		},
		sortChange({order}, ref) {
			if (order === 'null') {
			  this.$refs[ref].clearSort()
			}
		}
	},

}
