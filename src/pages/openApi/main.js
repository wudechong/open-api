import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import language from "./locale";
import store from "./store";
import directives from "./directives";
import mixins from "./mixins";
import utils from "./utils";
import use from "@/use";
import "./styles/index.scss";
import registerComponents from "./components/register";
import CMessageBox from "./components/common/CMessageBox";
registerComponents(Vue)

const {i18n} = use(language);
Vue.mixin(mixins);
Vue.use(directives);
Vue.use(utils);
Vue.use(CMessageBox);

Vue.prototype.$eventBus = new Vue();
Vue.prototype.$ZhAddressParse= window.ZhAddressParse
export default new Vue({
	router,
	store,
	i18n,
	render: h => h(App)
}).$mount("#app");
