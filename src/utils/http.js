import { http } from "calf-vue";
import Vue from "vue";
import qs from "qs";
http.defaults.showProgress = false;
export default function extendhttp() {
	http.calfInterceptors.push({
		onFullFilled(result, config = {}) {
			if (!result) {
				return result;
			}
			if (result.code && result.code !== 0 && result.code !== 200) {
				// silence: 无论接口是否成功，返回值都不报错；successAfSilence：接口调用成功，返回值不是200的不报错
				if (config.silence || (config.successAfSilence && result.errMsg === '密码错误')
				) {
					return result;
				} else if (config.showErrorTip) {  // showErrorTip: 显示报错信息为message
					Vue.prototype.$message.error(result.message || result.msg || result.errMsg);
					return result;
				}
				if (result.level === "tip") {
					Vue.prototype.$notify({
						title: "提示",
						message: result.message || result.msg || result.errMsg,
						position: result.position || "top-left",
						offset: result.offset || 0,
						customClass: result.customClass || "",
					});
				} else {
					Vue.prototype.$alert(
						result.message || result.msg || result.errMsg,
						"提示",
						{
							iconClass: "iconfont iconjichuxinxitishi icon-info",
							confirmButtonText: "我知道了",
						}
					);
				}

				return result;
			}
			if (result.code || result.code == 0 || result.code == 200) {
				return result.data;
			} else {
				return result;
			}
		},
	});
	http.postFormData = async function (url, obj, config = {}) {
		// 兼容老代码
		let method;
		if (['POST', 'GET'].indexOf(url.toUpperCase()) >= 0) {
			method = url;
			url = obj;
			obj = config;
			config = arguments[3];
		} else {
			method = "POST";
		}
		const res = await http({
			method,
			header: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			transformRequest: [
				function (obj) {
					return qs.stringify(obj);
				},
			],
			url: url,
			data: obj || null,
			...config,
		});
		return fullFilled(res, config);
	};
	http.get = async function (url, obj, config = {}) {
		const res = await http({
			method: 'GET',
			url: url,
			params: obj,
			...config,
		});
		return fullFilled(res, config);
	};

	http.post = async function (url, obj, config = {}) {
		const res = await http({
			method: 'POST',
			url: url,
			data: obj,
			...config,
		});
		return fullFilled(res, config);
	};

}
function fullFilled(response, config) {
	let result = response;
	for (const interceptor of http.calfInterceptors) {
		if (interceptor.onFullFilled) {
			result = interceptor.onFullFilled(result, config);
		}
	}
	return result;
}
