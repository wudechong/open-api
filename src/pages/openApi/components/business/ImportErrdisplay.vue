<template lang="pug">
  div(style='z-index:100')
    el-dialog(:visible='visible' :title="$t('tradePlan.errdisplay.uploadFail')" width='500px' append-to-body modal-append-to-body :close-on-click-modal='false' @close='close')
      vxe-table(:data='data' height='210' stripe resizable column-key show-overflow show-header-overflow auto-resize highlight-current-row ref='xTable' header-align='center' row-id='id' size='mini')
        vxe-table-column(type='seq' width='40' align='center' fixed='left')
          template(v-slot:header='{ }')
            i.el-icon-more(style='transform: rotate(90deg)')
        vxe-table-column(field='rowNum' :title="$t('tradePlan.errdisplay.rowNum')" width='70' align='center')
        vxe-table-column(field='error' :title="$t('tradePlan.errdisplay.error')" header-align='center' align='left')
      span.btn-center
        el-button(@click='cancel') {{$t('common.know')}}
</template>

<script>
export default {
  name: '',
  props: {
    visible: Boolean,
    data: Array,
  },
  components: {

  },
  data () {
    return {

    }
  },
  created () {

  },
  methods: {
    close () {
      this.$emit('close')
    },
    cancel () {
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss" scoped>
.btn-center {
	text-align: center;
    display: block;
    padding: 10px;
}
</style>
