<template lang="pug">
	div
		hp-modal-dialog(ref='modelDialog' title='地区设置' width='900px' @close="()=>close()" :close-on-click-modal="false")
			ul.form-box
				li.region-contains
					.btn-box
						a(@click='allCheck') 全选
						a(@click='allNotCheck') 全不选
						a(@click='antiCheck') 反选
					.region-box
						.region-wrap(v-for='(p, pIndex) in regionList' :key='p[defaultProps.value]')
							ul.province-box
								el-checkbox(v-model='p.isChecked' :disabled='p.disabled' :indeterminate='p.indeterminate' @change='(val)=>provinceCheck(val, pIndex)') {{p[defaultProps.label]}}
							ul.city-box
								li.city-item(v-for='(c, cIndex) in p[defaultProps.children]' ref='city' :key='c[defaultProps.value]')
									el-checkbox.city-checkbox(@mouseenter.native='changeArea(c, pIndex, cIndex, $event)' v-model='c.isChecked' :disabled='c.disabled' :indeterminate='c.indeterminate' @change='(val)=>cityCheck(val, pIndex, cIndex)') {{c[defaultProps.label]}}
			span.dialog-footer(slot='footer')
				el-button(type='primary' @click='confirm') {{$t('common.saveButton')}}
				el-button(@click='cancel' class="is-plain") {{$t('common.cancel')}}
		template(v-if='showArea && off')
			ul.area-box(v-show='showCurrent && currentCity[defaultProps.children]' :style="{'top':currentTop + 'px','left':currentLeft + 'px'}")
				li(v-for='(area, areaIndex) in currentCity[defaultProps.children]' :key='area[defaultProps.value]')
					el-checkbox(v-model='area.isChecked' :disabled='area.disabled' @change='(val)=>areaCheck(val, currentPIndex, currentCIndex, areaIndex)') {{area[defaultProps.label]}}

</template>

