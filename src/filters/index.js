import {common} from "calf-vue"

const filters = {
	// 保留n位小数
	toFixedN(num, patternNum = 2, currency = '￥', suffix = "") {
		if (num || num === 0) {
			const pattern = `0.${new Array(patternNum).fill(0).join('')}`
			return currency + common.formatNumber(num, pattern) + suffix
		}
		return
	},
	formatNumber(num, pattern = "0.00") {
		return common.formatNumber(num, pattern)
	},

	stampToDate(time, pattern = "YYYY-MM-DD HH:mm:ss") {
		if (!time) return
		return common.formatDate(time, pattern)
	},
}

const install = function (Vue) {
	for (let key in filters) {
		Vue.filter(key, filters[key])
	}
}

export default install
