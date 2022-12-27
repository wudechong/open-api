<template lang="pug">
  .input-excel
    ul
      li  省
      li  市
      li  区
    .excel-box
      ul.text(v-for="(item, index) of excelArr" :key="index")
        li(:class="{act: actIndex===index && actType === 'province'}")
          el-input(v-model="item.province" ref="province" @change="change(item, index, 'province')" @focus="actIndex = index, actType = 'province'")
        li(:class="{act: actIndex===index && actType === 'city'}")
          el-input(v-model="item.city" ref="city" @change="change(item, index, 'city')" @focus="actIndex = index, actType = 'city'")
        li(:class="{act: actIndex===index && actType === 'area'}")
          el-input(v-model="item.area" ref="area" @change="change(item, index, 'area')" @focus="actIndex = index, actType = 'area'")
</template>

<script>
export default {
  name: "AddressExcel",
  data() {
    return {
      defaultForm: { province: '', city: '', area: '' },
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
        this.$refs.province[0].focus();
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
      let res = [], province = '', city = '';
      arr.forEach((val, index) => {
        let txt = val.replace(/\s/g, ';;');
        if (index !== arr.length - 1 && txt.indexOf(';;', txt.length -2) >= 0) {
          txt = txt.substr(0, txt.length - 2);
        }
        let result = txt.split(';;');
        if (result.at(0)) {
          province = result.at(0);
        } else {
          result[0] = province;
        }
        if (result.at(1)) {
          city = result.at(1);
        } else {
          result[1] = city;
        }
        res.push({
          province: result.at(0),
          city: result.at(1),
          area: result.at(2),
        });
      })
      setTimeout(() => {
        this.setData(res);
      })
    },
    setData(res) {
      this.excelArr.splice(this.actIndex, res.length, ...res);
      if (this.excelArr[this.excelArr.length - 1].province) {
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
      overflow-x: hidden;
      width: 462px;
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