<script>
import _ from "lodash";
export default {
	name: 'RegionSet',
	props: {
		data: Array,
		defaultProps: {
			type: Object,
			default: () => {
				return {
					children: 'children',
					label: 'regionName',
					value: 'regionCode',
					regionGrade: 'regionGrade', // 级别，3是区
				}
			},
		},
		showArea: { // 是否显示区，区可能没有，所以需要判断市的children
			type: Boolean,
			default: true,
		},
	},
	data () {
		return {
			value: [], // 传入的已选
			disabledCodes: [], // 传入的不能选
			regionList: [],
			currentCity: {},
			showCurrent: false,
			currentTop: 0,
			currentLeft: 0,
			currentPIndex: 0,
			currentCIndex: 0,
			times: null, // 延时器
			off: false,
		}
	},
	watch: {
	},
	created () {

	},
	methods: {
		open(options) {
			this.off = true;
			this.init(options)
			this.initValue()
			if (this.showArea) {
				document.addEventListener('mousemove', this.setAreaStatus, false);
			}
			return this.$refs.modelDialog.open(options);
		},
		close(data) {
			this.off = false;
			if (this.showArea) {
				document.removeEventListener('mousemove', this.setAreaStatus, false);
			}
			return this.$refs.modelDialog.close(data);
		},
		init (options) {
			this.value = options.value || [];
			this.disabledCodes = options.disabledCodes || [];
			this.regionList = _.cloneDeep(this.data)
			this.regionList.forEach(p => {
				this.$set(p, 'isChecked', false)
				this.$set(p, 'indeterminate', false)
				this.$set(p, 'disabled', false)
				p[this.defaultProps.children].forEach(c => {
					this.$set(c, 'isChecked', false)
					this.$set(c, 'indeterminate', false)
					this.$set(c, 'disabled', false)
					if (this.showArea && c[this.defaultProps.children]) { // 如果区显示
						if (c[this.defaultProps.children].length === 0) {
							c[this.defaultProps.children].push({
								[this.defaultProps.value]: c[this.defaultProps.value],
								[this.defaultProps.regionGrade]: c[this.defaultProps.regionGrade],
								[this.defaultProps.label]: c[this.defaultProps.label]
							})
						}
						c[this.defaultProps.children].forEach(area => {
							this.$set(area, 'isChecked', false)
							this.$set(area, 'disabled', false)
						})
					}
				})
			})
			this.getDisabled(this.regionList)
		},
		initValue () {
			let arr =  _.cloneDeep([...this.value, ...this.disabledCodes])
			arr.forEach(regionCode => {
				this.regionList.forEach(item => {
					if (item[this.defaultProps.value] == regionCode) {
						let status = this.disabledCodes.includes(regionCode);
						item[this.defaultProps.children].forEach(item1 => {
							item1.isChecked = !status
							item1.disabled = status
							if (this.showArea && item1[this.defaultProps.children]) {
								item1[this.defaultProps.children].forEach(area => {
									area.isChecked = !status
									area.disabled = status
								})
							}
						})
						item.isChecked = !status
						item.disabled = status
					} else {
						item[this.defaultProps.children].forEach(item1 => {
							if (regionCode == item1[this.defaultProps.value]) {
								let status = this.disabledCodes.includes(regionCode);
								item1.isChecked = !status
								item1.disabled = status
								if (this.showArea && item1[this.defaultProps.children]) {
									item1[this.defaultProps.children].forEach(area => {
										area.isChecked = !status
										area.disabled = status
									})
								}
							} else if (this.showArea && item1[this.defaultProps.children]) {
								item1[this.defaultProps.children].forEach(area => {
									if (regionCode == area[this.defaultProps.value]) {
										let status = this.disabledCodes.includes(regionCode);
										area.isChecked = !status
										area.disabled = status
									}
								})
							}
						})
					}
				})
			})
			this.setChecked(this.regionList);
		},
		// 通过禁止选取的arr来把上下级选出禁止
		getDisabled(list) {
			list.forEach(item => {
				// 条件满足：省市级；有区级且showArea-true
				if ((item[this.defaultProps.children] && item[this.defaultProps.regionGrade] < 2) || (item[this.defaultProps.children] && item[this.defaultProps.regionGrade] === 2 && this.showArea)) {
					this.getDisabled(item[this.defaultProps.children]);
					let status = item[this.defaultProps.children].every(val => {
						return this.disabledCodes.includes(val[this.defaultProps.value])
					})
					if (status && !this.disabledCodes.includes(item[this.defaultProps.value])) {
						this.disabledCodes.push(item[this.defaultProps.value])
					}
				}
			})
		},
		// 设置上下级的check
		setChecked(list) {
			list.forEach(item => {
				// 条件满足：省市级；有区级且showArea-true
				if ((item[this.defaultProps.children] && item[this.defaultProps.regionGrade] < 2) || (item[this.defaultProps.children] && item[this.defaultProps.regionGrade] === 2 && this.showArea)) {
					this.setChecked(item[this.defaultProps.children]);
					let status = item[this.defaultProps.children].every(val => {
						return val.isChecked == true
					})
					if (status) {
						item.isChecked = true
						item.indeterminate = false
					} else {
						item.isChecked = false
						item.indeterminate = item[this.defaultProps.children].some(val => {
							return val.isChecked || val.indeterminate
						})
					}
				}
			})
		},
		// 全选
		allCheck () {
			this.regionList.forEach(p => {
				if (this.disabledCodes.includes(p[this.defaultProps.value])) {return};
				p.isChecked = true
				p.indeterminate = false
				p[this.defaultProps.children].forEach(c => {
					if (this.disabledCodes.includes(c[this.defaultProps.value])) {return};
					c.isChecked = true
					c.indeterminate = false;
					if (this.showArea && c[this.defaultProps.children]) { // 如果区显示
						c[this.defaultProps.children].forEach((area) => {
							if (this.disabledCodes.includes(area[this.defaultProps.value])) {return};
							area.isChecked = true;
						})
					}
				})
			})
			this.setChecked(this.regionList);
		},
		// 全不选
		allNotCheck () {
			this.regionList.forEach(p => {
				if (this.disabledCodes.includes(p[this.defaultProps.value])) {return};
				p.isChecked = false
				p.indeterminate = false
				p[this.defaultProps.children].forEach(c => {
					if (this.disabledCodes.includes(c[this.defaultProps.value])) {return};
					c.isChecked = false
					c.indeterminate = false
					if (this.showArea && c[this.defaultProps.children]) { // 如果区显示
						c[this.defaultProps.children].forEach((area) => {
							if (this.disabledCodes.includes(area[this.defaultProps.value])) {return};
							area.isChecked = false;
						})
					}
				})
			})
			this.setChecked(this.regionList);
		},
		// 反选
		antiCheck () {
			this.regionList.forEach((p) => {
				if (this.disabledCodes.includes(p[this.defaultProps.value])) {return};
				p.isChecked = !p.isChecked
				p[this.defaultProps.children].forEach((c) => {
					if (this.disabledCodes.includes(c[this.defaultProps.value])) {return};
					c.isChecked = !c.isChecked
					if (this.showArea && c[this.defaultProps.children]) { // 如果区显示
						c[this.defaultProps.children].forEach((area) => {
							if (this.disabledCodes.includes(area[this.defaultProps.value])) {return};
							area.isChecked = !area.isChecked;
						})
					}
				})
			})
			this.setChecked(this.regionList);
		},
		// 省选择
		provinceCheck (val, index) {
			this.regionList[index].indeterminate = false
			if (val) {
				this.regionList[index][this.defaultProps.children].forEach(c => {
					if (this.disabledCodes.includes(c[this.defaultProps.value])) {return};
					c.isChecked = true
					c.indeterminate = false
					if (this.showArea && c[this.defaultProps.children]) {
						c[this.defaultProps.children].forEach((item) => {
							if (this.disabledCodes.includes(item[this.defaultProps.value])) {return};
							item.isChecked = true
						})
					}
				})
			} else {
				this.regionList[index][this.defaultProps.children].forEach(c => {
					if (this.disabledCodes.includes(c[this.defaultProps.value])) {return};
					c.isChecked = false
					c.indeterminate = false
					if (this.showArea && c[this.defaultProps.children]) {
						c[this.defaultProps.children].forEach((item) => {
							if (this.disabledCodes.includes(item[this.defaultProps.value])) {return};
							item.isChecked = false
						})
					}
				})
			}
			this.setChecked(this.regionList);
		},
		// 市选择
		cityCheck (val, pIndex, cIndex) {
			this.regionList[pIndex][this.defaultProps.children][cIndex].indeterminate = false;
			if (!val) {
				this.regionList[pIndex].isChecked = false
				this.regionList[pIndex].indeterminate = this.regionList[pIndex][this.defaultProps.children].some((item) => {
					return item.isChecked || item.indeterminate
				})
				if (this.showArea && this.regionList[pIndex][this.defaultProps.children][cIndex][this.defaultProps.children]) {
					this.regionList[pIndex][this.defaultProps.children][cIndex][this.defaultProps.children].forEach((item) => {
						if (this.disabledCodes.includes(item[this.defaultProps.value])) {return};
						item.isChecked = false
					})
				}
			} else {
				if (this.showArea && this.regionList[pIndex][this.defaultProps.children][cIndex][this.defaultProps.children]) {
					this.regionList[pIndex][this.defaultProps.children][cIndex][this.defaultProps.children].forEach((item) => {
						if (this.disabledCodes.includes(item[this.defaultProps.value])) {return};
						item.isChecked = true
					})
				}
			}
			this.setChecked(this.regionList);
		},
		// 区选择
		areaCheck (val, pIndex, cIndex, areaIndex) {
			if (!val) {
				this.regionList[pIndex].isChecked = false
				this.regionList[pIndex][this.defaultProps.children][cIndex].isChecked = false;
				this.regionList[pIndex][this.defaultProps.children][cIndex].indeterminate = this.regionList[pIndex][this.defaultProps.children][cIndex][this.defaultProps.children].some((item) => {
					return item.isChecked == true
				})
				this.regionList[pIndex].indeterminate = this.regionList[pIndex][this.defaultProps.children].some((item) => {
					return item.isChecked || item.indeterminate
				})
			} else {
				this.setChecked(this.regionList);
			}
		},
		//
		confirm () {
			let regionNames = []
			let regionContain = []; // 包含关系的name
			let regionCodes = [];
			let regionObjArr = [];

			this.regionList.forEach(p => {
				if (p.isChecked) {
					regionCodes.push(p[this.defaultProps.value])
					regionNames.push(p[this.defaultProps.label])
					regionContain.push(p[this.defaultProps.label])
					regionObjArr.push({ regionName: p[this.defaultProps.label], regionCode: p[this.defaultProps.value] });
				} else {
					let pRegionNames = [];
					p[this.defaultProps.children].forEach(c => {
						if (c.isChecked) {
							pRegionNames.push(c[this.defaultProps.label])
							regionNames.push(c[this.defaultProps.label])
							regionCodes.push(c[this.defaultProps.value])
							regionObjArr.push({ regionName: p[this.defaultProps.label], cityName: c[this.defaultProps.label], regionCode: c[this.defaultProps.value] });
						} else if (this.showArea && c[this.defaultProps.children]) {
							let aRegionNames = [];
							c[this.defaultProps.children].forEach(area => {
								if (area.isChecked) {
									aRegionNames.push(area[this.defaultProps.label])
									regionNames.push(area[this.defaultProps.label])
									regionCodes.push(area[this.defaultProps.value])
									regionObjArr.push({ regionName: p[this.defaultProps.label], cityName: c[this.defaultProps.label], districtName: area[this.defaultProps.label], regionCode: area[this.defaultProps.value] });
								}
							})
							if (aRegionNames.length > 0) {
								regionContain.push(`${c[this.defaultProps.label]}（${aRegionNames.join('；')}）`)
							}
						}
					})
					if (pRegionNames.length > 0) {
						regionContain.push(`${p[this.defaultProps.label]}（${pRegionNames.join('；')}）`)
					}
				}
			})
			this.close({regionCodes, regionNames, regionContain, regionObjArr});
		},
		changeArea(city, pIndex, cIndex, e) {
			if (!this.showArea) return
			clearTimeout(this.times);
			this.times = setTimeout(() => {
				let item = document.getElementsByClassName('region-wrap')[pIndex].getElementsByClassName('city-checkbox')[cIndex];
				if (item.contains(e.target)) {
					let obj = document.getElementsByClassName('region-wrap')[pIndex].getElementsByClassName('city-item')[cIndex];
					let areaBox = document.getElementsByClassName('area-box')[0];
					areaBox.scrollTop = 0;
					let regionTop = document.getElementsByClassName('region-box')[0].scrollTop;
					var l = 0, t = 0;
					while(obj) {
							l = l + obj.offsetLeft + obj.clientLeft;
							t = t + obj.offsetTop + obj.clientTop;
							obj = obj.offsetParent;
					}
					this.showCurrent = true;
					this.currentCity = city;
					this.currentPIndex = pIndex;
					this.currentCIndex = cIndex;
					this.currentLeft = l - 1;
					this.currentTop = t + 22 - regionTop;
				}
			}, 1000)
		},
		setAreaStatus(e) {
			let checkboxs = document.getElementsByClassName('city-checkbox');
			let status = Array.prototype.every.call(checkboxs, function (val) {
				return !val.contains(e.target)
			});
			let areaBox = document.getElementsByClassName('area-box')[0];
			let areaStatus = !areaBox.contains(e.target)
			if (status && areaStatus) {
				clearTimeout(this.times);
				this.showCurrent = false
			}
		},
		cancel () {
			this.close();
		},
	},
}
</script>

