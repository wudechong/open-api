<template lang="pug">
  transition(:name="transitionName")
    ._contains(v-if="show" :style="{left: left+'px', top: top+'px'}")
      .title 自定义列
      vxe-table.column-set(:data="showTable" ref="defaultTable" :height="314" :show-header="false" border="none" resizable show-overflow="title" header-align="center" size="mini" @checkbox-change="change")
        vxe-table-column(type="checkbox" width="40" align="right")
        vxe-table-column(title="列名" field="title" align="left")
</template>

<script>
import Sortable from 'sortablejs'
import DROP_MIXINS from '../../mixins/drop.js';
export default {
  name: 'ColumnSet',
  props: {
    show: Boolean,
    data: {
      type: Array,
      default () {
        return []
      },
    },
    event: Object,
    random: Number,
    fixed: Number, // 固定的列数
    view: Number || String,
  },
  mixins: [DROP_MIXINS],
  data () {
    return {
      tableData: [],
      fixedTable: [],
      showTable: [], // 显示的table
      selectRecords: [],
      transitionName: 'el-zoom-in-top',

      top: 0,
      left: 0,
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
    }
  },
  watch: {
    show (v) {
      if (v) {
        this.fixedTable =  _.cloneDeep(this.data).splice(0, this.fixed);
        this.tableData = _.cloneDeep(this.data).splice(this.fixed);
        this.showTable = this.tableData.filter(item=> {
          return !item.hidden;
        })
        let tableDataIndex = []
        this.showTable.forEach((v, i) => {
          if (v.visible) {
            tableDataIndex.push(this.showTable[i])
          }
        })
        this.$nextTick(() => {
          this.$refs.defaultTable.setCheckboxRow(tableDataIndex, true)
        })
      }
    },
    random (val) {
      this.confirm()
    },
    event: {
      handler (val) {
        this.top = 30;
        this.left = val.e.clientX - 190 < 0 ? 10 : val.e.clientX - 190
        this.transitionName = this.top < 0 ? 'el-zoom-in-bottom' : 'el-zoom-in-top'
      },
    }
  },
  computed: {

  },
  methods: {
    confirm () {
      this.saveOrderColumnSet(this.tableData, this.view)
      this.$emit('close')
    },
    change() {
      let selectRecords = this.$refs.defaultTable.getCheckboxRecords()
      if (selectRecords.length < 3) {
        this.$message({
					message: '最少保留3列！',
					type: 'warning'
				});
        return
      }

      this.tableData.forEach(item => {
        let index = selectRecords.findIndex(item1 => {
          return item.id == item1.id
        })
        if (index != -1) {
          item.visible = true
        } else {
          item.visible = false
        }
      })
      const initTableColumn = [...this.fixedTable, ...this.tableData]
      this.$emit('change', initTableColumn)
    }
  }
}
</script>

<style lang="scss" scoped>
._contains {
  position: absolute;
  top: 0;
  left: 10px;
  background: white;
  width: 250px;
  overflow: hidden;
  box-shadow: 0px 5px 15px 0 rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  z-index: 1000;
  overflow: auto;
  max-height: 350px;
  border-radius: 3px;
  .title{
    height: 36px;
    background: #f5f6f7;
    font-size: 14px;
    color: #171f25;
    line-height: 36px;
    text-indent: 15px;
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
