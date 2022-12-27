<template lang="pug">
	ul.query-ul
		//- type：类型
				model： 绑定值
				multiple: 单/多选
				clearable: 清空按钮
				filterable：筛选
				options：绑定下拉
				props：配置
				@change：发生改变触发的函数
				disabled：是否禁用
				enums: 下拉枚举
				fn: 对枚举数据进行改造返回options
		li.normal-li(v-for="(item, index) of items" :key="item.code" :class="item.class" :style="{width: item.width}" @mouseenter="setHighLight(index)" @mouseleave="clearHighLight(index)")
			.act(v-if="actIndex === index")
			label(v-if="item.name") {{item.name}} 

			hp-cascader-select(v-if="item.type==='hp-cascader-select'" v-model="item.model.length == 1 ? form[item.model[0]] : form[item.model[0]][item.model[1]]" :multiple="item.multiple" :clearable="item.clearable" :filterable="item.filterable" :options="item.options"
				:props="item.props" @change="(val) => item.change ? item.change(val) : ''" :disabled="item.childDisabled")
			
			hp-switch-input(v-else-if="item.type==='hp-switch-input'" :types="item.types" :typeFieldWidth="item.typeFieldWidth" :type.sync="item.model.length == 1 ? form[item.model[0]] : form[item.model[0]][item.model[1]]" @change="item.change ? item.change() : ''")
				template(v-for="(list, num) of item.children")
					el-input(v-if="list.type==='el-input' && (item.model.length == 1 ? list.showValue.includes(form[item.model[0]]) : list.showValue.includes(form[item.model[0]][item.model[1]]))" v-model='list.model.length == 1 ? form[list.model[0]] : form[list.model[0]][list.model[1]]' :key="list.id" v-selectAll clearable @keyup.enter.native="clickQuery" :disabled="item.childDisabled")
					hp-item-select(v-else-if="list.type==='hp-item-select' && (item.model.length == 1 ? list.showValue.includes(form[item.model[0]]) : list.showValue.includes(form[item.model[0]][item.model[1]]))" v-model="list.model.length == 1 ? form[list.model[0]] : form[list.model[0]][list.model[1]]" :clearable="list.clearable" :filterable="list.filterable" :allowCreate="list.allowCreate" :items="list.options" :props="list.props" @change="(val) => list.change ? list.change(val) : ''" :disabled="item.childDisabled")
					hp-region-select(v-else-if="list.type==='hp-region-select' && (item.model.length == 1 ? list.showValue.includes(form[item.model[0]]) : list.showValue.includes(form[item.model[0]][item.model[1]]))" v-model="list.model.length == 1 ? form[list.model[0]] : form[list.model[0]][list.model[1]]" size="mini"
						:levels="['省', '市', '区县']"
						vertical
						:readonly="list.readonly"
						@loadRegions="loadRegions" @keyup.enter.native="clickQuery" clearable :disabled="item.childDisabled")
					hp-combo-box(v-else-if="list.type==='hp-combo-box' && (item.model.length == 1 ? list.showValue.includes(form[item.model[0]]) : list.showValue.includes(form[item.model[0]][item.model[1]]))" :items="list.options" :props="list.props" v-model="list.model.length == 1 ? form[list.model[0]] : form[list.model[0]][list.model[1]]" @keyup.enter.native="clickQuery" @change="(val) => list.change ? list.change(val) : ''" :disabled="item.childDisabled")
					hp-cascader-select(v-else-if="list.type==='hp-cascader-select' && (item.model.length == 1 ? list.showValue.includes(form[item.model[0]]) : list.showValue.includes(form[item.model[0]][item.model[1]]))" v-model="list.model.length == 1 ? form[list.model[0]] : form[list.model[0]][list.model[1]]" :multiple="list.multiple" :clearable="list.clearable" :filterable="list.filterable" :options="list.options"
						:props="list.props" @change="(val) => list.change ? list.change(val) : ''" :disabled="item.childDisabled")
					
			el-input(v-else-if="item.type==='el-input'" v-model='item.model.length == 1 ? form[item.model[0]] : form[item.model[0]][item.model[1]]' v-selectAll clearable @keyup.enter.native="clickQuery" :placeholder="item.placeholder" :disabled="item.childDisabled")

			hp-item-select(v-else-if="item.type==='hp-item-select'" v-model="item.model.length == 1 ? form[item.model[0]] : form[item.model[0]][item.model[1]]" :clearable="item.clearable" :filterable="item.filterable" :allowCreate="item.allowCreate" :items="item.options" :props="item.props" @change="(val) => item.change ? item.change(val) : ''" :disabled="item.childDisabled")

			el-radio-group.radio-group(v-else-if="item.type==='el-radio-group'" v-model="item.model.length == 1 ? form[item.model[0]] : form[item.model[0]][item.model[1]]" size="mini" @change="(val) => item.change ? item.change(val) : ''" :disabled="item.childDisabled")
				el-radio-button(v-for="(rangeType,index) in item.options" :label="rangeType.value" :key="index" @click.native.prevent="item.childClick ? item.childClick(rangeType.value) : ''") {{rangeType.label}}
			
			.number-2-input(v-else-if="item.type==='el-input-number-2'")
				el-input-number(v-model="item.model1.length == 1 ? form[item.model1[0]] : form[item.model1[0]][item.model1[1]]" v-selectAll controls-position="right" :precision="item.precision || 0" :min="item.min" :max="item.max" size="mini" @keyup.enter.native="clickQuery" @change="(val) => item.change1 ? item.change1(val) : ''" :disabled="item.childDisabled")
				.delim ~
				el-input-number(v-model="item.model2.length == 1 ? form[item.model2[0]] : form[item.model2[0]][item.model2[1]]" v-selectAll controls-position="right" :precision="item.precision || 0" :min="item.min" :max="item.max" size="mini" @keyup.enter.native="clickQuery" @change="(val) => item.change2 ? item.change2(val) : ''" :disabled="item.childDisabled")
			
			.hp-number-2-input(v-else-if="item.type==='hp-number-2-input'")
				hp-input-number(v-model="item.model1.length == 1 ? form[item.model1[0]] : form[item.model1[0]][item.model1[1]]" v-selectAll :precision="item.precision || 0" :min="item.min" :max="item.max" :suffix="item.suffix" :clearable="item.clearable" :placeholder="item.placeholder" @keyup.enter.native="clickQuery" @change="(val) => item.change1 ? item.change1(val) : ''" textAlign="left" :disabled="item.childDisabled")
				.delim ~
				hp-input-number(v-model="item.model2.length == 1 ? form[item.model2[0]] : form[item.model2[0]][item.model2[1]]" v-selectAll :precision="item.precision || 0" :min="item.min" :max="item.max" :suffix="item.suffix" :clearable="item.clearable" :placeholder="item.placeholder" @keyup.enter.native="clickQuery" @change="(val) => item.change2 ? item.change2(val) : ''" textAlign="left" :disabled="item.childDisabled")
			
			.switch-data(v-else-if="item.type==='hp-switch-input-date'")
				hp-switch-input(:types="item.types" :type.sync="item.model.length == 1 ? form[item.model[0]] : form[item.model[0]][item.model[1]]" :typeFieldWidth="item.typeFieldWidth")
					date-time-input(:start.sync="item.start.length == 1 ? form[item.start[0]] : form[item.start[0]][item.start[1]]" :end.sync="item.end.length == 1 ? form[item.end[0]] : form[item.end[0]][item.end[1]]" placeholder="开始时间" default-time="00:00:00" type="start" @enterEvent="clickQuery" :disabled="item.childDisabled")
					.delim ~
					date-time-input(:start.sync="item.start.length == 1 ? form[item.start[0]] : form[item.start[0]][item.start[1]]" :end.sync="item.end.length == 1 ? form[item.end[0]] : form[item.end[0]][item.end[1]]" placeholder="结束时间" default-time="23:59:59" type="end" @enterEvent="clickQuery" :disabled="item.childDisabled")

			.goods-switch(v-else-if="item.type==='goods-switch'")
				hp-switch-input(:types="item.types1"  :typeFieldWidth="item.typeFieldWidth1" :type.sync="item.type1.length == 1 ? form[item.type1[0]] : form[item.type1[0]][item.type1[1]]")
					goods-input(:value.sync="item.value1.length == 1 ? form[item.value1[0]] : form[item.value1[0]][item.value1[1]]"
						:label.sync="item.label1.length == 1 ? form[item.label1[0]] : form[item.label1[0]][item.label1[1]]" :skuLeft="item.skuLeft1"
						:getGoodsPicker="getGoodsPicker" :filterable="item.filterable1" @keyup.enter.native="clickQuery" :disabled="item.childDisabled")
				.delim 且
				hp-switch-input(:types="item.types2"  :typeFieldWidth="item.typeFieldWidth2" :type.sync="item.type2.length == 1 ? form[item.type2[0]] : form[item.type2[0]][item.type2[1]]")
					goods-input(:value.sync="item.value2.length == 1 ? form[item.value2[0]] : form[item.value2[0]][item.value2[1]]"
						:label.sync="item.label2.length == 1 ? form[item.label2[0]] : form[item.label2[0]][item.label2[1]]" :skuLeft="item.skuLeft2"
						:getGoodsPicker="getGoodsPicker" :filterable="item.filterable2" @keyup.enter.native="clickQuery" :disabled="item.childDisabled")

			radio-flags(v-else-if="item.type==='radio-flags'" v-model="item.model.length == 1 ? form[item.model[0]] : form[item.model[0]][item.model[1]]" :cancel="item.cancel" :disabled="item.childDisabled")
			

