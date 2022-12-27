<template lang="pug">
	div.contains
		header
			div.title
				div.labelBox(v-for="(item, index) in tabList" :key="index" :class="{labelColor:tab == index}")
					label.labelText(@click="clickTab(index)") {{item.label}}
		.baImg
		main
			component(:is="componentId" @showJoinGuide="clickTab(1)")
		footer
			label 版权所有© 2022 杭州湖畔网络技术有限公司浙ICP备11057864号-1 
			img(src="@/assets/img/openApi/Control/公安icon.svg")
			label 浙公网安备 33010602002003号Copyright© 2022 Hangzhou HUPUN Network Technology CO.,LTD.All Rights Reserved
			img(src="@/assets/img/openApi/Control/认证icon.svg")
		development-agreement(:show="agreeVisible" @confirm="agreeDevelopment")
		//- join-guide-vue(:show="showJoinGuideVisible" @close="showJoinGuideVisible=false")
</template>

<script>
import control from './Control/Control';
import joinGuide from './JoinGuide/JoinGuide';
import APIWord from './APIWord/APIWord';
import serviceSupport from './ServiceSupport/ServiceSupport';
import notice from './Notice/Notice';
import developmentAgreement from './DevelopmentAgreement';
import joinGuideVue from './JoinGuideVue';
import { mapState } from 'vuex';
export default {
	components: {
		control,
		joinGuide,
		APIWord,
		serviceSupport,
		notice,
		developmentAgreement,
		joinGuideVue
	},
	props: {},
	mixins: [],
	data() {
		return {
			tab: 0,
			tabList: [
				
			],
			componentId: '',
			agreeVisible: true,
			showJoinGuideVisible: false
		};
	},
	computed: {
		...mapState('configCommon',['isAdmin']),
	},
	watch: {
		'isAdmin' (val) {
			if (val) {
				this.tabList = [
					{label: '控制台'},
					{label: '接入指南'},
					{label: 'API文档'},
					{label: '服务支持'},
					{label: '公告通知'}
				]
				this.componentId = 'control'
			}else{
				this.tabList = [
					{label: '接入指南'},
					{label: 'API文档'},
					{label: '服务支持'},
					{label: '公告通知'}
				]
				this.componentId = 'joinGuide'
			}
		}
	},
	created() {
		this.enums()
		this.agreeVisible = true
	},
	mounted() {},
	methods: {
		enums () {
			this.$store.dispatch('configCommon/loadIsAdmin');
		},
		clickTab(index) {
			if (this.isAdmin) {
				this.tab = index
				switch(index) {
					case 0:
						this.componentId = 'control'
						break;
					case 1:
						this.componentId = 'joinGuide'
						break;
					case 2:
						this.componentId = 'APIWord'
						break;
					case 3:
						this.componentId = 'serviceSupport'
						break;
					case 4:
						this.componentId = 'notice'
						break;
				}
			}else{
				this.tab = index
				switch(index) {
					case 0:
						this.componentId = 'joinGuide'
						break;
					case 1:
						this.componentId = 'APIWord'
						break;
					case 2:
						this.componentId = 'serviceSupport'
						break;
					case 3:
						this.componentId = 'notice'
						break;
				}
			}
		},
		agreeDevelopment () {
			this.agreeVisible = false
		}
	},
	}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
* {
	margin: 0px;
	padding: 0px;
}
.contains {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background-color: #ebeced;
  position: relative;
  > header {
	z-index: 2;
	width: 100vw;
	background-size: 100% 100%;
	overflow: hidden;
	> .title {
		display: flex;
		justify-content: center;
		margin-top: 178px;
		.labelBox {
			width:131px;
			height:46px;
			opacity: 0.75;
			border-radius: 3px;
			display: flex;
			justify-content: center;
    		align-items: center;
			.labelText {
				height: 20px;
				font-size: 18px;
				font-family: PingFangSC, PingFangSC-Semibold;
				font-weight: 600;
				text-align: left;
				color: #ffffff;
				line-height: 20px;
				text-align: center;
				cursor: pointer;
			}
		}
	}
  }
  .baImg {
	z-index: 1;
	position: absolute;
	width: 100vw;
	height: 300px;
	background: url(../../../../assets/img/openApi/Control/背景.svg) no-repeat center;
  }
  > main {
	z-index: 2;
    flex: 1;
	box-sizing: border-box;
	overflow: hidden;
	display: flex;
	justify-content: center;
	margin-top: 17px;
  }
  > footer {
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 10px;
	color: #797979;
	margin: 19px auto;
	> label {
		margin-right: 5.16px;
	}
  }
}
.labelColor {
	background: #053fc7;
}
</style>