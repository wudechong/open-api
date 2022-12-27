import globUtils from "@utils/utils";
import Vue from "vue";
import api from "./common_data";


const install = function () {
	Vue.prototype.$utils = {
		...globUtils,
	}
	Vue.prototype.$api = api
};

export default {
	install,
};