<style lang="scss" scoped>
.form-box {
	padding: 0 6px 6px 6px;
	> li {
		margin: 0 0 10px 0;
		> label {
			display: inline-block;
			text-align: right;
			width: 100px;
		}
	}
}
.area-box {
	position: fixed;
	flex: 1;
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	padding: 5px;
	min-width: 320px;
	max-height: 150px;
	overflow-y: auto;
	top: 25px;
	left: 0;
	z-index: 9999;
	background-color: rgb(228, 239, 247);
	border-radius: 5px;
	li {
		padding: 5px 0;
	}
}
.region-contains {
	.btn-box {
		text-align: right;
		margin: 5px 0;
		a {
			margin-right: 10px;
		}
	}
	.region-box {
		height: 70vh;
		max-height: 400px;
		overflow: auto;
		.region-wrap {
			display: flex;
			&:nth-of-type(odd) {
				background: #fafafa;
			}
			.province-box {
				width: 20%;
				padding: 10px;
				box-sizing: border-box;
				border-right: 1px solid #ccc;
			}
			.city-box {
				flex: 1;
				display: grid;
				grid-template-columns: 1fr 1fr 1fr 1fr;
				padding: 5px;
				> li {
					padding: 5px 0;
				}
			}
		}
	}
}
::v-deep .el-checkbox__input.is-disabled .el-checkbox__inner::after{
	transform: rotate(45deg) scaleY(1);
	color: #333;
	border-color: #333;
}
::v-deep .el-checkbox__input.is-disabled + span.el-checkbox__label{
	color: #333;
}
</style>
