import Vue from "vue"
import VueI18n from "vue-i18n"
import CalfVue from "calf-vue"
import mixins from "@mixins"
import components from "@components"

import directives from "@directives"
import filters from "@filters"
import moment from "moment"
import utils from "@utils"
import ElementUI from "element-ui"

export default function (messages) {
	const isDevMode = process.env.NODE_ENV === "development"
	Vue.config.productionTip = !isDevMode

	if (isDevMode) {
		require("@mock")
	}

	Vue.use(CalfVue.pc)

	Vue.use(directives)
	Vue.use(filters)
	Vue.use(utils)
	Vue.mixin(mixins)
	for (const component of Object.values(components)) {
		Vue.component(component.name, component)
	}
	
	Vue.prototype.$message = function (options) {
		if (options.type === 'info') {
			options = {
				...options,
				iconClass: 'iconfont-calf icon-info icon-info-color',
				customClass: 'el-message--info',
				offset: 12,
				duration: 1000
			}
		} else if (options.type === 'warning') {
			options = {
				...options,
				iconClass: 'iconfont-calf icon-warn icon-warning',
				customClass: 'el-message--warning',
				offset: 12,
				duration: 2000
			}
		} else if (!options.type) {
			options = {
				message: options,
				iconClass: 'iconfont-calf icon-info icon-info-color',
				customClass: 'el-message--info',
				offset: 12,
				duration: 1000
			}
		}
		ElementUI.Message(options)
	}
	Vue.prototype.$message.warning = (text) => {
		ElementUI.Message({
			iconClass: 'iconfont-calf icon-warn icon-warning',
			customClass: 'el-message--warning',
			type: 'warning',
			message: text,
			offset: 12,
			duration: 2000
		})
	}
	Vue.prototype.$message.info = (text) => {
		ElementUI.Message({
			iconClass: 'iconfont-calf icon-info icon-info-color',
			customClass: 'el-message--info',
			message: text,
			offset: 12,
			duration: 1000
		})
	}
	Vue.prototype.$message.success = (text) => {
		ElementUI.Message({
			type: 'success',
			message: text,
			offset: 12,
			duration: 1000
		})
	}
	Vue.prototype.$message.error = (text) => {
		ElementUI.Message({
			type: 'error',
			message: text,
			offset: 12,
			duration: 1000
		})
	}

	moment.locale("zh-cn")

	Vue.use(VueI18n)
	const i18n = new VueI18n({
		locale: "cn", // 设置语言
		messages, // 语言包
		fallbackLocale: "cn" // 默认语言包,当en语言包不存在时，默认cn
	})

	return {i18n}
}
