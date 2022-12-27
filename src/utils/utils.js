import { common, http } from "calf-vue";
import moment from "moment";
import CalfOss from "calf-oss";
let timer = null;
const utils = {
	// 获取下载/导入/导出url
	getDoc() {
		return http.get("/erp/supply/doc/url/get");
	},

	// yyyy-MM-ddTHH:mm:ss.000
	formatRequestDate(type = "now", pastDay = 0) {
		if (type === "start") {
			return (
				moment()
					.subtract(pastDay, "days")
					.format("YYYY-MM-DD") + " 00:00:00"
			);
		} else if (type === "end") {
			return (
				moment()
					.subtract(pastDay, "days")
					.format("YYYY-MM-DD") + " 23:59:59"
			);
		} else {
			return moment().format("YYYY-MM-DD HH:mm:ss");
		}
	},

	// 深拷贝
	clone: common.deepClone,

	// 利用对象键不重复，对对象数组去重
	uniqBy(arr = [], key) {
		const result = {};
		for (const item of arr) {
			// 以第一个为准
			if (!result[item[key]]) {
				result[item[key]] = item;
			}
		}
		return Object.values(result);
	},

	stampToDate(time, pattern = "YYYY-MM-DD HH:mm:ss") {
		if (!time) return;
		return common.formatDate(time, pattern);
	},
	// 数组变成关联树:arr-目标数组，pid-目标父id，matchId-进行匹配的id,id-目标id
	arrayToTree(arr, pid = "pid", matchId, id = "id") {
		let res = [];
		arr.forEach((item) => {
			if (item[pid] === matchId) {
				let itemChildren = utils.arrayToTree(arr, pid, item[id], id);
				if (itemChildren.length) {
					item.children = itemChildren;
				}
				res.push(item);
			}
		});
		return res;
	},
	// 四舍五入
	toRound(val, n = 2) {
		if (!val) return 0;

		let rate = Math.pow(10, n);
		return Math.round(Number(val) * rate) / rate;
	},
	// 将大图切成小图渲染
	thumbUrl(url, width = 24, height = 24) {
		if (!url) return;
		let src = "";
		try {
			let res = CalfOss.thumbUrl(url, width, height);
			if (res.includes("undefined")) {
				src = url;
			} else {
				src = res;
			}
		} catch {
			src = "";
		}
		return src;
	},
	/**
	 * 判断给定的字符串是否为中文
	 *
	 * @param {} str
	 */
	isChinese(str) {
		return str.match(/[\u4e00-\u9fa5]/g);
	},
	/**
	 * 获取字符串的长度，中文长度计为 2
	 *
	 * @param {} str
	 */
	getStrLen(str = "") {
		const matcher = this.isChinese(str);
		let l = str.length,
			len = l;
		if (matcher !== null) {
			len += matcher.length;
		}
		return len;
	},
	/**
	 * 通过 begin count 截取部分字符串
	 * strSlice('hupun湖畔', 0, 6, 'less') 返回 'hupun'
	 * strSlice('hupun湖畔', 0, 6, 'more') 返回 'hupun湖'
	 *
	 * @param {} str
	 * @param {} begin 字符串的索引
	 * @param {} count 截取的字符串长度，中文长度计为 2
	 * @param {} mode 可取 less 或 more，默认值为 less
	 */
	strSlice(str, begin, count, mode = "less") {
		let res = "",
			i = begin,
			l = 0;
		while (l < count && i < str.length) {
			let item = str.slice(i, i + 1);
			l += this.getStrLen(item);
			if (l > count) {
				if (mode === "less") {
					break;
				}
			}
			res += item;
			i++;
		}
		return res;
	},
	debounce(fn, delay = 60) {
		
		return function (...args) {
			if (timer) {
				clearTimeout(timer)
			}
			timer = setTimeout(() => {
				fn.apply(this, args)
			}, delay)
		}
	},
	isNumber(val) {
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if(regPos.test(val) || regNeg.test(val)) {
			return true;
		} else {
		return false;
		}
	},
	/**
	 * 保留n位小数
	 */
	toFixedN(num , patternNum = 2 , currency = '￥' , suffix = ''){
		if(num || num === 0){
			const pattern = `0.${new Array(patternNum).fill(0).join('')}`
			return currency + common.formatNumber(num,pattern) + suffix
		}
	},
};

export default utils;
