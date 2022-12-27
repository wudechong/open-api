<template lang="pug">
	hp-modal-dialog(ref="addCustomDialog" title="客户信息" :width="width" :close-on-click-modal="false" appendToBody)
		.dialog-box(id="addCustom")
			el-form(:model="form" label-width="90px")
				el-col(:span="8")
					el-form-item(label="平台：")
						lazy-select(v-model='form.sourceType' :multiple="false" :options='shopType' :props="{children: '',label: 'label',value: 'id'}" placeholder='' :clearable="false")
				el-col(:span="8")
					el-form-item(label="昵称：")
						hp-input-field.input(:state="visible&&!form.sourceNick ? 'error': ''" message='请输入昵称' type="bubble" hoverShow)
							el-input(v-model="form.sourceNick" clearable placeholder="昵称/手机号码" v-selectAll)
				el-col(:span="8")
					el-form-item(label="期初应付款：")
						hp-input-number(v-model="form.cc" textAlign="left" v-selectAll suffix="￥" :precision="2" :min="0" :max="99999999999" clearable)
				el-col(:span="8")
					el-form-item(label="客户编码：")
						el-input(v-model="form.code" placeholder="默认自动生成..." clearable v-selectAll)
				el-col(:span="8")
					el-form-item(label="客户名称：")
						hp-input-field.input(:state="visible&&!form.name ? 'error': ''" message='请输入客户名称' type="bubble" hoverShow)
							el-input(v-model="form.name" clearable v-selectAll)
				el-col(:span="8")
					el-form-item(label="预收款余额：")
						hp-input-number(v-model="form.ff" textAlign="left" v-selectAll suffix="￥" :precision="2" :min="0" :max="99999999999" disabled)
				el-col(:span="8")
					el-form-item(label="客户类型：")
							hp-cascader-select(v-model='form.priceType' :multiple="false" :options='platformTypeList' :props="{children: '',label: 'label',value: 'value'}" placeholder='' :clearable="false")
				el-col(:span="8")
					el-form-item(label="业务员：")
							hp-cascader-select(v-model='form.hh' :multiple="false" :options='salesman' :props="{children: '',label: 'name',value: 'id'}" placeholder='' :clearable="false")
				el-col(:span="8")
					el-form-item(label="省市区：")
						hp-region-select(clearable v-model="form.addressTxt" vertical :levels="['省', '市', '区县']" @loadRegions="loadRegions")
				el-col(:span="16")
					el-form-item(label="详细地址：")
						address-input(:value.sync="form.address" @enter="setArea" :maxlength="164" @confirm="setArea" :showBtn="false" placeholder="支持智能语义识别地址")
				el-col(:span="8")
					el-form-item(label="邮编：")
						el-input(v-model="form.ii" clearable v-selectAll)
				
				el-col(:span="8")
					el-form-item(label="固话：" )
						el-input(v-model="form.phone" clearable v-selectAll)
				el-col(:span="16")
					el-form-item(label="E-mail：")
						hp-input-field.input(:state="visible&&form.email&&!isEmail(form.email) ? 'error': ''" message='E-mail格式不正确' type="bubble" hoverShow)
							el-input(v-model="form.email" clearable v-selectAll)
				el-col(:span="8")
					el-form-item(label="手机：")
						el-input(v-model="form.mobile" clearable v-selectAll)
				el-col(:span="16")
					el-form-item(label="QQ/MSN：")
						el-input(v-model="form.qqMsn" clearable v-selectAll)
				el-col(:span="24")
					el-form-item.remark(label="备注：")
						el-input(type="textarea" v-model="form.remark" :maxlength="300" :rows="3" show-word-limit style="margin-top:8px;")
		template(slot="footer")
			.buttons
				el-button(type="primary" @click="save") {{$t('common.ok')}}
				el-button(@click="close('')" plain) {{$t('common.cancel')}}
</template>

