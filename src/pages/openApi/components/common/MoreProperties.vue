<template lang="pug">
	div(v-show="visible")
		div.more-box(ref="dialog")
			span.more(@click="isShow = !isShow" :class="[isShow ? 'more-active' : '']")
				span.label-right-4 {{$t('common.more')}}
				i.el-icon-arrow-down(v-show="!isShow")
				i.el-icon-arrow-up(v-show="isShow")
			el-collapse-transition
				div.more-dialog(v-show="isShow" :style="{minWidth: minWidth + 'px', width: width + 'px'}")
					header.header
						div {{title}}
						i.el-icon-close.icon-close(@click.stop="isShow = false")
					main
						ul.form-box
							li(v-for="item of selectList" :key="item.propertiesID")
								label(:title="item.proName") {{item.proName}}：
								el-select.input(v-model="item.value" ref="Selectxx" placeholder="" clearable @change="saveProperties" :disabled="disabled")
									el-option(v-for="val in item.list" :key="val.proValue" :label="val.proValue" :value="val.proValue")
							li(v-for="item of inputList" :key="item.propertiesID")
								label(:title="item.proName") {{item.proName}}：
								el-input.input(v-model="item.value" clearable @change="saveProperties" :disabled="disabled")
</template>

<script>

export default {
	components: {},
	props: {
		data: Object,
		type: String || Number,
		disabled: {
			default: false,
			type: Boolean,
		},
		title: {
			type: String,
			default: '设置完成后，点【查询】'
		},
		minWidth: {
			type: [String, Number],
			default: 400
		},
		width: [String, Number],
	},
	mixins: [],
	data() {
		return {
			selectList: [], // 自定义select
      		inputList: [], // 自定义input
			visible: false,
			isShow: false,
		};
	},
	computed: {},
	watch: {
		isShow (val) {
			val ? this.matchingProperties() : this.isShow = false
		},
	},
	created() {
		this.getProperties();
	},
	mounted() {
		document.addEventListener('click', this.hidePanel)
	},
	methods: {
		getProperties () {
			this.$http.post('/service/erp/purchase/properties/get', {
				type: 3
			}).then((res) => {
				if (!res.code) {
				this.setProperties(res);
				}
			})
		},
		// 设置自定义属性
		setProperties (res) {
			res.forEach(item => {
				let obj = {}

				if (item.withoutPreset && item.withoutPreset.billType.split('').includes(this.type)) {
				this.inputList.push({ ...item.withoutPreset, value: '' })
				} else if (item.presets) {
				obj.list = [];

				item.presets.forEach(item => {
					if (item.status == 1) {
					obj = { ...obj, ...item, value: '' };
					} else {
					obj.list.push(item);
					}
				})
				if (obj.billType.split('').includes(this.type)) {
					this.selectList.push(obj);
				}
				}
			})

			if (this.selectList.length > 0 || this.inputList.length > 0) {
				this.visible = true;
			} else {
				this.visible = false;
			}
		},
		 // 匹配自定义属性
		matchingProperties () {
			this.inputList.forEach(item => {
				item.value = ''
			})
			this.selectList.forEach(item => {
				item.value = ''
			})

			this.data.propertiesValues = this.data.propertiesValues || []
			for (let item of this.data.propertiesValues) {
				for (let input of this.inputList) {
				if (input.proCode === item.proCode) {
					input.value = item.value;
					break;
				}
				}
				for (let select of this.selectList) {
				if (select.proCode === item.proCode) {
					select.value = item.value;
					break;
				}
				}
			}
		},
		// 保存自定义属性
		saveProperties () {
			let result = [];

			this.selectList.forEach(item => {
				if (item.value) {
				result.push({
					companyID: item.companyID,
					dimensionType: item.type,
					proCode: item.proCode,
					value: item.value
				})
				}
			})

			this.inputList.forEach(item => {
				if (item.value) {
				result.push({
					companyID: item.companyID,
					dimensionType: item.type,
					proCode: item.proCode,
					value: item.value
				})
				}
			})
			this.data.propertiesValues = _.cloneDeep(result)
		},
		hidePanel () {
			let sp = this.$el
			if (sp) {
				if (!sp.contains(event.target)) {
				this.isShow = false
				}
			}
			},
		},
		beforeDestroy () {
			document.removeEventListener('click', this.hidePanel)
		},
		close () {
			this.isShow = false
		}
	}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.form-box {
  display: grid;
  grid-template-columns: 1fr 1fr;
  > li {
    display: flex;
    margin: 5px;
    align-items: center;
    > label {
      display: inline-block;
      width: 100px;
      text-align: right;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .input {
      width: 110px;
    }
  }
}
.more-box {
  display: inline-block;
  position: relative;
  margin: 0 3px;
  .more {
    display: inline-block;
    position: relative;
    width: 70px;
    height: 24px;
    line-height: 24px;
    box-sizing: border-box;
    user-select: none;
    border: 1px solid #aeaeae;
    border-radius: 3px;
    padding: 0 0 0 8px;
    cursor: pointer;
    &:hover {
      color: #1c82cb;
      border-color: #1c82cb;
    }
    .icon-down {
      position: absolute;
      top: 50%;
      right: 8px;
      font-size: 10px;
      font-weight: bold;
      transform: translateY(-50%);
    }
  }
  .more-dialog {
    position: absolute;
    top: 24px;
    right: 0;
    box-sizing: border-box;
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.8);
    border-radius: 3px;
    color: #333;
    z-index: 1099;
    background: #ffffff;
    .header {
      height: 26px;
      line-height: 26px;
      padding: 0 10px;
      display: flex;
      align-items: center;
      border-radius: 3px;
      justify-content: space-between;
      background-color: #ededed;
      i {
        font-weight: bold;
        cursor: pointer;
      }
    }
  }
}
.more-active {
  background-color: #d7d7d7;
}
main {
  padding: 4px;
}
</style>
