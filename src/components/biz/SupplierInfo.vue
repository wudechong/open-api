<template lang="pug">
	hp-modal-dialog(ref="supplierInfoDialog" title="供应商信息" :width="width" :close-on-click-modal="false" appendToBody)
		.dialog-box
			el-form(:model="form" label-width="100px" :rules="rules")
				el-col(:span="8")
					el-form-item(label="供应商编码：" prop="todo1")
						el-input(v-model="form.todo1")
				el-col(:span="16")
					el-form-item(label="供应商名称：" prop="todo")
						el-input(v-model="form.todo")
				el-col(:span="8")
					el-form-item(label="期初应付款：" prop="todo2")
						hp-input-number(v-model="form.todo2" prefix="￥" :min="0" minLock)
				el-col(:span="16")
					el-form-item(label="网站网址：" prop="todo1")
						el-input(v-model="form.todo1")
				el-col(:span="8")
					el-form-item(label="省市区：" prop="todo3")
						hp-region-select(clearable v-model="form.todo3" vertical :levels="['省', '市', '区县']" @loadRegions="loadRegions")
				el-col(:span="16")
					el-form-item(label="详细地址：" prop="todo1")
						el-input(v-model="form.todo1")
				el-col(:span="8")
					el-form-item(label="邮编：" prop="todo1")
						el-input(v-model="form.todo1")
				el-col(:span="8")
					el-form-item(label="联系人：" prop="todo1")
						el-input(v-model="form.todo1")
				el-col(:span="8")
					el-form-item(label="直供供应商：" prop="todo4")
						el-checkbox(v-model="form.todo4")
				el-col(:span="8")
					el-form-item(label="固话：" prop="todo1")
						el-input(v-model="form.todo1")
				el-col(:span="8")
					el-form-item(label="手机：" prop="todo1")
						el-input(v-model="form.todo1")
				el-col(:span="8")
					el-form-item(label="传真：" prop="todo1")
						el-input(v-model="form.todo1")
				el-col(:span="8")
					el-form-item(label="业务员：" prop="todo1")
						hp-item-select(v-model="form.todo1" clearable filterable :items="options"
							:props="{label:'label', value: 'value'}")
				el-col(:span="8")
					el-form-item(label="税号：" prop="todo1")
						el-input(v-model="form.todo1")
				el-col(:span="8")
					el-form-item(label="email：" prop="todo1")
						el-input(v-model="form.todo1")
				el-col(:span="24")
					el-form-item(label="开户行及账号：" prop="todo1")
						el-input(v-model="form.todo1")
				el-col(:span="24")
					el-form-item(label="备注：" prop="todo1")
						el-input(type="textarea" v-model="form.todo1" :rows="3" show-word-limit style="margin-top:8px;")
		template(slot="footer")
			.buttons
				el-button(type="primary" @click="save") {{$t('common.ok')}}
				el-button(@click="close('')" plain) {{$t('common.cancel')}}
</template>

<script>
export default {
	name: "SupplierInfo",
	props: {
		width: {
			type: String,
			default: "800px",
		},
		addShow: {
			type: Boolean,
			default: false
		}
	},
	data () {
		return {
			form: {
				todo: "",
				todo1: "",
				todo2: 0,
				todo3: "",
				todo4: false
			},
			options: [],
			rules: {
				todo: [
					{ required: true, message: '请输入供应商名称', trigger: 'blur' }
				]
			}
		}
	},
	methods: {
		open(options) {
			return this.$refs.supplierInfoDialog.open(options);
		},
		close(data) {
			return this.$refs.supplierInfoDialog.close(data);
		},
		query () {},
		pageChanged (val) {},
		save () {},
		async loadRegions({level, parentRegion, resolve, reject}) {
			if (level === 0) {
				resolve(this.provinces);
			} else {
				try {
					const regions = await this.$http.get("/service/register/address", {
						type: level + 1,
						code: parentRegion.regionCode
					});
					resolve(regions);
				} catch (e) {
					reject(e);
				}
			}
		},
	}
}
</script>
<style lang="scss" scoped>
// 需根据查询条件做出修改
$query-input-large: 300px;

// 间距
// margin
$fields-right-small: 2px;
$fields-right-normal: 8px;

.input--large {
	width: $query-input-large;
}
.dialog-box {
	height: 355px;
	padding: 10px 20px;
	.menu-row {
		position: relative;
		.query-btn {
			margin-left: 10px;
			i {
				color:#558364;
				margin-right: 5px;
			}
		}
		.toolbar {
			position: absolute;
			right: 0;
			top: 0;
		}
	}
}
::v-deep .el-form-item__error {
	top: 80% !important;
}
</style>