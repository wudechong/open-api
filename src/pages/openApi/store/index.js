import Vue from "vue";
import Vuex from "vuex";
import globalStore from "@store"
import configCommon from "./common"
import trade from "./trade"
import permission from "./permission"
Vue.use(Vuex);
const store = new Vuex.Store({
	modules: {
    ...globalStore,
	configCommon,
	trade,
	permission,
	}
});
export default store;
