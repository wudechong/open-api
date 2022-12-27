<template lang="pug">
	hp-modal-dialog(ref="AddExpressDialog" title="快递公司信息" :width="width" :close-on-click-modal="false" appendToBody)
		.dialog-box(id="addExpress")
			el-form(:model="form" label-width="90px")
				el-col(:span="8")
					el-form-item(label="快递编码：")
						el-input(v-model="form.aa" placeholder="默认自动生成..." clearable v-selectAll)
				el-col(:span="16")
					el-form-item(label="快递名称：")
						hp-input-field.input(:state="visible&&!form.bb ? 'error': ''" message='请输入快递名称' type="bubble" hoverShow)
							el-input(v-model="form.bb" clearable v-selectAll)
				el-col(:span="8")
					el-form-item(label="承运商：")
						hp-input-field.input(:state="visible&&!form.cc ? 'error': ''" message='请选择承运商' type="bubble" hoverShow)
							hp-cascader-select(v-model='form.cc' :multiple="false" :options='expressCarrier' :props="{children: '',label: 'expressCarrierName',value: 'expressCarrierCode'}" placeholder='' clearable)
				el-col(:span="8")
					el-form-item(label="打印模板：")
						hp-input-field.input(:state="visible&&!form.dd ? 'error': ''" message='请选择打印模板' type="bubble" hoverShow)
							hp-cascader-select(v-model='form.dd' :multiple="false" :options='printData' :props="{children: '',label: 'name',value: 'id'}" placeholder='' clearable)
				el-col(:span="8")
					el-form-item(label="期初应付款：")
						hp-input-number(v-model="form.ee" textAlign="left" v-selectAll suffix="￥" :precision="2" :min="0" :max="99999999999" clearable)
				el-col(:span="24")
					el-form-item(label="网站地址：")
						el-input(v-model="form.ff" clearable v-selectAll)
				el-col(:span="8")
					el-form-item(label="省市区：")
						hp-region-select(clearable v-model="form.address" vertical :levels="['省', '市', '区县']" @loadRegions="loadRegions")
				el-col(:span="16")
					el-form-item(label="详细地址：")
						address-input(:value.sync="form.detail" @enter="setArea" :maxlength="164" @confirm="setArea" :showBtn="false" placeholder="支持智能语义识别地址")
				el-col(:span="8")
					el-form-item(label="邮编：")
						el-input(v-model="form.gg" clearable v-selectAll)
				el-col(:span="8")
					el-form-item(label="联系人：")
						el-input(v-model="form.name" clearable v-selectAll)
				el-col(:span="8")
					el-form-item(label="固话：" )
						el-input(v-model="form.phone" clearable v-selectAll)
				el-col(:span="8")
					el-form-item(label="手机：")
						el-input(v-model="form.mobile" clearable v-selectAll)
				el-col(:span="8")
					el-form-item(label="E-mail：")
						hp-input-field.input(:state="visible&&form.email&&!isEmail(form.email) ? 'error': ''" message='E-mail格式不正确' type="bubble" hoverShow)
							el-input(v-model="form.email" clearable v-selectAll)
				el-col(:span="8")
					el-form-item(label="税号：")
						el-input(v-model="form.ll" clearable v-selectAll)
				el-col(:span="8")
					el-form-item(label="传真：")
						el-input(v-model="form.mm" clearable v-selectAll)
				el-col(:span="16")
					el-form-item(label="开户行及账号：")
						el-input(v-model="form.nn" clearable v-selectAll)
				el-col(:span="24")
					el-form-item.remark(label="备注：")
						el-input(type="textarea" v-model="form.oo" :rows="3" :maxlength="300" show-word-limit style="margin-top:8px;")
		template(slot="footer")
			.buttons
				el-button(type="primary" @click="save") {{$t('common.ok')}}
				el-button(@click="close('')" plain) {{$t('common.cancel')}}
</template>

<script>
import { mapState } from 'vuex'
import AddressInput from './AddressInput.vue'

export default {
	name: "AddExpress",
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
				aa: undefined,
				bb: undefined,
				cc: undefined,
				dd: undefined,
				ee: 0,
				ff: undefined,
				gg: undefined,
				name: undefined,
				phone: undefined,
				mobile: undefined,
				email: undefined,
				ll: undefined,
				mm: undefined,
				nn: undefined,
				oo: undefined,
				province: undefined,
				city: undefined,
				district: undefined,
				address: undefined,
			},
			visible: false,
		}
	},
	computed: {
		...mapState('common', ['printData', 'expressCarrier', 'address']),
	},
	created() {
		this.$store.dispatch("common/loadPrintData"); // 打印模板
		this.$store.dispatch("common/loadExpressCarrier"); // 承运商
	},
	methods: {
		open() {
			return this.$refs.AddExpressDialog.open();
		},
		close(data) {
			return this.$refs.AddExpressDialog.close(data);
		},
		query () {},
		pageChanged (val) {},
		async save () {
			this.visible = true;
			await this.sleep(300);
			if (this.form.address && this.form.address.includes(' / ')) {
				const address = this.form.address.split("/");
				this.form.province = address[0]
					? address[0].trim()
					: undefined;
				this.form.city = address[1]
					? address[1].trim()
					: undefined;
				this.form.district = address[2]
					? address[2].trim()
					: undefined;
			} 
			console.log(this.form)
			// 有数字输入错误
			let errLength = document.getElementById('addExpress').getElementsByClassName('error').length;
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
					data: this.form.detail,
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
						this.form.province = res.provinceName;
						this.form.city = res.cityName;
						this.form.detail = res.detail;
						this.form.address = `${this.form.province} / ${
							this.form.city
						}`;
					} else if (address == true && !res.emptyDistrict) {
						this.form.province = result.province;
						this.form.city = result.city;
						this.form.district = result.area;
						this.form.detail = result.details;
						this.form.address = `${this.form.province} / ${
							this.form.city
						} ${
							this.form.district
								? "/ " + this.form.district
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
	height: 370px;
	padding: 10px 20px;
	.input{
		width: 100%;
	}
	.hp-cascader-select, ::v-deep .el-select{
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