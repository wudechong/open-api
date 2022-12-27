import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/openApi',
    },
	// 开放平台
	{ path: '/openApi', name: 'openApi', component: () => import(/* webpackChunkName: "report-chunk" */ "../views/openApi/Index.vue")},
  ]
})