<script>
import { mapState } from 'vuex'
import AddressInput from './AddressInput.vue'
export default {
	name: "AddCustom",
	components: {
		AddressInput,
	},
	props: {
		width: {
			type: String,
			default: "800px",
		},
	},
	data () {
		return {
			form: {
				sourceType: -1,
				sourceNick: undefined,
				cc: 0,
				code: undefined,
				name: undefined,
				ff: 0,
				priceType: 0,
				hh: undefined,
				ii: undefined,
				phone: undefined,
				email: undefined,
				mobile: undefined,
				qqMsn: undefined,
				nn: undefined,
				remark: undefined,
				state: undefined,
				city: undefined,
				area: undefined,
				address: undefined,
				addressTxt: undefined,
			},
			visible: false,
			platformTypeList: [
				{ label: '零售', value: 0},
				{ label: '批发', value: 1},
				{ label: '分销', value: 2},
			],
		}
	},
	computed: {
		...mapState('common', ['shopType', 'address', 'salesman']),
	},
	created() {
		this.$store.dispatch("common/loadShopType"); // 打印模板
	},
	methods: {
		open() {
			return this.$refs.addCustomDialog.open();
		},
		close(data) {
			this.form.sourceType = undefined;
			return
			return this.$refs.addCustomDialog.close(data);
		},
		query () {},
		pageChanged (val) {},
		async save () {
			this.visible = true;
			await this.sleep(300);
			if (this.form.addressTxt && this.form.addressTxt.includes(' / ')) {
				const address = this.form.addressTxt.split("/");
				this.form.state = address[0]
					? address[0].trim()
					: undefined;
				this.form.city = address[1]
					? address[1].trim()
					: undefined;
				this.form.area = address[2]
					? address[2].trim()
					: undefined;
			} 
			console.log(this.form)
			// 有数字输入错误
			let errLength = document.getElementById('addCustom').getElementsByClassName('error').length;
			if (errLength > 0) return
			this.close(this.form);
			Object.assign(this.$data,this.$options.data(this)) 
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
		// 设置地址
		async setArea(result) {
			try {
				const res = await this.$http.get("/calf/basic/widget/region/matching", {
					data: this.form.address,
				});
				if (!res.code) {
					let address = true;
					if (!res) {
						address = false;
					}
					if (address && result.area == "" && !res.emptyDistrict) {
						address = false;
					} 
					if (address == true && res.emptyDistrict) {
						this.form.state = res.provinceName;
						this.form.city = res.cityName;
						this.form.address = res.detail;
						this.form.addressTxt = `${this.form.state} / ${
							this.form.city
						}`;
					} else if (address == true && !res.emptyDistrict) {
						this.form.state = result.province;
						this.form.city = result.city;
						this.form.area = result.area;
						this.form.address = result.details;
						this.form.addressTxt = `${this.form.state} / ${
							this.form.city
						} ${
							this.form.area
								? "/ " + this.form.area
								: ""
						}`;
					}
					if (result.mobile) {
						this.form.mobile = result.mobile;
					}
					if (result.phone) {
						this.form.phone = result.phone;
					}
					if (result.name) {
						this.form.name = result.name;
					}
				}
			} finally {
			}
		},
		isEmail(email) {
			if (email) {
				var emailValidate = /^([a-zA-Z0-9]+[_|_|.|-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.|-]?)*[a-zA-Z0-9]+.[a-zA-Z]{2,4}$/;
				return emailValidate.test(email);
			}
			return false;
		}
	}
}
</script>
<style lang="scss" scoped>
.dialog-box {
	height: 300px;
	padding: 10px 20px;
	.input{
		width: 100%;
	}
	.hp-cascader-select, ::v-deep .el-select, .vxe-pulldown{
		width: 100%;
	}
	.el-form-item{
		margin: 6px 0;
		&.remark{
			margin-top: 0;
		}
	}
	::v-deep .el-form-item__label{
		padding: 0;
		line-height: 24px;
	}
	::v-deep .el-form-item__content{
		line-height: 24px;
		font-size: 12px;
	}
}
</style>