</template>

<script>''
import { mapState } from "vuex";

export default {
	name: 'CommonQuery',
	props: {
		items: Array,
		form: Object,

		hover: Boolean, // 拖拽相关
		actIndex: Number, 
		draging: Boolean
	},
	computed: {
		...mapState("common", ['cShopGroup', 'warehouseGroup', 'express', 'bizType', 'markTypes', 'invoiceTypes', 'address', 'deliveryRegions', 'salesman']),
	},
	components: {

	},
	watch: {
		cShopGroup(val) {
			this.setOptions(val, 'cShopGroup')
		},
		warehouseGroup(val) {
			this.setOptions(val, 'warehouseGroup')
		},
		express(val) {
			this.setOptions(val, 'express')
		},
		bizType(val) {
			this.setOptions(val, 'bizType')
		},
		markTypes(val) {
			this.setOptions(val, 'markTypes');
		},
		invoiceTypes(val) {
			this.setOptions(val, 'invoiceTypes');
		},
		deliveryRegions(val) {
			this.setOptions(val, 'deliveryRegions');
		},
		salesman(val) {
			this.setOptions(val, 'salesman');
		},
	},
	data() {
		return {
		}
	},
	created() {
		
	},
	methods: {
		// 重新获取新的枚举值，不影响原来的枚举
		setOptions(arr, str) {
			for (let item of this.items) {
				if (item.enums === str) {
					let res = arr
					if (item.fn) {
						res = item.fn(_.cloneDeep(arr));
					}
					item.options = res;
					break;
				}
			}
			this.items.forEach(item => {
				if (item.type === 'hp-switch-input') {
					for (let val of item.children) {
						if (val.enums === str) {
							let res = arr
							if (val.fn) {
								res = item.fn(_.cloneDeep(arr));
							}
							val.options = res;
							break;
						}
					}
				}
			})
		},
		async loadRegions({ level, parentRegion, resolve, reject }) {
			if (level === 0) {
				resolve(this.address);
			} else if (level === 1){
				let regions = this.address.find(val => {
					return val.regionCode === parentRegion.regionCode;
				});
				resolve(regions.children);
			} else if (level === 2) {
				let pRegions = this.address.find(val => {
					return val.regionCode === parentRegion.parentCode;
				});
				let cRegions = pRegions.children.find(val => {
					return val.regionCode === parentRegion.regionCode;
				})
				resolve(cRegions.children)
			}
		},
		getGoodsPicker() {
			return this.findSharedCompoment("goodsPicker");
		},
		clickQuery() {
			this.$emit('clickQuery')
		},
		setHighLight(index) {
			if (this.draging || !this.hover) return;
			this.$emit('update:actIndex', index);
		},
		clearHighLight(index) {
			if (this.draging || !this.hover) return;
			this.$emit('update:actIndex', -1);
		},
	},
}
</script>
<style lang="scss" scoped>
.query-ul{
	display: flex;
	li{
		position: relative;
		margin: 6px 0;
		padding: 0 4px;
		display: flex;
		line-height: 24px;
		::v-deep .el-radio-group{
			display: flex;
			.el-radio-button{
				flex: 1;
				span{
					padding: 4px 0;
					width: 100%;
				}
			}
		}
		.act{
			position: absolute;
			top: -6px;
			bottom: -6px;
			left: 0;
			width: 100%;
			z-index: 0;
			background: #EBF3F9;
			border: 1px solid #007EEB;
			border-radius: 3px;
		}
		>div{
			flex: 1;
		}
		.number-2-input, .hp-number-2-input, .switch-data, .goods-switch{
			display: flex;
		}
		.delim{
			position: relative;
			width: 18px;
			text-align: center;
			color: #d6d8d9;
			min-width: 18px;
		}
	}
	::v-deep .el-input-number.is-controls-right .el-input-number__decrease {
		bottom: 2px;
		height: 11px;
	}
	::v-deep .el-input-number.is-controls-right .el-input__inner{
		padding-left: 0;
		padding-right: 25px;
	}
}
</style>