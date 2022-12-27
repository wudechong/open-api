<template lang="pug">
  span {{column.title}}
    slot
    span.sort-span(@click.stop="sortClickEvent")
      i.iconfont.iconpaixushang.sort-asc(:class="{'sort-act':column.order === 'asc'}")
      i.iconfont.iconpaixuxia.sort-desc(:class="{'sort-act':column.order === 'desc'}")
</template>
<script>
export default {
	name: "SortTitle",
  props: {
    column: Object,
    tableName: String,
  },
  methods: {
    sortClickEvent() {
      this.$emit('sortClickEvent', this.column, this.tableName);
    }
  }
}
</script>