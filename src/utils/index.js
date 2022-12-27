import Vue from "vue"
import extendAxios from "./http"
import api from "./common-data"
import utils from "./utils"

const install = function () {
	extendAxios();

	Vue.prototype.$api = api;
	Vue.prototype.$utils = utils;
};

export default {
	install
}
