<template lang="pug">
  .input-excel
    ul
      li  商品编码
      li  商品数量
      li  折后单价
    .excel-box
      ul.text(v-for="(item, index) of excelArr" :key="index")
        li(:class="{act: actIndex===index && actType === 'code'}")
          el-input(v-model="item.code" ref="code" @change="change(item, index, 'code')" @focus="actIndex = index, actType = 'code'")
        li(:class="{act: actIndex===index && actType === 'size'}")
          hp-input-number(v-model="item.size" :precision="0" :min="0" @change="change(item, index, 'size')" @focus="actIndex = index, actType = 'size'" textAlign="center")
        li(:class="{act: actIndex===index && actType === 'price'}")
          hp-input-number(v-model="item.price" :min="0" @change="change(item, index, 'price')" @focus="actIndex = index, actType = 'price'" textAlign="center")
</template>

<script>
export default {
  name: "InputExcel",
  data() {
    return {
      defaultForm: { code: '', size: undefined, price: undefined },
      excelArr: new Array(0),
      actIndex: -1,
      actType: null,
      size: 10, // 默认行数
    }
  },
  mounted() {
    this.init()
    document.addEventListener ("paste", this.handler, false);
  },
  methods: {
    init() {
      this.excelArr = new Array(0);
      for (let i = 0; i < this.size; i ++) {
        this.excelArr.push(_.cloneDeep(this.defaultForm))
      }
      
      this.$emit('change', this.excelArr);
      this.$nextTick(() => {
        this.$refs.code[0].focus();
      })
    },
    change(item, index, target) {
      if (this.excelArr.length - 1 === index) {
        this.excelArr.push(_.cloneDeep(this.defaultForm));
      }
      this.$emit('change', this.excelArr);
    },
    handler(event) {
      let v = (event.clipboardData || window.clipboardData).getData('text')
      let text = v.replace(/\n/g, ';;');
      let arr = text.split(';;')
      let res = [];
      arr.forEach(val => {
        val = val.trim();
        let txt = val.replace(/\s+/g, ';;');
        res.push(txt.split(';;'));
      })
      this.setData(res);
    },
    setData(res) {
      let result = [];
      for (let i = 0; i < res.length; i++) {
        if (this.actType === 'code') {
            result.push({code: (res[i] && res[i][0]) || this.excelArr[this.actIndex + i].code, size: (res[i] && res[i][1]) || this.excelArr[this.actIndex + i].size, price: (res[i] && res[i][2]) || this.excelArr[this.actIndex + i].price})
        } else if (this.actType === 'size') {
          result.push({code: this.excelArr[this.actIndex + i].code, size: (res[i] && res[i][0]) || this.excelArr[this.actIndex + i].size, price: (res[i] && res[i][1]) || this.excelArr[this.actIndex + i].price})
        } else if (this.actType === 'price') {
          result.push({code: this.excelArr[this.actIndex + i].code, size: this.excelArr[this.actIndex + i].size, price: (res[i] && res[i][0]) || this.excelArr[this.actIndex + i].price})
        }
      }
      this.excelArr.splice(this.actIndex, result.length, ...result);
      if (this.excelArr[this.excelArr.length - 1].code) {
        this.excelArr.push(_.cloneDeep(this.defaultForm));
      }
      this.$emit('change', this.excelArr);
    }
  }
}
</script>
<style lang="scss" scoped>
  .input-excel{
    // width: 500px;
    .excel-box{
      height: 310px;
      overflow: auto;
      padding-right: 26px;
      overflow-x: hidden;
    }
    ul{
      display: flex;
      border: 1px solid #D6D8D9;
      line-height: 32px;
      width: 450px;
      li {
        position: relative;
        flex: 1;
        border: 1px solid transparent;
        border-right: 1px solid #D6D8D9;
        text-align: center;
        &:last-child{
          border-right: 1px solid transparent;
        }
        &.act{
          border: 1px solid $primary-color;
        }
      }
      &.text{
        border-top: none;
        line-height: 28px;
      }
    }
    ::v-deep input{
      text-align: center;
      border: none;
    }
  }
</style>